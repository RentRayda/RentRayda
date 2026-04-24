/**
 * Connection reveal predicate.
 *
 * Single source of truth for "should these two parties see each other's
 * phone numbers?" Extracted from the inline checks in routes/connections.ts
 * so that every branch can be tested exhaustively — a privacy leak here is
 * unrecoverable.
 *
 * The function is pure: it takes already-loaded DB rows and returns a
 * decision. The route handler still owns the DB reads and side effects
 * (updating status, stamping timestamps, creating the connection row),
 * but it delegates the question "is this allowed?" here.
 */

type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'partial';
type RequestStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export type DenyCode =
  | 'NOT_OWNER'
  | 'INVALID_INPUT'
  | 'BOTH_NOT_VERIFIED'
  | 'SUSPENDED'
  | 'NOT_FOUND';

export interface RevealInput {
  request: {
    status: RequestStatus;
    landlordProfileId: string;
    tenantProfileId: string;
    listingId: string;
  };
  landlordProfile: {
    id: string;
    verificationStatus: VerificationStatus;
    userId: string;
  } | null;
  landlordUser: {
    id: string;
    isSuspended: boolean;
  };
  tenantProfile: {
    id: string;
    verificationStatus: VerificationStatus;
    userId: string;
  } | null;
  tenantUser: {
    id: string;
    isSuspended: boolean;
  } | null;
}

export type RevealDecision =
  | { allowed: true }
  | { allowed: false; code: DenyCode; reason: string };

export function canRevealPhone(input: RevealInput): RevealDecision {
  const { request, landlordProfile, landlordUser, tenantProfile, tenantUser } = input;

  // Ownership — the authenticated landlord must own this request.
  if (!landlordProfile || request.landlordProfileId !== landlordProfile.id) {
    return { allowed: false, code: 'NOT_OWNER', reason: 'Landlord does not own this request' };
  }

  // Request must still be pending — already-processed requests cannot re-reveal.
  if (request.status !== 'pending') {
    return {
      allowed: false,
      code: 'INVALID_INPUT',
      reason: `Request status is ${request.status}, must be pending`,
    };
  }

  // Landlord side: verified AND not suspended.
  if (landlordProfile.verificationStatus !== 'verified') {
    return {
      allowed: false,
      code: 'BOTH_NOT_VERIFIED',
      reason: `Landlord verification is ${landlordProfile.verificationStatus}`,
    };
  }
  if (landlordUser.isSuspended) {
    return { allowed: false, code: 'SUSPENDED', reason: 'Landlord account is suspended' };
  }

  // Tenant side: profile present, verified, user present, not suspended.
  if (!tenantProfile || tenantProfile.verificationStatus !== 'verified') {
    return {
      allowed: false,
      code: 'BOTH_NOT_VERIFIED',
      reason: 'Tenant not verified',
    };
  }
  if (!tenantUser) {
    return { allowed: false, code: 'NOT_FOUND', reason: 'Tenant user not found' };
  }
  if (tenantUser.isSuspended) {
    return { allowed: false, code: 'SUSPENDED', reason: 'Tenant account is suspended' };
  }

  return { allowed: true };
}
