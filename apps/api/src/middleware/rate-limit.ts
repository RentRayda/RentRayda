import { createMiddleware } from 'hono/factory';
import type { Context } from 'hono';
import { redis } from '../lib/queue';

type RateLimitOpts = {
  max: number;
  windowMs: number;
  keyPrefix: string;
  keyBy?: 'ip' | 'userId';
  keyExtractor?: (c: Context) => string | null;
};

/**
 * Redis sliding-window rate limiter using sorted sets.
 * Keys auto-expire — no memory leak.
 */
export function rateLimiter(opts: RateLimitOpts) {
  const { max, windowMs, keyPrefix, keyBy = 'ip', keyExtractor } = opts;

  return createMiddleware(async (c, next) => {
    let identifier: string;

    if (keyExtractor) {
      const extracted = keyExtractor(c);
      if (!extracted) {
        // Can't extract key — skip rate limiting for this request
        return next();
      }
      identifier = extracted;
    } else if (keyBy === 'userId') {
      const user = c.get('user') as { id?: string } | undefined;
      if (user?.id) {
        identifier = user.id;
      } else {
        // Fall back to IP if no user (shouldn't happen behind authMiddleware)
        identifier = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
          || c.req.header('x-real-ip')
          || 'unknown';
      }
    } else {
      identifier = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
        || c.req.header('x-real-ip')
        || 'unknown';
    }

    const key = `rl:${keyPrefix}:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    const windowSec = Math.ceil(windowMs / 1000);

    // Sliding window: remove old entries, count current, add if under limit
    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zcard(key);
    const results = await pipeline.exec();

    const count = (results?.[1]?.[1] as number) ?? 0;

    if (count >= max) {
      // Find when the oldest entry in the window expires
      const oldest = await redis.zrange(key, 0, 0, 'WITHSCORES');
      const retryAfterMs = oldest.length >= 2
        ? Math.max(0, Number(oldest[1]) + windowMs - now)
        : windowMs;
      const retryAfter = Math.ceil(retryAfterMs / 1000);

      c.header('Retry-After', String(retryAfter));
      return c.json(
        { error: 'Too many requests. Try again later.', code: 'RATE_LIMIT', retryAfter },
        429,
      );
    }

    // Add this request and refresh TTL
    await redis.pipeline()
      .zadd(key, now, `${now}:${Math.random().toString(36).slice(2, 8)}`)
      .expire(key, windowSec)
      .exec();

    await next();
  });
}

/**
 * Global catch-all rate limiter: 100 requests/min per IP.
 * Apply before all route mounts as a safety net.
 */
export function globalRateLimiter() {
  return rateLimiter({
    max: 100,
    windowMs: 60 * 1000,
    keyPrefix: 'global',
    keyBy: 'ip',
  });
}
