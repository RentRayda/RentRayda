# Decision: Validate demand with fake-door before building more features

**Date:** 2026-04-12
**Status:** Active

---

## Context

Over 15+ hours of strategic planning across V1-V5 iterations, we generated 14,000+ lines of blueprints without validating that anyone wants what we're building. The existing codebase is 95% complete (25/32 playbook prompts done, 6,704 LOC) but has never been deployed and has zero paying users.

Research showed:
- 0/5 landlords enthusiastic about any platform
- Only 1/4 tenants (T1, migrant, no network) had real pain
- "Fees kill adoption" validated universally
- Multiple hypothesis failures (landlords don't need us, locals don't need us)
- No clear AlphaFold-scale opportunity exists in this market

Dominic (co-founder) asked two critical questions:
1. Are the people in our market willing to pay extra for verification?
2. Who gains more value — landlords or tenants?

We can spend another 100+ hours building features we THINK will work, or we can spend 2 hours building a landing page and find out in 14 days whether real strangers will pay ₱199 for what we're promising.

---

## Decision

**Before any more code, we run a fake-door validation test:**

1. Build a landing page at `rentrayda.com/fast` in 2 hours
2. Page promises: "Find your next place in Manila in 7 days. ₱999 or your money back."
3. Require real ₱199 Paymongo reservation to submit (refundable)
4. Run for 14 days with zero paid ads (organic only: BPO FB groups, universities, Reddit, personal network, TikTok)
5. Two-CTA landing page (per `2026-04-12-two-revenue-paths`): Tier 1 escrow (₱99 reservation) + Tier 2 concierge (₱199 reservation). Both refundable.
6. Call every reserver within 24 hours

**Go/no-go thresholds:**
- 30+ paid reservations → BUILD (finish MVP cleanup ~40hr, deploy, manually deliver first 10 placements)
- 15-29 → EXTEND 14 more days with iterated landing page
- <15 → KILL, refund all reservations, publish post-mortem, archive repo

---

## Alternatives considered

**Build first, validate later:** Standard approach but we've already been burned 5 times by pivoting after building. The MVP is built. Building more before proving demand is sunk cost escalation.

**Free signup validation:** Collect emails without payment. Rejected because free signups are noise. Real cash from real strangers is the only honest signal.

**Paid ad validation:** Run Facebook ads to test conversion. Rejected because it confounds "product-market fit" with "channel-market fit". Organic signal is cleaner.

**Wider target (all Manila renters):** Rejected because it dilutes the message. The wedge is provincial migrants without kakilala network in Pasig/Ortigas — specific, findable, deadline-driven. Female BPO new hires are the sharpest marketing focus, but the product serves all migrants matching the core pattern.

---

## Consequences

**Positive:**
- Costs ~₱500 to run (landing page hosting + refund fees)
- Gets honest answer in 14 days
- If validation fails, we walk away with minimal sunk cost
- If validation passes, we have 30+ real paying customers before writing more code
- Forces us to write actual marketing copy that works

**Negative:**
- 14 days of no code-shipping (but the existing MVP is already 95% done, so this is fine)
- Risk of negative signal if we market before we can deliver (mitigated by manual delivery for first 10)
- Public test = if it fails, competitors see us fail (acceptable trade-off)

---

## Revive trigger

**This decision should be reopened if:**
- We hit 30+ reservations in the first 7 days (then we can start building earlier)
- We get strong qualitative signal from discovery calls that the price point is wrong but the need is real (might adjust price mid-validation)

If we hit <5 reservations in the first 7 days with no viral pickup, consider killing early rather than running full 14 days.

---

## Review date

2026-04-26 (Day 14, end of validation window)

---

## References

- Related decisions: [[2026-04-10-kill-scraping]], [[2026-04-11-tenant-only-revenue]]
- Related research: `context/01-research-findings.md` (the full hypothesis status table)
- Source: `FINAL_DECISION.md` Sections 1, 4, 7
