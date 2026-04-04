import { z } from 'zod';
import { EMPLOYMENT_TYPES, ID_TYPES } from '../constants';

export const updateLandlordProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  barangay: z.string().min(2).max(100).optional(),
  city: z.string().min(2).max(50).optional(),
  unitCount: z.number().int().min(1).max(50).optional(),
  profilePhotoUrl: z.string().url().optional(),
});

export const updateTenantProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  searchBarangay: z.string().max(100).optional(),
  currentCity: z.string().max(50).optional(),
  homeProvince: z.string().max(100).optional(),
  employmentType: z.enum(EMPLOYMENT_TYPES).optional(),
  companyName: z.string().max(100).optional(),
  profilePhotoUrl: z.string().url().optional(),
  budgetMin: z.number().int().min(500).optional(),
  budgetMax: z.number().int().max(100000).optional(),
  moveInDate: z.string().optional(),
});

export const verifyIdSchema = z.object({
  idType: z.enum(ID_TYPES),
  r2ObjectKey: z.string().min(1),
  selfieR2Key: z.string().min(1),
  consentAt: z.string().datetime(),
});

export const verifyPropertySchema = z.object({
  proofType: z.string().min(1),
  r2ObjectKey: z.string().min(1),
  consentAt: z.string().datetime(),
});

export const verifyEmploymentSchema = z.object({
  proofType: z.string().min(1),
  r2ObjectKey: z.string().min(1),
  consentAt: z.string().datetime(),
});

export type UpdateLandlordProfileInput = z.infer<typeof updateLandlordProfileSchema>;
export type UpdateTenantProfileInput = z.infer<typeof updateTenantProfileSchema>;
export type VerifyIdInput = z.infer<typeof verifyIdSchema>;
export type VerifyPropertyInput = z.infer<typeof verifyPropertySchema>;
export type VerifyEmploymentInput = z.infer<typeof verifyEmploymentSchema>;
