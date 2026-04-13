# Decision: Kill all third-party scraping (Lamudi, OLX, Carousell, Facebook)

**Date:** 2026-04-10 (documented retroactively 2026-04-12)
**Status:** Active

---

## Context

V1-V3 plans included scraping Lamudi, OLX, Carousell, and Facebook as primary inventory sources. The hypothesis was that we could bootstrap a supply-side marketplace by aggregating listings from existing platforms.

User direct feedback: "Lamudi is useless, online listed rentals are .1% of actual market."

Research confirmed:
- Lamudi listings are 99%+ formal/mid-market (₱15K+), we target ₱3-15K informal
- Rentpad has broker markups inflating prices beyond our segment
- Facebook has the real inventory but:
  - Groups API deprecated April 22, 2024
  - Marketplace scraping violates ToS, anti-bot catches it fast
  - Meta has sued scrapers successfully
- The informal market lives in: tarps on walls, kakilala referrals, barangay word-of-mouth, small local Facebook groups with heavy moderation

---

## Decision

**We do not scrape any third-party site.** Ever. Not Lamudi, OLX, Carousell, Facebook Marketplace, Facebook Groups, or Rentpad.

**Inventory comes from:**
1. Direct in-person landlord onboarding (barangay walks)
2. Photographing tarps and onboarding those landlords
3. Our own in-app listing creation flow

---

## Alternatives considered

**Scrape Lamudi for volume:** Rejected. Wrong segment (<0.1% of real inventory), minimum ₱15K listings, doesn't serve our target.

**Scrape Facebook Groups:** Impossible. API deprecated. Headless browser violates ToS.

**Partner with existing platforms:** Explored briefly. Lamudi charges ₱15K minimum for listings. No API partnership available. Hoppler/Dormy.ph are competitors, not partners.

**Crowdsource listings from users:** Would work but creates chicken-egg problem. We need landlord supply BEFORE tenants arrive.

---

## Consequences

**Positive:**
- Zero legal risk from ToS violations
- Every listing is high-quality because we personally verified the landlord
- Forces us to build real relationships in target barangays (defensible moat)
- Clean, curated inventory vs. noisy aggregated feeds

**Negative:**
- Slower supply-side growth (walking barangays vs. scraping at scale)
- Manual work for each landlord onboarded (~20 min per landlord including verification)
- Requires physical presence in Pasig/Ortigas

---

## Revive trigger

**This decision should be reopened if:**
- A third-party platform offers an official API partnership (unlikely but monitor)
- Meta dramatically changes its stance on automated posting (extremely unlikely)

**Do NOT revive if:**
- Scraping "just this one site" is proposed
- Someone claims they have a "compliant scraper"
- A new library makes scraping technically easier

---

## Review date

2026-10-10 (6 months — only reopen if partnership opportunity emerges)

---

## References

- User quote: "Lamudi is useless, online listed rentals are .1% of actual market"
- Related decisions: [[2026-04-12-facebook-page-only-no-groups]]
- Related context: `context/07-facebook-policy.md`
