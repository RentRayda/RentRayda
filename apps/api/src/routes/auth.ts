import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { auth } from '../lib/auth';
import { authMiddleware } from '../middleware/auth';
import { rateLimiter } from '../middleware/rate-limit';
import { db, users, landlordProfiles, tenantProfiles } from '@rentrayda/db';
import { eq } from 'drizzle-orm';
import { sendOtpSchema, verifyOtpSchema } from '@rentrayda/shared';
import type { AppVariables } from '../types';

const authRouter = new Hono<{ Variables: AppVariables }>();

// POST /api/auth/send-otp
authRouter.post(
  '/send-otp',
  rateLimiter({ max: 5, windowMs: 15 * 60 * 1000, keyPrefix: 'send-otp' }),
  zValidator('json', sendOtpSchema),
  async (c) => {
    const { phone } = c.req.valid('json');
    await auth.api.sendPhoneNumberOTP({
      body: { phoneNumber: phone },
    });
    return c.json({ data: { message: 'OTP sent' } });
  },
);

// POST /api/auth/verify-otp
authRouter.post(
  '/verify-otp',
  rateLimiter({ max: 10, windowMs: 15 * 60 * 1000, keyPrefix: 'verify-otp' }),
  zValidator('json', verifyOtpSchema),
  async (c) => {
    const { phone, code, role } = c.req.valid('json');

    // verifyPhoneNumber handles OTP check + session creation (via signUpOnVerification)
    const result = await auth.api.verifyPhoneNumber({
      body: { phoneNumber: phone, code },
    });

    if (!result.status) {
      return c.json({ error: 'Wrong code.', code: 'INVALID_OTP' }, 401);
    }

    // Check if our app-level user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    let isNewUser = false;

    if (!existingUser && role) {
      // Create app-level user record
      const [newUser] = await db
        .insert(users)
        .values({ phone, role })
        .returning();

      // Create empty profile based on role
      if (role === 'landlord') {
        await db.insert(landlordProfiles).values({
          userId: newUser.id,
          fullName: '',
          barangay: '',
        });
      } else if (role === 'tenant') {
        await db.insert(tenantProfiles).values({
          userId: newUser.id,
          fullName: '',
        });
      }

      isNewUser = true;
    }

    const appUser = existingUser || (await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1)
      .then(rows => rows[0]));

    return c.json({ data: { user: appUser, isNewUser } });
  },
);

// POST /api/auth/logout
authRouter.post('/logout', authMiddleware, async (c) => {
  const session = c.get('session');
  await auth.api.revokeSession({
    headers: c.req.raw.headers,
    body: { token: session.token },
  });
  return c.json({ data: { message: 'OK' } });
});

// GET /api/auth/me
authRouter.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');

  // Look up app-level user by phone
  const phone = user.phoneNumber;
  if (!phone) {
    return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);
  }

  const [appUser] = await db
    .select()
    .from(users)
    .where(eq(users.phone, phone))
    .limit(1);

  if (!appUser) {
    return c.json({ error: 'User not found', code: 'NOT_FOUND' }, 404);
  }

  let profile = null;
  if (appUser.role === 'landlord') {
    const [lp] = await db
      .select()
      .from(landlordProfiles)
      .where(eq(landlordProfiles.userId, appUser.id))
      .limit(1);
    profile = lp || null;
  } else if (appUser.role === 'tenant') {
    const [tp] = await db
      .select()
      .from(tenantProfiles)
      .where(eq(tenantProfiles.userId, appUser.id))
      .limit(1);
    profile = tp || null;
  }

  return c.json({ data: { user: appUser, profile } });
});

export { authRouter };
