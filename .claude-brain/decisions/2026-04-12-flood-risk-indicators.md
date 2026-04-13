# Decision: Add flood risk indicators to all listings using HazardHunter data

**Date:** 2026-04-12
**Status:** Active

---

## Context

Pasig City entered RED ALERT on July 21, 2025 when Wawa Dam reached 135.69m (capacity: 135m). Barangays Santolan and Sta. Lucia were specifically named as highest-risk. The Pasig-Marikina-Laguna de Bay basin is one of Metro Manila's three most flood-prone areas.

Our launch area (Pasig/Ortigas corridor) sits in flood-exposed territory. Low-income renters (our target) typically prioritize price and proximity over flood risk — an information asymmetry we can correct.

The Philippine government operates **hazardhunter.georisk.gov.ph** — a FREE barangay-level flood mapping tool.

---

## Decision

**Every listing displays a flood risk indicator based on HazardHunter barangay data.**

Implementation:
- Simple 3-tier color coding: 🟢 Low / 🟡 Moderate / 🔴 High flood risk
- Tooltip provides context: "This barangay experienced flooding in [month/year]. During monsoon season, check PAGASA alerts."
- Integration with PAGASA weather alerts during monsoon season (June-November)
- Do NOT block or hide listings in red zones — inform the user, let them decide
- Display prominently on listing card, not buried in details

---

## Alternatives considered

**Skip flood indicators entirely:** Rejected. Ignoring flood risk for our specific user base (provincial migrants unfamiliar with Manila geography) is negligent. Scammers already exploit their unfamiliarity; we won't add to it.

**Hide high-risk listings:** Rejected. Paternalistic and anti-market. Some users may accept flood risk for lower rent. Information > gatekeeping.

**Use paid weather data service:** Unnecessary. HazardHunter is government-provided and free. PAGASA alerts are also free.

**Only show during monsoon season:** Rejected. Users making 6-12 month lease decisions need year-round visibility of risk. Monsoon season is ALSO when they can't move.

---

## Consequences

**Positive:**
- Free (zero build/operational cost)
- Differentiation: Facebook Marketplace has zero risk data
- User welfare signal: demonstrates care beyond transaction
- Trust signal: aligns with verification philosophy
- Corrects genuine information asymmetry
- Defensible positioning for media/press narrative
- Natural fit with PhilSys verification (both are "we add institutional data to informal market")

**Negative:**
- Landlords in red-zone barangays may object (manage via clear messaging: "We show this because our users deserve to know")
- HazardHunter data may be outdated for specific incidents
- Risk of user confusion ("low risk" barangay still flooded in freak event)
- Legal ambiguity if a user gets flooded in "low risk" listing (mitigate with clear disclaimer)

---

## Implementation approach

**Phase 1 (Week 1 of post-validation build):**
- Pull HazardHunter flood hazard classifications per barangay in launch area
- Cache in our database (update monthly)
- Simple 3-tier mapping (their data → our 🟢🟡🔴)
- Display on listing card + detail screen

**Phase 2 (Month 2+):**
- Subscribe to PAGASA weather alert feed
- Push notification to tenants in high-risk barangays when storm warnings issued
- "During monsoon season, we'll alert you if a typhoon affects your barangay"

**Phase 3 (Future):**
- User-submitted flood reports (crowdsourced data supplementing government sources)
- Historical flood depth indicators (if government opens data)

---

## Data & privacy considerations

- HazardHunter data is public government data — no DPA implications
- Our use case (informing users) is a public interest purpose, well within DPA allowances
- User-level flood event history (if we build user-submitted reports) would need consent

---

## Legal disclaimer requirement

Listing display must include (fine print, but present):

> "Flood risk shown is based on historical government data from HazardHunter (hazardhunter.georisk.gov.ph). Actual conditions may vary. This is informational only and not a guarantee."

---

## Revive trigger

This decision should be reopened if:
- HazardHunter is deprecated, paywalled, or data quality declines
- Better data source emerges (e.g., DOST-ASTI partnership)
- Users report flood indicators are inaccurate or unhelpful
- Landlords in affected areas aggregate opposition (unlikely but monitor)
- Legal counsel advises against showing risk data (unlikely given public data status)
- We expand beyond Pasig/Ortigas to areas where HazardHunter coverage is different

---

## Review date

2026-10-12 (6 months — check user feedback, data accuracy)

---

## References

- Source: hazardhunter.georisk.gov.ph (PHIVOLCS + DOST-ASTI + Mines and Geosciences Bureau)
- PAGASA: https://www.pagasa.dost.gov.ph/
- Pasig 2025 red alert: Philstar, 2025-07-21
- Related context: `context/08-pestel-snapshot-2026.md` § ENVIRONMENTAL
