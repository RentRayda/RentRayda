import { pgTable, uuid, varchar, text, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { tenantProfiles } from './tenant-profiles';
import { listings } from './listings';
import { landlordProfiles } from './landlord-profiles';

export const connectionRequests = pgTable('connection_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantProfileId: uuid('tenant_profile_id').notNull()
    .references(() => tenantProfiles.id),
  listingId: uuid('listing_id').notNull()
    .references(() => listings.id),
  landlordProfileId: uuid('landlord_profile_id').notNull()
    .references(() => landlordProfiles.id),
  message: varchar('message', { length: 200 }),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
    // 'pending' | 'accepted' | 'declined'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  respondedAt: timestamp('responded_at', { withTimezone: true }),
}, (t) => [
  uniqueIndex('idx_cr_unique').on(t.tenantProfileId, t.listingId),
  index('idx_cr_landlord').on(t.landlordProfileId, t.status),
]);

export type ConnectionRequest = typeof connectionRequests.$inferSelect;
