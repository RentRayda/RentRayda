import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { connectionRequests } from './connection-requests';
import { listings } from './listings';

export const connections = pgTable('connections', {
  id: uuid('id').defaultRandom().primaryKey(),
  connectionRequestId: uuid('connection_request_id').unique().notNull()
    .references(() => connectionRequests.id),
  tenantUserId: uuid('tenant_user_id').notNull(),
  landlordUserId: uuid('landlord_user_id').notNull(),
  listingId: uuid('listing_id').notNull().references(() => listings.id),
  tenantPhone: varchar('tenant_phone', { length: 15 }).notNull(),
  landlordPhone: varchar('landlord_phone', { length: 15 }).notNull(),
  connectedAt: timestamp('connected_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('idx_conn_tenant').on(t.tenantUserId),
  index('idx_conn_landlord').on(t.landlordUserId),
]);

export type Connection = typeof connections.$inferSelect;
