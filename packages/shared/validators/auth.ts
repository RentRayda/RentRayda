import { z } from 'zod';

export const phoneSchema = z.string().regex(/^09\d{9}$/, 'Must be a valid PH mobile number (09XXXXXXXXX)');

export const sendOtpSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: z.string().length(6, 'OTP must be 6 digits'),
  role: z.enum(['landlord', 'tenant']).optional(),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
