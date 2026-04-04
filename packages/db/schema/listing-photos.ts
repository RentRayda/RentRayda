import { pgTable, uuid, text, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { listings } from './listings';

export const listingPhotos = pgTable('listing_photos', {
  id: uuid('id').defaultRandom().primaryKey(),
  listingId: uuid('listing_id').notNull()
    .references(() => listings.id, { onDelete: 'cascade' }),
  r2ObjectKey: text('r2_object_key').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('idx_photos_listing').on(t.listingId),
]);
