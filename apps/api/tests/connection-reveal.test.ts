import { describe, it, expect } from 'vitest';
import { canRevealPhone } from '../src/lib/connection-reveal';

/**
 * The single most critical business rule in RentRayda:
 *   Phone numbers are revealed ONLY when BOTH sides are verified,
 *   neither is suspended, the request is pending, and the landlord owns it.
 *
 * This test file drives a refactor: the route handler at
 * src/routes/connections.ts currently inlines these checks entangled with DB
 * queries. Extracting the decision into a pure predicate lets us exhaustively
 * test every "deny" path — which is what protects real users from privacy leaks.
 *
 * Follow the TDD rule: watch these fail BEFORE writing the implementation.
 * If you didn't see them fail, you don't know if they test the right thing.
 */

type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'partial';
type RequestStatus = 'pending' | 'accepted' | 'declined' | 'expired';

interface RevealInput {
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

function happyPath(): RevealInput {
  return {
    request: {
      status: 'pending',
      landlordProfileId: 'llp_1',
      tenantProfileId: 'tp_1',
      listingId: 'lst_1',
    },
    landlordProfile: {
      id: 'llp_1',
      verificationStatus: 'verified',
      userId: 'u_landlord',
    },
    landlordUser: { id: 'u_landlord', isSuspended: false },
    tenantProfile: { id: 'tp_1', verificationStatus: 'verified', userId: 'u_tenant' },
    tenantUser: { id: 'u_tenant', isSuspended: false },
  };
}

describe('canRevealPhone — the critical reveal predicate', () => {
  it('ALLOWS reveal when both verified, neither suspended, request pending, owner matches', () => {
    const result = canRevealPhone(happyPath());
    expect(result.allowed).toBe(true);
  });

  describe('request ownership', () => {
    it('denies when landlord does not own the request', () => {
      const input = happyPath();
      input.request.landlordProfileId = 'llp_SOMEONE_ELSE';
      const result = canRevealPhone(input);
      expect(result.allowed).toBe(false);
      expect(result.code).toBe('NOT_OWNER');
    });

    it('denies when landlord profile is missing', () => {
      const input = happyPath();
      input.landlordProfile = null;
      expect(canRevealPhone(input).code).toBe('NOT_OWNER');
    });
  });

  describe('request status', () => {
    it.each(['accepted', 'declined', 'expired'] as const)(
      'denies when request status is %s (not pending)',
      (status) => {
        const input = happyPath();
        input.request.status = status;
        const result = canRevealPhone(input);
        expect(result.allowed).toBe(false);
        expect(result.code).toBe('INVALID_INPUT');
      }
    );
  });

  describe('landlord verification', () => {
    it.each(['unverified', 'pending', 'rejected', 'partial'] as const)(
      'denies when landlord verification is %s',
      (status) => {
        const input = happyPath();
        input.landlordProfile!.verificationStatus = status;
        const result = canRevealPhone(input);
        expect(result.allowed).toBe(false);
        expect(result.code).toBe('BOTH_NOT_VERIFIED');
      }
    );

    it('denies when landlord user is suspended (even if verified)', () => {
      const input = happyPath();
      input.landlordUser.isSuspended = true;
      const result = canRevealPhone(input);
      expect(result.allowed).toBe(false);
      expect(result.code).toBe('SUSPENDED');
    });
  });

  describe('tenant verification', () => {
    it.each(['unverified', 'pending', 'rejected', 'partial'] as const)(
      'denies when tenant verification is %s',
      (status) => {
        const input = happyPath();
        input.tenantProfile!.verificationStatus = status;
        const result = canRevealPhone(input);
        expect(result.allowed).toBe(false);
        expect(result.code).toBe('BOTH_NOT_VERIFIED');
      }
    );

    it('denies when tenant profile is missing', () => {
      const input = happyPath();
      input.tenantProfile = null;
      expect(canRevealPhone(input).code).toBe('BOTH_NOT_VERIFIED');
    });

    it('denies when tenant user is missing', () => {
      const input = happyPath();
      input.tenantUser = null;
      expect(canRevealPhone(input).code).toBe('NOT_FOUND');
    });

    it('denies when tenant user is suspended (even if verified)', () => {
      const input = happyPath();
      input.tenantUser!.isSuspended = true;
      const result = canRevealPhone(input);
      expect(result.allowed).toBe(false);
      expect(result.code).toBe('SUSPENDED');
    });
  });

  describe('belt-and-suspenders cases', () => {
    it('denies with a single clear reason when multiple things are wrong', () => {
      const input = happyPath();
      input.request.status = 'declined';
      input.tenantProfile!.verificationStatus = 'unverified';
      input.landlordUser.isSuspended = true;
      const result = canRevealPhone(input);
      expect(result.allowed).toBe(false);
      // Early-return on the first check, so we see INVALID_INPUT (request
      // status is checked first). The point: the function must not reveal.
      expect(result.code).toBeDefined();
    });

    it('returns a human-readable reason alongside the code', () => {
      const input = happyPath();
      input.tenantProfile!.verificationStatus = 'unverified';
      const result = canRevealPhone(input);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBeTruthy();
      expect(typeof result.reason).toBe('string');
    });
  });
});
