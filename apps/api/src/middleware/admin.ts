import { createMiddleware } from 'hono/factory';

export const adminMiddleware = createMiddleware(async (c, next) => {
  const user = c.get('user');
  if (user.role !== 'admin') {
    return c.json({ error: 'Forbidden', code: 'NOT_ADMIN' }, 403);
  }
  await next();
});
