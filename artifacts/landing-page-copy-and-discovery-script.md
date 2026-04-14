# Landing Page Copy + Customer Discovery Script

Two artifacts:
1. Landing page copy for rentrayda.com (dual-path CTAs)
2. Customer discovery call script (every reserver gets a call within 24 hours)

---

## ARTIFACT 1: Landing Page Copy (rentrayda.com)

**Target file:** `apps/web/app/page.tsx` (or equivalent)
**Tone:** Warm but direct. Safety-first. Taglish where natural, English where professional.
**Design constraint:** Must work on 360px width (many target users on budget Android)

### Section 1: Hero (above the fold)

**Headline (H1):**
> **Verified rentals in Pasig/Ortigas.**
> **Scam-protected. Landlord-safe.**

**Subheadline:**
> For anyone moving to Manila without a kakilala network — BPO new hires, students, fresh grads, OFW families. Browse free. Pay only if you want scam protection or our full concierge service.

**Primary trust signals (three in a row, icon + text):**
- ✓ Verified landlord IDs (PhilSys-backed)
- ✓ Deposits protected through GCash
- ✓ Female-only options available

**Hero image:** Female BPO worker in background, smiling, in what looks like a bedspace interior. Natural light. NOT corporate stock photo. NOT smiling model. Should look like a real Ate who moved to Manila last month.

**Under-hero sub-message:**
> Free to browse. Free for landlords forever. We only charge tenants who want our protection — and only after we've delivered.

### Section 2: Three-path CTA block (the validation test)

**Section heading:**
> **Choose how much help you want.**

Three equal-width cards on desktop; stacked on mobile. Each has its own CTA leading to a different flow.

---

**CARD 1 — Free browsing (Tier 0)**

**Badge:** 🆓 FREE FOREVER

**Headline:**
> Browse 30+ verified listings in Pasig/Ortigas

**Body:**
> - All listings have verified landlord IDs
> - All units have been photographed in-person
> - Female-only filter available
> - No sign-up to browse
> - Connect with landlords after both parties verified

**CTA button:** `Browse listings →`
**Links to:** `/listings`

---

**CARD 2 — Secure booking (Tier 1)**

**Badge:** 💰 3% OF DEPOSIT

**Headline:**
> Protect your deposit. Pay only if you find a place.

**Body:**
> - Browse all listings free
> - When you're ready to commit, we handle the deposit safely through GCash
> - We never touch your money — licensed EMI partner holds it
> - Released only when you confirm move-in
> - Average fee: ₱300-₱750 (3% of deposit)

**CTA button:** `Reserve escrow slot — ₱99 →`
**Links to:** `/reserve/escrow`
**Subtext under button:** `₱99 reservation applies to your eventual 3% fee. Fully refundable.`

---

**CARD 3 — Full concierge (Tier 2)**

**Badge:** 🎯 DONE FOR YOU

**Headline:**
> Find me a place in 7 days. Guaranteed.

**Body:**
> - 5-field form, then we take over
> - 3 verified matches delivered in 7 days
> - Housing buddy coordinates your viewings
> - Includes secure deposit handling
> - 7-day money-back guarantee

**CTA button:** `Reserve concierge slot — ₱199 →`
**Links to:** `/reserve/concierge`
**Subtext under button:** `₱199 applied to your ₱999 total. Refunded in full if we can't deliver.`

---

### Section 3: "Why we exist" (empathy + authority)

**Heading:**
> **Finding safe housing in Manila shouldn't be this hard.**

**Body:**
> Most people arriving in Manila without a kakilala network — BPO new hires, students, fresh grads, OFW families — land with training or classes starting in 5-14 days, no local contacts, and scammers waiting. We heard story after story: ₱10,000 deposits sent via GCash to listings that didn't exist. Units that looked nothing like the photos. Landlords who locked out tenants after complaints.
>
> We built RentRayda because Facebook groups weren't enough. Every landlord on our platform is verified via PhilSys. Every listing is photographed in person. Every deposit flows through GCash, not through us.
>
> You shouldn't have to choose between "unsafe and free" and "safe but expensive." With us, free is the default. Safety is the commitment. Money only changes hands when we've delivered.

