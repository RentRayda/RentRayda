# Decision: RentRayda never creates BIR-adjacent paper trails for landlords

**Date:** 2026-04-12
**Status:** Active

---

## Context

Deep research revealed that informal Filipino landlords (our target supply-side segment, women 45-70 with 2-10 units) operate cash-only **specifically to avoid BIR (tax authority) exposure**.

Most informal landlords:
- Are not BIR-registered
- Don't issue Official Receipts (ORs)
- Don't declare rental income
- Operate under verbal or simple written agreements
- Fear any system that creates auditable records

This fear is existential, not preferential. A platform that creates records = perceived tax trap. This is WHY "landlord side free forever" works — not just because fees kill adoption, but because fees (and the registration/records that come with them) signal formalization.

Prior decisions (two-revenue-paths, tenant-only-revenue) address the fee side. This decision addresses the paper trail side.

---

## Decision

**RentRayda will not create, export, or present transaction data in formats that appear BIR-reportable for landlords.**

Specifically:

**WHAT WE WILL NOT DO:**
- Issue Official Receipts (ORs) to tenants
- Require landlord TIN (Tax Identification Number)
- Require landlord BIR registration to list
- Generate downloadable "annual earnings summaries" for landlords
- Use language like "income statement," "revenue report," "taxable transactions"
- Share landlord transaction data with BIR or DTI unless legally compelled
- Display aggregated earnings totals to landlords in "accounting" format
- Integrate with accounting software (QuickBooks, Xero)
- Position ourselves as a "payment platform" (we're a "connection platform")
- Show "recipient: RentRayda" on landlord-facing receipts (they see tenant-to-landlord only)

**WHAT WE WILL DO:**
- Facilitate connection and trust between tenant and landlord
- Route payments through licensed EMI partner (tenant-to-landlord; we're not the recipient) [GCash hypothesis dead — 0/6 landlords, see decisions/2026-04-17]
- Provide tenant-facing receipts (tenant may need them, that's fine)
- Maintain platform activity logs for dispute resolution (internal, not exported)
- Comply with legal requests for specific data (we're not hiding illegal activity)

---

## Why this is compatible with our values

We're not helping anyone evade taxes. We're respecting that the informal rental market exists because formal housing doesn't serve this segment. Asking landlords to formalize before we can help them is:

1. Not our role as a platform (we're not government enforcers)
2. Practically impossible (40%+ of PH GDP is informal economy)
3. Adoption-killing (see psychographics)

Individual landlords remain responsible for their own tax compliance. That's between them and BIR, not us.

If/when a landlord wants to formalize (grows to 15+ units, becomes a business), tools exist (DTI registration, BIR registration). We can point them to these resources — but we don't require them.

---

## Alternatives considered

**Require BIR registration / TIN for all landlords:** Rejected. Kills 95%+ of target supply-side.

**Partial formalization (TIN required for payments >₱X):** Rejected. Still triggers BIR fear, just at a higher threshold.

**"Encourage" BIR registration:** Rejected. Our messaging is neutral-to-protective, not encouraging formalization.

**Active tax reporting to BIR:** Rejected. Would destroy the supply-side entirely and expose us to being seen as a tax arm of government by landlords.

---

## Consequences

**Positive:**
- Massively reduces landlord onboarding friction
- Aligns our product with actual informal economy norms
- Protects landlord psychological safety
- Signals "we're on your side" to target supply
- Simpler product (no tax-reporting features to build)
- Avoids liability of being seen as a tax platform

**Negative:**
- Cannot position ourselves as "official" or "formal" in marketing (but we never should — that's tenant-repellent too)
- Harder to partner with banks, formal property managers, enterprise real estate
- May face criticism from formal-sector stakeholders ("you're enabling tax evasion")
- If BIR changes enforcement stance dramatically, we may need to revisit

---

## What Claude Code must not build

When building landlord-facing features, DO NOT propose:

- "Landlord earnings dashboard" showing monthly/annual revenue totals
- "Annual tax summary" or similar
- TIN input fields (anywhere)
- BIR registration links or prompts
- Landlord accounting tools
- Integrations with accounting software
- Receipts from RentRayda to landlord (only tenant → landlord receipts via payment partner) [GCash hypothesis dead — 0/6 landlords, see decisions/2026-04-17]
- "Compliance" language in landlord UX
- "Official" partnership indicators with DTI, BIR, or tax-adjacent agencies

If a feature request crosses this line, flag it. Re-read this decision.

---

## What Claude Code SHOULD build

- "Active listings" view (how many of your units are listed)
- "Current tenants" view (who's renting what, by tenant name)
- "Upcoming move-ins" (operational, not financial)
- "Tenant move-in history" (for reputation, not tax)
- "Recent inquiries" (operational)
- Payment arrived/pending status (operational, not accounting)

The line is: **operational information = YES. Accounting / tax-adjacent information = NO.**

---

## Revive trigger

This decision should be reopened if:
- BIR launches specific enforcement campaign targeting informal rentals via platforms
- Government passes legislation requiring platforms to report landlord income
- Our landlord base shifts materially toward formal sector (large property managers)
- A specific landlord segment emerges that actively requests tax reporting tools
- Legal counsel advises new obligations under amended tax code

---

## Review date

2026-10-12 (6 months — monitor BIR enforcement posture)

---

## References

- Research: `context/10-target-psychographics-secondary.md` § BIR FEAR
- Related: [[2026-04-11-tenant-only-revenue]], [[2026-04-12-landlord-onboarding-messenger]]
- Legal context: Philippine tax code informal economy treatment
