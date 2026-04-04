import { z } from 'zod';
import { UNIT_TYPES, INCLUSIONS } from '../constants';

export const createListingSchema = z.object({
  unitType: z.enum(UNIT_TYPES),
  monthlyRent: z.number().int().min(500).max(100000),
  barangay: z.string().min(2),
  city: z.string().min(2).optional(),
  beds: z.number().int().min(1).max(20).optional(),
  rooms: z.number().int().min(1).max(20).optional(),
  inclusions: z.array(z.enum(INCLUSIONS)).optional(),
  description: z.string().max(200).optional(),
  availableDate: z.string().optional(),
  advanceMonths: z.number().int().min(0).max(6).optional(),
  depositMonths: z.number().int().min(0).max(6).optional(),
});

export const updateListingSchema = createListingSchema.partial().extend({
  status: z.enum(['active', 'paused']).optional(),
});

export const listingSearchSchema = z.object({
  barangay: z.string().optional(),
  minRent: z.coerce.number().optional(),
  maxRent: z.coerce.number().optional(),
  type: z.enum(UNIT_TYPES).optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type ListingSearchInput = z.infer<typeof listingSearchSchema>;
