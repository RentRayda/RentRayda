import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { rateLimiter } from '../middleware/rate-limit';
import { generatePrivateUploadUrl, generatePublicUploadUrl, verifyObjectExists } from '../lib/r2';
import type { AppVariables } from '../types';

const storageRouter = new Hono<{ Variables: AppVariables }>();
storageRouter.use('/*', authMiddleware);

const presignedUrlSchema = z.object({
  bucket: z.enum(['verification', 'listings', 'profiles']),
  contentType: z.enum(['image/jpeg', 'image/png']),
});

const confirmSchema = z.object({
  objectKey: z.string().min(1),
  bucket: z.enum(['verification', 'listings', 'profiles']),
});

const BUCKET_MAP: Record<string, string> = {
  verification: process.env.R2_BUCKET_VERIFICATION || 'rentrayda-verification-docs',
  listings: process.env.R2_BUCKET_LISTINGS || 'rentrayda-listing-photos',
  profiles: process.env.R2_BUCKET_PROFILES || 'rentrayda-profile-photos',
};

// POST /api/storage/presigned-url
storageRouter.post(
  '/presigned-url',
  rateLimiter({ max: 30, windowMs: 60 * 60 * 1000, keyPrefix: 'presigned-url' }),
  zValidator('json', presignedUrlSchema),
  async (c) => {
    const user = c.get('user');
    const { bucket, contentType } = c.req.valid('json');

    if (bucket === 'verification') {
      // PRIVATE bucket — verification docs
      const result = await generatePrivateUploadUrl(user.id, 'document', contentType);
      return c.json({ data: result });
    } else {
      // PUBLIC bucket — listings or profiles
      const prefix = bucket === 'profiles' ? `${user.id}` : `listing`;
      const result = await generatePublicUploadUrl(prefix, contentType);
      return c.json({ data: result });
    }
  },
);

// POST /api/storage/confirm
storageRouter.post(
  '/confirm',
  zValidator('json', confirmSchema),
  async (c) => {
    const { objectKey, bucket } = c.req.valid('json');
    const bucketName = BUCKET_MAP[bucket];
    const exists = await verifyObjectExists(bucketName, objectKey);

    if (!exists) {
      return c.json({ error: 'Object not found', code: 'NOT_FOUND' }, 404);
    }

    return c.json({ data: { confirmed: true } });
  },
);

export { storageRouter };