### Section 4: How it works (three steps per path)

**Heading:** **How RentRayda works**

Three columns, one per path:

**Free browsing (Tier 0):**
1. Browse verified listings
2. Both sides verify (PhilSys)
3. Phone numbers reveal — you coordinate directly

**Secure booking (Tier 1):**
1. Find your place + agree with landlord
2. Deposit routes through GCash (we orchestrate, never hold)
3. Confirm move-in → 3% fee charged to you

**Full concierge (Tier 2):**
1. Submit 5-field form + ₱199 reservation
2. We find 3 verified matches within 7 days
3. You view, pick, move in — deposit protected, ₱800 balance due

### Section 5: Safety matters (psychographic-driven)

**Heading:** **Because safety isn't optional.**

**Four trust indicators with icons, in a row:**

- 🛡️ **PhilSys verification** — Every landlord verified through the Philippines' official ID system
- 👥 **Female-only options** — Filter for female-only rooms, female-only landlords, female-only floors
- 📹 **Property walkthrough** — Every listed unit photographed in person by our team
- 🚨 **Scam response** — If you report a scam within 48h of move-in, our team intervenes immediately

### Section 6: Who we serve (wedge confirmation)

**Heading:** **Built for migrants moving to Pasig/Ortigas.**

**Body:**
> We focus narrowly on Pasig/Ortigas because focus wins. Our network is densest near:
>
> - Concentrix, Accenture, Teleperformance, TaskUs, Foundever (BPO offices)
> - University belt extensions (DLSU-based students commuting, PUP, UP satellite)
> - Pasig General Hospital, Rizal Medical Center
> - Banks, retail chains, government offices in Ortigas Center
>
> Female-only options in San Antonio, Kapitolyo, Ugong, and Oranbo. Walking distance or jeep-ride to your destination.
>
> Other areas coming soon. For now — we'd rather be great in one neighborhood than mediocre everywhere.

### Section 7: FAQs (critical trust signals for this demographic)

