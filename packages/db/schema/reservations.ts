import { pgTable, uuid, varchar, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const reservationTierEnum = pgEnum('reservation_tier', ['placement']);
export const reservationStatusEnum = pgEnum('reservation_status', ['pending', 'paid', 'refunded', 'expired']);

export const reservations = pgTable('reservations', {
  id: uuid('id').defaultRandom().primaryKey(),
  tier: reservationTierEnum('tier').notNull().default('placement'),
  amountCentavos: integer('amount_centavos').notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('PHP'),
  status: reservationStatusEnum('status').notNull().default('pending'),
  paymongoIntentId: varchar('paymongo_intent_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 15 }),
  name: varchar('name', { length: 255 }),
  utmSource: varchar('utm_source', { length: 255 }),
  utmCampaign: varchar('utm_campaign', { length: 255 }),
  utmMedium: varchar('utm_medium', { length: 255 }),
  referrer: varchar('referrer', { length: 2048 }),
  variant: varchar('variant', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  refundedAt: timestamp('refunded_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
