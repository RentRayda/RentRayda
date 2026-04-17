# North Star — What We're Building

**Last updated:** 2026-04-12
**Status:** Canonical. Changes require a file in `decisions/`.

---

## THE DECISION IN ONE PARAGRAPH

We are NOT building more features. We are running a fake-door validation test with the MVP we already have (95% done per REPO_STATUS.md §9) to prove — with real money on the table — that female BPO new hires migrating to Pasig/Ortigas will pay for verified, safe, scam-protected housing during a **72-hour decision window**. Tier 0 (free) and Tier 1 (₱499 verified placement) test in parallel. If 30+ paid reservations land in 14 days, we finish the MVP cleanup (~40 hours of known fixes), deploy, and manually deliver placements for the first 10 paying users. If fewer than 15 pay, we refund everyone and archive the repo. No more pivots. No more blueprints. The gate is money on the table.

## THE USER'S ACTUAL DECISION WINDOW

Per deep research (2026-04-12): the primary target user decides where to live in **1–3 days**, not 14. She arrives in Manila with training starting in 5–14 days, cash for 2–3 weeks, and no kakilala. Everything about the product's UX, response times, and marketing must respect this compression. If we're not live-responsive in hours, we lose her to the scammer who is.

## THE CORE POSITIONING: SAFETY-FIRST

88% of women aged 18–24 in Metro Manila report harassment. 2/4 tenant interviews reported scam attempts. Safety is NOT a feature filter — it is the proposition. Every touchpoint leads with female-only status, verified landlord identity, CCTV/security, and scam protection. Never lead with price. Never lead with convenience. Lead with safety.

---

## THE PRODUCT

**Core proposition:** "Find your next place in Manila. Verified. Scam-free. Free to browse — pay only if you want our full service."

**Two tiers of product, all accessible at zero cost up to the point of commitment:**

### Tier 0: Free core platform (everyone forever)
Browse listings, create listings, verify identity, send/receive connection requests, phone reveal after mutual verification, report suspicious activity. **₱0.** No sign-up wall to browse. This is the product everyone can access.

