import { z } from 'zod';

export const connectionRequestSchema = z.object({
  listingId: z.string().uuid(),
  message: z.string().max(200).optional(),
});

export type ConnectionRequestInput = z.infer<typeof connectionRequestSchema>;
