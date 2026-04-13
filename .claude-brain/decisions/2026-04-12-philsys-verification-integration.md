# Decision: Pursue PhilSys eVerify integration as primary identity verification

**Date:** 2026-04-12
**Status:** IN PROGRESS (contingent on PSA onboarding)

---

## Context

Verification is a core RentRayda differentiator — it's what distinguishes us from Facebook Groups. Prior plan assumed manual ID review via admin queue.

Deep research (April 2026) surfaced that **PhilSys (national digital ID system) has 90.29M PSNs (80% population coverage) and provides a FREE institutional verification API at everify.gov.ph.**

This is the highest-leverage technical investment we can make. It creates institutional trust that Facebook Marketplace categorically cannot provide, at zero per-verification cost.

---

## Decision

**Integrate PSA's PhilSys eVerify API for both tenant AND landlord identity verification.**

Implementation:
1. Primary verification: PhilSys eVerify check against user-provided PhilSys number or ePhilID scan
2. Verified users get a "PhilSys Verified" badge (distinct from the "Landlord Verified" and "Tenant Verified" badges which also incorporate property/employment proof)
3. Users without PhilSys can still use the platform — manual admin review remains as fallback
4. Verification UX: <2 minute flow, non-governmental register, reassuring language

---

## Alternatives considered

**Third-party KYC providers (Jumio, Onfido, etc.):** Rejected. Paid per-verification. Slower for PH-specific IDs. Creates user anxiety (foreign provider, more data shared). PhilSys is free and native.

**Manual ID review only:** Current MVP behavior. Doesn't scale, slower to verify, subjective admin calls. Keep as fallback but replace as primary.

**Delay verification until Phase 2:** Rejected. Verification IS the core differentiator. Launching without it means we look like "a slower Facebook Marketplace."

**Build our own scam database:** Complementary, not alternative. Do both.

---

## Consequences

**Positive:**
- Zero per-verification cost (PSA eVerify is free for institutional use)
- Instant verification (vs. hours/days for manual review)
- Strong institutional trust signal — specifically valuable for the female BPO migrant target who lacks network-based trust
- Creates defensible moat vs. Facebook (they have no equivalent)
- 80% of target users already have PhilSys (young Filipinos have highest registration rates)
- Complements kakilala social trust, doesn't replace it

**Negative:**
- Requires PSA institutional onboarding (bureaucratic, uncertain timeline)
- 20% of users don't have PhilSys → need fallback flow
- Data Privacy Act compliance requirements increase (sensitive personal information)
- Must handle PSA API downtime gracefully (what if their API is down?)
- Dependency on government-run API (political risk, albeit low)

---

## Implementation path

**Step 1 (this week):** Contact PSA institutional onboarding via:
- Email: [research the specific institutional contact at everify.gov.ph]
- Follow up: DICT (Department of Information and Communications Technology)
- Legal prep: Register as data processor under DPA (RA 10173)

**Step 2 (within 30 days):** Clarify:
- API access terms
- Rate limits
- Data handling requirements
- Liability and indemnity clauses
- Cost (confirmed free, but confirm for our use case)
- Required compliance documentation

**Step 3 (within 60 days):** If terms acceptable:
- Sign institutional agreement
- Integrate API in sandbox
- DPA compliance review (DPO sign-off, PIA update)
- Test flow with team members' real PhilSys IDs

**Step 4 (within 90 days):** Launch in production, replacing manual primary verification.

**If PSA onboarding takes >6 months:** Continue with manual verification at launch, log the blocker, escalate via industry groups / legal counsel. Do NOT gate product launch on PhilSys availability.

---

## Design requirements

- Verification flow must feel like RentRayda, not government. No government seal, no bureaucratic language.
- Copy: "Verify your identity in 2 minutes. We use PhilSys (your government ID) but we don't share your info with anyone."
- Fallback for no-PhilSys users: "No PhilSys yet? No problem. Upload any valid ID and we'll verify manually within 24 hours."
- Success state: "Verified ✓" badge appears immediately, with optional explanation "This means we matched your identity with PhilSys."
- Failure state: Never say "rejected" or "denied." Use "We couldn't verify this automatically. Let's try manual review."

---

## Revive trigger

This decision should be reopened if:
- PSA onboarding proves impossible or prohibitively slow (>6 months)
- PhilSys adoption stalls or reverses
- PSA changes terms to paid or restricted access
- Alternative verification method proves sufficient (e.g., BPO company ID cross-reference achieves 90%+ verification rate)
- Major PhilSys security incident undermines user trust in the system
- NPC (National Privacy Commission) issues restrictive guidance on PhilSys data use

---

## Review date

2026-07-12 (3 months — check PSA onboarding status, adoption metrics)

---

## References

- Research: `context/08-pestel-snapshot-2026.md` § TECHNOLOGICAL
- PSA eVerify portal: https://everify.gov.ph
- eGov PH Super App (for ePhilID): https://egov.gov.ph
- DPA compliance: `decisions/2026-04-12-data-privacy-act-compliance.md`
