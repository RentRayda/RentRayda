import { createMiddleware } from 'hono/factory';
import { auth } from '../lib/auth';
import { db, users } from '@rentrayda/db';
import { eq } from 'drizzle-orm';

export const authMiddleware = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);
  }

  // Look up app-level user by phone number from better-auth user
  const phone = (session.user as { phoneNumber?: string }).phoneNumber;
  if (phone) {
    const [appUser] = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    if (appUser?.isSuspended) {
      return c.json({ error: 'Account suspended', code: 'SUSPENDED' }, 403);
    }
  }

  c.set('user', session.user);
  c.set('session', session.session);
  await next();
});
