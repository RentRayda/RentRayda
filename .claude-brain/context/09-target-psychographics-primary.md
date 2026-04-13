# Primary Target Psychographic Profile — Female BPO New Hire, Provincial Migrant

**Last updated:** 2026-04-12

**⚠️ SCOPE NOTE:** This is the *sharpest empathy target* for marketing, not a product gate. The platform serves any provincial migrant without a kakilala network (male or female, BPO or student or fresh grad or OFW family). Our initial 4 interviews were all female, and the research shows safety concerns are gendered — so marketing stories lean female BPO. But do NOT restrict signups or UI copy to this subset. See `context/00-north-star.md` for the full wedge pattern.
**Source:** Deep research April 2026 (UN Women, PSA, Meltwater/DataReportal, RSIS International industry studies, legal firm reports, Pantao Journal)
**Purpose:** When building features, marketing, or support flows, match this person's actual life — not a generic user.

---

## WHY THIS FILE EXISTS

Claude Code defaults to generic "user" or "persona" assumptions when building UX. The primary target is specific and her life context dramatically changes what's useful vs. what's friction. Read this before designing any screen, writing any copy, or proposing any feature.

---

## WHO SHE IS

- **Age:** 20-26
- **Gender:** Female
- **Origin:** Province (primarily Visayas/Mindanao)
- **Location destination:** Pasig/Ortigas corridor
- **Employer:** Concentrix / Accenture / Teleperformance / TaskUs / Foundever (BPO new hire)
- **Salary:** ₱18,000-25,000/month
- **Housing budget:** ₱5,000-8,000/month
- **Education:** Some college to college graduate
- **Manila network:** NONE (walang kakilala) — training batchmates become surrogate family

---

## THE 72-HOUR DECISION WINDOW (CRITICAL)

**She does NOT have 14 days to find housing.**

Typical timeline:
- Receives BPO job offer → training starts in 5-14 days
- Arrives in Manila with money for 2-3 weeks maximum
- Must find housing within **1-3 days** or burn through her savings on transient rooms (₱500-800/night)
- Some arrive on Day 1 of training and search from transient rooms simultaneously

**Implication for RentRayda:** The product must match this urgency. Instant listing availability, real-time landlord responsiveness, same-day booking confirmation. Any friction that extends decision time beyond 72 hours risks irrelevance.

**Common scam exploitation:** Scammers specifically target this urgency. "Pay ₱5K GCash now to reserve or you lose it." The desperate provincial migrant is the scammer's favorite target.

---

## FINANCIAL REALITY

**Monthly ₱20,000 breakdown (typical):**
- Rent: ₱5,000-8,000
- Food: ₱3,000-6,000
- Remittance ("padala") to province: ₱3,000-7,000 (supports 3-4 family members)
- Transportation: ₱1,500-3,000
- Utilities/load: ₱1,000-2,000
- Emergency fund: ~₱0 (no margin)

**Implication:** A single scam of ₱5,000-10,000 destabilizes the entire family's financial plan. Fear of scam loss is not paranoia — it's appropriate risk assessment.

**Financial tools:**
- GCash: near-universal. Primary financial tool.
- Payday cycle: 15th and 30th (spending pulse days — best for conversion)
- Paluwagan: ₱500-2,000/cutoff with office peers (informal rotating savings for deposit lump sums)
- Bank accounts: many don't have one. GCash IS their bank.

---

## FEAR HIERARCHY

In order of priority:

1. **SCAMS.** Losing ₱5-10K to a fake listing. Catastrophic at her income level. Every housing transaction carries this anxiety.
2. **PHYSICAL SAFETY.** 88% of women aged 18-24 experience harassment in Metro Manila (UN Women). Night-shift commute (2-5 AM departure) amplifies risk. Gendered safety is foundational, not a filter.
3. **DISAPPOINTING FAMILY.** Losing the BPO job = losing the remittance = family impact. The job is the family economic strategy, not personal advancement.
4. **AI REPLACEMENT ANXIETY.** 69% of Filipino Gen Z cite uncertainty as root cause of depression. The AI narrative feeds this anxiety even if current data doesn't support mass BPO displacement.
5. **ISOLATION / HOMESICKNESS.** Messenger to province = daily emotional lifeline.

---

## TRUST HIERARCHY

In descending order of trust:

