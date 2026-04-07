import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middleware/auth';
import { rateLimiter } from '../middleware/rate-limit';
import { db, users, tenantProfiles, verificationDocuments } from '@rentrayda/db';
import { eq } from 'drizzle-orm';
import { updateTenantProfileSchema, verifyIdSchema, verifyEmploymentSchema } from '@rentrayda/shared';
import type { AppVariables } from '../types';

const tenantsRouter = new Hono<{ Variables: AppVariables }>();
tenantsRouter.use('/*', authMiddleware);

// GET /api/tenants/me
tenantsRouter.get('/me', async (c) => {
  const user = c.get('user');
  const phone = (user as { phoneNumber?: string }).phoneNumber;
  if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

  const [appUser] = await db
    .select()
    .from(users)
    .where(eq(users.phone, phone))
    .limit(1);

  if (!appUser || appUser.role !== 'tenant') {
    return c.json({ error: 'Not a tenant', code: 'FORBIDDEN' }, 403);
  }

  const [profile] = await db
    .select()
    .from(tenantProfiles)
    .where(eq(tenantProfiles.userId, appUser.id))
    .limit(1);

  if (!profile) {
    return c.json({ error: 'Profile not found', code: 'NOT_FOUND' }, 404);
  }

  return c.json({ data: profile });
});

// PATCH /api/tenants/me
tenantsRouter.patch(
  '/me',
  rateLimiter({ max: 30, windowMs: 60 * 60 * 1000, keyPrefix: 'tenant-profile', keyBy: 'userId' }),
  zValidator('json', updateTenantProfileSchema),
  async (c) => {
    const user = c.get('user');
    const phone = (user as { phoneNumber?: string }).phoneNumber;
    if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

    const [appUser] = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    if (!appUser || appUser.role !== 'tenant') {
      return c.json({ error: 'Not a tenant', code: 'FORBIDDEN' }, 403);
    }

    const body = c.req.valid('json');
    const [updated] = await db
      .update(tenantProfiles)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(tenantProfiles.userId, appUser.id))
      .returning();

    if (!updated) {
      return c.json({ error: 'Profile not found', code: 'NOT_FOUND' }, 404);
    }

    return c.json({ data: updated });
  },
);

// POST /api/tenants/verify/id
tenantsRouter.post(
  '/verify/id',
  rateLimiter({ max: 5, windowMs: 60 * 60 * 1000, keyPrefix: 'tenant-verify-id', keyBy: 'userId' }),
  zValidator('json', verifyIdSchema),
  async (c) => {
    const user = c.get('user');
    const phone = (user as { phoneNumber?: string }).phoneNumber;
    if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

    const [appUser] = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    if (!appUser || appUser.role !== 'tenant') {
      return c.json({ error: 'Not a tenant', code: 'FORBIDDEN' }, 403);
    }

    const body = c.req.valid('json');

    // Create verification document — NEVER expose r2ObjectKey in response
    const [doc] = await db
      .insert(verificationDocuments)
      .values({
        userId: appUser.id,
        documentType: 'government_id',
        idType: body.idType,
        r2ObjectKey: body.r2ObjectKey,
        selfieR2Key: body.selfieR2Key,
        status: 'pending',
        consentAt: new Date(body.consentAt),
      })
      .returning({ id: verificationDocuments.id, status: verificationDocuments.status });

    // Update tenant profile verification status to 'pending'
    await db
      .update(tenantProfiles)
      .set({ verificationStatus: 'pending', updatedAt: new Date() })
      .where(eq(tenantProfiles.userId, appUser.id));

    return c.json({ data: { documentId: doc.id, status: doc.status } }, 201);
  },
);

// POST /api/tenants/verify/employment
tenantsRouter.post(
  '/verify/employment',
  rateLimiter({ max: 5, windowMs: 60 * 60 * 1000, keyPrefix: 'tenant-verify-emp', keyBy: 'userId' }),
  zValidator('json', verifyEmploymentSchema),
  async (c) => {
    const user = c.get('user');
    const phone = (user as { phoneNumber?: string }).phoneNumber;
    if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

    const [appUser] = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    if (!appUser || appUser.role !== 'tenant') {
      return c.json({ error: 'Not a tenant', code: 'FORBIDDEN' }, 403);
    }

    const body = c.req.valid('json');

    // Create verification document — NEVER expose r2ObjectKey in response
    const [doc] = await db
      .insert(verificationDocuments)
      .values({
        userId: appUser.id,
        documentType: 'employment_proof',
        idType: body.proofType,
        r2ObjectKey: body.r2ObjectKey,
        status: 'pending',
        consentAt: new Date(body.consentAt),
      })
      .returning({ id: verificationDocuments.id, status: verificationDocuments.status });

    return c.json({ data: { documentId: doc.id, status: doc.status } }, 201);
  },
);

export { tenantsRouter };
