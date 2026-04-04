// Roles
export const ROLES = ['landlord', 'tenant', 'admin'] as const;
export type Role = (typeof ROLES)[number];

// Unit types
export const UNIT_TYPES = ['bedspace', 'room', 'apartment'] as const;
export type UnitType = (typeof UNIT_TYPES)[number];

// Launch barangays — Pasig BPO corridor + adjacent Mandaluyong
export const LAUNCH_BARANGAYS = [
  'Ugong',
  'San Antonio',
  'Kapitolyo',
  'Oranbo',
  'Boni',
  'Shaw',
] as const;
export type LaunchBarangay = (typeof LAUNCH_BARANGAYS)[number];

// Inclusions (what's included in rent)
export const INCLUSIONS = [
  'water',
  'electricity',
  'wifi',
  'cr',
  'aircon',
  'parking',
] as const;
export type Inclusion = (typeof INCLUSIONS)[number];

// Government ID types
export const ID_TYPES = [
  'philsys',
  'umid',
  'drivers_license',
  'passport',
  'voters_id',
  'prc_id',
  'postal_id',
] as const;
export type IdType = (typeof ID_TYPES)[number];

// Employment types
export const EMPLOYMENT_TYPES = [
  'bpo',
  'student',
  'office',
  'freelancer',
  'other',
] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

// BPO companies (common in Pasig corridor)
export const BPO_COMPANIES = [
  'Concentrix',
  'Teleperformance',
  'Accenture',
  'TaskUs',
  'Alorica',
  'Sutherland',
  'TTEC',
  'Conduent',
  'iQor',
  'Other',
] as const;
export type BpoCompany = (typeof BPO_COMPANIES)[number];

// Report types
export const REPORT_TYPES = [
  'fake_listing',
  'scam_attempt',
  'identity_fraud',
  'other',
] as const;
export type ReportType = (typeof REPORT_TYPES)[number];

// Verification statuses
export const VERIFICATION_STATUSES = ['unverified', 'pending', 'partial', 'verified', 'rejected'] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

// Listing statuses
export const LISTING_STATUSES = ['draft', 'active', 'paused', 'rented'] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

// Connection request statuses
export const CONNECTION_REQUEST_STATUSES = ['pending', 'accepted', 'declined'] as const;
export type ConnectionRequestStatus = (typeof CONNECTION_REQUEST_STATUSES)[number];

// Document types
export const DOCUMENT_TYPES = [
  'government_id',
  'selfie',
  'property_proof',
  'employment_proof',
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

// Verification document statuses
export const DOC_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type DocStatus = (typeof DOC_STATUSES)[number];