### Tier 1: Verified Placement (tenant pays ₱499 flat)
For deadline-driven users (BPO new hires, migrants without kakilala). Done-for-you: 5-field form in, 3 verified matches out within 48 hours. AI + human housing buddy. ₱149 reservation via Paymongo + ₱350 on move-in. 48-hour money-back guarantee. Includes deposit coordination (manual bank transfer — we don't touch deposits). No escrow tier. Deposit flows directly landlord-to-tenant as cash or bank transfer.

**Landlord pays ₱0 in all tiers forever.** Research-locked.

**Who the narrow first wedge targets (Tier 1 verified placement):**
**Who the platform serves (the real wedge pattern):**

Any provincial migrant arriving in Metro Manila with no kakilala network, urgent housing timeline (≤72 hours), and ₱5-8K monthly budget. This pattern applies to:
- BPO new hires (primary marketing focus — highest concentration, easiest to reach through batch WhatsApp/Messenger groups)
- University students starting at DLSU, UP, PUP
- Fresh graduates starting at hospitals, banks, retail chains
- Young professionals in any industry relocating for work
- OFW families temporarily relocating during documentation/visa processing

**Why we market to BPO new hires first:** They're the highest-concentration findable version of this wedge. Concentrix/Accenture/Teleperformance training cohorts = 50-200 people starting the same week, shared Messenger groups, same deadline pressure. Easiest channel to reach at validation scale.

**Why "female-first" marketing (not female-only product):** Safety is the strongest empathy hook — 88% of women aged 18-24 in Metro Manila report harassment, and our initial 4 tenant interviews were all female. Platform serves all genders identically. Marketing leans female because female voices land hardest on scam-avoidance + safety messaging. Male migrants face the same kakilala-gap and scam-exposure problems — we just haven't interviewed them yet.

**What this means operationally:**
- Do NOT restrict signups by gender or employer type
- Track gender + employer in customer discovery to surface demand patterns we haven't seen
- Do NOT write UI copy that excludes male/non-BPO users
- Do lean marketing content toward the female-BPO-migrant story for sharp emotional targeting

## SUPPLY-SIDE MODEL: "SIGE" (added 2026-04-17, based on L1-L6 interviews)

**The landlord is NOT our user. She is our supply.**

0/6 landlords showed genuine enthusiasm for adopting any platform. But all would say "sige" (yes) to having their units listed for free with no effort required on their part. The Mamikos Mamichecker model applies: WE do the digitization work, the landlord just exists.

**How supply onboarding works:**
1. Walk barangay, find boarding house / studio building (FOR RENT signs, Facebook posts)
2. Approach: "Ate, we have verified tenants looking for studios. Pwede po bang i-list yung units ninyo? Libre po, we do everything."
3. She says "sige" — that is her ENTIRE involvement
4. WE photograph, WE verify her ID (PhilSys), WE create the listing
5. She continues operating exactly as she does — notebooks, cash, Facebook
6. Verified tenants from our platform contact her like any other inquiry

**Key alignment (L6 confirmed):** Informal landlords PREFER taga-probinsya (provincial) tenants over Metro Manila locals. Our target tenants ARE the landlord's preferred tenants. The platform aligns supply preference with demand — we're not fighting it.

**Why this works:** We're not adding work. We're removing it. L6 already does passport + ID + workplace verification manually for every tenant. Our pre-screened tenants arrive already verified — less screening work for her, same (preferred) tenant profile.

## NORTH STAR METRIC (added 2026-04-17)

**North Star: Verified Placements per Month**

Definition: The number of completed, verified placement transactions in a calendar month where:
1. Tenant paid ₱499 (full: ₱149 reservation + ₱350 on move-in)
2. Both tenant AND landlord were identity-verified before phone reveal
3. Tenant confirmed move-in (not just phone reveal — actual placement)

RentRayda plays the **Transaction Game** (like Airbnb, Uber, Mamikos). Revenue is per-transaction. Usage is episodic. Success = more completed transactions.

### Input Metrics (5 levers that drive the North Star)

| Metric | Definition | Target (Month 1 / Month 3) |
|--------|------------|---------------------------|
| Active Verified Listings | Listings where landlord verified + status active + updated in 30 days | 50 / 150 |
| Tenant Conversion Rate | % of landing page visitors who complete ₱149 reservation | 3% / 5% |
| Match Rate (48hr) | % of paid reservations that receive 3 verified matches within 48 hours | 70% / 85% |
| Landlord Sige Rate | % of landlords approached who agree to be listed for free | 60% / 70% |
| Placement Completion Rate | % of phone reveals that result in confirmed move-in within 72 hours | 40% / 55% |

### North Star Targets

| Stage | Verified Placements/Month |
|-------|--------------------------|
| Validation (now) | 0 (testing demand with fake-door) |
| Soft Launch (Month 1) | 5-10 |
| Early Traction (Month 3) | 30-50 |
| Product-Market Fit signal | 100+ |
| Scale readiness | 500+ |

### Market Sizing (added 2026-04-17)

| Metric | Annual Estimate | Basis |
|--------|----------------|-------|
| **TAM** | ₱200M (400K placements, Metro Manila) | Bottom-up: 285K-475K migration-eligible transactions/year at ₱499 |
| **SAM** | ₱28M (57K placements) | TAM x 0.70 (price band) x 0.85 (digital access) x 0.40 (willingness to pay) x 0.60 (supply coverage) |
| **SOM Year 1** | ₱100K (200 placements, ~17/month) | 4-barangay Pasig/Ortigas scope, 5-10% of local SAM, 2-person team |

Note: "30 reservations in 14 days" is the **validation gate**, not the North Star. The gate tests willingness-to-pay. The North Star tracks ongoing value delivery. They are sequential, not competing.

**Tao Elev prevention pitch:** "Verified tenant = isang tao, isang ID, isang workplace. Hindi Tao Elev." L6's worst experience was group fraud (1 signs, 5 occupy). Verified-tenant directly prevents this.

**The stack (what gets built across tiers):**

Pre-booking (free + Tier 1):
- Verified listings only
- Verified tenant profile
- AI-assisted scam screening

Tier 1 additions:
- Done-for-you matching (form → 3 verified matches in 48 hours)
- AI + human housing buddy
- 48-hour money-back guarantee
- Deposit coordination (manual bank transfer — we don't touch deposits)

Post-booking (landlord gets value for free):
- Pre-screened verified tenants
- Auto-post to our Facebook Page
- One-tap share to Groups
- Reputation system

**Revenue model:**
- Tier 0: ₱0
- Tier 1: ₱499 flat, tenant pays (₱149 reservation via Paymongo + ₱350 on move-in)
- Landlord: ₱0 forever
- No escrow tier. No 3% of deposit. No GCash. Deposit flows directly landlord-to-tenant.

**Unit economics (target at Month 3):**
- Tier 1 verified placement: ~₱449 margin × 100 = ₱44,900 (Paymongo fees ~₱50/txn)
- Total: ~₱44,900/month contribution margin at 100 placements/month (base case 50-100)

---

## THE BUILD LIST (WHAT WE'RE ACTUALLY SHIPPING)

### Phase 0: Validation gate (BEFORE any code)
Fake-door landing page with two CTAs (free browse vs. ₱149 reservation for verified placement). 14-day window, 30+ paid reservations = build, <15 = kill. Organic-only traffic (TikTok primary, Facebook Groups secondary per `decisions/2026-04-12-tiktok-primary-awareness-channel.md`).

### Phase 1: MVP cleanup (IF validation passes — Week 1, ~40 hours)
Hit every REPO_STATUS.md §10 item in order. No new features.

### Phase 2: Validation-specific features (Week 2, ~32 hours)
Done-for-you matching flow, Paymongo integration (₱149 reservation + ₱350 balance), Facebook auto-post to our Page, PhilSys eVerify integration.

### Phase 3: Soft launch (Week 3)
Walk barangays to onboard 30-50 landlords, hand-deliver first 10 placements, review.

---

## THE KILL LIST (NEVER REVIVE)

Every path below has been specifically rejected. Full reasons in `FINAL_DECISION.md` Section 3.

1. AI rental agent chat UX (users want buttons, not prompts)
2. Lamudi/OLX/Carousell scraping (wrong segment, <0.1% of real inventory)
3. Facebook Marketplace/Groups scraping (ToS violation + Groups API deprecated April 22, 2024)
4. B2B BPO HR partnerships (BPO shrinking due to AI agents)
5. Tenant or landlord monthly subscriptions (fees kill adoption)
6. Landlord-side paid features (0/6 landlords enthusiastic)
7. AI chatbot for support (premature optimization)
8. iOS at launch (Android 90% PH share)
9. Multi-city at launch (focus wins)
10. AlphaFold-scale ambitions (no such opportunity exists in this market)
11. Fundraising before PMF (Day 120 earliest)
12. Over-engineered architecture from V1-V5 (archived noise)
13. Deposit escrow as sole value prop (killed entirely — we don't touch deposits)
14. Scraping our own Facebook Page (Page is one-way megaphone)

---

## NON-NEGOTIABLES

1. Phone numbers revealed ONLY when BOTH parties verified AND connection accepted (triple-check in `apps/api/src/routes/connections.ts`)
2. Government ID images in PRIVATE R2 bucket, signed URLs with 1-hour expiry
3. API response format: success = `{ data: ... }`, error = `{ error: 'message', code: 'MACHINE_CODE' }`
4. Rate limits per TRD.md §10
5. Database sessions only (NOT JWTs)
6. Landlord side free forever (research-validated)
7. No paid ads during validation phase
8. Every reserver gets a customer discovery call within 24h

---

## THE ONE TEST

Fake-door landing page with two CTAs (free browse vs. ₱149 verified placement reservation). Small real-money commitment on the paid path.

**In 14 days:**
- **30+ paid reservations → we have a business to build.**
- **Fewer than 15 → we don't.**

Everything else is mechanism.
