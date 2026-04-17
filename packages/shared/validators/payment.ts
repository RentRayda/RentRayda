import { z } from 'zod';

export const createReservationSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().regex(/^09\d{9}$/, 'Must be a valid PH mobile number').optional(),
  name: z.string().max(255).optional(),
  utmSource: z.string().max(255).optional(),
  utmCampaign: z.string().max(255).optional(),
  utmMedium: z.string().max(255).optional(),
  referrer: z.string().max(2048).optional(),
  variant: z.string().max(50).optional(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
