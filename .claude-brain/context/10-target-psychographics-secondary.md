# Secondary Target Psychographic Profile — Informal Filipina Landlord

**Last updated:** 2026-04-12
**Source:** Deep research April 2026 (Pantao Journal, 365Outsource, RSIS International, legal firm reports, SSRN studies on informal economy)
**Purpose:** When designing landlord-side UX, acquisition flows, or support, match this person's actual life. She is NOT a real-estate professional.

---

## WHY THIS FILE EXISTS

The landlord side is where past plans have repeatedly miscalibrated. She's not a developer, property manager, or business operator in the Western sense. She's the boarding-house equivalent of the sari-sari store tindera. Read this before proposing any landlord-facing feature.

---

## WHO SHE IS

- **Age:** 45-70
- **Gender:** Primarily female (70%+)
- **Units managed:** 2-10 (bedspaces, rooms, small apartments)
- **Pricing:** ₱3,000-15,000/month per unit
- **Lives:** On or near the rental premises
- **Primary income:** Spouse's salary, retirement, or small business. Rental is SUPPLEMENTAL.
- **Business registration:** Typically none (not BIR-registered, no DTI, no permits)
- **Accounting:** Mental arithmetic, maybe a notebook. No software.
- **Payment method:** Cash dominant. PDCs (post-dated checks) for longer leases. Rarely GCash.

**The accurate mental model:** She's leveraging her most accessible asset (extra rooms, inherited property) to generate family income through an intimate, cash-driven, legally informal micro-enterprise. Directly analogous to sari-sari store ownership — which is 75% female.

---

## HER PRIMARY FEAR: NON-PAYING TENANTS

Metro Manila rental delinquency rate: 8-12% annually. She's seen it firsthand. Recovery is slow, embarrassing, and often incomplete.

Her screening defenses:
- **Kutob (gut feeling)** — primary screening tool. Meets tenant in person.
- **Kakilala referral** — "who vouches for this person?"
- **Employment verification** — BPO workers preferred (regular income, corporate accountability via HR)
- **Family background** — asks about parents, siblings, hometown
- **Social media stalking** — Facebook check before accepting

**Implication for RentRayda:** Our verification badges are valuable to her precisely because "kutob" has limits and she knows it. Institutional verification supplements, doesn't replace, her intuition.

---

## HER SECONDARY FEAR: BIR EXPOSURE (DECISIVE)

**This is the single most important finding about the landlord side.**

Most informal landlords operate cash-only specifically to avoid tax paper trails:
- Not BIR-registered
- Don't issue official receipts
- Don't declare rental income
- Operate under informal agreements, sometimes verbal

Any platform that creates transaction records feels like a tax trap. This is existential, not preferential.

**What this means operationally:**
- No BIR registration required to list
- No TIN collection
- No "official receipt" generation
- No transaction exports that look like accounting statements
- No language on our platform that sounds government-adjacent
- No features that make her feel "formalized"

See `decisions/2026-04-12-no-bir-paper-trail.md` for the full decision.

---

## TRUST HIERARCHY

In descending order:

