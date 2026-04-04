import { createMiddleware } from 'hono/factory';

const stores = new Map<string, Map<string, { count: number; resetAt: number }>>();

export function rateLimiter(opts: { max: number; windowMs: number; keyPrefix: string }) {
  const store = new Map<string, { count: number; resetAt: number }>();
  stores.set(opts.keyPrefix, store);

  return createMiddleware(async (c, next) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const key = `${opts.keyPrefix}:${ip}`;
    const now = Date.now();

    const entry = store.get(key);
    if (entry && now < entry.resetAt) {
      if (entry.count >= opts.max) {
        return c.json(
          { error: 'Too many requests. Try again later.', code: 'RATE_LIMIT' },
          429,
        );
      }
      entry.count++;
    } else {
      store.set(key, { count: 1, resetAt: now + opts.windowMs });
    }

    await next();
  });
}
