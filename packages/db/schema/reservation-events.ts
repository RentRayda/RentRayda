import { pgTable, uuid, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { reservations } from './reservations';

export const reservationEvents = pgTable('reservation_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  reservationId: uuid('reservation_id').notNull().references(() => reservations.id, { onDelete: 'cascade' }),
  event: varchar('event', { length: 50 }).notNull(),
  paymongoEventId: varchar('paymongo_event_id', { length: 255 }),
  details: text('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type ReservationEvent = typeof reservationEvents.$inferSelect;
export type NewReservationEvent = typeof reservationEvents.$inferInsert;
