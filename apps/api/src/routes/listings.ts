import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middleware/auth';
import { db, users, landlordProfiles, listings, listingPhotos } from '@rentrayda/db';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { createListingSchema, updateListingSchema, listingSearchSchema } from '@rentrayda/shared';
import type { AppVariables } from '../types';

const listingsRouter = new Hono<{ Variables: AppVariables }>();

// GET /api/listings — public, no auth required
listingsRouter.get(
  '/',
  zValidator('query', listingSearchSchema),
  async (c) => {
    const filters = c.req.valid('query');
    const pageSize = 10;

    const conditions = [
      eq(listings.status, 'active'),
    ];
    if (filters.barangay) conditions.push(eq(listings.barangay, filters.barangay));
    if (filters.minRent) conditions.push(gte(listings.monthlyRent, filters.minRent));
    if (filters.maxRent) conditions.push(lte(listings.monthlyRent, filters.maxRent));
    if (filters.type) conditions.push(eq(listings.unitType, filters.type));

    // Only show listings from verified landlords
    const results = await db
      .select()
      .from(listings)
      .innerJoin(landlordProfiles, eq(listings.landlordProfileId, landlordProfiles.id))
      .where(and(...conditions, eq(landlordProfiles.verificationStatus, 'verified')))
      .orderBy(desc(listings.lastActiveAt))
      .limit(pageSize)
      .offset((filters.page - 1) * pageSize);

    // Fetch first photo for each listing
    const listingIds = results.map((r) => r.listings.id);
    const allPhotos = listingIds.length > 0
      ? await db
          .select()
          .from(listingPhotos)
          .where(eq(listingPhotos.displayOrder, 0))
      : [];

    const photoMap = new Map(allPhotos.map((p) => [p.listingId, p]));

    const enriched = results.map((r) => ({
      ...r.listings,
      landlordProfile: {
        fullName: r.landlord_profiles.fullName,
        profilePhotoUrl: r.landlord_profiles.profilePhotoUrl,
        verificationStatus: r.landlord_profiles.verificationStatus,
      },
      firstPhoto: photoMap.get(r.listings.id) || null,
    }));

    return c.json({
      data: {
        listings: enriched,
        total: results.length,
        page: filters.page,
        pageSize,
      },
    });
  },
);

// POST /api/listings — auth required, landlord only
listingsRouter.post(
  '/',
  authMiddleware,
  zValidator('json', createListingSchema),
  async (c) => {
    const user = c.get('user');
    const phone = (user as { phoneNumber?: string }).phoneNumber;
    if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

    const [appUser] = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    if (!appUser || appUser.role !== 'landlord') {
      return c.json({ error: 'Not a landlord', code: 'FORBIDDEN' }, 403);
    }

    const [profile] = await db
      .select()
      .from(landlordProfiles)
      .where(eq(landlordProfiles.userId, appUser.id))
      .limit(1);

    if (!profile) {
      return c.json({ error: 'Profile not found', code: 'NOT_FOUND' }, 404);
    }

    const body = c.req.valid('json');
    const status = profile.verificationStatus === 'verified' ? 'active' : 'draft';

    const [listing] = await db
      .insert(listings)
      .values({
        landlordProfileId: profile.id,
        unitType: body.unitType,
        monthlyRent: body.monthlyRent,
        barangay: body.barangay,
        city: body.city || 'Pasig',
        beds: body.beds,
        rooms: body.rooms,
        inclusions: body.inclusions || [],
        description: body.description,
        availableDate: body.availableDate,
        advanceMonths: body.advanceMonths,
        depositMonths: body.depositMonths,
        status,
      })
      .returning();

    return c.json({ data: listing }, 201);
  },
);

// GET /api/listings/:id — public
listingsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');

  const [result] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, id))
    .limit(1);

  if (!result) {
    return c.json({ error: 'Listing not found', code: 'NOT_FOUND' }, 404);
  }

  const photos = await db
    .select()
    .from(listingPhotos)
    .where(eq(listingPhotos.listingId, id))
    .orderBy(listingPhotos.displayOrder);

  const [profile] = await db
    .select()
    .from(landlordProfiles)
    .where(eq(landlordProfiles.id, result.landlordProfileId))
    .limit(1);

  return c.json({
    data: {
      ...result,
      photos: photos.map((p) => ({ id: p.id, displayOrder: p.displayOrder })),
      landlordProfile: profile
        ? { fullName: profile.fullName, profilePhotoUrl: profile.profilePhotoUrl, verificationStatus: profile.verificationStatus }
        : null,
    },
  });
});

