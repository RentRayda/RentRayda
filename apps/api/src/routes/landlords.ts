import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middleware/auth';
import { rateLimiter } from '../middleware/rate-limit';
import { db, users, landlordProfiles, verificationDocuments } from '@rentrayda/db';
import { eq } from 'drizzle-orm';
import { updateLandlordProfileSchema, verifyIdSchema, verifyPropertySchema } from '@rentrayda/shared';
import type { AppVariables } from '../types';

const landlordsRouter = new Hono<{ Variables: AppVariables }>();
landlordsRouter.use('/*', authMiddleware);

// GET /api/landlords/me
landlordsRouter.get('/me', async (c) => {
  const user = c.get('user');
  const phone = (user as { phoneNumber?: string }).phoneNumber;
  if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

  const [appUser] = await db
    .select()
    .from(users)
    .where(eq(users.phone, phone))
    .limit(1);

  if (!appUser || appUser.role !== 'landlord') {
    return c.json({ error: 'Not a landlord', code: 'FORBIDDEN' }, 403);
  }

  const [profile] = await db
    .select()
    .from(landlordProfiles)
    .where(eq(landlordProfiles.userId, appUser.id))
    .limit(1);

  if (!profile) {
    return c.json({ error: 'Profile not found', code: 'NOT_FOUND' }, 404);
  }

  return c.json({ data: profile });
});

// PATCH /api/landlords/me
landlordsRouter.patch(
  '/me',
  rateLimiter({ max: 30, windowMs: 60 * 60 * 1000, keyPrefix: 'landlord-profile', keyBy: 'userId' }),
  zValidator('json', updateLandlordProfileSchema),
  async (c) => {
    const user = c.get('user');
    const phone = (user as { phoneNumber?: string }).phoneNumber;
    if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

    const [appUser] = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    if (!appUser || appUser.role !== 'landlord') {
      return c.json({ error: 'Not a landlord', code: 'FORBIDDEN' }, 403);
    }

    const body = c.req.valid('json');
    const [updated] = await db
      .update(landlordProfiles)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(landlordProfiles.userId, appUser.id))
      .returning();

    if (!updated) {
      return c.json({ error: 'Profile not found', code: 'NOT_FOUND' }, 404);
    }

    return c.json({ data: updated });
  },
);

// POST /api/landlords/verify/id
landlordsRouter.post(
  '/verify/id',
  rateLimiter({ max: 5, windowMs: 60 * 60 * 1000, keyPrefix: 'landlord-verify-id', keyBy: 'userId' }),
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

    if (!appUser || appUser.role !== 'landlord') {
      return c.json({ error: 'Not a landlord', code: 'FORBIDDEN' }, 403);
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

    // Update landlord profile verification status to 'pending'
    await db
      .update(landlordProfiles)
      .set({ verificationStatus: 'pending', updatedAt: new Date() })
      .where(eq(landlordProfiles.userId, appUser.id));

    return c.json({ data: { documentId: doc.id, status: doc.status } }, 201);
  },
);

// POST /api/landlords/verify/property
landlordsRouter.post(
  '/verify/property',
  rateLimiter({ max: 5, windowMs: 60 * 60 * 1000, keyPrefix: 'landlord-verify-prop', keyBy: 'userId' }),
  zValidator('json', verifyPropertySchema),
  async (c) => {
    const user = c.get('user');
    const phone = (user as { phoneNumber?: string }).phoneNumber;
    if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

    const [appUser] = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    if (!appUser || appUser.role !== 'landlord') {
      return c.json({ error: 'Not a landlord', code: 'FORBIDDEN' }, 403);
    }

    const body = c.req.valid('json');

    // Create verification document — NEVER expose r2ObjectKey in response
    const [doc] = await db
      .insert(verificationDocuments)
      .values({
        userId: appUser.id,
        documentType: 'property_proof',
        idType: body.proofType,
        r2ObjectKey: body.r2ObjectKey,
        status: 'pending',
        consentAt: new Date(body.consentAt),
      })
      .returning({ id: verificationDocuments.id, status: verificationDocuments.status });

    return c.json({ data: { documentId: doc.id, status: doc.status } }, 201);
  },
);

export { landlordsRouter };
