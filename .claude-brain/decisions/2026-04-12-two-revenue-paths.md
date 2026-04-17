# Decision: Two tenant-paid revenue paths; free core platform; landlord still ₱0

**Date:** 2026-04-12
**Status:** Active
**Amends:** [[2026-04-11-tenant-only-revenue]] (adds second revenue stream, doesn't replace core principle)

---

## Context

Founder instinct pushed toward "free for both sides" to maximize accessibility and reach. Research locks the landlord side at ₱0 forever (validated: L5 "if it's free", 0/5 enthusiastic about any platform, "fees kill adoption" universal pattern).

The single ₱999 concierge fee works on paper but creates friction — users hit a payment wall before they can evaluate us. Many bounce. Founder correctly sensed that lower-friction monetization could dramatically increase conversion.

Explored 3% of every transaction as an alternative. That idea collapsed under scrutiny: "every transaction" is fuzzy (monthly rent is cash, we can't touch it), and the only transaction we actually see is the deposit at move-in. 3% of ₱15K deposit = ~₱450.

Also explored charging landlords a portion of the 3%. Killed — same research wall. Any landlord fee kills supply.

What survived: two parallel tenant-paid products serving different intents, both wrapped around a free core platform.

---

## Decision

**Three tiers of product, all accessible at zero cost up to the point of commitment.**

### Tier 0: Free core platform (everyone forever)
- Browse listings
- Create listings
- Verify identity (both landlord and tenant)
- Send and receive connection requests
- Phone reveal after mutual verification
- Report suspicious listings or users

No fee. No gate. No sign-up wall for browsing. This is the product "everyone can use."

### Tier 1: Escrow-only (tenant-paid, 3% of deposit)
- For DIY users who find their own place on the platform
- Licensed EMI partner holds the deposit in escrow via our partnership (we never hold funds — see [[2026-04-12-escrow-via-gcash-partnership]]) [GCash hypothesis dead — 0/6 landlords, see decisions/2026-04-17]
- Protects against scam landlords and bait-and-switch units
- Fee: 3% of deposit amount, min ₱300, max ₱750
- Average transaction: ~₱450 on a ₱15K deposit
- Landlord receives full deposit (₱15,000), tenant pays ₱15,450 total
- Marketed as "scam protection" not "platform fee"

### Tier 2: Full concierge placement (tenant-paid, ₱999 flat)
- For deadline-driven users (BPO new hires, migrants without kakilala)
- Done-for-you matching — 5-field form in, 3 verified matches out within 7 days
- AI + human housing buddy
- Includes escrow
- 7-day money-back guarantee

### Landlord pays: ₱0 in all tiers, forever.

Non-negotiable. Research-locked.

---

## Alternatives considered

**Pure free both sides, monetize later:**
Rejected. ZipMatch / Housing.com / Spleet pattern — burn cash, never monetize, die. "Later" arrives after the money runs out.

**Pure ₱999 concierge, no free tier escrow option:**
Original plan. Proven unit economics but high friction bounces price-sensitive users who would have paid 3% but not ₱999.

**3% on landlord's deposit receipt (landlord bears the fee):**
Killed. Research says landlords won't tolerate any fee. They'd receive ₱14,550 instead of ₱15,000 and revolt. Supply collapses.

**3% split between tenant and landlord:**
Same problem as above. Any landlord-facing fee triggers the same research-validated refusal.

**Flat ₱299 escrow fee (not percentage):**
Considered. Percentage ties our fee to transaction size, which aligns our incentive with user success and scales naturally across bedspace (₱3K deposit → ~₱90 fee) vs apartment (₱30K deposit → ₱750 fee). Flat fee creates weird edges — ₱299 on a ₱3K deposit is 10%, painful.

---

## Consequences

### Positive
- Free platform removes all access friction; word-of-mouth growth path unlocked
- Tier 1 (3% escrow) converts price-sensitive users who bounce at ₱999
- Tier 2 (₱999 concierge) captures high-intent high-willingness-to-pay users
- Two signals from the market instead of one
- Landlord side stays research-compliant (₱0)
- Escrow acts as scam prevention layer regardless of tier, building trust
- Validation test naturally A/Bs both paths

### Negative
- Two products to build, market, and support (more complex than single ₱999)
- Unit economics on Tier 1 are tighter (~₱450 avg vs ₱999 flat)
- Need higher volume on Tier 1 to generate same revenue (~91 placements/month to replace 34 ₱999 placements)
- Risk that users default to free tier and never upgrade, making us a cost center
- If we're not careful with marketing, users won't understand which tier they need

---

## Unit economics

### Tier 1 (escrow-only)
- Revenue per placement: ~₱450 avg
- Costs: Paymongo fees (~₱16), infra (~₱10), escrow ops (~₱20) = ~₱46
- **Gross margin: ~₱404 per placement (~90%)**

### Tier 2 (concierge)
- Revenue per placement: ₱999
- Costs: Gemini + infra + Paymongo + housing buddy (Phase 2) = ~₱120
- **Gross margin: ~₱879 per placement (~88%)**

### Blended target mix at Month 3
- 70% Tier 1 escrow (100 placements × ₱404 = ₱40,400)
- 30% Tier 2 concierge (40 placements × ₱879 = ₱35,160)
- **Total: ~₱75,560/month contribution margin at 140 (optimistic; base case 50-100) placements/month**

---

## Validation test update

The fake-door landing page changes. Instead of one ₱199 reservation button, two CTAs:

1. **"Protect my deposit — 3%"** → leads to escrow-only flow
2. **"Find me a place in 7 days — ₱999"** → leads to concierge flow

Both require a small real-money commitment to filter serious intent:
- Escrow path: ₱99 reservation (applied to eventual 3% fee)
- Concierge path: ₱199 reservation (applied to eventual ₱999)

### Go/no-go thresholds (updated)

Combined across both tiers in 14 days:
- **30+ paid reservations** (any mix) → BUILD
- **15-29** → EXTEND 14 more days
- **<15** → KILL, refund all, archive

Sub-analysis:
- If 30+ total but all escrow, concierge never gets built at launch
- If 30+ total but all concierge, escrow deferred to Phase 3
- If mix, build both

---

## Revive trigger

Reopen this decision if:
- Tier 1 conversion is >15× higher than Tier 2 — consider killing Tier 2 entirely (one product is simpler)
- Tier 2 conversion is near-zero and Tier 1 carries everything — simplify to escrow-only business
- Landlord demand emerges organically to pay for a premium feature — revisit landlord monetization (unlikely but track)
- Average deposit in our target segment falls below ₱10K — 3% math stops working, consider flat-fee escrow

---

## Review date

2026-04-26 (end of initial 14-day validation window)

---

## References

- Supersedes planning in [[2026-04-11-tenant-only-revenue]] (core principle retained, revenue stream extended)
- Research: `context/01-research-findings.md` (fees kill adoption, 0/5 landlord enthusiasm)
- Source: conversation 2026-04-12 arriving at dual-path model after exploring 3% and free-both-sides options