// PATCH /api/listings/:id — owner only
listingsRouter.patch(
  '/:id',
  authMiddleware,
  zValidator('json', updateListingSchema),
  async (c) => {
    const user = c.get('user');
    const phone = (user as { phoneNumber?: string }).phoneNumber;
    if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

    const [appUser] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    if (!appUser || appUser.role !== 'landlord') {
      return c.json({ error: 'Forbidden', code: 'FORBIDDEN' }, 403);
    }

    const [profile] = await db.select().from(landlordProfiles).where(eq(landlordProfiles.userId, appUser.id)).limit(1);
    if (!profile) return c.json({ error: 'Profile not found', code: 'NOT_FOUND' }, 404);

    const id = c.req.param('id');
    const [existing] = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
    if (!existing) return c.json({ error: 'Listing not found', code: 'NOT_FOUND' }, 404);
    if (existing.landlordProfileId !== profile.id) {
      return c.json({ error: 'Not the owner', code: 'NOT_OWNER' }, 403);
    }

    const body = c.req.valid('json');
    const [updated] = await db
      .update(listings)
      .set({ ...body, updatedAt: new Date(), lastActiveAt: new Date() })
      .where(eq(listings.id, id))
      .returning();

    return c.json({ data: updated });
  },
);

// DELETE /api/listings/:id — owner only, soft delete (status='rented')
listingsRouter.delete(
  '/:id',
  authMiddleware,
  async (c) => {
    const user = c.get('user');
    const phone = (user as { phoneNumber?: string }).phoneNumber;
    if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

    const [appUser] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    if (!appUser || appUser.role !== 'landlord') {
      return c.json({ error: 'Forbidden', code: 'FORBIDDEN' }, 403);
    }

    const [profile] = await db.select().from(landlordProfiles).where(eq(landlordProfiles.userId, appUser.id)).limit(1);
    if (!profile) return c.json({ error: 'Profile not found', code: 'NOT_FOUND' }, 404);

    const id = c.req.param('id');
    const [existing] = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
    if (!existing) return c.json({ error: 'Listing not found', code: 'NOT_FOUND' }, 404);
    if (existing.landlordProfileId !== profile.id) {
      return c.json({ error: 'Not the owner', code: 'NOT_OWNER' }, 403);
    }

    await db
      .update(listings)
      .set({ status: 'rented', updatedAt: new Date() })
      .where(eq(listings.id, id));

    return c.json({ data: { status: 'rented' } });
  },
);

// POST /api/listings/:id/photos — add photo to listing
listingsRouter.post(
  '/:id/photos',
  authMiddleware,
  async (c) => {
    const user = c.get('user');
    const phone = (user as { phoneNumber?: string }).phoneNumber;
    if (!phone) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

    const [appUser] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    if (!appUser) return c.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401);

    const [profile] = await db.select().from(landlordProfiles).where(eq(landlordProfiles.userId, appUser.id)).limit(1);
    if (!profile) return c.json({ error: 'Profile not found', code: 'NOT_FOUND' }, 404);

    const id = c.req.param('id');
    const [existing] = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
    if (!existing || existing.landlordProfileId !== profile.id) {
      return c.json({ error: 'Not the owner', code: 'NOT_OWNER' }, 403);
    }

    const body = await c.req.json<{ r2ObjectKey: string; displayOrder: number }>();

    const [photo] = await db
      .insert(listingPhotos)
      .values({
        listingId: id,
        r2ObjectKey: body.r2ObjectKey,
        displayOrder: body.displayOrder,
      })
      .returning({ id: listingPhotos.id, displayOrder: listingPhotos.displayOrder });

    return c.json({ data: photo }, 201);
  },
);

export { listingsRouter };
