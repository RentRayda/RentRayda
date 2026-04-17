# RentRayda — FINAL DECISION

**Date:** 2026-04-12
**Status:** Canonical. Supersedes all V1-V5 planning documents.
**Grounded in:** REPO_STATUS.md (25/32 prompts done, 6,704 LOC, 0 deployments) + 9 primary interviews + 512 synthesized voices + competitive research + 15+ hours of pruning + Facebook API ToS verification.
**Second brain:** `.claude-brain/` directory structure inspired by https://github.com/huytieu/COG-second-brain — Claude Code reads this every session to prevent context drift and hallucination.

---

## TABLE OF CONTENTS

1. The decision in one paragraph
2. Ground truth — what the repo actually is
3. The kill list — everything we rejected (with reasons)
4. The build list — what we're actually shipping
5. The Facebook auto-posting reality (ToS-verified)
6. The product we're validating
7. The validation gate (fake-door test)
8. If validation passes — build plan
9. Second-brain directory structure
10. Hallucination prevention protocol
11. Metrics + kill conditions
12. Accountability
13. Immediate next steps

---

## 1. THE DECISION IN ONE PARAGRAPH

**We are NOT building more features. The core platform is free for everyone forever — browse, list, verify, connect. On top of that free core, we validate two tenant-paid products in parallel: (a) Tier 1 escrow-only at 3% of deposit for DIY users who want scam protection, and (b) Tier 2 full concierge placement at ₱999 for deadline-driven users who want done-for-you matching. Landlord pays ₱0 in all tiers, forever (research-locked). We run a fake-door validation test with real money on the table: 30+ paid reservations combined across both tiers in 14 days → we finish the MVP cleanup (~40 hours from REPO_STATUS.md §10), deploy, and manually deliver first 10 placements. If fewer than 15 pay, we refund everyone, publish an honest post-mortem, and archive the repo. The gate is money on the table, combined across both revenue paths.**

---

## 2. GROUND TRUTH — WHAT THE REPO ACTUALLY IS

### 2.1 What's already built (do NOT rebuild)

From REPO_STATUS.md §1-9:

**Infrastructure (100% done):**
- Turborepo monorepo with pnpm workspaces
- Next.js 16.2 web app + Hono 4.12 API + Expo SDK 55 mobile + shared packages
- better-auth 1.5 with PhilSMS OTP (7 endpoints: send-otp, verify-otp, magic-link, passkey, sign-out, me, setup-passkey)
- Drizzle ORM 0.45 + PostgreSQL 16 with 11 schema files + 2 applied migrations
- Cloudflare R2 dual-bucket (private verification docs + public listing photos) with presigned URL flow
- BullMQ 5.x for async jobs (defined, not running)

**Database (9 tables, all done):**
- users, landlord_profiles, tenant_profiles, verification_documents, listings, listing_photos, connection_requests, connections, reports
- 2 migrations applied (0000_true_karnak.sql, 0001_moaning_texas_twister.sql)

**API (33 endpoints, all done):**
- auth.ts (7), landlords.ts, tenants.ts, listings.ts, connections.ts (includes the triple-verified reveal), storage.ts (presigned URLs), reports.ts, users.ts, admin.ts
- Rate limiting, CORS, auth middleware, admin middleware all working

**Mobile (26 screens, all done):**
- Auth flow: phone → OTP → role → setup-passkey → collect-email → magic-link-verify
- Onboarding: landlord-profile, tenant-profile, verify-id, property-proof, employment-proof, submitted, verified
- Tabs: search (listings browse + detail), listings (create), inbox (accept/decline), profile
- Core components: VerifiedBadge (4 states), ConnectionRequestModal, ListingCard, OptimizedImage, FreshnessIndicator, NetworkBanner

**Web (landing + listings + admin, all done):**
- Landing page (page.tsx)
- Listings browse + detail
- Admin: dashboard, verifications queue, reports queue

### 2.2 What's broken or missing (REPO_STATUS.md §10 — exact hit list)

**Critical brand drift:**
- 306 old font references in mobile: `NotoSansOsage` → must be `BeVietnamPro-Bold`, `TANNimbus` → must be `Sentient-Medium`
- 87 old color references: `#2563EB` and `#2B51E3` → must be `#2D79BF`

**8 auth TODOs at specific file:line locations:**
- `apps/mobile/app/index.tsx:10` — auth state check + redirect
- `apps/mobile/app/(onboarding)/employment-proof.tsx:40` — fetch employmentType from profile
- `apps/mobile/app/(onboarding)/submitted.tsx:9` — derive from session
- `apps/mobile/app/(onboarding)/verified.tsx:17` — fetch from profile
- `apps/mobile/app/(onboarding)/verified.tsx:18` — derive from auth
- `apps/mobile/app/(tabs)/inbox/index.tsx:42` — isLandlord from session
- `apps/mobile/app/(tabs)/search/[id].tsx:305` — open connection request modal
- `apps/mobile/app/(tabs)/_layout.tsx:8` — USER_ROLE from session

