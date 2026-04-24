import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middleware/auth';
import { rateLimiter } from '../middleware/rate-limit';
import { db, users, tenantProfiles, listings, landlordProfiles, connectionRequests, connections } from '@rentrayda/db';
import { eq, and } from 'drizzle-orm';
import { connectionRequestSchema } from '@rentrayda/shared';
import { notificationQueue } from '../lib/queue';
import { canRevealPhone } from '../lib/connection-reveal';
import type { AppVariables } from '../types';

const connectionsRouter = new Hono<{ Variables: AppVariables }>();
connectionsRouter.use('/*', authMiddleware);

// POST /api/connections/request — tenant only, MUST be verified
connectionsRouter.post(
  '/request',
  rateLimiter({ max: 10, windowMs: 60 * 60 * 1000, keyPrefix: 'conn-request', keyBy: 'userId' }),
  zValidator('json', connectionRequestSchema),
  async (c) => {
    const user = c.get('user');
    const phone = (user as { phoneNumber?: string }).phoneNumber;
    if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

    const [appUser] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    if (!appUser || appUser.role !== 'tenant') {
      return c.json({ error: 'Only tenants can send requests', code: 'FORBIDDEN' }, 403);
    }

    const [tenantProfile] = await db
      .select()
      .from(tenantProfiles)
      .where(eq(tenantProfiles.userId, appUser.id))
      .limit(1);

    if (!tenantProfile) {
      return c.json({ error: 'Profile not found', code: 'NOT_FOUND' }, 404);
    }

    // CRITICAL: Server-side verification check — non-bypassable
    if (tenantProfile.verificationStatus !== 'verified') {
      return c.json({ error: 'Verify your profile first.', code: 'NOT_VERIFIED' }, 403);
    }

    const { listingId, message } = c.req.valid('json');

    // Check listing exists and is active
    const [listing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, listingId))
      .limit(1);

    if (!listing || listing.status !== 'active') {
      return c.json({ error: 'Listing not available', code: 'LISTING_INACTIVE' }, 400);
    }

    // Check for duplicate request
    const [existing] = await db
      .select()
      .from(connectionRequests)
      .where(
        and(
          eq(connectionRequests.tenantProfileId, tenantProfile.id),
          eq(connectionRequests.listingId, listingId),
        ),
      )
      .limit(1);

    if (existing) {
      return c.json({ error: 'Already sent.', code: 'DUPLICATE' }, 409);
    }

    // Create connection request
    const [request] = await db
      .insert(connectionRequests)
      .values({
        tenantProfileId: tenantProfile.id,
        listingId,
        landlordProfileId: listing.landlordProfileId,
        message: message || null,
        status: 'pending',
      })
      .returning({ id: connectionRequests.id });

    // Push notification to landlord: "Someone sent a connection request"
    const [lp] = await db.select().from(landlordProfiles).where(eq(landlordProfiles.id, listing.landlordProfileId)).limit(1);
    const [landlordUser] = lp ? await db.select().from(users).where(eq(users.id, lp.userId)).limit(1) : [null];
    if (landlordUser?.pushToken) {
      await notificationQueue.add('push', {
        userId: landlordUser.id,
        pushToken: landlordUser.pushToken,
        title: 'New connection request!',
        body: `${tenantProfile.fullName} sent a connection request for your listing.`,
        data: { type: 'connection_request', requestId: request.id },
      }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
    }

    return c.json({ data: { requestId: request.id } }, 201);
  },
);

// GET /api/connections/requests — landlord: incoming, tenant: sent
connectionsRouter.get('/requests', async (c) => {
  const user = c.get('user');
  const phone = (user as { phoneNumber?: string }).phoneNumber;
  if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

  const [appUser] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  if (!appUser) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

  if (appUser.role === 'landlord') {
    const [profile] = await db.select().from(landlordProfiles).where(eq(landlordProfiles.userId, appUser.id)).limit(1);
    if (!profile) return c.json({ data: [] });

    const requests = await db
      .select()
      .from(connectionRequests)
      .innerJoin(tenantProfiles, eq(connectionRequests.tenantProfileId, tenantProfiles.id))
      .innerJoin(listings, eq(connectionRequests.listingId, listings.id))
      .where(eq(connectionRequests.landlordProfileId, profile.id))
      .orderBy(connectionRequests.createdAt);

    return c.json({
      data: requests.map((r) => ({
        ...r.connection_requests,
        tenant: {
          fullName: r.tenant_profiles.fullName,
          verificationStatus: r.tenant_profiles.verificationStatus,
        },
        listing: {
          unitType: r.listings.unitType,
          barangay: r.listings.barangay,
        },
      })),
    });
  } else {
    const [profile] = await db.select().from(tenantProfiles).where(eq(tenantProfiles.userId, appUser.id)).limit(1);
    if (!profile) return c.json({ data: [] });

    const requests = await db
      .select()
      .from(connectionRequests)
      .innerJoin(listings, eq(connectionRequests.listingId, listings.id))
      .innerJoin(landlordProfiles, eq(connectionRequests.landlordProfileId, landlordProfiles.id))
      .where(eq(connectionRequests.tenantProfileId, profile.id))
      .orderBy(connectionRequests.createdAt);

    return c.json({
      data: requests.map((r) => ({
        ...r.connection_requests,
        listing: {
          unitType: r.listings.unitType,
          barangay: r.listings.barangay,
          monthlyRent: r.listings.monthlyRent,
        },
        landlord: {
          fullName: r.landlord_profiles.fullName,
          verificationStatus: r.landlord_profiles.verificationStatus,
        },
      })),
    });
  }
});

