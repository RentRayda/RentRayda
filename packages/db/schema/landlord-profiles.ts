import { pgTable, uuid, varchar, integer, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const landlordProfiles = pgTable('landlord_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').unique().notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  barangay: varchar('barangay', { length: 100 }).notNull(),
  city: varchar('city', { length: 50 }).notNull().default('Pasig'),
  unitCount: integer('unit_count').notNull().default(1),
  profilePhotoUrl: text('profile_photo_url'),
  verificationStatus: varchar('verification_status', { length: 20 })
    .notNull().default('unverified'),
    // Values: 'unverified' | 'pending' | 'partial' | 'verified' | 'rejected'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('idx_landlord_verification').on(t.verificationStatus),
]);

export type LandlordProfile = typeof landlordProfiles.$inferSelect;
export type NewLandlordProfile = typeof landlordProfiles.$inferInsert;
