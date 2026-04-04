import { pgTable, uuid, varchar, integer, text, date, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { landlordProfiles } from './landlord-profiles';

export const listings = pgTable('listings', {
  id: uuid('id').defaultRandom().primaryKey(),
  landlordProfileId: uuid('landlord_profile_id').notNull()
    .references(() => landlordProfiles.id, { onDelete: 'cascade' }),
  unitType: varchar('unit_type', { length: 20 }).notNull(),
    // 'bedspace' | 'room' | 'apartment'
  monthlyRent: integer('monthly_rent').notNull(),
  barangay: varchar('barangay', { length: 100 }).notNull(),
  city: varchar('city', { length: 50 }).notNull().default('Pasig'),
  beds: integer('beds').default(1),
  rooms: integer('rooms').default(1),
  inclusions: jsonb('inclusions').default([]),
  description: varchar('description', { length: 200 }),
  availableDate: date('available_date'),
  advanceMonths: integer('advance_months').default(1),
  depositMonths: integer('deposit_months').default(2),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
    // 'draft' | 'active' | 'paused' | 'rented'
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('idx_listings_search').on(t.status, t.city, t.barangay, t.monthlyRent),
  index('idx_listings_landlord').on(t.landlordProfileId),
  index('idx_listings_freshness').on(t.lastActiveAt),
]);

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