// PATCH /api/connections/:id/accept — landlord only, CRITICAL checks
connectionsRouter.patch('/:id/accept', async (c) => {
  const user = c.get('user');
  const phone = (user as { phoneNumber?: string }).phoneNumber;
  if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

  const [appUser] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  if (!appUser || appUser.role !== 'landlord') {
    return c.json({ error: 'Forbidden', code: 'FORBIDDEN' }, 403);
  }

  const requestId = c.req.param('id');
  const [request] = await db.select().from(connectionRequests).where(eq(connectionRequests.id, requestId)).limit(1);
  if (!request) return c.json({ error: 'Not found', code: 'NOT_FOUND' }, 404);

  // Load everything the reveal predicate needs, then let the pure function decide.
  // The rule itself lives in ../lib/connection-reveal.ts and is exhaustively
  // tested in tests/connection-reveal.test.ts — a privacy leak here is
  // unrecoverable, so every deny path has its own test.
  const [landlordProfile] = await db.select().from(landlordProfiles).where(eq(landlordProfiles.userId, appUser.id)).limit(1);
  const [tenantProfile] = request.tenantProfileId
    ? await db.select().from(tenantProfiles).where(eq(tenantProfiles.id, request.tenantProfileId)).limit(1)
    : [null];
  const [tenantUser] = tenantProfile?.userId
    ? await db.select().from(users).where(eq(users.id, tenantProfile.userId)).limit(1)
    : [null];

  // Narrow Drizzle's `string` to the union types the predicate expects.
  // DB CHECK constraints guarantee these values at runtime.
  const decision = canRevealPhone({
    request: {
      status: request.status as 'pending' | 'accepted' | 'declined' | 'expired',
      landlordProfileId: request.landlordProfileId,
      tenantProfileId: request.tenantProfileId,
      listingId: request.listingId,
    },
    landlordProfile: landlordProfile
      ? {
          id: landlordProfile.id,
          verificationStatus: landlordProfile.verificationStatus as
            | 'unverified'
            | 'pending'
            | 'verified'
            | 'rejected'
            | 'partial',
          userId: landlordProfile.userId,
        }
      : null,
    landlordUser: { id: appUser.id, isSuspended: appUser.isSuspended },
    tenantProfile: tenantProfile
      ? {
          id: tenantProfile.id,
          verificationStatus: tenantProfile.verificationStatus as
            | 'unverified'
            | 'pending'
            | 'verified'
            | 'rejected'
            | 'partial',
          userId: tenantProfile.userId,
        }
      : null,
    tenantUser: tenantUser ? { id: tenantUser.id, isSuspended: tenantUser.isSuspended } : null,
  });

  if (!decision.allowed) {
    const statusByCode = {
      NOT_OWNER: 403,
      INVALID_INPUT: 400,
      BOTH_NOT_VERIFIED: 403,
      SUSPENDED: 403,
      NOT_FOUND: 404,
    } as const;
    return c.json({ error: decision.reason, code: decision.code }, statusByCode[decision.code]);
  }

  // From here on we know the reveal is allowed — non-null narrowing for TS.
  if (!tenantUser || !tenantProfile) {
    // Unreachable given the predicate, but satisfies the compiler.
    return c.json({ error: 'Unexpected null tenant state', code: 'NOT_FOUND' }, 404);
  }

  // ALL CHECKS PASSED — reveal phone numbers
  // Update request status
  await db.update(connectionRequests).set({ status: 'accepted', respondedAt: new Date() }).where(eq(connectionRequests.id, requestId));

  // Update listing freshness — landlord is actively managing
  await db.update(listings).set({ lastActiveAt: new Date() }).where(eq(listings.id, request.listingId));

  // Create connection with BOTH phone numbers copied at reveal time
  const [connection] = await db
    .insert(connections)
    .values({
      connectionRequestId: requestId,
      tenantUserId: tenantProfile.userId,
      landlordUserId: appUser.id,
      listingId: request.listingId,
      tenantPhone: tenantUser.phone,
      landlordPhone: appUser.phone,
    })
    .returning({ id: connections.id });

  // Push notification to tenant: "Your request was accepted!"
  if (tenantUser.pushToken) {
    await notificationQueue.add('push', {
      userId: tenantUser.id,
      pushToken: tenantUser.pushToken,
      title: 'Your request was accepted!',
      body: `You can now connect with ${landlordProfile.fullName}. View their number now.`,
      data: { type: 'connection_accepted', connectionId: connection.id },
    }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
  }

  return c.json({ data: { connectionId: connection.id, otherPartyPhone: tenantUser.phone } });
});

// PATCH /api/connections/:id/decline — landlord only
connectionsRouter.patch('/:id/decline', async (c) => {
  const user = c.get('user');
  const phone = (user as { phoneNumber?: string }).phoneNumber;
  if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

  const [appUser] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  if (!appUser || appUser.role !== 'landlord') return c.json({ error: 'Forbidden', code: 'FORBIDDEN' }, 403);

  const requestId = c.req.param('id');
  const [request] = await db.select().from(connectionRequests).where(eq(connectionRequests.id, requestId)).limit(1);
  if (!request) return c.json({ error: 'Not found', code: 'NOT_FOUND' }, 404);

  const [landlordProfile] = await db.select().from(landlordProfiles).where(eq(landlordProfiles.userId, appUser.id)).limit(1);
  if (!landlordProfile || request.landlordProfileId !== landlordProfile.id) {
    return c.json({ error: 'Not the owner', code: 'NOT_OWNER' }, 403);
  }

  await db.update(connectionRequests).set({ status: 'declined', respondedAt: new Date() }).where(eq(connectionRequests.id, requestId));

  return c.json({ data: { status: 'declined' } });
});

// GET /api/connections — revealed connections with phone numbers
// Phone numbers only visible to non-suspended, authenticated users
connectionsRouter.get('/', async (c) => {
  const user = c.get('user');
  const phone = (user as { phoneNumber?: string }).phoneNumber;
  if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

  const [appUser] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  if (!appUser) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);
  if (appUser.isSuspended) return c.json({ error: 'Account suspended', code: 'SUSPENDED' }, 403);

  let userConnections;
  if (appUser.role === 'landlord') {
    userConnections = await db.select().from(connections).where(eq(connections.landlordUserId, appUser.id));
  } else {
    userConnections = await db.select().from(connections).where(eq(connections.tenantUserId, appUser.id));
  }

  return c.json({ data: userConnections });
});