1. **Family recommendation** (strongest — "my daughter uses this")
2. **Fellow landlord endorsement** (peer-to-peer, Facebook group comments)
3. **Church / barangay community endorsement**
4. **Successful tenants' word-of-mouth** ("my tenant told me about this")
5. **Platform testimonials from "people like me"** (not corporate voice)
6. **Celebrity or brand endorsement** (LOWEST — doesn't move her)

**Implication:** Our landlord acquisition must go through peer networks and successful tenant testimonials, not ads or influencers.

---

## DIGITAL BEHAVIOR

**She IS Facebook-native.** She:
- Posts listings on Facebook groups ("Available bedspace sa Ugong, ₱5K all-in, female only")
- Responds to inquiries via Messenger PM
- Joins barangay/community Facebook groups
- Shares family photos
- Uses Facebook as her primary digital space

**She is NOT app-native.** She resists:
- Downloading new apps
- Creating new accounts
- Multi-step onboarding
- Settings menus
- Anything that looks like a "system"

**Pantao Journal 2025 research:** Women 45+ face "higher difficulties, especially regarding security and education" with new digital systems.

**Implication:** Landlord listing creation must happen via Facebook Messenger. A RentRayda team member (or trained agent) walks her through it in a Messenger conversation. See `decisions/2026-04-12-landlord-onboarding-messenger.md`.

---

## RELATIONSHIP DYNAMIC WITH TENANTS

The landlord-tenant relationship for informal rentals is **paternalistic and familial**, especially when tenants are young provincial women.

Common dynamics:
- Lives on or adjacent to premises
- Takes quasi-maternal role
- Enforces house rules (curfews, visitor policies) through personal authority
- Gives informal loans or lenient grace periods for struggling tenants
- Feels responsible for tenant safety
- Calls tenant's parents if something seems wrong

**Key paradox:** She's tough on screening but soft on enforcement.

**"Nahihiya ako magsingil"** (I'm embarrassed to collect) — cultural embarrassment around rent collection creates paralysis. She often lets delinquent tenants stay 1-2 months before confronting.

**Implication for product:** Features that help her enforce rules without social awkwardness are valuable. Automated reminders she can blame on "the system" reduce her social cost.

---

## LANGUAGE

**Default:** Tagalog / Filipino with some English
**Respect markers:** She uses "po/opo" with younger people, surprisingly often (sign of maternal care, not subservience)
**Formal register:** Lower literacy in English legal/technical terms. Contracts in Tagalog welcome.

**Key phrases she uses in listings:**
- "Walang bisita" (no visitors)
- "Curfew 10 PM"
- "All-in na ang bayad" (everything included)
- "Kasama na ang kuryente at tubig" (electricity and water included)
- "May CCTV" (has CCTV)
- "Female/male only po"

**In customer support:** Respond in Taglish. Don't force her into English. Don't use technical jargon.

---

## PLATFORM ADOPTION BARRIERS (RANKED)

1. **BIR exposure fear** — existential deal-breaker
2. **Complexity** — more than a few taps beyond Facebook = abandonment
3. **Perceived irrelevance** — "I have only 5 rooms, I don't need a system"
4. **No peer adoption** — won't be the first among peers to try
5. **Digital literacy gaps** — comfortable with Facebook/Messenger, resistant to new apps
6. **Cost** — ANY fee is a deal-breaker (0/5 in user's own prior interviews were enthusiastic about paid platforms)

---

## WHAT ACTUALLY WORKS FOR ACQUISITION

Based on research + prior decisions:

1. **In-person barangay walks** — knock on doors, explain in 2 minutes, offer to list her units for her via Messenger later
2. **Peer referral** — satisfied landlord tells her neighbor-landlord ("Try this, it's free")
3. **Tenant advocacy** — a tenant who wants to rent says "can you list on RentRayda so I can book?"
4. **Facebook group presence** — establish ourselves as a helpful presence in local community groups, not an advertiser

**What DOESN'T work:**
- Facebook ads (she scrolls past)
- Cold email (she doesn't check email)
- Website signup forms (she won't reach them)
- Downloadable PDFs (friction)
- "Register now" CTAs (triggers BIR anxiety)

---

## WHAT SHE'D ACTUALLY PAY FOR (IF ANYTHING)

Past research: 0/6 landlords enthusiastic about paying ANYTHING.

Hypothetical future premium features she MIGHT pay for (once she trusts the platform):
- Verified pre-screened tenants with employment proof
- Deposit guarantee from the platform
- Dispute mediation
- Automated rent reminders sent on her behalf

**But none of these are launch features.** Launch is ₱0, forever. Any landlord monetization comes only after she has been on the platform for months and has seen value.

---

## THE CORE INSIGHT

She's not resisting technology. She's resisting loss of control, loss of informality, and exposure to systems she doesn't trust (BIR, formal commerce, apps that track her).

**The platform that wins her is the one that:**
1. Gives her more control (better tenant screening, trusted pre-filtered inquiries)
2. Preserves her informality (no paper trails, no registration, no "formal" vibe)
3. Works within systems she already trusts (Facebook Messenger, cash, kakilala network)

This is the product design challenge. Every landlord-facing feature should pass these three tests.

---

## REVIVE TRIGGERS

This profile should be re-validated if:
- BIR launches enforcement campaign targeting informal rentals
- Younger landlords (under 40) become a meaningful segment (different psychographic)
- Facebook Groups deprecate or restrict housing listings
- A competitor normalizes landlord platforms (reduces psychological barrier)
- PhilSys becomes mandatory for landlord activity

Review date: 2026-10-12 (6 months)
