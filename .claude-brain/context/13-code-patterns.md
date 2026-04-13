# Code Patterns — RentRayda Canonical Examples

Reference these patterns when building new routes, queries, or auth-gated features.
Source of truth for API design: TRD.md §3-4. This file provides copy-paste examples.

---

## API Route (Hono)

```typescript
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { db } from '@rentrayda/db';
import { listings } from '@rentrayda/db/schema/listings';
import { eq } from 'drizzle-orm';

const listingsRouter = new Hono();
listingsRouter.use('/*', authMiddleware);

listingsRouter.post('/',
  zValidator('json', z.object({
    unitType: z.enum(['bedspace', 'room', 'apartment']),
    monthlyRent: z.number().int().min(500).max(100000),
    barangay: z.string().min(2),
    beds: z.number().int().min(1).max(20).optional(),
    inclusions: z.array(z.string()).optional(),
    description: z.string().max(200).optional(),
  })),
  async (c) => {
    const user = c.get('user');
    const body = c.req.valid('json');
    const profile = await db.query.landlordProfiles.findFirst({
      where: eq(landlordProfiles.userId, user.id),
    });
    const [listing] = await db.insert(listings).values({
      landlordProfileId: profile!.id,
      ...body,
      status: profile!.verificationStatus === 'verified' ? 'active' : 'draft',
    }).returning();
    return c.json({ data: listing }, 201);
  }
);
```

---

## Database Query (Drizzle relational)

```typescript
// Queries are inline in route handlers (no separate queries/ directory)
async function getActiveListings(filters) {
  return db.query.listings.findMany({
    where: and(eq(listings.status, 'active'), ...filterConditions),
    with: {
      photos: { limit: 1 },
      landlordProfile: { columns: { fullName: true, profilePhotoUrl: true, verificationStatus: true } },
    },
    orderBy: [desc(listings.lastActiveAt)],
    limit: 10,
    offset: (page - 1) * 10,
  });
}
```

---

## Response Formats

```typescript
// Success — always wrap in { data: ... }
return c.json({ data: resultObject }, 200);

// Error — always include error + code
return c.json({ error: 'You need to verify first.', code: 'NOT_VERIFIED' }, 403);
// Error codes: packages/shared/error-codes.ts (see TRD.md §2.14)
```

---

## Server Auth Middleware

```typescript
// apps/api/src/middleware/auth.ts
import { createMiddleware } from 'hono/factory';
import { auth } from '../lib/auth';

export const authMiddleware = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);
  if (session.user.isSuspended) return c.json({ error: 'Account suspended', code: 'SUSPENDED' }, 403);
  c.set('user', session.user);
  c.set('session', session.session);
  await next();
});
```

---

## Mobile Auth Client

```typescript
// apps/mobile/lib/auth.ts
import { createAuthClient } from 'better-auth/client';
import { expoClient } from '@better-auth/expo/client';
import { phoneNumberClient } from 'better-auth/client/plugins';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  plugins: [
    expoClient({ scheme: 'rentrayda', storagePrefix: 'rentrayda', storage: SecureStore }),
    phoneNumberClient(),
  ],
});
```
