import { Queue } from 'bullmq';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Shared Redis client for rate limiting and other non-BullMQ uses
export const redis = new Redis(redisUrl, { maxRetriesPerRequest: null });

// BullMQ needs its own connection (per docs: don't share with other clients)
const connection = {
  host: new URL(redisUrl).hostname,
  port: Number(new URL(redisUrl).port) || 6379,
};

export const notificationQueue = new Queue('notifications', { connection });