// GET /api/connections/:id — single connection for reveal screen
connectionsRouter.get('/:id', async (c) => {
  const user = c.get('user');
  const phone = (user as { phoneNumber?: string }).phoneNumber;
  if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

  const [appUser] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  if (!appUser) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);
  if (appUser.isSuspended) return c.json({ error: 'Account suspended', code: 'SUSPENDED' }, 403);

  const connectionId = c.req.param('id');
  const [conn] = await db.select().from(connections).where(eq(connections.id, connectionId)).limit(1);
  if (!conn) return c.json({ error: 'Connection not found', code: 'NOT_FOUND' }, 404);

  // Verify the user is part of this connection
  if (conn.tenantUserId !== appUser.id && conn.landlordUserId !== appUser.id) {
    return c.json({ error: 'Forbidden', code: 'FORBIDDEN' }, 403);
  }

  // Get the other party's profile info for the reveal card
  const isLandlord = appUser.role === 'landlord';
  const otherUserId = isLandlord ? conn.tenantUserId : conn.landlordUserId;
  const otherPhone = isLandlord ? conn.tenantPhone : conn.landlordPhone;

  let otherName = '';
  let otherPhotoUrl: string | null = null;

  if (isLandlord) {
    const [tp] = await db.select().from(tenantProfiles).where(eq(tenantProfiles.userId, otherUserId)).limit(1);
    if (tp) { otherName = tp.fullName; otherPhotoUrl = tp.profilePhotoUrl; }
  } else {
    const [lp] = await db.select().from(landlordProfiles).where(eq(landlordProfiles.userId, otherUserId)).limit(1);
    if (lp) { otherName = lp.fullName; otherPhotoUrl = lp.profilePhotoUrl; }
  }

  return c.json({
    data: {
      id: conn.id,
      otherPartyPhone: otherPhone,
      otherPartyName: otherName,
      otherPartyPhotoUrl: otherPhotoUrl,
      connectedAt: conn.connectedAt,
    },
  });
});

export { connectionsRouter };