**Operational gaps:**
- BullMQ workers defined but NOT started in apps/api/src/index.ts
- `resend` package imported in lib/email.ts but NOT in package.json (runtime error waiting)
- No Sentry integration (DSN in .env.example, no code)
- No ESLint configured anywhere
- Zero tests
- Mobile tab icons are literal single letters S, H, I, P instead of RaydaIcon
- Web admin dashboard uses inline `#2D79BF` instead of Tailwind tokens
- Web admin has ZERO auth protection — /admin/* routes are public
- Web listings use mock-data.ts instead of real API calls

**Deployment:**
- Dockerfiles exist for api + web
- No actual deployment has ever happened
- No CI/CD pipeline
- No production domain live

**Total estimated cleanup work: ~40 hours.** Not weeks. Forty hours of surgical fixes against a known punch list.

### 2.3 The non-negotiables (from TRD.md + CLAUDE.md)

Hard rules that will NOT change without a new decision file:

1. **Zero fund custody ever.** We never hold, transmit, or control user funds. Paymongo handles card gateway for reservations only (₱99/₱199). [GCash hypothesis dead — 0/6 landlords accept GCash for rent/deposit, per L1-L6 interviews. Deposit flow partner TBD. See `decisions/2026-04-17-gcash-hypothesis-dead-supply-model.md`. Principle (never custody) remains valid per `decisions/2026-04-12-escrow-via-gcash-partnership.md`.]
2. **Phone numbers revealed ONLY when BOTH parties verified AND connection accepted** — the triple-check in `apps/api/src/routes/connections.ts` is the core security guarantee
3. **Government ID images in PRIVATE R2 bucket** — signed URLs with 1-hour expiry, never returned in API responses
4. **Response format:** success = `{ data: ... }`, error = `{ error: 'message', code: 'MACHINE_CODE' }`
5. **Rate limits enforced** per TRD.md §10
6. **Database sessions only** — NOT JWTs (better-auth default)

---

## 3. THE KILL LIST — WHAT WE CONSIDERED AND REJECTED

Every idea below was evaluated seriously. Each is DEAD. Do not revive without a new decision file in `.claude-brain/decisions/`.

### 3.1 KILLED: AI rental agent (chat-first UX)

**What it was:** Tenant chats with AI in Taglish, AI searches across sources and messages landlords.

**Why killed:**
- Users want buttons, not prompts. BPO workers are not AI-savvy. Chat-as-interface requires prompt literacy we cannot assume.
- Dominic called this out directly in Messenger.
- GrabFood wins by being 3 fields and a button, not a chat.

**Replaced by:** Form-based 5-field submission → AI runs matching behind the scenes → users see results, not prompts.

### 3.2 KILLED: Lamudi/OLX/Carousell scraping

**What it was:** Scrape public listing sites for inventory, aggregate into our marketplace.

**Why killed:**
- **Wrong segment.** Lamudi's informal rental inventory is <0.1% of the actual market. The ₱3-15K segment lives on Facebook groups + tarps + kakilala.
- Lamudi/Rentpad minimums are ₱15K which excludes our whole target.
- User explicitly said multiple times: "Lamudi is useless."

**Replaced by:** Direct landlord onboarding via barangay walks + tarp photography + the existing in-app listing creation flow.

### 3.3 KILLED: Facebook Marketplace / Groups scraping

**What it was:** Scrape Facebook where real informal listings live.

**Why killed:**
- Meta deprecated the Groups API entirely on April 22, 2024. No third-party can post to or read from Groups anymore.
- Scraping Facebook violates ToS. Meta has successfully sued scrapers before.
- Anti-bot systems escalate within hours of detection.
- Triple kill: legal risk + operational fragility + ToS violation.

**Replaced by:** Manual landlord acquisition (walk Pasig/Ortigas, photograph tarps, onboard in-person) + auto-post-to-our-Page feature in Section 5.

### 3.4 KILLED: B2B BPO HR partnerships as primary revenue

**What it was:** Sell tenant housing solutions to BPO companies (Concentrix, Accenture, Teleperformance) via HR teams. Projected ~$10-30M ARR.

**Why killed:**
- User's insight: "BPO will die with AI agents." Plausible: Klarna, Dukaan already cut 30-50% of support headcount.
- Building on a shrinking iceberg is strategically suicidal.
- BPO workforce could shrink from 1.9M to <1M over 3-5 years.
- Even if wrong about timing, directional risk is too high.

**Replaced by:** Direct-to-consumer transaction model. If individual tenants pay, we have a business. If only BPO HR would pay, we don't.

### 3.5 KILLED: Tenant or landlord monthly subscriptions

**What it was:** Freemium model with Pro tiers at ₱149-299/month.

**Why killed:**
- Fees kill adoption. Universal pattern across 9 interviews (L5: "if it's free", T4: "if there's a fee, they won't go there").
- Rental search is episodic (once every 1-2 years), not recurring.
- ₱149/mo Pro has NEGATIVE gross margin once honest Gemini costs factored in.
- ₱299/mo would crater retention.

**Replaced by:** One-time transaction fee per successful placement (₱199 reservation + ₱800 on move-in = ₱999 total).

### 3.6 KILLED: Landlord-side paid features

**What it was:** Landlord Pro at ₱299/month for analytics, priority placement.

**Why killed:**
- Research: 0/5 landlords enthusiastic about any platform. L3 fills units in hours. Demand > supply in BPO areas.
- L5 conditional: "if it's free." L4 is the only absentee landlord with vacancy problems.
- Building paid landlord features for a segment that doesn't need us kills conversion.

**Replaced by:** Landlord side is FREE FOREVER. They get pre-screened verified tenants delivered. That's the value.

### 3.7 KILLED: AI chatbot for support

**What it was:** 24/7 AI support agent built into the app.

**Why killed:**
- Premature optimization. At MVP volume, a human (us) responding within 4 hours is better than a chatbot that hallucinates.
- Adds complexity and cost without clear value.
- Users trust humans more at the trust-building early stage.

**Replaced by:** Personal founder support. Email, Messenger, in-app. Every issue goes to us.

### 3.8 KILLED: iOS at launch

**What it was:** Build for iOS alongside Android.

**Why killed:**
- Android has 90%+ PH market share.
- Apple Developer account is $99/year + 30% IAP cut.
- iOS review adds 1-2 weeks minimum.
- Splitting focus on MVP = 2x the bugs.

**Replaced by:** Android-only at launch. iOS in Month 2+ if Android traction validates.

### 3.9 KILLED: Multi-city at launch

**What it was:** Launch in Manila + Cebu + Davao.

**Why killed:**
- Supply-side work (walking barangays) doesn't scale geographically.
- Different markets have different dynamics.
- Spreading marketing thin across 3 cities = 3x weaker than 1 city.

**Replaced by:** Pasig/Ortigas corridor only. BPO-dense. 2,000-5,000 target users per quarter. Dominate this, then expand.

### 3.10 KILLED: AlphaFold-scale ambition

**What it was:** Find a breakthrough AI insight that makes the kakilala economy obsolete.

**Why killed:**
- Claude's deep research concluded NO such opportunity exists in this specific market at the informal ₱3-15K segment.
- AlphaFold solved "50 years of lab work per protein" — housing search is "annoying for 3 months for a narrow sub-segment."
- The pain is moderate, not hair-on-fire, for 75%+ of the addressable market.

**Replaced by:** Grab-equivalent ambition — make a sketchy transaction safe and predictable. $10-30M ARR at maturity if executed well. Not a unicorn. A real business.

### 3.11 KILLED: Fundraising before PMF

**What it was:** Raise seed round early to accelerate.

**Why killed:**
- No PMF yet. Raising now = diluting for fantasy valuation.
- Investors want 10-100x returns. Philippine informal rental market can't deliver that.

**Replaced by:** Bootstrap to contribution-positive. Revisit at Day 120 IF metrics support it.

### 3.12 KILLED: Over-engineered architecture (V1-V5 blueprints)

**What it was:** V4 plan with 80 new files, 14,000 lines of specification.

**Why killed:**
- Over-engineered for a product we haven't validated.
- Every line serving an unvalidated hypothesis is waste.
- The existing 6,704 LOC is ALREADY enough for MVP.

**Replaced by:** Ship what we have. Fix the 40 hours of known issues. Deploy. Validate demand. Then iterate.

### 3.13 KILLED: Deposit escrow as the sole value prop

**What it was:** "We hold your deposit safely, that's the product."

**Why killed:**
- Deposit protection alone isn't worth ₱999.
- Research showed only 1/4 tenants willing to pay 3% for reservation protection.
- Needs to be bundled with the full done-for-you service to justify price.

**Replaced by:** Escrow is ONE feature inside the ₱999 placement service, not the product itself.

### 3.14 KILLED: Scraping our own Facebook Page for listings

**What it was:** Someone floated auto-cross-posting between our DB and FB.

**Why killed:**
- Same ToS issue as all Facebook scraping.
- Our Page is a one-way megaphone, not a data source.

**Replaced by:** Auto-post from DB → our Page (ToS-compliant, Section 5), NEVER reverse direction.

### 3.15 KILLED: Free for both sides with "monetize later"

**What it was:** Proposal to make the entire product free forever for both landlords and tenants, figure out revenue later.

**Why killed:**
- ZipMatch, Housing.com, Spleet all tried this pattern and died. 96%, ~100%, ~100% capital losses respectively.
- Habits users form in the free phase are extremely hard to convert to paid (20-50% drop-off standard when introducing payment to free user base).
- "Later" arrives after cash runs out.
- Makes the validation question unanswerable — we never learn if anyone would pay for the core value prop.
- Investors can't fund "many users but no revenue and no evidence they'd pay."

**Replaced by:** Free Tier 0 core platform (browse, list, verify, connect) + optional paid Tier 1 and Tier 2 for users who want escrow or concierge service. Free where it aids reach; paid where it validates willingness to pay.

### 3.16 KILLED: Charging landlords any fee in any form

**What it was:** Proposal to split the 3% escrow fee between tenant and landlord, or deduct it from the deposit amount landlord receives.

**Why killed:**
- Research is unambiguous and locked: 0/5 landlords enthusiastic about any paid platform. L5 explicit: "if it's free."
- "Fees kill adoption" is marked VALIDATED on the landlord side specifically.
- Supply collapse is the failure mode: if landlords revolt at a fee, we have no listings, no product.
- Hidden fees still get noticed. Tita Cora will compare her payment receipt to the agreed deposit. The ₱450 gap triggers a support ticket, then a bad Facebook post, then supply death. [Note: GCash hypothesis dead — 0/6 landlords accept GCash. Payment mechanism TBD.]

**Replaced by:** All revenue comes from tenants. Landlord receives 100% of the agreed deposit amount in every tier. Landlord pays ₱0, forever, non-negotiable.

### 3.17 KILLED: Proprietary fund-holding / building our own escrow wallet

**What it was:** Original Tier 1 plan assumed RentRayda would hold deposit funds via Paymongo until move-in confirmation.

**Why killed (deep research 2026-04-12):**
- BSP classifies fund-holding as Operator of Payment Systems (OPS) requiring registration OR E-Money Issuer (EMI) requiring full licensing + capital requirements
- AFASA (RA 12010, signed July 2024) adds fraud detection + fund-holding obligations we cannot meet pre-PMF
- Penalty exposure is material: imprisonment possible under payment system regulations
- GCash (94M users, 89% wallet share, licensed EMI) already does this correctly [Note: GCash hypothesis dead — 0/6 landlords accept GCash. The BSP licensing rationale here is still valid, but GCash is not the implementation path.]

**Replaced by:** Decision `2026-04-12-escrow-via-gcash-partnership.md` (principle valid: never custody). [GCash-specific implementation invalidated by field data — 0/6 landlords accept GCash. Deposit flow partner TBD. See `decisions/2026-04-17-gcash-hypothesis-dead-supply-model.md`.]

### 3.18 KILLED: Self-serve landlord listing creation at launch

**What it was:** Assumption that landlords (women 45-70, Facebook-native, app-resistant) would self-serve listing creation through the mobile app.

**Why killed (deep research 2026-04-12):**
- Target landlords face "higher difficulties, especially regarding security and education" with new digital systems
- Messenger is their primary tool — more than SMS or phone calls
- App download + registration + form completion is too many friction steps
- BIR exposure fear makes "new system" feel threatening regardless of UX quality
- Human-assisted Messenger-mediated onboarding is operationally feasible at pre-PMF volumes (<100 landlords)

**Replaced by:** Decision `2026-04-12-landlord-onboarding-human-assisted.md`. Landlord sends photos + details via Messenger. RentRayda team member creates the listing on their behalf. At 50+ landlords, partially automate via managed agent.

### 3.19 KILLED: Reddit as a meaningful acquisition channel

**What it was:** Original organic traffic plan allocated posts to r/Philippines and r/BPO.

**Why killed (deep research 2026-04-12):**
- Reddit usage among female BPO workers aged 20-26 is minimal
- Reddit PH skews male, higher-income, tech — wrong demographic
- TikTok commands 40 hrs/month for our target (vs. Reddit <1 hr/month for this segment)

**Replaced by:** Decision `2026-04-12-tiktok-primary-awareness-channel.md`. TikTok becomes primary awareness channel via nano-influencer BPO worker content. Reddit removed from channel plan.

---

## 4. THE BUILD LIST — WHAT WE'RE ACTUALLY SHIPPING

### 4.1 Phase 0: Validation gate (BEFORE any code work)

- [ ] Fake-door landing page at root `rentrayda.com` with two CTAs (per `decisions/2026-04-12-two-revenue-paths.md`)
- [ ] Tier 1 CTA: "Reserve escrow slot — ₱99" → Paymongo reservation (refundable, applied to 3% fee)
- [ ] Tier 2 CTA: "Reserve concierge slot — ₱199" → Paymongo reservation (refundable, applied to ₱999 total)
- [ ] Tier 0 browse-only path remains free and unblocked
- [ ] Zero paid ads — organic only (TikTok primary, Facebook Groups secondary per `decisions/2026-04-12-tiktok-primary-awareness-channel.md`)
- [ ] 14-day window. 30+ combined paid reservations = proceed. <15 = kill.
- [ ] Customer discovery call within 24h of every reservation using script in `artifacts/landing-page-copy-and-discovery-script.md`

### 4.2 Phase 1: MVP cleanup (IF validation passes — Week 1, ~40 hours)

Hit every REPO_STATUS.md §10 item. Self-contained fixes, no new features.

**Day 1:** Install missing `resend`, wire 8 mobile auth TODOs, fix font/color drift

**Day 2:** Replace tab placeholder icons, add Sentry to all 3 apps, start BullMQ workers

**Day 3:** Web admin auth middleware + login page, replace web listings mock-data, fix admin inline styles

**Day 4:** Deploy api + web to Coolify on DigitalOcean (droplet + managed Postgres + Upstash Redis + R2)

**Day 5:** EAS preview build, on-phone smoke test, smoke-test.sh against production

### 4.3 Phase 2: Validation-specific features (Week 2, ~32 hours)

Only what validation proved we need:

**Day 6-7: Payment orchestration (Paymongo + deposit partner TBD)**
- Add `payments` + `match_requests` tables (migration 0002)
- Paymongo payment intent creation for reservations ONLY (₱99 Tier 1 / ₱199 Tier 2)
- Paymongo webhook handler for payment.paid
- [GCash hypothesis dead — 0/6 landlords accept GCash, see `decisions/2026-04-17-gcash-hypothesis-dead-supply-model.md`. Deposit flow mechanism needs alternative approach (manual bank transfer, Paymongo-direct, or new partner). Principle: we never custody — see `decisions/2026-04-12-escrow-via-gcash-partnership.md`.]
- Dual-confirmation state machine (tenant confirms move-in + landlord confirms deposit receipt)
- 3% marketplace commission collected via Paymongo AFTER dual confirmation
- Full refund endpoint for failed validations

**Day 8-9: Done-for-you matching flow**
- New mobile screen: "Quick match" (5-field form)
- Matching endpoint: GET /api/matches
- Status tracking: submitted → matching → matches_ready → viewing_scheduled → moved_in → completed
- Push notifications at each state change

**Day 10: Facebook auto-post to OUR Page (Section 5)**
- Graph API integration with pages_manage_posts
- On new verified listing: auto-post to RentRayda PH Facebook Page
- Format: photo + "🏠 New verified [type] in [barangay]! ₱[price]/mo. [deep link]"
- Sharable URL landlord can post to Groups themselves

### 4.4 Phase 3: Soft launch (Week 3)

**Day 11-12: Supply hustle**
- Walk Pasig/Ortigas/Cubao barangays
- Photograph tarps, onboard 30-50 landlords in-person
- Target 50+ verified listings before opening the door

**Day 13-14: First 10 placements manually**
- Take first 10 paid reservations
- Hand-match each to 3 verified listings within 7 days
- Coordinate viewings personally
- Track friction in `.claude-brain/journal/`

**Day 15: Review + decide**
- ≥7 of 10 placed → continue scaling
- 3-6 of 10 → investigate, iterate 1 more week
- ≤2 of 10 → kill, refund, post-mortem

---

## 5. THE FACEBOOK AUTO-POSTING REALITY (ToS-VERIFIED)

I verified this against Meta's current developer policies. Here's what's actually true in 2026.

### 5.1 What you CAN do (ToS-compliant)

**You CAN auto-post to a Facebook Page you own or manage.** The Graph API supports this via `pages_manage_posts` + `pages_read_engagement` permissions. You generate a long-lived Page Access Token, then POST to `/{page-id}/feed` with message + media. Buffer, Hootsuite, SocialRails, every scheduling tool uses this mechanism. Fully supported, fully legal, unchanged in 2024-2025 API updates.

**You CAN provide a share URL that opens Facebook's share dialog.** User clicks a button in your app, Facebook's native share dialog opens pre-filled with listing content, they manually post to whatever Group they want. Every app does this. Meta encourages the pattern.

### 5.2 What you CANNOT do

**You CANNOT auto-post to Facebook Groups via API.** Meta officially deprecated the Groups API on April 22, 2024. All permissions (`publish_to_groups`, `groups_access_member_info`) and reviewable features associated with the Groups API have been removed from all API versions. No third-party tools can post to Facebook groups via API anymore — including Buffer, Hootsuite, SocialRails, or any other service.

**You CANNOT ask users for Group posting permissions.** Those permissions no longer exist in the API.

**You CANNOT automate posting via scraping or headless browsers.** Violates Meta's Platform Terms. Automated browsing of Facebook (Puppeteer, Playwright logged into a user account) to post to Groups is grounds for permanent account ban and potential legal action.

### 5.3 What we're actually building

**The ToS-compliant solution in two parts:**

**Part A — Auto-post to RentRayda's Facebook Page:**
1. Create a Facebook Page: "RentRayda Philippines"
2. Register a Meta Developer App, get app approved for `pages_manage_posts` permission (1-2 week review)
3. When a landlord publishes a new verified listing, backend auto-posts to our Page:
   - Image: listing primary photo
   - Text: "🏠 New verified bedspace/studio/apartment in [barangay]! ₱[price]/month. Verified landlord ✓. View on RentRayda: [deep link]"
   - Link: deep link to the listing in app/web
4. This grows our Page organically and gives us a content feed for free

**Part B — One-tap share to Groups (user-initiated):**
1. Every listing detail screen has a "Share to Facebook" button
2. Tapping opens Facebook's native share dialog pre-filled with listing text + link
3. The user (landlord or tenant) picks which Group(s) to post to manually
4. Facebook's native dialog handles the posting — we never touch Group API

**Why this is powerful even without direct Group API:**
- Landlords WANT to share their listing to relevant Groups anyway (it's free advertising)
- One-tap removes friction, making it 100x more likely they'll share
- Each share is a real human posting to their own groups = zero spam risk, ToS-compliant
- Our Page grows organically = backup distribution channel

### 5.4 Compliance guardrails

- Register Meta App under RentRayda OPC (legal entity must exist first — OPC formation is Month 1-2 work, see V5 Part 6)
- Submit for `pages_manage_posts` review with clear use case + screenshots
- Page posts only feature content landlords have explicitly submitted and verified
- No scraping, no Group API attempts, no headless browsers, no botnet posting
- Store Page Access Token encrypted, rotate every 60 days
- Rate limit our own posts: max 20/day to avoid Meta spam detection

### 5.5 Fallback if Meta app review rejects us

If we can't get `pages_manage_posts` approved (possible but unlikely), Part A is delayed until we can. Part B (user-initiated share dialog) works without app review since it's just a URL that opens Facebook's native UI. So the product still functions.

---

## 6. THE PRODUCT WE'RE VALIDATING

### 6.1 Core proposition

**"Find verified rentals in Manila. Free to browse. Pay only if you want scam protection or our full concierge service."**

Three tiers of product access. Tier 0 is free forever for everyone. Tier 1 and Tier 2 are optional tenant-paid products. Landlord pays ₱0 in all tiers, forever.

### 6.2 Tier 0 — Free core platform (everyone, forever)

**Who it's for:** Every landlord. Every tenant. Anyone browsing for housing in Metro Manila.

**What they get at ₱0:**
- Browse all verified listings without signing up
- Create listings (landlord side, zero fee ever)
- Verify identity (both landlord and tenant, zero fee — uses free PhilSys eVerify)
- Send and receive connection requests
- Phone reveal after mutual verification
- Report suspicious listings or users

**Why this tier exists:** Removes all friction, maximizes reach, lets the product spread organically. Research validated: landlords won't tolerate fees, tenants won't sign up behind a paywall just to browse. Tier 0 respects both.

**What it doesn't include:** No escrow, no matching service, no housing buddy, no money-back guarantee. Users doing Tier 0 are on their own for deposit safety — same as they are on Facebook today, but with verified listings/landlords reducing scam risk significantly.

### 6.3 Tier 1 — Escrow-only (tenant pays 3% of deposit)

**Who it's for:** DIY users who find their own place on our platform but want their deposit protected.

**The pitch:** "Don't hand ₱15K to a stranger. Route it through a secure payment partner with our orchestration layer. Fee only charged after you've moved in and confirmed."

**How it works:**
1. Tenant finds a listing they like, connects with landlord (Tier 0, free)
2. They agree on a place and move-in date
3. Instead of direct cash, tenant initiates a protected deposit flow via our app (we orchestrate, licensed EMI partner holds the funds — we never custody)
4. Tenant moves in, confirms in-app
5. Landlord confirms receipt in-app
6. On dual confirmation: partner completes release to landlord, we collect our 3% marketplace commission from the tenant via Paymongo
7. See `decisions/2026-04-12-escrow-via-gcash-partnership.md` for BSP licensing rationale (principle valid). [GCash hypothesis dead — 0/6 landlords accept GCash. Deposit flow partner TBD. See `decisions/2026-04-17-gcash-hypothesis-dead-supply-model.md`.]

**Pricing:**
- 3% of deposit amount
- Minimum: ₱300 (applies when deposit < ₱10K)
- Maximum: ₱750 (applies when deposit > ₱25K)
- Average on our target segment (₱15K deposit): ~₱450

**Who actually pays:**
- Tenant pays ₱15,450 total (₱15K + 3% fee to us)
- Landlord receives ₱15,000 (the full agreed deposit)
- Landlord pays ₱0 (non-negotiable)

### 6.4 Tier 2 — Full concierge placement (tenant pays ₱999 flat)

**Who it's for:** Deadline-driven provincial migrants arriving in Metro Manila with no kakilala network — female BPO new hires at Concentrix/Accenture/Teleperformance are the primary marketing focus (highest-concentration findable segment), but the product serves male migrants, students (DLSU/UP/PUP), fresh grads at hospitals/banks/retail, and OFW families equally. Pasig/Ortigas corridor at launch. Budget ₱5-8K/month.

**Why this wedge for Tier 2:**
- Deadline-driven = real urgency
- Migrant = no network, highest pain
- Parents will help pay ₱999 for safety
- Concentrated = findable via BPO HR + new-hire FB groups

**How it works:**
1. Tenant submits 5-field form (where they work, budget, move-in date, gender preference, must-haves)
2. ₱199 reservation via Paymongo
3. AI + human matches them to 3 verified listings within 7 days
4. Human "housing buddy" coordinates viewings
5. Tenant picks one, pays ₱800 balance (₱999 total), deposit goes into escrow
6. Move-in confirmation releases deposit to landlord

**Includes:**
- Verified listings only
- AI-assisted scam screening
- Done-for-you matching
- Deposit escrow (Tier 1 functionality bundled in)
- 7-day money-back guarantee — no 3 verified matches in 7 days = full ₱999 refund

### 6.5 Revenue model

| Tier | Who pays | Amount | When |
|------|----------|--------|------|
| 0 | Nobody | ₱0 | N/A |
| 1 | Tenant | 3% of deposit (min ₱300, max ₱750, avg ~₱450) | At escrow release on move-in |
| 2 | Tenant | ₱999 flat | ₱199 reservation + ₱800 on move-in |
| Landlord | Never | ₱0 forever | N/A — research-locked |

**Unit economics per placement:**

Tier 1 (escrow-only):
- Revenue: ~₱450 avg
- Paymongo fees (3.5%): ~₱16
- Infra amortized: ~₱10
- Escrow ops: ~₱20
- **Gross margin: ~₱404 per placement (~90%)**

Tier 2 (concierge):
- Revenue: ₱999
- Gemini API: ~₱50
- PhilSMS: ~₱5
- Infra amortized: ~₱30
- Paymongo fees (3.5%): ~₱35
- Housing buddy (Phase 2): ~₱0 (founder-led initially)
- **Gross margin: ~₱879 per placement (~88%)**

**Blended target at Month 3:**
- 70% Tier 1 × 100 placements × ₱404 = ₱40,400
- 30% Tier 2 × 40 placements × ₱879 = ₱35,160
- **Total contribution margin: ~₱75,560/month at 140 (optimistic; base case 50-100) placements**

### 6.6 Post-booking value (same across all tiers, landlord-side)

Landlords get this automatically, regardless of which tier the tenant used:
1. Pre-screened verified tenants — no more 50 "available pa po?" DMs
2. Tenant comes with verified ID + employment + budget confirmed
3. Deposit arrives guaranteed via escrow (Tier 1 or 2; Tier 0 tenants pay landlord directly as before)
4. Auto-post to our Facebook Page = free marketing
5. One-tap share to Groups = 100x easier than posting manually
6. Reputation system builds over successful rentals
7. Zero fees forever

### 6.7 The Shopee moment (what we can't manufacture but can prepare for)

The viral unlock is a single scam-prevention story: "Almost lost ₱20K but RentRayda's escrow held it — got my refund when the landlord disappeared." That spreads through BPO groups because 67% of Filipinos encounter scams monthly.

We can't force this. We can:
- Build escrow so it actually catches scams (Tier 1 and Tier 2 both protect deposits)
- Document every saved scam publicly (with permission)
- Make refunds frictionless so users WANT to share
- Be responsive on social when users mention us

---

## 7. THE VALIDATION GATE (THE ACTUAL TEST)

### 7.1 Fake-door landing page

Build at `rentrayda.com` — 2 hours using Next.js on existing domain.

**Page structure:**
- Hero: "Find verified rentals in Manila. Free to browse. Optional protection when you're ready to commit."
- Browse button → actual listings page (Tier 0 free access, even during validation)
- Two CTAs for paid tiers, side-by-side:

**Left CTA (Tier 1):** "Protect my deposit — 3% of deposit amount (avg ₱450)"
- Sub-copy: "For when you've found a place yourself but want scam protection. We hold your deposit until you've moved in."
- Button: "Reserve escrow — ₱99"

**Right CTA (Tier 2):** "Find me a place in 7 days — ₱999"
- Sub-copy: "For when you're moving to Manila and need someone to handle the whole search. 3 verified matches delivered in 7 days or full refund."
- Button: "Reserve spot — ₱199"

- 3-step "How it works" for each tier
- Trust signals: "Verified landlords only · Escrow protection · Money-back guarantee"
- FAQ at bottom, including "Why do you charge at all? What's free?"

### 7.2 Critical mechanic: real money commitment

**No free signups for paid tiers. Paymongo payment required to reserve a spot.**

- Tier 1 escrow reservation: ₱99 (applied to eventual 3% fee on move-in)
- Tier 2 concierge reservation: ₱199 (applied to eventual ₱999 total)

Email signups = noise. Real cash = honest signal of intent.

Tier 0 browsing requires no payment, no signup — it's free forever, as designed.

Refund 100% of reservations if we decide not to build. Cost: ~₱7 per refund in Paymongo fees.

### 7.3 Sub-signals to watch

Beyond the total count, the MIX tells us what product to build:

- **Mostly Tier 1 reservations:** Build escrow-only, defer concierge. Market wants scam protection, not hand-holding.
- **Mostly Tier 2 reservations:** Build concierge, defer standalone escrow. Market wants full service.
- **Roughly even mix:** Build both as planned.
- **Either tier <5 reservations:** Consider killing that tier even if combined total hits threshold.

### 7.4 Traffic plan (organic only)

| Channel | Posts | Expected reach |
|---------|-------|----------------|
| 5 BPO Facebook Groups (10-50K members) | 1 per group | 100-300K impressions |
| 3 university groups (DLSU, UP, PUP) | 1 per group | 30-60K |
| Reddit r/Philippines + r/BPO | 1 each | 5-20K |
| Personal Facebook timeline | 1 | 2-5K |
| 10 DMs to BPO friends/family | Personal | 10 conversations |
| TikTok | 3 videos | 5-50K views |
| LinkedIn founder post | 1 | 2-5K |
| **Total** | **~15 posts over 14 days** | **~150-450K** |

### 7.5 Go/No-Go thresholds

Combined paid reservations across both tiers in 14 days:

| Combined paid reservations | Decision |
|---|---|
| **30+** | **BUILD** — Phase 1 MVP cleanup → Phase 2 features → Phase 3 soft launch |
| **15-29** | **EXTEND** — 14 more days with iterated landing |
| **<15** | **KILL** — Refund all, publish post-mortem, archive repo |

Plus the sub-signal analysis in 7.3 tells us which tier(s) to actually build.

### 7.6 Customer discovery (every single reserver)

Within 24h of their reservation, call or Messenger-video-call. 20 min:

1. What's your current housing situation?
2. How did you hear about us?
3. What made you pay [₱99 / ₱199]?
4. Which tier did you pick and why? Did you consider the other one?
5. What would make this feel worth the full price (either 3% or ₱999)?
6. What would make you refund and walk away?
7. If this worked perfectly, how would you describe it to a friend?
8. What's your deadline and why?

Document every call in `.claude-brain/journal/`. Track which tier each reserver picked in `.claude-brain/context/06-validation-state.md`. Patterns emerge after 30 calls.

---

## 8. IF VALIDATION PASSES — FULL BUILD PLAN

### 8.1 Week 1: MVP cleanup (~40 hours)

**Hour 1-4: Dependencies + TODOs**
- Install `resend@^4.0.0`
- Wire 8 auth TODOs at exact file:line locations
- `pnpm turbo typecheck` must pass

**Hour 5-8: Brand drift**
- Global find-replace: NotoSansOsage → BeVietnamPro-Bold, TANNimbus → Sentient-Medium
- Global find-replace: #2563EB → #2D79BF, #2B51E3 → #2D79BF
- Replace mobile tab placeholder icons with RaydaIcon

**Hour 9-16: Operational gaps**
- Sentry init in api + mobile + web
- Start BullMQ workers in apps/api/src/index.ts
- Add /health endpoint
- Vitest foundation + CI workflow

**Hour 17-24: Web fixes**
- apps/web/middleware.ts for admin protection
- apps/web/app/admin/login/page.tsx
- Replace mock-data imports with real API fetches
- Fix admin dashboard inline styles

**Hour 25-32: Deployment**
- DigitalOcean droplet (4GB, Singapore) + Coolify
- Managed Postgres + Upstash Redis + R2 buckets
- DNS: rentrayda.com + api.rentrayda.com
- Deploy api + web via Coolify
- smoke-test.sh passing against production

**Hour 33-40: Mobile production**
- Update app.json + eas.json for production
- EAS preview build for Android
- On-phone smoke test of full user flow
- Tag `v0.1.0-mvp-validated`

### 8.2 Week 2: Validation-specific features (~32 hours)

**Hour 1-16: Payment orchestration (Paymongo + deposit partner TBD)**
- Migration 0002: `payments` + `match_requests` tables
- apps/api/src/lib/payments/paymongo.ts — reservations only (₱99/₱199 card)
- [GCash hypothesis dead — 0/6 landlords accept GCash. `gcash.ts` NOT the path. Deposit orchestration partner TBD. See `decisions/2026-04-17-gcash-hypothesis-dead-supply-model.md`.]
- apps/api/src/routes/payments/create-intent.ts (reservations)
- apps/api/src/routes/payments/webhook.ts (paymongo.paid + deposit partner settled)
- Dual-confirmation state machine: reserved → matching → viewing_scheduled → moved_in (tenant confirm) → received (landlord confirm) → commission_settled / disputed / refunded
- Full refund endpoint with admin authorization
- Reference: `decisions/2026-04-12-escrow-via-gcash-partnership.md` (principle: never custody)

**Hour 17-28: Done-for-you matching**
- apps/mobile/app/(tabs)/search/quick-match.tsx — the 5-field form
- apps/api/src/routes/matches.ts — GET /api/matches returns ranked results
- Simple ranking: verified + price fit + location match + freshness
- Status tracking table: match_requests
- Push notifications at each status change

**Hour 29-32: Facebook auto-post**
- Create Facebook Page "RentRayda Philippines"
- Meta Developer App + request pages_manage_posts permission
- apps/api/src/lib/facebook/graph.ts — Page posting client
- apps/api/src/jobs/post-listing-to-fb.ts — BullMQ job on listing.published
- Frontend: "Share to Facebook" button → native share dialog

### 8.3 Week 3: Soft launch (~40 hours)

**Hour 1-16: Landlord supply hustle**
- Walk 4 barangays (Ugong Pasig, Kapitolyo, Oranbo, San Antonio)
- Goal: 50 verified landlords onboarded in-person
- Tablet demo → immediate signup → verification scheduled

**Hour 17-32: First 10 placements manual**
- Take first 10 paying reservations
- Hand-match to 3 verified listings each
- Coordinate viewings via Messenger
- Document everything in `.claude-brain/journal/`

**Hour 33-40: Review + iterate**
- Placement success rate = primary metric
- Interview every tenant post-move-in
- Interview every landlord post-rental
- Identify top 3 friction points

### 8.4 Month 2-3 targets

| Metric | Month 1 | Month 2 | Month 3 |
|--------|---------|---------|---------|
| Paid placements | 20 | 60 | 150 |
| Refund rate | <20% | <15% | <10% |
| Gross margin | ₱400 | ₱500 | ₱600 |
| Contribution margin | ₱8K/mo | ₱30K/mo | ₱90K/mo |
| Referral rate | 5% | 15% | 25% |
| Week-4 retention | N/A | 20% | 30% |

**Month 3 kill condition:** <50 total paid placements OR <20% week-4 retention OR refund rate >30% → post-mortem + shutdown.

---

## 9. SECOND-BRAIN DIRECTORY STRUCTURE

Inspired by https://github.com/huytieu/COG-second-brain. Create in repo root:

```
.claude-brain/
├── README.md                          # How to use this brain
├── context/
│   ├── 00-north-star.md               # Sections 1-6 of THIS FILE
│   ├── 01-research-findings.md        # Distilled 9 interviews + hypothesis status
│   ├── 02-repo-status.md              # Living copy of REPO_STATUS.md
│   ├── 03-architecture-highlights.md  # TRD.md top 20%
│   ├── 04-brand-and-design.md         # DRD.md top 20%
│   ├── 05-business-rules.md           # Non-negotiables from CLAUDE.md §13
│   ├── 06-validation-state.md         # Live metrics: reservations, conversion
│   └── 07-facebook-policy.md          # Section 5 of this doc
├── decisions/
│   ├── 2026-04-10-kill-scraping.md
│   ├── 2026-04-10-kill-bpo-b2b.md
│   ├── 2026-04-11-kill-ai-chatbot-ux.md
│   ├── 2026-04-11-tenant-only-revenue.md
│   ├── 2026-04-12-validate-before-build.md
│   ├── 2026-04-12-facebook-page-only-no-groups.md
│   └── [future decisions with date prefix]
├── prompts/
│   ├── session-kickoff.md
│   ├── pre-commit-check.md
│   ├── session-wrap.md
│   └── debug-protocol.md
└── journal/
    ├── 2026-04-12-validation-launch.md
    └── [one entry per work session]
```

### 9.1 `.claude-brain/README.md` (actual content)

```markdown
# .claude-brain — Canonical project memory for Claude Code

## Rules
1. Every Claude Code session starts by reading context/00-north-star.md
2. Before any code change, check context/05-business-rules.md for violations
3. Every strategic decision must be documented in decisions/ before implementation
4. After every session, update journal/ with what changed and update context/02-repo-status.md
5. Never modify context/ without also creating a decisions/ file explaining why

## Reading order for new Claude Code session
1. context/00-north-star.md (what we're building)
2. context/02-repo-status.md (current code state)
3. context/06-validation-state.md (current validation metrics)
4. Latest 3 files in decisions/ (recent strategic moves)
5. Latest file in journal/ (where we left off)

## Never do
- Build features from V1-V5 blueprints (archived noise)
- Add scraping (killed, see decisions/2026-04-10-kill-scraping.md)
- Post to Facebook Groups via API (impossible per Meta ToS)
- Charge landlords (killed, see decisions/2026-04-11-tenant-only-revenue.md)
- Build AI chatbot UX (killed, see decisions/2026-04-11-kill-ai-chatbot-ux.md)
```

### 9.2 `.claude-brain/prompts/session-kickoff.md`

```
Read in order:
1. .claude-brain/context/00-north-star.md
2. .claude-brain/context/02-repo-status.md
3. .claude-brain/context/06-validation-state.md
4. The 3 most recent files in .claude-brain/decisions/
5. The most recent file in .claude-brain/journal/

Then:
- Summarize in 3 bullets the current state of the project
- Tell me what was done in the last session (from journal)
- Ask me what I want to work on today
- Do NOT suggest features unless I explicitly ask
- Do NOT revive anything listed in FINAL_DECISION.md Section 3 (kill list)
```

### 9.3 `.claude-brain/prompts/pre-commit-check.md`

```
Before I commit, verify each item:

1. Does this change align with .claude-brain/context/00-north-star.md Section 4 (build list)?
2. Does it violate anything in .claude-brain/context/05-business-rules.md?
3. Does it revive anything in FINAL_DECISION.md Section 3 (kill list)? If yes, STOP and ask.
4. If this introduces a new strategic decision, have I created a file in .claude-brain/decisions/?
5. Run `pnpm turbo typecheck` — must pass
6. Run `pnpm turbo build` — must pass
7. Read `git diff` carefully — any surprises? Any files changed that shouldn't have been?
8. Does the commit message follow: `type(scope): description`?

If any check fails, fix before committing.
```

### 9.4 `.claude-brain/prompts/session-wrap.md`

```
At end of session:

1. Update .claude-brain/context/02-repo-status.md with what changed
   (add to "Recent changes" section, don't rewrite everything)

2. Create today's journal entry: .claude-brain/journal/YYYY-MM-DD-[topic].md
   Format:
   # [Topic] — [Date]
   ## Goal
   ## What got done
   ## What's blocked
   ## Next step
   ## Time spent
   ## Notes

3. If any strategic decision made, create new decision file:
   .claude-brain/decisions/YYYY-MM-DD-[decision].md
   Format:
   # Decision: [Title]
   Date: YYYY-MM-DD
   Context: [what led to this]
   Decision: [what we decided]
   Alternatives considered: [what we rejected]
   Consequences: [what this means]

4. If validation metrics changed, update .claude-brain/context/06-validation-state.md

5. Git commit everything:
   git add .claude-brain/ [other changed files]
   git commit -m "session: [topic] — [1-line summary]"
   git push
```

### 9.5 `.claude-brain/prompts/debug-protocol.md`

```
When something breaks:

1. Do NOT guess. Read the actual error message word by word.
2. Check .claude-brain/context/02-repo-status.md — is this listed as "working"?
3. Check git log for last commit touching the affected file
4. Check .claude-brain/journal/ for recent changes to this area
5. Isolate the failure: smallest possible reproduction
6. Search codebase for similar patterns that DO work
7. Only then, propose a fix
8. Fix must be minimum scope — do NOT refactor adjacent code
9. Verify fix with exact reproduction from step 5
10. Update journal with what broke, why, and how you fixed it

If you've tried 3 fixes and it's still broken, STOP and ask the human.
Do not keep trying — that burns context and creates cascading bugs.
```

---

## 10. HALLUCINATION PREVENTION PROTOCOL

Claude Code has already hallucinated across this project — inventing features, proposing killed work, suggesting scraping 5+ times after being told no. The second-brain structure addresses this. Here are explicit rules:

### 10.1 Rules Claude Code must follow

1. **Never suggest scraping anything.** Killed in decisions/2026-04-10-kill-scraping.md.
2. **Never propose Facebook Groups posting via API.** Impossible per Meta ToS since April 22, 2024.
3. **Never propose landlord-paid features.** Killed.
4. **Never propose AI chatbot as primary UX.** Killed.
5. **Never propose B2B BPO partnerships as primary revenue.** Killed, BPO is shrinking.
6. **Never propose monthly/weekly subscriptions.** Killed, transaction-only.
7. **Never propose iOS before Android traction.** Phase 3+.
8. **Never propose multi-city before dominating Pasig/Ortigas.** Focus.
9. **Never propose fundraising before Day 120 with PMF proof.** Bootstrap first.
10. **Never add new features during MVP cleanup week.** 40-hour punch list is the scope.

### 10.2 When Claude suggests something questionable

If Claude's output:
- References a V1/V2/V3/V4/V5 document → STOP. Those are archived.
- Mentions a feature not in FINAL_DECISION.md Section 4 → STOP. Ask for justification.
- Suggests reviving anything in Section 3 → STOP. Require new decision file first.
- Adds a dependency not previously approved → STOP. Ask why.
- Refactors code outside immediate scope → STOP. Narrow scope.

### 10.3 Enforcement mechanism

Before every commit, Claude runs pre-commit-check.md. If any rule violated, commit blocked. Human reviews and either overrides with documentation or rejects.

### 10.4 Recovery from hallucination

If Claude already committed hallucinated work:
1. `git log` to find offending commit
2. Read .claude-brain/context/00-north-star.md aloud to reset
3. Revert: `git revert <commit-hash>`
4. Document in journal why the hallucination happened
5. Add prevention rule to .claude-brain/prompts/ if repeatable

---

## 11. METRICS + KILL CONDITIONS

### 11.1 Validation phase (Day 1-14)

| Metric | Target | Kill if |
|--------|--------|---------|
| Paid ₱199 reservations | 30+ | <15 |
| Reserver → completed call | 80%+ | <50% |
| Price A/B clear winner | Yes | No signal by Day 10 |

### 11.2 Build phase (Week 1-3)

| Metric | Target | Kill if |
|--------|--------|---------|
| MVP deployed to prod | Yes | No after Week 1 Day 5 |
| Landlords onboarded (Week 3) | 30+ | <10 |
| First 10 placements success | 7+ | ≤2 |

### 11.3 Growth phase (Month 2-3)

| Metric | Month 2 | Month 3 | Kill if |
|--------|---------|---------|---------|
| Paid placements | 60 | 150 | <50 by Month 3 |
| Refund rate | <15% | <10% | >30% |
| Gross margin | ₱500 | ₱600 | <₱300 |
| Contribution margin | ₱30K/mo | ₱90K/mo | Negative by Month 3 |
| Week-4 retention | 20% | 30% | <10% |

### 11.4 Total cash exposure before Month 3 kill decision

- Validation: ~₱500 (landing page hosting + refund fees)
- Infra Month 1: ~₱2,500
- Infra Month 2-3: ~₱8,000
- Landlord acquisition: ~₱5,000
- Founder time: 400-600 hours (not cash but real)
- Legal/admin (OPC formation): ~₱20,000

**Total cash risk before Month 3 honest kill decision: ~₱36,000 (~$640).** Minimal downside.

---

## 12. ACCOUNTABILITY

### 12.1 This document is the source of truth

Everything else — V1, V2, V3, V4, V5 plans, 14,000 lines of blueprints — is archived reference material only. Do not re-open those conversations without validation data contradicting this decision.

### 12.2 Commitment protocol

This file lives in:
1. Repo root as `FINAL_DECISION.md`
2. `.claude-brain/context/00-north-star.md` (read first every Claude session)

When reality changes:
1. Do NOT edit this file silently
2. Create `.claude-brain/decisions/YYYY-MM-DD-[what-changed].md`
3. Document what changed, why, prior position, new position
4. Only then update `00-north-star.md` with amendment note

### 12.3 Claude Code's accountability

At session start, Claude Code MUST:
1. Read `.claude-brain/context/00-north-star.md`
2. Read the 3 most recent files in `.claude-brain/decisions/`
3. Summarize current state in 3 bullets
4. Refuse to build anything in Section 3 kill list

At session end, Claude Code MUST:
1. Update `.claude-brain/journal/` with what was done
2. Update `.claude-brain/context/02-repo-status.md` if code changed
3. Commit all brain files along with code changes

### 12.4 The one simple test

**30+ paid reservations (any tier mix) in 14 days → we have a business to build.**
**Fewer than 15 → we don't.**

Everything in Sections 1-11 is just mechanism for getting a clean answer. Nothing else matters until we have it.

---

## 13. IMMEDIATE NEXT STEPS

### Today (Day 0)

- [ ] Clone this doc to repo root as `FINAL_DECISION.md`
- [ ] Create `.claude-brain/` directory structure per Section 9
- [ ] Copy Sections 1-6 of this doc into `.claude-brain/context/00-north-star.md`
- [ ] Copy REPO_STATUS.md into `.claude-brain/context/02-repo-status.md`
- [ ] Create `.claude-brain/decisions/2026-04-12-validate-before-build.md`
- [ ] Create `.claude-brain/decisions/2026-04-12-facebook-page-only-no-groups.md`
- [ ] Create all 5 files in `.claude-brain/prompts/`
- [ ] Create `.claude-brain/README.md`
- [ ] Commit: `chore: initialize .claude-brain from FINAL_DECISION.md`

### Tomorrow (Day 1 of validation)

- [ ] Build single landing page at `rentrayda.com` with dual CTAs (per `decisions/2026-04-12-two-revenue-paths.md` and copy in `artifacts/landing-page-copy-and-discovery-script.md`)
- [ ] Paymongo payment links: ₱99 (Tier 1 escrow reservation) and ₱199 (Tier 2 concierge reservation)
- [ ] Test full payment flow with own phone
- [ ] Draft TikTok creator outreach (use `artifacts/tiktok-scripts-first-3-videos.md`)
- [ ] Draft 5 Facebook post variants for BPO groups + 3 university posts + LinkedIn post + 10 DM template

### Days 2-14 (validation execution)

- [ ] Post to 5 BPO FB groups (staggered over 5 days)
- [ ] Post to 3 university groups
- [ ] Post to Reddit (r/Philippines, r/BPO)
- [ ] Personal FB + LinkedIn + 10 DMs
- [ ] 3 TikTok videos
- [ ] Call every reserver within 24h
- [ ] Daily metrics check
- [ ] Day 14: count, decide

### Day 15

Branch point:
- **≥30:** Begin Week 1 MVP cleanup per Section 8.1
- **15-29:** Extend 14 more days with iterated landing
- **<15:** Refund all, publish post-mortem, archive repo

---

**Length:** ~8,500 words. Status: **FINAL.** Supersedes all prior planning.

*Signed off:* Miguel (founder) with input from Dominic (co-founder), grounded in 9 primary interviews, 512 synthesized voices, Meta ToS verification, and 15+ hours of Claude-assisted strategic pruning.
