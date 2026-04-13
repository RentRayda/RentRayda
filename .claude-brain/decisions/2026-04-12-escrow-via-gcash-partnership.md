# Decision: Route escrow through GCash/Maya partnership, never hold funds directly

**Date:** 2026-04-12
**Status:** Active
**Supersedes:** Paymongo-as-escrow assumptions in prior planning docs

---

## Context

Tier 1 model includes a 3% fee on escrow-protected transactions. Original assumption (pre-research): RentRayda's Paymongo integration would hold funds in escrow until tenant confirms move-in, then release to landlord minus 3%.

Deep research (April 2026) surfaced a material legal issue: **BSP classifies fund-holding as either Operating a Payment System (OPS) requiring registration, or E-Money Issuance (EMI) requiring full licensing.** AFASA (RA 12010, signed July 2024) adds further obligations: fraud detection mechanisms, fund-holding on scam reports, and cooperation with authorities.

Paymongo is itself a licensed EMI. RentRayda using Paymongo is different from RentRayda HOLDING user funds — the latter would require our own BSP registration.

---

## Decision

**RentRayda will NEVER hold, transmit, or control tenant or landlord funds directly.**

All payment flows route through a licensed EMI partner:
- **Primary: GCash** (94M users, 89% wallet share — both sides already use it)
- **Secondary: Maya** (50M+ users — fallback for users without GCash)
- **Paymongo remains valid** as a card/bank-to-GCash rail for Tier 2 concierge reservations

The 3% fee (Tier 1) is structured as a marketplace commission:
- Tenant initiates payment through our flow
- Funds go directly to GCash-held escrow (NOT to us)
- GCash releases funds to landlord on our API signal (after tenant confirms move-in)
- GCash deducts our 3% commission and remits to us
- We never hold the principal amount

For Tier 2 (₱999 flat):
- Tenant pays us directly via Paymongo (standard ecommerce)
- The ₱999 is OUR revenue, not held funds
- Deposit escrow happens separately via GCash partnership (same as Tier 1)

---

## Alternatives considered

**Option A (chosen): GCash/Maya partnership.** Lowest regulatory burden, maximum user trust (existing tools), fastest to market.

**Option B: Register as OPS with BSP.** Requires AML/CFT compliance, settlement accounts, consumer protection infrastructure, ~12-24 months to approval. Viable at scale, premature at launch.

**Option C: EMI license.** Full BSP supervision, capital requirements in millions of pesos. Overkill for a pre-PMF startup.

**Option D: Partner with Lodgerin or similar existing escrow provider.** No established PH rental-specific escrow provider exists. Would be building the partnership from scratch anyway.

---

## Consequences

**Positive:**
- Zero BSP licensing burden at launch
- Leverages existing user trust in GCash (no "what's this new payment thing" anxiety)
- AFASA compliance delegated to partner (they have obligation, not us)
- Faster time-to-market
- Fee collection flow is cleaner (commission vs. held-funds accounting)
- No need for our own fraud detection infrastructure at launch

**Negative:**
- Dependent on GCash API terms and uptime (single point of failure mitigated by Maya fallback)
- GCash API may charge per-transaction fee (negotiate in partnership)
- Less control over refund timing
- Need to maintain GCash business account with merchant vertical compliance
- Partnership negotiation is non-trivial (can take 3-6 months)

---

## Implementation path

1. **Week 1:** Initiate GCash merchant partnership conversation via official business channels
2. **Week 2:** Technical spec review — confirm API supports escrow-like hold-and-release pattern
3. **Week 3-4:** If partnership viable, integrate into existing Paymongo flow as parallel path
4. **Week 5+:** Validation launch uses both — Paymongo for reservation (₱99/₱199), GCash for deposit flow

**If partnership stalls >60 days:** Launch Tier 1 with explicit messaging "secure booking fee, pay landlord directly" — postpone full escrow to Phase 3 rather than violate BSP rules by improvising.

---

## Revive trigger

This decision should be reopened if:
- GCash API terms become prohibitively expensive (>1% of transaction value as their fee)
- BSP creates a "lite" OPS registration suitable for marketplaces
- Transaction volume exceeds GCash API rate limits
- A competitor successfully obtains OPS registration and offers superior escrow
- GCash partnership is rejected or stalls indefinitely

---

## Review date

2026-07-12 (3 months — re-check partnership status and regulatory landscape)

---

## References

- Research: `context/08-pestel-snapshot-2026.md` § LEGAL
- Related: [[2026-04-12-two-revenue-paths]] (defines the 3% mechanic this decision implements)
- Legal: BSP Circular 1206 (EMI moratorium lifted), AFASA / RA 12010
- GCash business inquiries: business@mynt.xyz (public channel)
