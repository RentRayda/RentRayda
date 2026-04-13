# PESTEL Snapshot — Philippine Informal Rental Market (April 2026)

**Last updated:** 2026-04-12
**Source:** Deep research April 2026 (PSA, BSP, DLA Piper, Hogan Lovells, UN Women, Meltwater/DataReportal, DHSUD, PNA, Global Property Guide, industry reports)
**Purpose:** Environmental context that shapes what RentRayda should build, how it should position, and what it must prepare for.

---

## WHY THIS FILE EXISTS

Claude Code tends to default to global/generic assumptions when given country-specific problems. This file makes the Philippine-specific environment explicit so Claude Code doesn't propose solutions that are illegal, culturally tone-deaf, or environmentally naive.

Read this BEFORE proposing any feature that touches: payments, identity, marketing channels, housing features, legal compliance, or partnerships.

---

## POLITICAL

- **4PH housing program:** 0% utilization in 2025. Budget slashed ₱700M → ₱35M. Government CANNOT deliver affordable housing at scale. Structural demand for informal rentals is permanent.
- **Rent Control Act (RA 9653):** Covers bedspaces ≤₱10,000/month in NCR. 2026 renewal cap: 1%. Initial rent for new tenants: uncapped. Enforcement: complaint-driven, practically dormant in informal sector.
- **NPC enforcement accelerating:** Worldcoin Cease and Desist order Sept 2025. Imprisonment penalties for data privacy violations are real, not theoretical.
- **DHSUD pilot programs:** Beginning to acknowledge rental housing as a modality (UP, Iloilo, QC pilots). Not a competitive threat — validates the category.

---

## ECONOMIC

- **GDP:** 4.4% (2025), forecasts 3.7-5.6% (2026). Inflation: 1.7% avg (2025), spiked to 4.1% March 2026.
- **BPO industry:** $40B+ revenue, 1.9M workers (projected 1.97M in 2026), 5% annual growth. AI = augmentation, not replacement. Entry salary ₱18,000-25,000/month.
- **Housing backlog:** 10.65M units. Metro Manila prices +13.9% YoY. 80,300 unsold condos all at wrong price point (₱4-12M). Less than 1% of remaining supply serves low-income segment.
- **GCash:** 94M registered users, 81M active, 89% mobile wallet market share. Maya: 50M+. Digital payments: 52.8% of retail transactions.
- **Implication:** Target demographic (₱18-25K/month) has zero margin after rent/remittance/food. Single scam of ₱5-10K is catastrophic.

---

## SOCIAL

- **Migration patterns:** Provincial → NCR continuous. 53% female migration majority. Metro Manila population 14.75M.
- **Gen Z:** Digital-first, flexibility-oriented, co-living culturally accepted. 35% have experienced depression; 69% cite uncertainty as root cause.
- **BPO workforce:** 55% female. Median age 25.7 years. Night shift norm.
- **Informal settlements:** 37% of Metro Manila residents. Context for why "informal rental" is the norm, not the exception.
- **Implication:** The user is already anxious before they open the app. Every friction point compounds existing stress.

---

## TECHNOLOGICAL

- **Android market share:** 85-89% in Philippines. Budget phones dominate: 3-4GB RAM, 32-64GB storage.
- **PhilSys (national digital ID):** 80% population coverage (90.29M PSNs). ePhilID available via eGov PH app, legally binding. **eVerify institutional API at everify.gov.ph is FREE.**
- **Mobile internet:** ~36-59 Mbps avg. Data costs ~₱11-12.50/GB. Most BPO workers on ₱199-599/month prepaid plans.
- **Facebook:** 107.6M users (89.2% of population). Messenger: 101.5M. TikTok: 56M users, 40 hrs/month avg for target demo.
- **Implication:** APK size matters (keep <50MB). Image compression is non-negotiable. PWA fallback should be considered.

---

## ENVIRONMENTAL

- **Pasig City:** RED ALERT July 21, 2025 (Wawa Dam at 135.69m vs 135m capacity). High-risk barangays: Santolan, Sta. Lucia. Pasig-Marikina-Laguna de Bay basin is one of Metro Manila's three most flood-prone areas.
- **Typhoon season:** June-November. ~20 cyclones/year. Major 2025 events displaced millions.
- **HazardHunter:** hazardhunter.georisk.gov.ph — FREE barangay-level flood data. Product opportunity.
- **Implication:** Listings in our launch area (Pasig/Ortigas) are genuinely at flood risk. Ignoring this is negligent; surfacing it is defensible differentiation.

---

## LEGAL

- **BSP licensing (CRITICAL FINDING):** Escrow/fund-holding requires OPS registration or EMI license. EMI moratorium lifted (Circular 1206) but capital requirements are high. **Solution: route escrow through GCash/Maya partnership, never hold funds directly.** See `decisions/2026-04-12-escrow-via-gcash-partnership.md`.
- **AFASA (RA 12010):** Anti-Financial Account Scamming Act, signed July 2024. Imposes fraud detection, fund-holding on scam reports, and cooperation with authorities on any entity processing payments. Reinforces the GCash partnership decision.
- **Data Privacy Act (RA 10173):** Imprisonment up to 7 YEARS for violations (not just fines). NPC registration required at 1000+ sensitive records. DPO mandatory. PIA (Privacy Impact Assessment) before launch. 72-hour breach notification.
- **E-Commerce Act (RA 8792):** Digital contracts legally valid. Enables our connection-reveal mechanism.
- **BIR:** Landlord rental income technically taxable. Most informal landlords are non-compliant and operate in cash specifically to avoid paper trails. See `decisions/2026-04-12-no-bir-paper-trail.md`.
- **Rent Control Act (RA 9653):** Applies to our target segment (bedspaces ≤₱10K). Max deposit: 2 months rent + 1 month advance. Our product must enforce this.

---

## WHAT THIS MEANS FOR CLAUDE CODE

When proposing anything, check against this snapshot:

1. Does it hold funds? → Route through GCash/Maya, don't build custom.
2. Does it store IDs or sensitive data? → DPA compliance is non-negotiable (DPO, PIA, encryption, 72hr breach response).
3. Does it create records for landlords? → Check BIR paper trail decision first.
4. Does it ignore flood risk? → Add HazardHunter indicator instead.
5. Does it assume iOS or desktop? → Android <50MB APK with 3G support.
6. Does it propose scraping? → Killed. See `decisions/2026-04-10-kill-scraping.md`.
7. Does it propose landlord fees? → Killed. See `decisions/2026-04-11-tenant-only-revenue.md`.

---

## REVIVE TRIGGERS

This snapshot should be updated if:
- Philippine government changes housing policy (4PH revival, new program)
- BSP changes fund-holding regulations
- PhilSys eVerify becomes paid or restricted
- Major BPO industry shock (AI-driven headcount cuts)
- NPC enforcement posture changes significantly
- Peso/USD exchange rate moves >20% (affects OFW remittances, tenant budgets)

Review date: 2026-07-12 (quarterly)