1. **Peer referral** from batchmate or kababayan (strongest)
2. **Facebook group social proof** — active comments, real photos, timestamps, mutual friends
3. **Physical property viewing** before payment
4. **Verified identity / institutional verification** (PhilSys-verified badge has high perceived trust value)
5. **Professional brand appearance** (lowest — brand trust alone doesn't override the above)

**Implication:** Our verification stack works WITH this hierarchy, not against it. Show mutual connections, show who referred, show physical viewing scheduling, then show institutional verification. Order matters.

---

## MEDIA CONSUMPTION

| Platform | Time/Month | Primary use |
|----------|-----------|-------------|
| TikTok | 40 hrs | Entertainment, BPO life content, budgeting tips, K-drama |
| YouTube | 25.4 hrs | Vlogs, music, tutorials (background consumption) |
| Facebook | 23.5 hrs | Housing search, family, groups, marketplace |
| Messenger | 16.4 hrs | Daily family + batchmate communication |

**Active browsing windows:**
- 4-8 PM (pre-shift)
- Midnight-3 AM (night shift breaks)
- 6-9 AM (post-shift decompression)

**For marketing:** TikTok owns attention. Facebook owns transaction intent. Messenger owns peer referral. Reddit is nearly irrelevant for this demographic.

**Content that works:** Nano-influencers (BPO workers filming actual dorm rooms, move-in days, honest reviews) dramatically outperform celebrity endorsements. "People like me" signal is the unlock.

---

## LANGUAGE PATTERNS

**Default:** Taglish (Tagalog-English code-switching)
**Respect markers:** "Po" / "opo" with landlords, managers, elders
**Emoji:** Heavy. 😊🙏💕✨
**Softeners:** "hehe", "hihi"

**Key trust-verification phrases appearing constantly in BPO housing groups:**
- "Legit ba 'to?" (Is this legitimate?)
- "PM sent"
- "Pa-share po" (Please share)
- "All-in po ba?" (Is everything included in the price?)
- "Available pa po?" (Still available?)
- "Near [landmark/mall]?"
- "Female lang po ba?" (Female-only?)

**In-app UI copy should be:** Simple English only (app UI rule per `context/04-brand.md`). But for Facebook content, TikTok scripts, and Messenger flows, use Taglish to match her natural register.

---

## DECISION-MAKING PATTERN

The typical housing search flow:

1. **Post in 2-5 BPO Facebook groups** — "Looking for bedspace near Concentrix Ortigas, budget ₱6K"
2. **Receive 10-30 DMs** in first hour
3. **Cross-reference each sender's Facebook profile** — real photos? mutual friends? account age?
4. **Ask filtering questions** in Messenger — price all-in? female only? CCTV? house rules?
5. **Schedule 2-5 physical viewings** over 1-2 days
6. **Pay deposit after viewing** (or before, under duress, to scammers)

**Implication for RentRayda:** Our product must slot INTO this flow, not replace it. The magic moments are: verified listings (skip step 3), verified landlord communication (replace step 4's anxiety), scheduled viewings with safety indicators (enhance step 5), escrow payment (fix step 6).

---

## WHAT SHE WANTS IN 5 YEARS

Understanding her aspiration context helps craft long-term positioning:

- Own a small lot/house in the province (for family)
- Send siblings to college (remittance continues)
- Advance at BPO (team lead, supervisor — salary doubles to ₱40-50K)
- Marry (often a priority by 26-28)
- Possibly go abroad as OFW (Middle East, Japan, Canada) for higher earnings

**Implication:** RentRayda's success in housing her first year creates lifetime loyalty. If we help her navigate her first Manila placement, she may bring her cousin next year, her sister the year after. Referral loops are native to this demographic because migration is continuous in their networks.

---

## WHAT WILL FRUSTRATE HER

Design considerations — avoid these:

- Long forms (>5 fields)
- Requirement to create account before browsing
- English-only copy in marketing (Taglish feels native)
- No price shown upfront (always show all-in price)
- No photos or fake photos
- Needing a credit card (she doesn't have one)
- Monthly subscriptions (kills adoption, universal finding)
- Desktop-first web design (mobile Android first always)
- Assuming she has time to "compare options" (she has 72 hours)
- Male-coded safety assumptions (ignore night commute risk)
- Assuming she has savings buffer (she doesn't)

---

## WHAT WILL DELIGHT HER

- "Verified by PhilSys" badge (institutional trust)
- Mutual connection visible on listing ("2 Concentrix workers moved here")
- Female-only filter prominent
- Flood risk indicator (she doesn't know which barangays flood)
- Same-day viewing scheduling
- Move-in day companion (someone to help her navigate)
- Refund within 48 hours if something's wrong (speed of refund = trust)
- Testimonials from actual BPO workers (not stock photos)
- Taglish customer support on Messenger

---

## REVIVE TRIGGERS

This profile should be re-validated if:
- BPO entry salary shifts >20% (changes budget band)
- Major Philippine labor law change affecting BPO work
- UN Women harassment data updates significantly
- PhilSys adoption stalls or reverses
- TikTok gets banned/restricted in Philippines
- Target age range shifts (e.g., younger high school grads entering BPO)

Review date: 2026-10-12 (6 months)
