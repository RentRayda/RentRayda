import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const verificationDocuments = pgTable('verification_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  documentType: varchar('document_type', { length: 30 }).notNull(),
    // 'government_id' | 'selfie' | 'property_proof' | 'employment_proof'
  idType: varchar('id_type', { length: 30 }),
    // 'philsys' | 'umid' | 'drivers_license' | 'passport' | 'voters_id' | etc.
  r2ObjectKey: text('r2_object_key').notNull(),
  selfieR2Key: text('selfie_r2_key'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
    // 'pending' | 'approved' | 'rejected'
  reviewerNotes: text('reviewer_notes'),
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  rejectionReason: varchar('rejection_reason', { length: 200 }),
  consentAt: timestamp('consent_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('idx_verdocs_user').on(t.userId),
  index('idx_verdocs_status').on(t.status),
]);

export type VerificationDocument = typeof verificationDocuments.$inferSelect;