**1. Ano ba yung "verified"?**
> Every landlord uploads a valid Philippine ID (PhilID, passport, driver's license) AND proof of property ownership (deed or utility bill). We manually review. Only after verification is their listing published.

**2. Bakit may bayad yung deposit protection?**
> Because holding deposits costs us regulatory compliance with BSP and ongoing operational cost. We keep it at 3% — lower than any broker in Manila — because we're a platform, not a middleman.

**3. May bayad ba sa landlord?**
> Wala. Libre forever. Hindi kami kumukuha sa inyo ng bayad, fee, subscription, kahit anong form. Kayo lang yung nagde-decide at nag-a-approve ng tenant.

**4. Saan napupunta yung deposit ko?**
> Derechto po yung deposit ninyo sa landlord via GCash. Hindi kami humahawak ng pera. We orchestrate yung transaction, pero licensed EMI (GCash) yung actual custody. Sinusunod namin ang BSP regulations po.

**5. Pag may issue after move-in, ano mangyayari?**
> Report mo sa amin within 48 hours of move-in. Coordinate kami sa landlord, sa GCash, at sa inyong legal options. Worst case: Tier 2 users get full ₱999 refund, plus we help locate a replacement unit within 7 days.

**6. Bakit Pasig/Ortigas lang?**
> Focus wins. We'd rather be deeply trusted in one corridor than mediocre across five. Makati, BGC, and QC — soon, when we've proven this works here.

### Section 8: Final CTA

**Heading:** **Your next place is 7 days away.**

Three buttons (same as Section 2):
- Browse listings (free)
- Reserve escrow slot (₱99)
- Reserve concierge slot (₱199)

**Footer line:** "Built by Filipinos, for Filipinos. RA 10173 compliant. Data Protection Officer: dpo@rentrayda.com"

---

## ARTIFACT 2: Customer Discovery Call Script (20-minute interview)

**When:** Within 24 hours of each paid reservation (Tier 1 or Tier 2)
**Who:** Founder only during validation phase
**Where:** Messenger video call (target's native platform)
**Goal:** Learn why they paid, what they expect, what they'd refund over, how they heard about us

**BEFORE the call:**
- Pull up their reservation details (tier, price, timestamp, UTM source)
- Check their Facebook profile (publicly visible only) for demographic context
- Prepare to take notes in `.claude-brain/journal/YYYY-MM-DD-customer-call-[name].md`
- Don't record without consent (DPA compliance)

**Language:** Taglish throughout. Lead with warmth, not corporate tone.

---

### Opening (0-2 minutes)

> "Hi [name], si Miguel from RentRayda! Salamat sa reservation kanina. Okay po ba kung mag-usap tayo for 20 minutes? Gusto ko lang maintindihan ang context ninyo para ma-serve namin kayo nang maayos. Hindi ko po kayo bebentahan ng kahit ano sa call — just want to learn."

Wait for their response. If they agree, continue.

> "Bago magsimula, tatanungin ko po lang: okay ba na mag-take ako ng notes? Hindi ko po siya irerecord. Pure notes lang po para hindi ko makalimutan."

If they say no to recording, confirm only notes.

### Section 1: Their situation (2-6 minutes)

**Q1:** "Kumusta po yung current housing situation niyo ngayon?"
> [Listen: are they homeless? Staying with relatives? Paying transient room? How urgent is the problem?]

**Q2:** "Nasaan po kayo nagwowork, or saan po kayo magsisimula?"
> [Listen: which BPO? Which location? Shift schedule?]

**Q3:** "Paano po kayo dumating dito sa Manila? Kailan po?"
> [Listen: provincial migrant? Have network? First time in Manila?]

### Section 2: How they heard of us (6-10 minutes)

**Q4:** "Paano niyo po nahanap ang RentRayda?"
> [Listen: TikTok video? Facebook group? Friend referral? Directly searched?]

**Q5:** "Kung hindi kami yung tinuturo sa inyo, saan po sana kayo hahanap ng tirahan?"
> [Listen: Facebook groups, broker, ask family, online marketplace? Real alternatives tell us competitive context.]

**Q6:** "May ni-try niyo po bang ibang housing platform before? Kumusta yung experience?"
> [Listen: what did they use, what was the pain, did they get scammed? Actionable color on what to avoid in our UX.]

### Section 3: What made them pay (10-15 minutes)

**Q7:** "Ano po yung nag-convince sa inyo na mag-pay ng ₱[99/199] reservation?"
> [Listen: specific trust signals that worked. Badge? Verification language? Money-back promise? Something specific to write more of.]

**Q8:** "What would make this worth the full ₱[450/999] price to you?"
> [Listen: their definition of value = our product spec. If they say "just three listings in 3 days" we know the product surface. If they say "a housing buddy to meet me at the unit" we know the service.]

**Q9:** "What would make you want to refund and walk away?"
> [Listen: their deal-breakers = our failure modes to design around.]

**Q10:** "If this worked perfectly, how would you describe it to a friend?"
> [GOLD. Their description is our marketing copy. Write it verbatim.]

### Section 4: Their deadline and constraints (15-18 minutes)

**Q11:** "Ano po yung deadline ninyo? Kailan po kayo kailangan na makalipat?"
> [Listen: confirms 72-hour window insight, or surfaces longer timelines.]

**Q12:** "Magkano po budget ninyo para sa rent at deposit?"
> [Listen: tests pricing model. ₱5-8K rent, ₱15K deposit = validates. Wildly different = segment confusion.]

**Q13:** "May specific po ba kayong requirements? Female-only? Malapit sa work? May aircon?"
> [Listen: top 3 non-negotiables = search filter priority for our product.]

### Section 5: Infrastructure Signals (4-5 minutes)

**Q-I1:** "If paying rent through our app could build your credit score for bank loans, would that matter to you?"
> [Listen: does credit history resonate? Or is she too immediate-focused to care about future credit? Tags: credit-history-value]

**Q-I2:** "If we told a landlord you're verified — ID confirmed, employed at [their company], paid on time — do you think they'd prefer you over a random Facebook inquiry?"
> [Listen: does she believe verification has value to landlords? Her perspective on landlord behavior. Tags: verification-value-to-landlord]

**Q-I3:** "Aside from housing, what else do you need in your first 30 days in Manila?"
> [Listen: adjacent needs — furniture, clearances, roommate, community, transport. Top 3 by frequency across calls. Tags: adjacent-needs]

**Q-I4:** "We can help process your NBI, police, and barangay clearances for ₱399 all-in — would you use that?"
> [Listen: specific yes/no + price sensitivity. Would they pay more? Less? Tags: document-processing]

### Section 6: Close and thank (18-20 minutes)

**Q14:** "One last question: may kakilala po ba kayo — batchmate, friend, family — who's also looking for housing sa Manila? Pwede po bang i-connect niyo kami?"
> [Referrals are the highest-quality traffic. Ask every single call.]

**Q15:** "May tanong po ba kayo sa akin?"
> [Always give them the floor to ask. Often the best insights come here.]

**Closing:**
> "Salamat po talaga [name] for the time. Two things:
> 1. Within 48 hours, mag-message ako sa inyo with an update on your [escrow/matches].
> 2. Kung may issue po, message niyo ako sa Messenger kahit kailan — I'll respond within a few hours.
> Kung gusto niyo i-share yung experience with batchmates, we'd love it. Pero kung ayaw, ayaw niyo, no pressure.
> Salamat ulit po 🙏"

---

### AFTER the call

Document in `.claude-brain/journal/YYYY-MM-DD-customer-call-[name].md`:

```markdown
# Customer call — [First Name] ([Tier 1/2], [amount])

## Date: YYYY-MM-DD HH:MM
## Source channel: [TikTok/Facebook/Friend/Other]
## Call duration: X minutes
## Consent to notes: Yes

## Their situation
- Currently: [status]
- Work: [company, location]
- Timeline: [urgency]
- Provincial background: [yes/no, where]

## How they heard of us
- Primary: [channel]
- What convinced them: [specific trust signal]

## Key quotes (verbatim Taglish preserved)
- "[quote 1]"
- "[quote 2]"
- "[quote 3]"

## Their definition of success
[what would make this worth full price]

## Their deal-breakers
[what would make them refund]

## Budget
- Rent: ₱X
- Deposit capacity: ₱X
- Total willing to pay us: ₱X

## Infrastructure signals
- Credit history interest: [Yes/No + reasoning]
- Verification value: [Yes/No + their take]
- Adjacent needs: [top 3 mentioned]
- Document processing: [Yes/No + price reaction]

## Referral offered
[Yes/No, names if yes]

## Follow-up required
- [ ] [action]
- [ ] [action]
```

### Patterns to watch across calls

After 10 calls, look for:
- Channel concentration (is TikTok actually driving reservations?)
- Price sensitivity (are ₱99 Tier 1 reservations converting to 3% commission, or are they all just Tier 2?)
- Deal-breaker clustering (what's the one thing that would make 7+/10 people refund?)
- Urgency distribution (is the 72-hour window the modal case, or outlier?)
- Referral rate (what % offer a name vs. decline?)

Infrastructure patterns to track:
- Credit history interest: X/total said yes (threshold: 7+/10 across all calls = viable)
- Verification value to landlords: X/total said yes (threshold: 8+/10 = strong signal)
- Top 3 adjacent needs (ranked by frequency across all calls)
- Document processing: X/total said yes at ₱399 (threshold: 5+/10 = build it)

After 30 calls, we have enough signal to make Phase 2 decisions with conviction.

---

*These are the two most operationally-loaded artifacts. The landing page drives all validation traffic. The call script converts reservers into qualitative gold. Both should ship in first week of validation phase.*
