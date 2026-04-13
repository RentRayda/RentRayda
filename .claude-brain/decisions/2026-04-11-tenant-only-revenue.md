# Decision: Tenant-only transaction-based revenue; landlord free forever

**Date:** 2026-04-11 (documented 2026-04-12)
**Status:** Active

---

## Context

We considered multiple revenue models across V1-V5:
- Monthly subscriptions (tenant Pro ₱149-299, landlord Pro ₱299-999)
- Transaction commissions on rent
- Broker-style placement fees (1 month rent)
- Listing fees for landlords
- Verification premium tiers

Research findings killed most of these:
- 0/5 landlords enthusiastic about any platform
- L5 explicit: "if it's free"
- T4 explicit: "if there's a fee regarding registration, they won't go there"
- Unit economics analysis of ₱149/mo tier showed NEGATIVE gross margin once Gemini API costs factored
- Rental search is episodic (once every 1-2 years), not recurring — subscriptions require frequency

Dominic's question crystallized the structure: "Who gains more value — landlords or tenants? They're different markets."

Answer: **Tenants gain pre-booking value (scam protection, verified listings, escrow). Landlords gain post-booking value (verified tenant delivered, guaranteed deposit). We charge the tenant side only.**

---

## Decision

**Revenue model:**

| Side | Pays | When | Amount |
|------|------|------|--------|
| Tenant | Per successful placement | ₱199 on reservation + ₱800 on move-in | ₱999 total |
| Landlord | Nothing | Never | ₱0 |

**No subscriptions. Ever.**

**Landlord side stays free forever.** This is research-validated and non-negotiable.

**Optional future upsells (Phase 3+, only if validation proves core model):**
- Express 48-hour placement: +₱500
- Premium dedicated housing buddy: +₱1,000

---

## Alternatives considered

**Landlord subscription at ₱299/mo:** Research killed this. 0/5 landlords want it.

**Listing fees (₱99 per listing, landlord pays):** Smaller friction than subscription but same principle — any fee kills adoption on landlord side.

**Commission on rent (% of monthly rent ongoing):** Technically possible via Paymongo as rent payment rail, but landlords insist on cash and we confirmed this in research (3/5 cash only, 2/5 PDCs, 0/5 GCash).

**Broker-style 1-month commission:** Would be ₱5-15K per placement (huge margin), but brokers charge this because they do 20+ hours of human work. Our AI+thin human model justifies ~₱999, not ₱5K+.

**Tenant subscription for unlimited searches:** Same problem as any subscription — rental search is episodic.

---

## Consequences

**Positive:**
- Landlord side has zero friction to adoption — they literally lose nothing by trying us
- Tenants pay for clear value: scam protection on a ₱15K deposit = ~2% insurance
- Unit economics work at ~88% gross margin per placement (₱879 of ₱999)
- Simple, explainable pricing — no tier confusion

**Negative:**
- Caps our revenue per user (can't upsell landlords ever)
- Requires high placement volume to build meaningful revenue
- At 100 placements/month = ₱87K gross margin — not huge
- To reach ₱1M+/month margin, we need 1,150+ placements/month — aggressive

---

## Revive trigger

**This decision should be reopened if:**
- Landlords independently ask to pay for something (strong signal we're leaving money on the table)
- Validation reveals tenants won't pay ₱999 but would pay ₱299 + small recurring fee (unlikely based on research)
- Unit economics fail at scale and we need to find new revenue lines

**Do NOT revive if:**
- "Other rental platforms charge landlords" — they fail. Research shows fees kill adoption in this segment.
- "But what about premium landlord analytics?" — Not until we have 1000+ landlords AND they're asking.

---

## Review date

2026-07-12 (3 months — check unit economics at scale)

---

## References

- Research: `context/01-research-findings.md` (fees kill adoption, L5 quote, T4 quote)
- Related decisions: [[2026-04-12-validate-before-build]]
- Source: Dominic Messenger conversation 2026-04-11, screenshots archived
