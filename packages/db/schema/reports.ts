import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';
import { listings } from './listings';

export const reports = pgTable('reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  reporterId: uuid('reporter_id').notNull().references(() => users.id),
  reportedUserId: uuid('reported_user_id').references(() => users.id),
  reportedListingId: uuid('reported_listing_id').references(() => listings.id),
  reportType: varchar('report_type', { length: 30 }).notNull(),
    // 'fake_listing' | 'scam_attempt' | 'identity_fraud' | 'other'
  description: text('description'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
    // 'pending' | 'reviewed' | 'resolved'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('idx_reports_status').on(t.status),
]);

export type Report = typeof reports.$inferSelect;
