import { pgTable, uuid, varchar, integer, text, boolean, date, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const tenantProfiles = pgTable('tenant_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').unique().notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  profilePhotoUrl: text('profile_photo_url'),
  homeProvince: varchar('home_province', { length: 100 }),
  searchBarangay: varchar('search_barangay', { length: 100 }),
  currentCity: varchar('current_city', { length: 50 }),
  employmentType: varchar('employment_type', { length: 20 }),
    // Values: 'bpo' | 'student' | 'office' | 'freelancer' | 'other'
  companyName: varchar('company_name', { length: 100 }),
  employmentVerified: boolean('employment_verified').default(false).notNull(),
  moveInDate: date('move_in_date'),
  budgetMin: integer('budget_min'),
  budgetMax: integer('budget_max'),
  preferredBarangays: jsonb('preferred_barangays').default([]),
  verificationStatus: varchar('verification_status', { length: 20 })
    .notNull().default('unverified'),
    // Values: 'unverified' | 'pending' | 'verified' | 'rejected'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('idx_tenant_verification').on(t.verificationStatus),
]);

export type TenantProfile = typeof tenantProfiles.$inferSelect;
export type NewTenantProfile = typeof tenantProfiles.$inferInsert;
