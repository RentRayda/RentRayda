import { relations } from 'drizzle-orm';
import { users } from './users';
import { landlordProfiles } from './landlord-profiles';
import { tenantProfiles } from './tenant-profiles';
import { listings } from './listings';
import { listingPhotos } from './listing-photos';
import { connectionRequests } from './connection-requests';
import { connections } from './connections';
import { verificationDocuments } from './verification-documents';
import { reports } from './reports';

export const usersRelations = relations(users, ({ one }) => ({
  landlordProfile: one(landlordProfiles, { fields: [users.id], references: [landlordProfiles.userId] }),
  tenantProfile: one(tenantProfiles, { fields: [users.id], references: [tenantProfiles.userId] }),
}));

export const landlordProfilesRelations = relations(landlordProfiles, ({ one, many }) => ({
  user: one(users, { fields: [landlordProfiles.userId], references: [users.id] }),
  listings: many(listings),
}));

export const tenantProfilesRelations = relations(tenantProfiles, ({ one, many }) => ({
  user: one(users, { fields: [tenantProfiles.userId], references: [users.id] }),
  connectionRequests: many(connectionRequests),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  landlordProfile: one(landlordProfiles, { fields: [listings.landlordProfileId], references: [landlordProfiles.id] }),
  photos: many(listingPhotos),
  connectionRequests: many(connectionRequests),
}));

export const listingPhotosRelations = relations(listingPhotos, ({ one }) => ({
  listing: one(listings, { fields: [listingPhotos.listingId], references: [listings.id] }),
}));

export const connectionRequestsRelations = relations(connectionRequests, ({ one }) => ({
  tenantProfile: one(tenantProfiles, { fields: [connectionRequests.tenantProfileId], references: [tenantProfiles.id] }),
  listing: one(listings, { fields: [connectionRequests.listingId], references: [listings.id] }),
  landlordProfile: one(landlordProfiles, { fields: [connectionRequests.landlordProfileId], references: [landlordProfiles.id] }),
}));

export const verificationDocumentsRelations = relations(verificationDocuments, ({ one }) => ({
  user: one(users, { fields: [verificationDocuments.userId], references: [users.id] }),
}));
