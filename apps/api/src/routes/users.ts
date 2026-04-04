import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { db, users } from '@rentrayda/db';
import { eq } from 'drizzle-orm';
import type { AppVariables } from '../types';

const usersRouter = new Hono<{ Variables: AppVariables }>();
usersRouter.use('/*', authMiddleware);

const pushTokenSchema = z.object({
  token: z.string().min(1),
});

// POST /api/users/push-token
usersRouter.post(
  '/push-token',
  zValidator('json', pushTokenSchema),
  async (c) => {
    const user = c.get('user');
    const phone = (user as { phoneNumber?: string }).phoneNumber;
    if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

    const { token } = c.req.valid('json');

    await db
      .update(users)
      .set({ pushToken: token, updatedAt: new Date() })
      .where(eq(users.phone, phone));

    return c.json({ data: { message: 'Push token saved' } });
  },
);

export { usersRouter };
