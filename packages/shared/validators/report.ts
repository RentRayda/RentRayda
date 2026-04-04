import { z } from 'zod';
import { REPORT_TYPES } from '../constants';

export const createReportSchema = z.object({
  reportedUserId: z.string().uuid().optional(),
  reportedListingId: z.string().uuid().optional(),
  reportType: z.enum(REPORT_TYPES),
  description: z.string().max(500).optional(),
}).refine(
  (data) => data.reportedUserId || data.reportedListingId,
  { message: 'Must report either a user or a listing' },
);

export type CreateReportInput = z.infer<typeof createReportSchema>;
