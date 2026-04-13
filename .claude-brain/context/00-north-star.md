# North Star — What We're Building

**Last updated:** 2026-04-12
**Status:** Canonical. Changes require a file in `decisions/`.

---

## THE DECISION IN ONE PARAGRAPH

We are NOT building more features. We are running a fake-door validation test with the MVP we already have (95% done per REPO_STATUS.md §9) to prove — with real money on the table — that female BPO new hires migrating to Pasig/Ortigas will pay for verified, safe, scam-protected housing during a **72-hour decision window**. Tier 1 (3% escrow via GCash partnership) and Tier 2 (₱999 concierge) test in parallel. If 30+ combined paid reservations land in 14 days, we finish the MVP cleanup (~40 hours of known fixes), deploy, and manually deliver placements for the first 10 paying users. If fewer than 15 pay, we refund everyone and archive the repo. No more pivots. No more blueprints. The gate is money on the table.

## THE USER'S ACTUAL DECISION WINDOW

Per deep research (2026-04-12): the primary target user decides where to live in **1–3 days**, not 14. She arrives in Manila with training starting in 5–14 days, cash for 2–3 weeks, and no kakilala. Everything about the product's UX, response times, and marketing must respect this compression. If we're not live-responsive in hours, we lose her to the scammer who is.

## THE CORE POSITIONING: SAFETY-FIRST

88% of women aged 18–24 in Metro Manila report harassment. 2/4 tenant interviews reported scam attempts. Safety is NOT a feature filter — it is the proposition. Every touchpoint leads with female-only status, verified landlord identity, CCTV/security, and scam protection. Never lead with price. Never lead with convenience. Lead with safety.

---

## THE PRODUCT

**Core proposition:** "Find your next place in Manila. Verified. Scam-free. Free to browse — pay only if you want our full service."

**Three tiers of product, all accessible at zero cost up to the point of commitment:**

### Tier 0: Free core platform (everyone forever)
Browse listings, create listings, verify identity, send/receive connection requests, phone reveal after mutual verification, report suspicious activity. **₱0.** No sign-up wall to browse. This is the product everyone can access.

### Tier 1: Secure booking (tenant pays 3% of deposit, avg ~₱450) — GCash-powered
For DIY users who find their own place. **We never hold funds.** Payment routes through a licensed EMI partner (GCash primary, Maya secondary). The 3% is a marketplace commission collected by the EMI and remitted to us after the tenant confirms move-in. Min ₱300, max ₱750. Landlord receives full deposit. See `decisions/2026-04-12-escrow-via-gcash-partnership.md` for BSP licensing rationale.

### Tier 2: Full concierge placement (tenant pays ₱999 flat)
For deadline-driven users (BPO new hires, migrants without kakilala). Done-for-you: 5-field form in, 3 verified matches out within 7 days. AI + human housing buddy. Includes escrow. 7-day money-back guarantee.

**Landlord pays ₱0 in all tiers forever.** Research-locked.

**Who the narrow first wedge targets (Tier 2 concierge):**
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

**The stack (what gets built across tiers):**

Pre-booking (free + Tier 1/2):
- Verified listings only
- Verified tenant profile
- AI-assisted scam screening
- Deposit escrow via GCash partnership (Tier 1 and 2); Paymongo handles Tier 2 ₱999 payment + validation reservation

Tier 2 additions:
- Done-for-you matching (form → 3 verified matches in 7 days)
- AI + human housing buddy
- 7-day money-back guarantee

Post-booking (landlord gets value for free):
- Pre-screened verified tenants
- Deposit arrives guaranteed via escrow
- Auto-post to our Facebook Page
- One-tap share to Groups
- Reputation system

**Revenue model:**
- Tier 0: ₱0
- Tier 1: 3% of deposit, tenant pays, ~₱450 avg per transaction
- Tier 2: ₱999 flat, tenant pays (₱199 reservation + ₱800 on move-in)
- Landlord: ₱0 forever

**Unit economics (blended target at Month 3):**
- 70% Tier 1 escrow: ~₱404 margin × 100 = ₱40,400
- 30% Tier 2 concierge: ~₱879 margin × 40 = ₱35,160
- Total: ~₱75,560/month contribution margin at 140 placements/month

---

## THE BUILD LIST (WHAT WE'RE ACTUALLY SHIPPING)

### Phase 0: Validation gate (BEFORE any code)
Fake-door landing page with dual CTAs. Tier 1 path: ₱99 reservation via Paymongo. Tier 2 path: ₱199 reservation via Paymongo. 14-day window, 30+ combined paid reservations = build, <15 = kill. Organic-only traffic (TikTok primary, Facebook Groups secondary per `decisions/2026-04-12-tiktok-primary-awareness-channel.md`).

### Phase 1: MVP cleanup (IF validation passes — Week 1, ~40 hours)
Hit every REPO_STATUS.md §10 item in order. No new features.

### Phase 2: Validation-specific features (Week 2, ~32 hours)
GCash partnership integration (escrow), done-for-you matching flow, Facebook auto-post to our Page, PhilSys eVerify integration.

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
6. Landlord-side paid features (0/5 landlords enthusiastic)
7. AI chatbot for support (premature optimization)
8. iOS at launch (Android 90% PH share)
9. Multi-city at launch (focus wins)
10. AlphaFold-scale ambitions (no such opportunity exists in this market)
11. Fundraising before PMF (Day 120 earliest)
12. Over-engineered architecture from V1-V5 (archived noise)
13. Deposit escrow as sole value prop (needs full bundle to justify ₱999)
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

Fake-door landing page with two CTAs (Tier 1 escrow + Tier 2 concierge). Small real-money commitment on either path.

**Combined across both tiers in 14 days:**
- **30+ paid reservations → we have a business to build.**
- **Fewer than 15 → we don't.**

Everything else is mechanism.
