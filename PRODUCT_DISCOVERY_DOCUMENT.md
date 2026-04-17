# PRODUCT_DISCOVERY_DOCUMENT.md
# RentRayda — Philippine Informal Rental Marketplace
# Version 1.1 | April 4, 2026
# Brand: #2D79BF (RentRayda Blue — NOTE: #2B51E3 was v1, deprecated) | Verified badge: #16A34A (Green) | NativeWind token: rayda
# Deep link scheme: rentrayda:// | Package scope: @rentrayda/ | Expo scheme: rentrayda

INPUTS CONFIRMED: RESEARCH_FINDINGS.md ✓ | All 6 project files ✓
Proceeding to Section 1.

## EXECUTIVE DECISION TABLE
*(Every major decision in this document, in one place)*

| Dimension | Decision |
|---|---|
| Platform type | Trust infrastructure that enables rental transactions between verified strangers in the Philippine informal rental market |
| Core promise (one sentence) | Dito, hindi mo kailangan ng kakilala — verified landlords at verified tenants, magkakilala na bago mag-meet. |
| Primary tenant user | Displaced Migrant (T1/T4 profile): 20s–30s BPO worker, provincial, no Manila network, 1–3 month search, Facebook-exhausted |
| Primary landlord user | Cash-Strapped Informal Landlord (L4/L5 profile): 4–10 units in Pasig/Taguig, cash only, gut-feeling screening, midnight runner pain |
| Launch geography | Pasig BPO corridor: Barangays Ugong, San Antonio, Kapitolyo, Oranbo + adjacent Mandaluyong (Boni/Shaw corridor) |
| Fee model at launch | Zero fees. No exceptions. "If it's free, we might use it." — L5 |
| Web framework + version | Next.js 16.2 (App Router, standalone output mode, stable Adapter API) |
| Mobile framework + version | Expo SDK 55 with Expo Router |
| Backend runtime + framework | Node.js 22 LTS + Hono 4.12 |
| API style | REST with Zod validation (not tRPC — Claude Code familiarity + simpler mobile debugging) |
| ORM + version | Drizzle ORM 0.45 |
| Auth package + version | better-auth 1.5 with @better-auth/expo plugin |
| Primary database | PostgreSQL 16.4 (self-hosted on Droplet) |
| File storage | Cloudflare R2 (S3-compatible, $0 egress) |
| SMS OTP provider | PhilSMS (₱0.35/SMS, official telco routes, all PH carriers) |
| Deployment tool | Coolify 4.x (self-hosted, free, web GUI) |
| Hosting provider + tier | DigitalOcean $24/mo Droplet (4 GiB RAM, 2 vCPU, 80 GiB SSD) |
| Monthly infra cost at launch | ~$27/month (DO $24 + PhilSMS ~$1.80 + domain ~$1) |
| Monthly infra cost at 10K users | ~$80/month (upgraded Droplet $48 + separate DB $24 + PhilSMS ~$6 + R2 ~$5) |
| KYC verification approach at launch | Manual review by founding team. PhilSys QR verification (free) as primary check. ID Analyzer 100 free monthly credits as backup. No paid KYC API at MVP. |
| MVP timeline | 30 days. One developer. Claude Code. Ugly but functional. |
| First feature to build | Phone OTP registration + landlord profile creation (Day 2) |
| First feature explicitly excluded | GCash/Maya payment integration (0/5 landlords use GCash, cash-dominant market) |
| Biggest adoption risk | Landlord supply — L4/L5 landlords fill units fast (hours to days) through signs and networks. They don't feel pain in finding tenants. The value prop (tenant screening) must be compelling enough to justify listing when they don't need help filling units. |
| Kill condition (when to pivot) | Fewer than 5 successful verified connections (both phones revealed) after 90 days of operation with 20+ verified listings live. If landlords list but tenants don't connect, the trust signal isn't working. If tenants sign up but landlords don't list, the single-player value isn't enough. |

---

## SECTION 1: PLATFORM IDENTITY

### 1.1 — What This Platform Actually Is

The Philippine informal rental market operates on a single currency: personal connections. T3 found her apartment in one day because her landlord was "known through relatives, councilor child." T1, without a single Manila connection, searched for three months, visited ten or more places, and was almost scammed twice. The difference between these two experiences is not effort, not intelligence, and not budget. The difference is network. The Philippine rental market is a kakilala economy — the best units fill through word of mouth before a tarpaulin goes up, and Facebook Groups are where landlords dump the leftovers after their network has had first pick.

This structural reality means a listing site cannot solve the problem. Lamudi has 160,000+ listings and an 11-review, all-1-star Trustpilot profile. Rentpad has 18,617 Metro Manila listings and Quora users complaining that "the prices are mostly higher than expected and inflated." More listings do not create more trust. Dormy.ph, the closest competitor, recognized this and built tiered verification — but after three years and $50,900 in funding, their CEO's goal was still just "3,000 Filipinos this year." The listing-first model has been tried. It does not work in this market because the problem is not discovery. The problem is trust.

The Trust Deadlock mechanism (138/165 in the Unique Mechanism Evaluator) names the structural catch-22: landlords want tenant IDs before showing units, tenants cannot share IDs with unverified strangers, and neither side will move first. Dormy.ph itself documented this: sharing government IDs with unverified agents "is bad practice and must be avoided at all cost." Both sides stay stuck — and default to the kakilala economy, where the only trust bridge is personal connections that provincial migrants do not have.

The Kakilala Gap mechanism (140/165 — highest score in the entire evaluation) reveals why: the informal rental market structurally excludes anyone without a local network. This is not a technology gap. It is a trust gap. And it cannot be solved by adding more listings to Facebook. It requires a neutral third party where both sides verify their identity to the platform — not to each other — so that a BPO worker from Leyte with zero rental history and zero Manila connections can prove she is a trustworthy tenant, and a Pasig landlord with four units can prove he actually owns the property and is not running a reservation fee scam.

Decision: This platform is trust infrastructure that enables rental transactions between verified strangers. It is not a listing directory (Lamudi), not a broker marketplace (Rentpad), not a property management tool (what L2 wanted), and not a payment processor. It is the neutral third party that breaks the trust deadlock and closes the kakilala gap. Every feature exists to make a verified stranger as trustworthy as a personal referral. Any feature that does not serve this function does not belong in the MVP.

### 1.2 — One-Sentence Product Definition

Candidate A: "Mga verified na landlord at tenant — magkakilala na bago pa mag-meet."
Grade: ✓ Understandable by T1 in 5 seconds. ✓ Taglish. ✓ Contains "verified." ✓ No forbidden words. ✓ Does not sound like Lamudi. ✓ References core promise (mutual verification before meeting). ✓ L5 would not leave. Pass on all seven checks.

Candidate B: "Hanapin ang tunay na apartment — walang scam, walang kakilala needed."
Grade: ✓ Understandable. ✓ Taglish. ✓ Contains "tunay." ✓ Clean of forbidden words. ✓ References core promise. ✗ Slightly focuses on tenant side only — does not communicate landlord value. Fails the two-sided test.

Candidate C: "Ang lugar kung saan ang landlord at tenant, parehong napatunayan na."
Grade: ✓ Understandable. ✓ Taglish. ✓ Contains "napatunayan." ✓ Clean. ✗ Sounds slightly formal — like a tagline written by a marketing agency, not words T1 would say. Fails the T1 register test.

Selected: Candidate A. It won because it communicates mutual verification ("magkakilala na bago pa mag-meet" — you already know each other before you even meet), addresses both sides (landlord and tenant), uses natural conversational Taglish, and the word "verified" is the single most important trust signal in the product. Candidate B was close but skewed tenant-side. Candidate C was too polished.

### 1.3 — What This App Is Not

This is not Lamudi because Lamudi serves brokers and formal real estate agents, charges ₱999/month for Pro accounts, and has a 100% negative Trustpilot score. Lamudi's "Certified Partners" badge is widely criticized — one user drove an hour based on a "verified" listing only to find the real price was "more than double the advertised price." The informal rental market (₱3K–15K/month) does not exist on Lamudi.

This is not Rentpad because Rentpad is broker-dominated, with Quora users reporting prices that are "mostly higher than expected and inflated." Rentpad listings route through agents, not owners. L4 and L5 — our target landlords — do not use brokers. They use signs and word of mouth.

This is not Airbnb because Airbnb serves short-term tourism stays with different trust mechanics (reviews, insurance, dispute resolution). T4 said "Airbnb for long-term stays" unprompted, which validates the emotional positioning but not the feature set. Long-term rentals have fundamentally different trust requirements — the relationship lasts months or years, not nights.

This is not a property management tool because L2 explicitly wanted management ("Not to have to do it myself. If I don't have to do it myself, that would solve everything") — but L2 is not our target user. L2 uses PDCs, has zero late payments, and fills units in 1–2 weeks. The management feature is a distraction at MVP that serves the wrong user.

This is not a payment platform because 0/5 interviewed landlords use GCash for rent collection, 3/5 are cash only, and 2/5 use postdated checks. The informal rental market runs on physical cash handed to the landlord in person. Building payment infrastructure serves nobody in the target segment.

This is not a social network because the connection between landlord and tenant is transactional, not social. The platform facilitates one action: verified stranger meets verified stranger. After that, the relationship moves offline to phone calls and in-person visits. Building social features would dilute the trust signal.

This is not a legal service because the platform does not draft contracts, mediate disputes, or provide legal advice. L5's barangay mediation experience ("tenant argued and demanded 3-month grace period") shows that legal mechanisms already exist in the informal market — they simply do not work. The platform addresses the screening gap, not the enforcement gap.

This is not a government service because the platform is a private entity that leverages government infrastructure (PhilSys National ID verification, barangay clearances) without being part of government. It must register with NPC under the PDPA but operates independently.

This is not a credit bureau or background check service because the platform verifies identity and employment — not creditworthiness. No credit scoring system exists in the Philippines for informal rentals. What L4 and L5 asked for is simpler: "tenant's background profile" and "better background checking." This means verified government ID + confirmed employment, not a FICO score.

### 1.4 — The Single Core Promise

The primary mechanism is the Kakilala Gap (140/165), not the Trust Deadlock (138/165). The Trust Deadlock explains the structural problem (who shares ID first), but the Kakilala Gap explains the emotional problem (why provincial migrants suffer while locals thrive). T1 searched for three months. T3 found her place in one day. The only difference: network. This emotional truth — "Hindi ako bobo. Wala lang akong network" — is what the platform promises to solve.

The Trust Deadlock is the mechanism by which the Kakilala Gap is closed. The platform acts as a neutral third party (solving the deadlock) so that strangers can become as trusted as personal referrals (closing the gap). But the promise is framed around the gap, not the deadlock, because the gap is what the user feels.

With this app, for the first time, a BPO worker from the province can find a verified apartment in Manila without knowing anyone — because the app does what a kakilala does: it vouches for both sides.

### 1.5 — Emotional Feel

```
ADJECTIVE: Maaasahan (Dependable)
Research grounding: "Maaasahan" appeared 5+ times across Filipino blogs and forums
  as the quality renters most want in both landlords and platforms. T1's core pain was
  unreliable responses — "almost dead" after 3 months of searching. L5's core pain was
  unreliable tenants — midnight runners leaving "completely empty."
What it looks like in practice:
  - Copy: Every verification state has a clear Taglish label — "Napatunayan na" (verified),
    "Sinusuri pa" (under review) — never ambiguous loading states
  - UI: Connection requests show exact response times. Listings show last-active dates.
    Nothing feels abandoned or ghost-like.
Reference app (for feel, not features): GCash — clean, dependable, every action confirmed
  with clear feedback. SUS usability score of 80.55 in PH market.
Anti-reference: Lamudi — users report "click bait" listings, agents who never respond,
  prices that don't match reality. The opposite of dependable.
```

```
ADJECTIVE: Tapat (Honest/Straightforward)
Research grounding: The #1 scam keyword across 512 voices was "fake" (35+ mentions of
  "fake listing" / "fake ad"). T2's process was cross-referencing every listing, reverse-image-
  searching photos, screenshotting conversations as evidence. Users are exhausted by
  dishonesty. The platform must feel transparent in every interaction.
What it looks like in practice:
  - Copy: Listings show verification level prominently before price. "Hindi pa verified ang
    landlord na ito" is shown honestly, not hidden. Rejection reasons are specific, not vague.
  - UI: No hidden information. Pricing shown upfront (rent + deposit + advance). No
    "contact for price" patterns. Verification badges show exactly what was verified and what
    was not.
Reference app: Carousell Philippines — direct seller-to-buyer, transparent pricing, user
  profiles with ratings. Clean, no-nonsense marketplace feel.
Anti-reference: Facebook Marketplace — zero verification, "reservation fee" scams
  flourishing, impossible to distinguish real from fake.
```

```
ADJECTIVE: Magaan (Light/Easy)
Research grounding: L5 uses Facebook. L3 is 75 years old. The Taglish extraction found
  that Filipino users prefer simplicity over complex features. Google's research shows each
  6 MB increase in app size costs 2% in install conversions in emerging markets. Facebook
  Lite (1.24 MB) is the #1 social app in PH. The entire design must feel effortless.
What it looks like in practice:
  - Copy: Maximum 5 steps for landlord onboarding. Every screen does one thing.
    Instructions in short Taglish sentences, never paragraph-length explanations.
  - UI: Large tap targets (48px minimum). Single primary action per screen. No dropdown
    menus — only direct selection. Skeleton loading on 3G so screens never feel frozen.
Reference app: Facebook Lite — extreme simplicity, works on 3G, minimal RAM usage,
  large touch targets, immediate responsiveness even on budget devices.
Anti-reference: Lamudi full app — feature-heavy, broker-focused, overwhelming navigation
  with buy/sell/rent/commercial categories that confuse the budget rental user.
```

### 1.6 — Name Direction

```
Name: Tira
Root words/meaning: Tagalog "tira" means "to live" or "dwelling place." "Tirahán" =
  home/residence. Short, natural, instantly understood.
Why it resonates: High-frequency word in rental contexts. "Naghahanap ng tirahan" (looking
  for a place to live) is the natural Tagalog phrase every target user would say. Single
  syllable prefix makes it memorable and app-friendly.
URL viability: tira.ph is likely available. tira.com.ph possible. tiraapp.ph as backup.
Risk: Very common word — may have existing uses. Need trademark search.
```

```
Name: Katok
Root words/meaning: Tagalog "katok" means "knock" — as in knocking on a door.
  Represents the moment of connection between tenant and landlord.
Why it resonates: Physical, tactile metaphor that everyone understands. Avoids tech
  jargon. "Kumatok ka na" (go ahead and knock) is a natural invitation.
URL viability: katok.ph likely available. Short and memorable.
Risk: Could feel too casual for landlords. Slightly playful tone.
```

```
Name: Katibayan
Root words/meaning: Tagalog "katibayan" means "proof" or "certification." Root word
  "tibay" = strength/durability. Directly connects to verification.
Why it resonates: Maps perfectly to the trust promise. "May katibayan" = there's proof.
  Uses the language of government documents (barangay clearances use this word).
URL viability: katibayan.ph possible but long for a domain. Could shorten to "katib.ph."
Risk: Seven syllables — too long. Feels bureaucratic rather than warm.
```

```
Name: Sulô
Root words/meaning: Tagalog "sulô" means "torch" or "light." Metaphor for illuminating
  what's hidden in the dark (scams, fake listings).
Why it resonates: Emotional resonance with "HINDI TO SCAM" culture — being a light
  in a market full of darkness. Short, two syllables, distinctive.
URL viability: sulo.ph likely available. Clean, modern.
Risk: Less immediately connected to housing. Requires brand-building to associate with
  rentals.
```

```
Name: Bisig
Root words/meaning: Tagalog "bisig" means "arm" — as in the arm of support. "Bisig ng
  bayan" = arm of the community. Connotes protection and strength.
Why it resonates: Warm, physical, protective. Connects to the emotional driver of safety
  (T1: "Not everyone that lets you in is safe"). Community connotation without being a
  social network.
URL viability: bisig.ph likely available.
Risk: Could be confused with labor union associations ("bisig" has political connotations
  from labor movements). Needs cultural sensitivity check.
```

Naming principle to follow: Use common Tagalog words that a T1-profile user (28, BPO, probinsyano) would use in daily conversation. The name should be pronounceable in one breath, writable in a text message, and immediately communicative without explanation. The Taglish extraction found that target users speak ~70% Filipino, 30% English. The name should live in the Filipino register.

Naming principle to avoid: Do not use English startup naming conventions (dropping vowels, adding "-ly" or "-ify," portmanteau words). The Taglish extraction explicitly marked "platform," "ecosystem," "solution," and "seamless" as taboo marketing language. A name like "RentEase" or "TrustRent" would immediately signal "this was not made for me" to the target user.

---

## SECTION 2: THE TWO-SIDED PROBLEM — SOLVED

### 2.1 — Cold Start Analysis — Philippine-Specific

The standard "get supply first" playbook works here — but only if you understand which supply. L3 fills units in hours through word of mouth. She is not the target landlord. She has a network so dense that a digital platform offers her nothing. L4's son is the target: Makati unit, three months vacant, Facebook not working, no local network. L5 is the target: real pain (midnight runners, slow payments), uses Facebook already, conditional on free — "If it's free, we might use it."

The critical insight from research: 80% of the top 17 marketplace companies focused almost all resources on supply first (Lenny Rachitsky). Thumbtack's founder: "All that matters is supply." For this rental marketplace, supply-first is even more critical because landlords must invest time creating listings and accept stranger risk, while tenants are accustomed to searching anywhere (Facebook, walking neighborhoods, word of mouth).

Why demand acquisition works differently here: T1 (three months, ten viewings) is looking actively on Facebook already. She will keep looking until she finds something or gets scammed again. T3 (one day, community referral) will never search digitally — she is not our target. The target tenant is T1: the migrant without a network, actively searching, currently in pain, willing to pay 3% for escrow (though we will not charge that). The BPO pipeline is the structured acquisition channel: 1.8 million+ workers, provincial job fairs, training batchmates who share housing tips within cohorts.

The dependency map: Before tenant acquisition can start, there must be verified landlord listings in the specific barangays where BPO workers search. The minimum viable supply from research is lower than Airbnb's 300 listings because rentals are searched less frequently (once or twice a year), geographic scope is tighter (specific neighborhoods), and listings are longer-lived. For one Metro Manila corridor: 50–75 verified listings per neighborhood, or approximately 150 total across the launch zone. For the initial cluster (Pasig BPO corridor), the target is 25 verified landlord listings before any tenant marketing begins.

### 2.2 — Landlord First: The Complete Argument

Evidence 1: The Gut Feeling Screening Method (136/165) gives landlords value with zero tenants on the platform. L4 and L5 both explicitly requested tenant screening — L4: "Better background checking. I haven't been very strict with it, but it's important to know a tenant's behavior before they move in." L5: "Especially if it includes a profile of the tenant's background." The single-player value is a digital listing card with a verified owner badge that the landlord can share on Facebook, via Messenger, or as a physical QR code printed on their "For Rent" tarpaulin. Even with zero tenants on the platform, a landlord gets: (a) a verified listing link they can text to inquiring tenants, (b) a badge that signals "this landlord is real" to anyone who clicks, and (c) the future promise of seeing verified tenant profiles before deciding to show the unit.

Evidence 2: L4's son has a Makati unit vacant for three months with Facebook not working and no local network. His pain is not finding tenants — it is finding tenants he can trust from a distance. A verified listing with his ownership proof on file gives him something Facebook cannot: credibility as a real landlord to strangers. When L5 says "If it's free, we might use it," the value proposition is not more tenants (he fills fast). The value proposition is better tenants — tenants with verified IDs, confirmed employment, and profiles he can review before agreeing to a viewing.

Evidence 3: Research finding from RESEARCH_FINDINGS.md Section 3.2 — 80% of top marketplace companies focused on supply first. OpenTable built a reservation management system restaurants used standalone before any diners existed. For this platform, the "OpenTable equivalent" is a shareable verified listing link — a tool landlords can use independently even if no tenants are on the platform yet.

Conclusion: Tenant acquisition begins at exactly 25 verified landlord listings within 3 barangays in Pasig (Ugong, San Antonio, Kapitolyo). This number is derived from the minimum viable supply finding (50–75 per neighborhood at full density) scaled down to "enough to demonstrate the product works" level. At 25 listings, a BPO worker searching "apartment Pasig" would see enough variety (different price points, unit types, locations) to believe the platform has real inventory. Below 25, the empty state problem makes the platform feel dead.

### 2.3 — Single-Player Value Specification

```
SINGLE-PLAYER FEATURE: Verified Listing Link (Shareable Proof Card)
What the landlord does: Creates a listing (5 steps max), uploads government ID and
  property proof, receives verification from ops team (manual review, 24–48 hours).
What they receive: A unique URL (e.g., [app].ph/listing/abc123) that displays their
  listing with a "Napatunayan na" verified badge, property photos, rent details, and a
  "Contact Landlord" button visible only to verified tenants.
Why this has value with zero other users: The landlord can copy this URL and paste it
  into Facebook Marketplace posts, Messenger conversations, or group chats. Instead of
  "DM me for details" in a Facebook Group (which looks identical to scam listings), they
  post a verified listing link that immediately distinguishes them as real. They can also
  print a QR code linking to their listing and tape it next to their physical "For Rent" sign.
  This bridges the offline-online gap that L5 already navigates (he uses both Facebook
  AND physical signs).
Research grounding: L5 uses Facebook to find tenants — FIRST landlord to use Facebook
  in the interview set. The verified listing link makes his Facebook posts MORE effective,
  not less. It is an enhancement to his current behavior, not a replacement. L4's son in
  Makati could text this link to anyone asking about his vacant unit. Eli Chait's analysis:
  single-player mode marketplaces had 10x the capital efficiency of other approaches.
How this creates lock-in: Once a landlord has a verified listing with uploaded photos,
  property proof, and a shareable link, recreating this on another platform requires
  re-uploading everything. The listing link accumulates value over time as it gets shared
  and viewed. The landlord's identity verification (government ID) is not something they
  want to repeat on multiple platforms. The friction of re-verification creates natural
  retention.
```

### 2.4 — Getting the First 20 Landlords

```
LANDLORD ACQUISITION — FIRST 20

Target profile: L4/L5 type (not L1/L2/L3)
Identifying characteristics: Owns 2–10 apartment units or converted residential rooms
  in Pasig, Mandaluyong, or Taguig. Manages personally (no property manager). Collects
  rent in cash. Has a "For Rent" sign or posts in Facebook groups. Does NOT use brokers.
  Does NOT require PDCs. Age range: 35–65. Lives near or at the property. Likely has
  experienced at least one problem tenant (late payment, midnight runner, or damage).

Action 1: Physical walk-through of target barangays
  What: Non-technical founder physically walks Barangays Ugong, San Antonio, Kapitolyo,
    and Oranbo in Pasig. Photographs every "FOR RENT" / "PAUPAHAN" sign. Notes the
    phone number on each sign. Estimates rent range from the neighborhood. Maps the
    density of available units.
  Who does it: Non-technical co-founder
  Expected yield: 8 landlord contacts from signs (assume 60% answer rate = 5 conversations,
    70% match L4/L5 profile = 3–4 qualified landlords)
  Timeline: Day 1 to Day 5
  Script: "Magandang araw po! Nakita ko po yung sign niyo. May ginagawa po kaming
    libre na app para sa mga nagpapaupa — verified yung mga tenant, may background
    profile. Libre lahat. Pwede ko po ba kayong makausap ng 5 minutes?"

Action 2: Facebook Group outreach in rental posting groups
  What: Join the top 5 Facebook Groups for "Apartment for Rent Pasig" and "Room for
    rent near BGC/Ortigas." Identify landlords who post directly (not agents — look for
    personal photos, "For Rent" text, phone numbers). Send direct messages to the 20 most
    recent landlord posts. Offer to create a free verified listing for them.
  Who does it: Non-technical co-founder
  Expected yield: 20 DMs sent, 8 replies (40% response on Facebook is optimistic but
    landlords posting actively are reachable), 5 match L4/L5 profile, 3–4 agree to try.
  Timeline: Day 3 to Day 10
  Script (DM): "Hi po! Nakita ko yung post niyo. May bago po kaming libre na app —
    ang landlord, verified na. May badge po kayo na 'Napatunayan na' para makita ng mga
    nag-hahanap na legit kayo. Gusto niyo po ba i-try? Libre lang po lahat."

Action 3: Barangay office partnership in Ugong and San Antonio
  What: Visit the barangay halls of Ugong and San Antonio, Pasig. Introduce the app to
    the barangay captain or housing committee. Request permission to post a flyer about
    free landlord verification in the barangay hall. Ask for introductions to known landlords
    in the area (barangay officials know every multi-unit property owner in their jurisdiction).
  Who does it: Non-technical co-founder
  Expected yield: 2 barangay visits, 3–5 landlord introductions per barangay = 6–10
    introductions, 4–5 qualified after profile filtering.
  Timeline: Day 5 to Day 15
  Script: "Magandang araw po, kapitan. May libre po kaming verification service para sa
    mga nagpapaupa at umuupa dito. Ang goal po namin, mabawasan ang scam at
    matulungan yung mga tenant na makahanap ng legit na landlord. Pwede po ba kaming
    mag-post ng notice sa hall, at i-refer po ninyo kami sa mga kilala niyong may paupahan?"

Action 4: L5 warm referral chain
  What: L5 (interviewed landlord, Pasig, 4 units) is the closest to an early adopter. If
    the product is free and includes tenant background profiles — his two stated conditions
    — approach L5 directly and offer to be his personal onboarding concierge. After L5 is
    verified, ask: "May kilala po ba kayong ibang landlord na baka interested din? Yung mga
    katabi niyo o sa compound?" Informal landlords in Pasig know each other — compound
    owners, neighboring apartment buildings, and the barangay landlord network.
  Who does it: Either co-founder (whoever conducted the original interview)
  Expected yield: 1 direct (L5) + 2–3 referrals from L5's network = 3–4 landlords
  Timeline: Day 7 to Day 14
  Script: "Kuya/Ate [L5], naalala niyo po yung app na pinag-usapan natin? Ready na po.
    Libre lahat, may tenant background profile na. Pwede ko po ba kayong tulungan
    mag-sign up ngayon?"

Action 5: BPO corridor property canvas around Ortigas Center
  What: Walk the streets within 2km radius of Ortigas Center, specifically along Shaw
    Boulevard and the Pasig-Mandaluyong border where budget apartments cluster near
    BPO offices (Accenture, Concentrix, TaskUs). Target apartment buildings with multiple
    "For Rent" signs. Approach building caretakers or landlords directly.
  Who does it: Non-technical co-founder
  Expected yield: 6 building contacts, 4 conversations, 2–3 qualified landlords
  Timeline: Day 10 to Day 18
  Script: Same as Action 1, with addition: "Maraming BPO worker na naghahanap dito —
    verified na sila sa app. Ang tenant, may ID at employment proof na. Hindi na kutob lang
    ang screening."

Action 6: Church and sari-sari store bulletin board posting
  What: Print simple A4 flyers in Taglish. Post in 10 strategic locations within target
    barangays: sari-sari stores near apartment clusters, church bulletin boards (Sunday mass
    attendance is high), and laundry shops (landlords frequent these). Flyer includes QR code
    to the app and the line: "May libre na verification para sa mga nagpapaupa. I-scan."
  Who does it: Non-technical co-founder
  Expected yield: 10 locations, 2–3 landlords who scan and inquire. Lower conversion but
    builds awareness in the community for word-of-mouth referrals later.
  Timeline: Day 12 to Day 20
  Script (on flyer): "LIBRE: Verified Landlord Badge para sa mga nagpapaupa sa Pasig.
    Makikita ng tenant na legit kayo. I-scan ang QR code. Walang bayad."

Total: 3–4 (Action 1) + 3–4 (Action 2) + 4–5 (Action 3) + 3–4 (Action 4) + 2–3 (Action 5) +
  2–3 (Action 6) = 17–23 landlords. Target: 20.
Total timeline: Day 1 to Day 20
Assumption: Non-technical co-founder is on the ground in Pasig full-time for 20 days.
  Filipino-speaking. Comfortable approaching strangers. Has a working phone with the
  app installed for demo purposes.
If this fails at Action 3 (barangay partnership): Fall back to increasing Action 2 volume —
  expand to 50 Facebook DMs across additional groups (Mandaluyong, Taguig). If Facebook
  outreach also fails (below 10% response rate), pivot to paid Facebook ads targeting
  landlords in Pasig with the hook: "Libre: Verified Landlord Badge. Makikita ng tenant na
  legit kayo."
```

### 2.5 — Geographic Launch Sequence

First cluster: Pasig BPO corridor. Specific barangays: Ugong, San Antonio, Kapitolyo, Oranbo. This cluster was selected because L4 and L5 are both located in Pasig. L3 confirmed demand exceeds supply in BPO areas ("They really have to go around and look because most places are usually full"). The Pasig-Ortigas corridor hosts major BPO employers (Accenture Tower, Robinsons Cybergate, Tektite Towers) generating constant demand from provincial migrant workers. Barangay Ugong specifically has high density of budget apartments (₱3K–8K range) within walking distance of Ortigas Center BPO offices. L4's Pasig unit fills in 3 days — confirming that tenant demand exists here.

The reason for barangay-level specificity: A new marketplace needs density, not breadth. Uber launched only in SF and did not leave until saturated. The platform must feel "full" in one micro-market before expanding. If a T1-profile tenant searches "apartment near Ortigas" and sees 25 verified listings in Ugong, Kapitolyo, and San Antonio, the platform feels alive. If those same 25 listings are scattered across all of Metro Manila, the platform feels dead.

Second cluster: Mandaluyong BPO corridor (Boni, Shaw Boulevard, Greenfield District). Expansion trigger: 50 verified landlord listings in Pasig cluster AND 10 successful verified connections (both phones revealed). This cluster is adjacent to Pasig and shares the same BPO worker pool. Many Ortigas workers live in Mandaluyong due to slightly lower rents. The expansion requires the non-technical founder to replicate Actions 1–6 in Mandaluyong barangays (Barangay Plainview, Addition Hills, Highway Hills).

Third cluster: Makati BPO corridor (Poblacion, Bel-Air adjacent, Pio del Pilar). This is where L4's son's vacant unit is located. Expansion trigger: 100 total verified listings across Pasig + Mandaluyong AND 25 successful connections. Makati has higher rents but also higher BPO concentration (Ayala Avenue, Salcedo Village offices). The BGC-adjacent budget areas (Pio del Pilar, Guadalupe Nuevo) are where BPO workers who cannot afford BGC/Makati CBD actually live.

### 2.6 — The Flywheel — Designed Specifically

The BPO batch distribution vector is the growth engine. When a new BPO hire arrives in Manila, they join a training batch of 15–30 people. These batches spend 4–8 weeks together in intensive training. Housing is the #1 topic of conversation during batch orientation because everyone is simultaneously relocating. One verified tenant in a batch becomes a trusted source for the entire batch.

What makes a verified tenant want to share: The verification ceremony (Section 5.5) is designed to create a shareable moment. When T1's verification completes, the screen shows: "Napatunayan ka na! Hindi mo na kailangan ng kakilala sa Manila." This addresses the deepest emotional pain (loneliness, shame of being a probinsyano without connections). Below this: a "Share sa batchmates mo" button that generates a pre-written Messenger message: "May app na pala na verified ang mga landlord. Hindi scam. [link]"

What sharing looks like: A screenshot of the verified profile badge sent to the batch GC (group chat) on Messenger. BPO training batches always have a Messenger GC. The screenshot shows the tenant's first name, "Verified Tenant" badge, and the app download link. This is not a formal referral — it is the natural behavior of someone who just solved a problem that everyone in the GC also has.

What the referral experience looks like: The batch member clicks the link, sees the landing page ("Mga verified na landlord at tenant — magkakilala na bago mag-meet"), downloads the app, and immediately sees verified listings in their work area (Pasig/Ortigas). The friction is minimal because BPO workers are digitally literate (they use multiple apps daily for work), the app is free, and the social proof from a batchmate is stronger than any ad.

How this creates geographic density: BPO offices cluster in corridors. Workers from the same batch tend to seek housing in the same 3–5 barangays near their office. If 5 workers from a single Accenture Ortigas batch all verify and search in Pasig, that creates 5 repeat visitors to the same landlord listings, generating engagement signals (view counts, connection requests) that keep landlords active and attract more landlords. The batch effect naturally concentrates activity in BPO corridors — exactly where the first landlord cluster is.

### 2.7 — Competitive Defensibility

```
MOAT LAYER 1: Verified Identity Network
What it is: Every user (landlord and tenant) who completes verification creates a
  permanently stored, PhilSys-checked identity record linked to their phone number.
  This is not a feature — it is a growing database of verified Philippine renters and property
  owners that no competitor has.
Why it takes time to replicate: Each verification requires manual review (at MVP),
  document upload, selfie comparison, and property proof for landlords. A competitor
  cannot replicate 500 verified users overnight — each one represents 15–20 minutes of
  ops team work plus the user's own effort. Angkas took years to verify 30,000 riders using
  a similar manual process.
How the product builds this from day one: Every verified user from Day 1 adds to the
  network. The first 100 verified users are the hardest — and the most valuable. By the time
  a competitor notices the product is working, there are already 100+ verified identities
  that would take months to replicate.

MOAT LAYER 2: Localized Trust Data
What it is: Over time, the platform accumulates barangay-level trust data: which
  landlords respond fastest, which areas have the most verified listings, which tenant
  profiles landlords accept most often. This data is invisible to competitors because it
  is generated by platform interactions, not public information.
Why it takes time to replicate: Trust data requires transaction volume. You cannot
  buy it or scrape it. Dormy's 35,000 users generate some data but it is concentrated
  in the student segment near specific universities. BPO corridor data does not exist
  anywhere. The platform that builds it first owns it.
How the product builds this from day one: Every connection request, every landlord
  acceptance/rejection, every listing view creates a data point. By Day 90, the platform
  knows which Pasig barangays have the fastest landlord response times and which
  tenant profiles get accepted most — actionable information that improves the experience
  for every subsequent user.

MOAT LAYER 3: Community Trust Brand (The "Kakilala Substitute" Position)
What it is: The platform occupies the emotional position of "your kakilala in Manila" for
  provincial migrants. This is a brand position, not a feature. Dormy.ph positioned as
  "digital renting." Lamudi positioned as "real estate marketplace." Neither claimed the
  emotional territory of replacing personal connections — because neither understood the
  Kakilala Gap as the core mechanism.
Why it takes time to replicate: Brand positions are earned through user experience, not
  declared through marketing. When 500 BPO workers have used this platform to find
  verified housing, and their batchmates heard about it from them, the platform IS the
  kakilala substitute. A competitor can copy the verification feature but cannot copy 500
  word-of-mouth stories. Airbnb's "belong anywhere" took years of user experience to earn.
How the product builds this from day one: Every verification ceremony uses the Kakilala
  Gap copy: "Hindi mo na kailangan ng kakilala sa Manila." Every shareable moment
  reinforces this position. The brand is embedded in the product, not in advertising.

WHEN DOES THE MOAT BECOME REAL: At approximately 500 verified users (250 landlords
  + 250 tenants) across the Pasig-Mandaluyong corridor, the network effect becomes
  meaningful. At this point, a new landlord joining sees enough verified tenants to justify
  the listing effort, and a new tenant sees enough verified listings to prefer this over
  Facebook. Below 500, the platform is still fragile and copiable.

MOST VULNERABLE PERIOD: Months 1–4, before 500 verified users. During this period,
  Dormy.ph could launch a BPO-focused verification feature and poach the first landlords.
  What must be accomplished before this window closes: 25+ verified landlord listings in
  Pasig, 10+ successful connections with revealed phone numbers, and 5+ organic
  (non-founder-facilitated) verified tenant sign-ups from BPO batch referrals. If the
  flywheel starts — even slowly — before a competitor notices, the head start compounds.
```

### 2.8 — The First 10 Users: White-Glove Protocol

```
FIRST 5 LANDLORDS — WHITE-GLOVE PROTOCOL:

Selection criteria: L4/L5-profile landlords in Barangays Ugong and San Antonio, Pasig.
  Preference for landlords with 3+ units (enough inventory to stay active on the platform).
  Must be cash-collecting, personally-managing landlords — not property managers or
  broker-represented. Ideal: landlord who currently posts on Facebook AND has a physical
  "For Rent" sign (shows both digital comfort and active vacancy).

Outreach: "Kuya/Ate, good morning po. Ako po si [Founder Name]. May libre po kaming
  app para sa mga nagpapaupa — verified yung mga tenant, may background profile, may
  employment confirmation. Libre lahat, walang bayad kahit kailan. Pwede ko po bang
  ipakita sa inyo? 10 minutes lang po."

Onboarding: Founder sits with landlord in person, at the landlord's property.
  Walk-through:
  1. Founder opens the app on landlord's phone (already installed by founder beforehand
     or installed together on the spot).
  2. Founder guides through phone OTP registration — helps enter phone number, read OTP
     aloud, enter code.
  3. Founder walks through profile creation — helps take a selfie if needed, fills in basic
     info together.
  4. Founder photographs the landlord's government ID using the app's camera. Explains:
     "Ito po para makita ng tenant na verified kayo. Hindi ito public — para lang sa
     verification namin."
  5. Founder photographs property proof (tax declaration, barangay certification, or utility
     bill). Explains: "Ito para malaman ng tenant na totoo ang property. Kayo talaga ang
     may-ari."
  6. Founder creates the first listing together — takes photos of the unit, fills in rent,
     location, and unit details.
  7. Founder shows the verification queue: "Iche-check po namin ito within 24 hours.
     Pagka-verified, may badge na kayo."
  Time investment per landlord: 45–60 minutes (onboarding) + 15 minutes (follow-up at
     verification approval).
  What founder observes: Where does the landlord hesitate? What question do they ask
     that the UI does not answer? Do they understand "verified"? Do they trust uploading
     their government ID to the app? What would they change? Does the 5-step flow feel
     like 5 steps or like 15?

Follow-up at Day 3: Phone call. "Kumusta po? Na-verify na po kayo — nakita niyo po ba
  ang badge? May nag-view na po ba ng listing niyo?" If no views: explain this is normal
  (tenant acquisition hasn't started). If views happened: celebrate.
Follow-up at Day 7: Phone call. "May tenant po ba na nag-request ng connection? Kumusta
  ang experience niyo so far? May gusto po ba kayong baguhin sa listing niyo?" If landlord
  has feedback: implement immediately.

What success looks like for landlord #1: Within 14 days, landlord has a verified listing with
  badge, has received at least 1 listing view, and tells the founder "okay lang" or better
  when asked about the experience. Bonus: landlord shares the listing link on their own
  Facebook or Messenger without being asked.

FIRST 5 TENANTS — WHITE-GLOVE PROTOCOL:

Selection criteria: T1/T4-profile tenants currently working at BPO companies in the
  Ortigas/Pasig corridor. Actively searching for housing (within the last 30 days). Provincial
  migrant preferred (no strong Manila network). Ideally from a recent training batch where
  housing is a topic of conversation.

How to find them: Visit co-working spaces and cafes near Robinsons Cybergate (Ortigas),
  where BPO workers on break congregate. Ask: "Naghahanap po ba kayo ng apartment
  nearby? May libre po kaming app — verified ang mga landlord." Alternatively: post in
  BPO-specific Facebook groups ("BPO Workers Manila," "Apartment for Rent near
  Ortigas") and offer to help the first 5 respondents personally.

Outreach script: "Hi! Ako si [Founder]. Gumawa kami ng app para sa mga naghahanap ng
  apartment na galing probinsya, walang kakilala sa Manila. Lahat ng landlord, verified —
  may ID, may property proof. Libre lahat. Pwede kita tulungan mag-sign up ngayon, mga
  5 minutes lang."

Onboarding: Can be remote (phone call + screenshare) or in person (cafe near BPO
  office).
  Walk-through:
  1. Help install app and register via OTP.
  2. Create tenant profile together — name, where they work, when they started.
  3. Upload government ID (help with photo quality — lighting, angle).
  4. Upload selfie (explain: "Para ma-match sa ID mo. Para alam ng landlord na ikaw talaga
     ang nag-apply.")
  5. Upload employment proof (Company ID photo, latest payslip, or COE).
  6. Show them verified listings: "Tingnan mo — lahat ng landlord dito, verified. May badge.
     Alam mo na na legit sila bago ka pa mag-message."
  7. Help send first connection request if a matching listing exists.
  Time investment per tenant: 30 minutes (onboarding) + 10 minutes (follow-up).

Follow-up at Day 3: "Na-verify ka na! Nakita mo na ba ang badge mo? May na-send ka na
  ba na connection request?"
Follow-up at Day 7: "Kumusta? May nagreply na ba na landlord? Anong experience mo so
  far?"

WHAT THESE 10 USERS MUST FEEL BY DAY 14:
Landlords must feel: "Ah, ito pala ang ibig sabihin ng 'verified tenant.' May profile, may ID,
  may trabaho. Hindi lang pangalan sa Messenger." (From the Gut Feeling Screening Method:
  "Hindi na kutob — may data ka na.")
Tenants must feel: "Hindi pala scam to. Totoo ang landlord. May proof na may-ari talaga
  siya. Hindi ko kailangan ng kakilala para malaman kung legit." (From the Kakilala Gap:
  "Hindi mo na kailangan ng kakilala sa Manila.")

HOW THIS TRANSITIONS TO SELF-SERVE:
At 50 total verified users (roughly 20 landlords + 30 tenants), if at least 3 users completed
  onboarding without founder assistance (found the app through a referral link, completed
  verification independently, and sent a connection request), the product can handle self-
  serve onboarding. If all 50 required founder hand-holding, the onboarding flow has a
  critical UX problem that must be fixed before scaling. The milestone that signals self-serve
  readiness: 3 consecutive tenant sign-ups where the founder did not initiate first contact.
```


---

## SECTION 3: MVP FEATURES — BUILD THIS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: phone-otp-registration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: All users — entry point for Displaced Migrant (T1, pain 5/5) and Cash-Strapped Informal Landlord (L5, pain 4/5)
Validation: "If it's free, we might use it." — L5. Zero-friction entry is non-negotiable.
MVP version: Enter Philippine phone number (09XX format), receive 6-digit OTP via PhilSMS, enter OTP, account created. Choose role: landlord or tenant. No email required. No social auth.
NOT at MVP: Email registration, Facebook/Google OAuth, multi-device sync, phone number change flow.
Complexity: Low
Dev time with Claude Code: 3–4 hours (OTP flow + PhilSMS integration + better-auth config)
Tables: users (phone, role, created_at, last_active)
Done when: A real Philippine phone number receives an OTP from PhilSMS, entering it creates a user row in the database with the correct role, and the user is redirected to profile creation.
Depends on: Nothing — this is the first feature built.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: landlord-profile-creation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Cash-Strapped Informal Landlord (L4/L5, pain 3–4/5)
Validation: L5: "Especially if it includes a profile of the tenant's background." — Landlords want to see profiles. They must first have their own profile.
MVP version: Full name, barangay, number of units, profile photo (selfie). All fields on one screen. Maximum 2 minutes to complete.
NOT at MVP: Bio/description text, landlord rating, property portfolio view, social links.
Complexity: Low
Dev time with Claude Code: 2–3 hours (form + DB save + photo upload to R2)
Tables: landlord_profiles (user_id FK, full_name, barangay, unit_count, profile_photo_url, verification_status, created_at)
Done when: Landlord can fill out profile form, upload a selfie, and see their profile saved. Verification status shows "Unverified."
Depends on: phone-otp-registration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: government-id-upload
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Cash-Strapped Informal Landlord (L4/L5) and Displaced Migrant (T1/T4)
Validation: Trust Deadlock (138/165): "NO platform provides a neutral third party where both you AND the landlord can verify each other's identity BEFORE meeting."
MVP version: User selects ID type from list (PhilSys, UMID, Driver's License, Passport, PRC ID, Voter's ID, Postal ID, Senior Citizen ID). Takes photo of front of ID using device camera. Takes selfie for face matching. Both uploaded to PRIVATE R2 bucket via presigned URL. User sees "Sinusuri pa — 24-48 oras" (Under review) confirmation. PDPA consent checkbox required before upload.
NOT at MVP: OCR text extraction, automated face matching, back-of-ID capture, PhilSys QR code scanning, real-time verification.
Complexity: Medium
Dev time with Claude Code: 4–5 hours (camera capture + presigned URL flow + private bucket + consent UI + verification_documents table entry)
Tables: verification_documents (user_id FK, document_type, r2_object_key, selfie_r2_key, status, reviewer_notes, reviewed_by, reviewed_at, created_at)
Done when: User can photograph their ID, take a selfie, both appear in private R2 bucket, a verification_documents row is created with status 'pending', and the admin dashboard shows this in the review queue.
Depends on: landlord-profile-creation or tenant-profile-creation (whichever the user is)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: property-proof-upload
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Cash-Strapped Informal Landlord (L4/L5, pain 3–4/5)
Validation: Scam pattern documentation: "Fake Landlord/Agent Scam — Scammer poses as owner using stolen photos, collects advance + deposit." Property proof is what separates real landlords from scammers.
MVP version: Landlord selects proof type (land title, tax declaration, barangay certification, building administrator letter, utility bill with address, lease-to-rent authorization). Photographs document. Uploaded to PRIVATE R2 bucket. Status set to 'pending.' Clear Taglish instructions: "I-picture ang document na nagpapatunay na ikaw ang may-ari o may karapatan sa property."
NOT at MVP: Multiple property proofs per listing, document expiry tracking, automated address matching between proof and listing.
Complexity: Medium
Dev time with Claude Code: 2–3 hours (reuses presigned URL pattern from government-id-upload)
Tables: verification_documents (same table, different document_type value: 'property_proof')
Done when: Landlord can upload a property proof document, it appears in private R2, verification_documents row created, admin can see it in the queue alongside the government ID.
Depends on: government-id-upload (must have government ID uploaded first)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: manual-verification-queue
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Internal ops — serves all verified landlords and tenants indirectly
Validation: Research finding: "Manual verification first, automation later. Every successful platform startup personally reviewed early users." Angkas: manual review (~2 days) for 30,000+ riders. Grab PH: in-person document verification at Grab office.
MVP version: Web-only admin dashboard. Shows list of pending verifications sorted by submission date. For each: (1) display government ID photo via signed URL (1-hour expiry), (2) display selfie via signed URL, (3) display property proof if landlord, (4) side-by-side view for manual face comparison, (5) approval button (sets status to 'verified'), (6) rejection button with required reason text field (sets status to 'rejected', triggers SMS notification to user). Admin must have user.role = 'admin.'
NOT at MVP: AI face matching, automated document OCR, batch processing, reviewer assignment workflow, second-reviewer requirements, audit trail beyond basic timestamps.
Complexity: Medium-High
Dev time with Claude Code: 5–6 hours (admin routes with auth guard + signed URL display + approval/rejection logic + SMS notification on rejection)
Tables: verification_documents (status updates), landlord_profiles or tenant_profiles (verification_status update), users (for admin role check)
Done when: Admin can log in, see a queue of pending verifications, view uploaded documents securely, approve or reject each one, and the user's verification_status updates accordingly. On rejection, user receives an SMS with reason.
Depends on: government-id-upload, property-proof-upload
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: listing-creation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Cash-Strapped Informal Landlord (L4/L5, pain 3–4/5)
Validation: T4: "Everything would just be in one place so it's all online and there's no more going back and forth."
MVP version: Single form screen: unit type (apartment, room, bedspace), monthly rent (₱), barangay/area, number of beds/rooms, inclusions (water, electricity, WiFi — checkboxes), brief description (max 200 characters), available date. Listing saved as 'draft' until landlord is 'verified' — then auto-published. Listing only visible in search when landlord verification_status = 'verified.'
NOT at MVP: Map pin placement, virtual tours, floor plans, amenity icons, featured/promoted listings, draft auto-save, listing templates.
Complexity: Low-Medium
Dev time with Claude Code: 3–4 hours (form + validation + DB + conditional visibility logic)
Tables: listings (landlord_profile_id FK, unit_type, monthly_rent, barangay, beds, rooms, inclusions JSONB, description, available_date, status, created_at, updated_at, last_active_at)
Done when: Verified landlord can create a listing, it appears in search results with correct details, unverified landlord's listing exists in DB but does not appear in tenant search.
Depends on: landlord-profile-creation, manual-verification-queue (listing visibility depends on verification status)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: listing-photo-upload
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Cash-Strapped Informal Landlord (L4/L5)
Validation: Airbnb founding insight: Professional photos are "trust infrastructure" and the #1 conversion variable. Scam pattern: "Ghost Property Scam — Property doesn't exist; generic photos, vague locations." Real photos of the actual unit are a primary trust signal.
MVP version: Upload 1–5 photos. Client-side compression to under 500KB each (3G consideration — data costs ₱50–90/week for many users). Upload to PUBLIC R2 bucket via presigned URL. Photos display in listing detail view as a horizontal swipeable gallery.
NOT at MVP: Photo reordering, photo editing/cropping, professional photo service, watermarking, photo quality checks, panoramic/360 views.
Complexity: Low-Medium
Dev time with Claude Code: 3–4 hours (image picker + client compression + presigned URL + gallery component)
Tables: listing_photos (listing_id FK, r2_object_key, display_order, created_at)
Done when: Landlord can upload photos, they appear compressed in the listing detail view, and the listing card in search shows the first photo as thumbnail.
Depends on: listing-creation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: listing-status-management
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Cash-Strapped Informal Landlord (L4/L5)
Validation: Quora complaint about Lamudi: "most of the times the listing owner will send a standard reply — oh its already rented out." Stale listings destroy trust. L3 fills in hours — units become unavailable fast.
MVP version: Landlord can toggle listing between three states: 'active' (visible in search), 'paused' (hidden, tenant connections preserved), 'rented' (hidden, archived). Auto-pause after 30 days of no landlord login (listing shows "Matagal nang walang update" before pausing). SMS notification before auto-pause: "Aktibo pa ba ang listing mo? I-open ang app para i-update."
NOT at MVP: Automatic listing renewal, listing scheduling, seasonal pricing, listing duplication for multiple units.
Complexity: Low
Dev time with Claude Code: 2 hours (status toggle + auto-pause cron job + SMS trigger)
Tables: listings (status field update), landlord_profiles (last_active tracking)
Done when: Landlord can pause/activate their listing from the app, auto-pause triggers after 30 days of inactivity with prior SMS warning, and paused listings do not appear in tenant search.
Depends on: listing-creation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: tenant-connection-inbox
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Cash-Strapped Informal Landlord (L4/L5)
Validation: L4: "Better background checking." L5: "Especially if it includes a profile of the tenant's background." The inbox is where landlords see and evaluate tenant connection requests.
MVP version: List of incoming connection requests. Each shows: tenant name, verified badge status, employment type (BPO, student, other), an optional short message from the tenant, and timestamp. Landlord can tap to view full tenant profile (see tenant-profile-creation). Two action buttons: "Tanggapin" (Accept) and "Tanggihan" (Decline). On accept: both phone numbers revealed (see mutual-verified-connection-reveal).
NOT at MVP: In-app messaging, conversation threads, read receipts, search/filter within inbox, bulk actions, notification preferences.
Complexity: Medium
Dev time with Claude Code: 4–5 hours (inbox list UI + tenant profile view + accept/decline logic + connection creation)
Tables: connection_requests (tenant_profile_id, listing_id, landlord_profile_id, message, status, created_at, responded_at), connections (tenant_user_id, landlord_user_id, listing_id, tenant_phone, landlord_phone, connected_at)
Done when: Landlord sees a list of tenant requests, can view each tenant's profile, can accept or decline, and on acceptance the connection is recorded in the database.
Depends on: landlord-profile-creation, connection-request-submission (tenant side)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: tenant-phone-otp-registration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Displaced Migrant (T1, pain 5/5) and Scam-Wary Digital Searcher (T4, pain 3/5)
Validation: T1: 3 months of searching, almost scammed twice. The entry point must feel safe and fast.
MVP version: Identical to phone-otp-registration but user selects 'tenant' role. Same PhilSMS OTP flow. Same 6-digit code, 10-minute expiry, 3 attempts before lockout.
NOT at MVP: Separate from landlord registration — same underlying system, different role selection.
Complexity: Low (already built — reuses phone-otp-registration)
Dev time with Claude Code: 0.5 hours (role selection screen addition to existing flow)
Tables: users (same table, role = 'tenant')
Done when: Tenant can register with phone number, receive OTP, and be created as a tenant user.
Depends on: phone-otp-registration (shared infrastructure)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: tenant-profile-creation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Displaced Migrant (T1/T4)
Validation: Gut Feeling Screening Method (136/165): Landlords need "data, not kutob." The tenant profile IS the screening tool landlords asked for.
MVP version: Full name, barangay/area where searching, employment type (BPO employee, student, office worker, freelancer, other), company/school name (optional but strongly encouraged), profile photo (selfie). Single screen.
NOT at MVP: Bio text, housing preferences, move-in timeline, roommate preferences, salary range, references list.
Complexity: Low
Dev time with Claude Code: 2 hours (form + DB + photo upload reusing existing pattern)
Tables: tenant_profiles (user_id FK, full_name, search_barangay, employment_type, company_name, profile_photo_url, verification_status, created_at)
Done when: Tenant has a profile with photo that a landlord could view and assess.
Depends on: tenant-phone-otp-registration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: government-id-and-selfie-upload
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Displaced Migrant (T1/T4)
Validation: Trust Deadlock: Both sides must verify to the platform. T2 already does manual verification — "asked landlords for valid IDs and cross-checked social media." The platform formalizes what users already try to do manually.
MVP version: Same as government-id-upload for landlords. Tenant selects ID type, photographs front, takes selfie. Uploaded to PRIVATE R2 bucket. PDPA consent checkbox required. Status: 'pending.'
NOT at MVP: Automated face matching, ID OCR, back-of-ID capture.
Complexity: Low (reuses landlord government-id-upload infrastructure entirely)
Dev time with Claude Code: 1 hour (UI adapted for tenant flow, same backend)
Tables: verification_documents (same table, linked to tenant user_id)
Done when: Tenant's ID and selfie are in private R2, verification_documents row exists with status 'pending', appears in admin queue.
Depends on: tenant-profile-creation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: bpo-employment-verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Displaced Migrant (T1/T4) — specifically the BPO fast path
Validation: Research finding: "BPO workers can prove employment via Certificate of Employment (COE), Company ID, latest payslips, BIR Form 2316, bank statements, SSS contribution records." These are documents BPO workers already have — required for employment.
MVP version: Tenant selects employment proof type (Company ID, latest payslip, Certificate of Employment, school ID + enrollment form for students). Photographs document. Upload to PRIVATE R2 bucket. Status: 'pending.' Manual review by ops team. On approval, tenant verification_status advances to 'verified' (both ID and employment confirmed).
NOT at MVP: Automated employment verification via API, HR department direct verification, salary amount extraction, employment history tracking.
Complexity: Low-Medium
Dev time with Claude Code: 3 hours (document type selector + upload flow + verification status logic — requires both ID AND employment to reach 'verified')
Tables: verification_documents (document_type = 'employment_proof'), tenant_profiles (verification_status updated to 'verified' only when BOTH government ID AND employment proof are approved)
Done when: BPO worker can upload Company ID or payslip, it appears in admin queue, and when admin approves both government ID and employment proof, tenant_profiles.verification_status becomes 'verified.'
Depends on: government-id-and-selfie-upload
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: listing-search-browse
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Displaced Migrant (T1/T4)
Validation: T4: "Everything would just be in one place." T1: 3 months of searching across multiple platforms. Centralized, filtered search is the core tenant experience.
MVP version: Search screen with filters: barangay/area (text input with suggestions for launch zone barangays), price range (₱ min–max), unit type (apartment/room/bedspace). Results show listing cards sorted by freshness (most recently active first). Each card: first photo thumbnail, monthly rent, barangay, unit type, landlord verified badge. Only listings where landlord_profiles.verification_status = 'verified' appear. Pagination (not infinite scroll — 3G performance). Empty state: "Wala pang listing sa area na ito. Subukan ang kalapit na barangay."
NOT at MVP: Map view, GPS-based search, saved searches, search alerts, sorting options beyond freshness, distance calculation.
Complexity: Medium
Dev time with Claude Code: 5–6 hours (search API with filters + listing card component + pagination + empty state)
Tables: listings (read with joins to landlord_profiles for verification check and listing_photos for thumbnail)
Done when: Tenant can search by area and price, see a list of verified listings with photos, and the list correctly excludes unverified landlords.
Depends on: listing-creation, listing-photo-upload, manual-verification-queue
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: listing-detail-view
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Displaced Migrant (T1/T4)
Validation: This is the make-or-break screen. See Section 7.5. T1 was almost scammed twice by fake listings. The detail view must communicate trust before anything else.
MVP version: Full photo gallery (swipeable), landlord verified badge prominently displayed, landlord name with profile photo, monthly rent, deposit/advance info, barangay, unit type, rooms/beds, inclusions list, description, available date, listing freshness indicator ("Aktibo ngayon" / "3 araw na"), "Request to Connect" button (visible only if tenant is verified), anti-scam copy: "Ang landlord na ito ay napatunayan na — may verified ID at property proof."
NOT at MVP: Map embed, neighborhood info, commute calculator, similar listings, save/bookmark, share button, viewing scheduler.
Complexity: Low-Medium
Dev time with Claude Code: 3–4 hours (detail screen layout + data fetching + conditional CTA)
Tables: listings (read), listing_photos (read), landlord_profiles (read for badge and name)
Done when: Tenant can tap a listing card, see full details with photos, see the landlord's verified badge, and see the "Request to Connect" button if they are verified.
Depends on: listing-search-browse
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: connection-request-submission
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Displaced Migrant (T1/T4)
Validation: T1: "Communication is #1 pain" — faster landlord communication matters more than expected. The connection request is the action that initiates contact.
MVP version: On listing detail view, verified tenant taps "Mag-connect." Optional short message field (max 200 characters — e.g., "Hi po! BPO worker po ako sa Ortigas. Interested po sa unit niyo."). Submission creates a connection_request row. If tenant is NOT verified, button shows "I-verify muna ang profile mo" and links to verification flow. Confirmation: "Na-send na! Hihintayin ang sagot ng landlord." Push notification sent to landlord.
NOT at MVP: Multiple connection requests to same listing, request scheduling, preferred viewing times, auto-generated introduction message.
Complexity: Low
Dev time with Claude Code: 2–3 hours (button + optional message + API call + notification trigger)
Tables: connection_requests (tenant_profile_id, listing_id, landlord_profile_id, message, status='pending', created_at)
Done when: Verified tenant can send a connection request with an optional message, landlord receives a push notification, and the request appears in the landlord's inbox.
Depends on: listing-detail-view, tenant verification (tenant must be 'verified')
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: application-message
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Displaced Migrant (T1/T4)
Validation: T1: communication is #1 pain. A short personal message gives landlords context beyond the profile — "hindi lang pangalan sa Messenger" but a real person with a real situation.
MVP version: Integrated into connection-request-submission as optional message field. Not a separate feature — it is the message field on the connection request screen. Pre-populated suggestions in Taglish: "BPO worker po ako, naghahanap ng malapit sa office" or "Student po, stable ang budget."
NOT at MVP: Multi-message threads, in-app chat, message templates library, voice messages.
Complexity: Included in connection-request-submission
Dev time with Claude Code: 0 additional hours (part of connection-request-submission)
Tables: connection_requests.message field
Done when: Message appears alongside the connection request in the landlord's inbox.
Depends on: connection-request-submission
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: mutual-verified-connection-reveal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: All primary users — this is the core product moment
Validation: Trust Deadlock (138/165): "Both sides verify to platform, not to each other." This is the moment the deadlock breaks — when both verified strangers receive each other's phone numbers and can arrange an in-person viewing.
MVP version: When landlord accepts a connection request: system checks BOTH landlord_profiles.verification_status = 'verified' AND tenant_profiles.verification_status = 'verified' AND connection_requests.status = 'accepted'. Only when ALL THREE are true: create a connections row containing both phone numbers. Tenant sees: landlord's phone number + "Tawagan mo na ang landlord!" Landlord sees: tenant's phone number + "Pwede mo nang tawagan ang tenant." This is the verification ceremony moment (Section 5.5 / 9.5). Push notification to both parties.
NOT at MVP: In-app calling, viewing scheduling, meeting point suggestions, connection expiry, connection ratings.
Complexity: Medium-High (security-critical — must be reviewed manually before commit)
Dev time with Claude Code: 6–8 hours (reveal logic + security validation + ceremony screen + notifications + manual security audit)
Tables: connections (tenant_user_id, landlord_user_id, listing_id, tenant_phone, landlord_phone, connected_at), connection_requests (status updated to 'accepted')
Done when: Two verified users complete the connection flow and both see the other's real phone number. Zero way to extract phone numbers without both parties being verified. Security review confirms no API bypass path exists.
Depends on: tenant-connection-inbox (landlord accept action), both verification systems
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: verified-badge-display
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: All users — core trust signal
Validation: Primary trust signal for the entire product. "Napatunayan na" badge. Airbnb: "Verified ID" drove 50% of guests to visit host profiles pre-booking. Dormy.ph's tiered trust system (semi-verified → fully-verified → Partner) demonstrates the concept works in PH rental.
MVP version: VerifiedBadge component with 4 states: 'verified' (green checkmark + "Napatunayan"), 'pending' (yellow clock + "Sinusuri pa"), 'partial' (half-green + "Partial — may kulang pa"), 'unverified' (gray outline + no label). Appears on: listing cards, listing detail, tenant profile view in landlord inbox, landlord profile on listing, and the user's own profile screen.
NOT at MVP: Badge levels (bronze/silver/gold), verification score, verification history, re-verification requirements.
Complexity: Low
Dev time with Claude Code: 4–5 hours (component creation + integration across 5+ screens)
Tables: landlord_profiles.verification_status, tenant_profiles.verification_status (read-only for display)
Done when: Badge appears correctly in all 4 states across listing cards, listing detail, tenant profile view, and user's own profile.
Depends on: manual-verification-queue
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: listing-freshness-indicator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Displaced Migrant (T1/T4)
Validation: Lamudi Quora complaint: "Lamudi is not at all updated and most of the times the listing owner will send a standard reply — oh its already rented out." Stale listings are the #2 trust killer after scams.
MVP version: Taglish freshness labels based on listing.last_active_at: within 24 hours = "Aktibo ngayon" (green), 1–7 days = "Kamakailan lang" (blue), 8–30 days = "Medyo matagal na" (yellow), 30+ days = auto-paused, not shown in search. Label displayed on listing card and listing detail view.
NOT at MVP: Last response time tracking, "usually responds within X hours" indicators, landlord online status.
Complexity: Low
Dev time with Claude Code: 2 hours (date comparison logic + label component + auto-pause cron)
Tables: listings.last_active_at (read for display, write on landlord login/listing edit)
Done when: Every listing card shows the correct freshness label, and listings inactive for 30+ days are automatically hidden.
Depends on: listing-creation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: scam-report-mechanism
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Scam-Wary Digital Searcher (T1/T4) and Cash-Strapped Informal Landlord (L4/L5)
Validation: Research: Philippines ranks 2nd globally for digital fraud rate at 13.4%. 67% of Filipinos encounter scams monthly. A report mechanism is the minimum viable safety net. Lamudi has zero visible reporting mechanism — "They don't delete the identified fraudulent accounts."
MVP version: "I-report" button on listing detail view and on user profiles. Report type selector: "Pekeng listing" (fake listing), "Scam attempt," "Hindi totoo ang identity" (identity fraud), "Iba pa" (other) with free text. Report creates a row in reports table. Email notification to ops team (via Resend). Reported listing/user NOT automatically hidden — ops team reviews first. User sees: "Natanggap na ang report mo. Iche-check namin ito."
NOT at MVP: Auto-hiding reported listings, report status tracking for reporter, appeal process, automated scam detection, IP blocking.
Complexity: Low
Dev time with Claude Code: 3 hours (report form + API + email notification + admin queue view)
Tables: reports (reporter_user_id, reported_user_id, reported_listing_id, report_type, description, status, created_at, reviewed_at, reviewed_by)
Done when: User can submit a report, it appears in admin queue, ops team receives email notification.
Depends on: listing-detail-view
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: admin-verification-dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Ops team (founders at MVP)
Validation: Angkas, Grab PH: manual review by staff for all early users. Research: "Manual verification first, automation later."
MVP version: Web-only dashboard (not mobile). Two main views: verification queue (pending reviews) and completed reviews (approved/rejected history). Each pending item shows: user type (landlord/tenant), submitted documents via signed URLs, submission timestamp, user profile info. Approve button, reject button with required reason field. Dashboard shows count of pending items.
NOT at MVP: Reviewer assignment, SLA tracking, batch operations, statistics/analytics, second reviewer requirement.
Complexity: Medium (covered under manual-verification-queue — this is the same feature from the admin perspective)
Dev time with Claude Code: 0 additional (built as part of manual-verification-queue)
Tables: Same as manual-verification-queue
Done when: Same as manual-verification-queue acceptance criteria.
Depends on: manual-verification-queue
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEATURE: admin-report-queue
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avatar: Ops team (founders at MVP)
Validation: Carousell (after acquiring OLX Philippines) deployed "dedicated fraud detection teams." At MVP scale, this is the founding team reviewing reports manually.
MVP version: Web-only. List of submitted reports. Each shows: report type, reported listing/user, reporter info, report text, timestamp. Admin can mark report as: 'reviewed — action taken' (listing removed or user suspended), 'reviewed — no action,' or 'escalated' (for legal/police referral). Admin can deactivate a listing or suspend a user directly from the report view.
NOT at MVP: Automated fraud detection, report categorization AI, reporter feedback on outcome, appeal workflow.
Complexity: Low-Medium
Dev time with Claude Code: 3 hours (report queue view + action buttons + listing deactivation + user suspension)
Tables: reports (status update), listings (status → 'removed'), users (is_suspended flag)
Done when: Admin can view reports, take action (deactivate listing or suspend user), and mark reports as reviewed.
Depends on: scam-report-mechanism
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


---

## SECTION 4: FEATURES NOT TO BUILD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: GCash/Maya Integration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: GCash has 81 million monthly active users in the Philippines. It is the dominant digital payment platform. Any app serving Filipino users should integrate GCash.
Why it's cut: 0/5 interviewed landlords use GCash for rent collection. 3/5 are cash only. 2/5 use postdated checks. The informal landlord segment physically collects cash in person. GCash appeared in research primarily as a scam payment vector — "requesting reservation fees via GCash" — not as a rent collection tool. T4 explicitly: "If there's a fee, they won't go there."
Engineering cost avoided: 40–80 hours (payment API integration, reconciliation, edge cases, refund handling, PCI compliance considerations).
When to reconsider: When 50+ landlords independently request digital payment collection through the app. Not before. Do not add because it seems logical. Add when the users demand it.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Automated Rent Collection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Late payments are pain for L4 and L5. Automated reminders and digital collection could solve this.
Why it's cut: Cash is king. 0/5 landlords use digital payments. The Hiya Collection Trap mechanism scored 2/5 on MVP Deliverability because automated collection requires digital payment infrastructure that does not exist in this market. The Unique Mechanism Evaluator flagged this explicitly: "aspirational, not launchable."
Engineering cost avoided: 60–100 hours (payment integration, recurring billing logic, reminder system, partial payment handling, receipt generation).
When to reconsider: Phase 2, after core verification is proven and digital comfort increases among landlords. Earliest: month 8–12.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Escrow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: T1 said she would pay 3% for reservation protection. Holding deposits in escrow protects both sides.
Why it's cut: Weak signal — 1/4 tenants yes (T1, informal), 1/4 no (T2, formal), 2/4 not asked. L5 conditioned all interest on "if it's free." Escrow requires money movement through the platform, regulatory compliance (BSP e-money license potentially), and trust that the platform itself is trustworthy enough to hold money. At zero users, the platform has no credibility to hold anyone's money. The cash-dominant informal market is not ready for this.
Engineering cost avoided: 80–120 hours (escrow account management, BSP compliance research, refund logic, dispute resolution system, trust accounting).
When to reconsider: After 500+ successful verified connections AND 10+ user requests for deposit protection. Earliest: month 12.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Deposit Protection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Online forums (especially expat forums) show deposit non-return as a major pain point.
Why it's cut: Dead hypothesis. 0/5 landlords and 0/4 tenants reported deposit disputes across 9 interviews. The Mass Desires research confirmed: "Online deposit complaints come overwhelmingly from expats and formal-market renters. The target market (Filipino informal renters) does not share this pain." The deposit amounts in the ₱3K–8K informal segment are small enough that disputes are absorbed rather than fought.
Engineering cost avoided: 40–60 hours.
When to reconsider: NEVER. This is a non-feature. Do not add to any future roadmap.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Review/Rating System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Airbnb's review system is central to trust. A host without reviews is ~4x less likely to get a booking.
Why it's cut: Zero users = zero reviews = zero signal = looks like a ghost platform. This makes trust WORSE not better at launch. Research finding: Airbnb reached the review tipping point at approximately 10 reviews per host — that requires hundreds of transactions. At MVP with 20 landlords, each would need 10 completed stays to generate meaningful reviews. That takes months at best. Verified identity badges are the trust signal for a new marketplace. Reviews come later.
Engineering cost avoided: 30–50 hours.
When to reconsider: After 100+ successful verified connections where some landlords have had multiple tenants. Month 6–8 at earliest.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: AI-Powered Matching
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: ML-based tenant-landlord matching could optimize the connection process.
Why it's cut: At 20 landlord listings and 30 tenant profiles, a simple barangay + price filter does the same job as any ML model. AI matching requires data — hundreds of successful matches to learn from. The MVP will not have this data for months. The engineering time is better spent on the verification system.
Engineering cost avoided: 60–100 hours (model development, training data, recommendation engine, feedback loop).
When to reconsider: After 1,000+ verified users and 200+ successful connections. Month 12+ at earliest.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Map/GPS Integration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Tenants search by location. A map showing listing pins would be natural.
Why it's cut: Map integration requires Google Maps API (₱₱₱ at scale), increases app size significantly (Google Maps SDK adds 15–20 MB to APK — the target is under 15 MB total), and demands more data bandwidth than the 3G constraint allows. At launch with 25 listings in 3 barangays, a text-based area filter is sufficient. Google research: each 6 MB increase in app size costs 2% in install conversions.
Engineering cost avoided: 20–30 hours.
When to reconsider: When geographic coverage exceeds 10 barangays and users report difficulty finding listings by area name alone.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Full In-App Messaging System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Tenants and landlords need to communicate. In-app chat would keep them on the platform.
Why it's cut: Research finding on disintermediation — rental marketplaces face the highest disintermediation risk of any marketplace type. Once phone numbers are revealed, communication moves to phone calls and Messenger (the Filipino default). Building a chat system competes with Messenger (105 million Filipino users) and adds massive engineering complexity (real-time messaging, notifications, message storage, read receipts). The product's value is the verified connection — not the ongoing conversation. T1 said communication is the #1 pain, but the pain is about response TIME from landlords, not about the communication channel.
Engineering cost avoided: 80–120 hours.
When to reconsider: Only if disintermediation becomes a measurable revenue problem. This requires the platform to have revenue — which is Phase 2+.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Advanced Push Notifications
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Users should be notified of new listings, price drops, and relevant activity.
Why it's cut: At MVP, only two notifications matter: (1) "May nagpadala ng connection request" → landlord, (2) "Tinanggap na ang request mo" → tenant. Everything else is noise that desensitizes users. Filipino users already receive heavy notification volume from GCash, Messenger, and other apps.
Engineering cost avoided: 20–30 hours.
When to reconsider: After 100+ active users, when notification preferences become meaningful.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Digital Contract Generation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Informal rentals lack written contracts. A standardized digital lease template would add value.
Why it's cut: The platform is not a legal service. L3, L4, L5 operate without written contracts and manage through personal relationships and barangay mechanisms. Introducing contracts adds legal liability for the platform and crosses into territory that requires legal review (Rent Control Act, DHSUD regulations). The platform's role is verification, not documentation.
Engineering cost avoided: 30–40 hours.
When to reconsider: Month 6+, after legal counsel advises on liability exposure, and only as a downloadable template — not an enforceable contract.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Formal Background Check API (Sumsub/etc at Launch)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Automated KYC would be faster and more scalable than manual review.
Why it's cut: Cost. Sumsub = $1.35/verification ($149/month minimum). Veriff = $0.80+ ($49/month minimum). At MVP with 50 verifications, that is $67–$250 before the platform has revenue. PhilSys QR verification is FREE. Manual review by the founding team costs $0. Research finding: "Skip all paid KYC APIs. Use PhilSys QR verification (free) + manual review by founding team for the first 500 users."
Engineering cost avoided: 20–30 hours (API integration, webhook handling, status reconciliation).
When to reconsider: When verification volume exceeds 200/month and manual review becomes a bottleneck. Estimated: month 4–6. At that point, ID Analyzer at $0.089/verification ($89/month for 1,000) is the budget option.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Property Management Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: L2 explicitly wanted management tools. OFW landlords need remote management.
Why it's cut: L2 is not our target user. L2 uses PDCs, has zero late payments, and is professionally managed. The target users (L4/L5) manage 4–10 units personally, collect cash, and do not need a dashboard — they need better tenants. The Family Manager Trap mechanism scored 2/5 on MVP Deliverability. Property management is Phase 2 for OFW landlord expansion.
Engineering cost avoided: 60–100 hours.
When to reconsider: Month 6+, when OFW landlord acquisition begins (Section 2.5, third cluster expansion).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Landlord Analytics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Landlords would want to see how many views their listing gets, conversion rates, and market insights.
Why it's cut: At 25 listings and 30 tenants, analytics are meaningless noise. L5 tracks in a notebook. L3 tracks mentally. Analytics serve sophisticated users (L1, L2) who are not the target.
Engineering cost avoided: 20–30 hours.
When to reconsider: When 100+ landlords are active and some start asking "how many people saw my listing."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Referral/Rewards Program
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Referral programs drive viral growth. GCash grew through referral bonuses.
Why it's cut: The platform is free. There is nothing to discount or reward. The BPO batch distribution mechanism (Section 2.6) IS the referral program — it is designed into the verification ceremony, not bolted on as a feature. A formal referral program at zero revenue would cost money the platform does not have.
Engineering cost avoided: 20–30 hours.
When to reconsider: When the platform has revenue to fund referral incentives. Phase 2+.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Social/Community Features
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Building community could increase retention and create a moat.
Why it's cut: Facebook already owns community. 105 million Filipino users. BPO workers have Messenger GCs for their training batches. Building a social feature competes with the most entrenched social platform on earth in its most penetrated market. The platform's identity is trust infrastructure, not a social network. Every community feature dilutes the focus on verification.
Engineering cost avoided: 60–100 hours.
When to reconsider: NEVER for social features within the app. Consider external community (e.g., a curated Facebook Group) for post-launch engagement, but this is marketing, not product.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Video Listing Tours
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Video shows the unit better than photos. TikTok-style property tours are trending.
Why it's cut: Video bandwidth on 3G is prohibitive. The average Philippine mobile data plan is ₱50/week for 2GB. A single 30-second video at 720p is 15–30MB. Five video listings could consume a user's entire weekly data plan. Photos compressed to under 500KB are the 3G-compatible solution.
Engineering cost avoided: 30–40 hours.
When to reconsider: When Philippine average mobile speeds exceed 50 Mbps consistently and data costs drop below ₱0.30/GB.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Calendar/Availability Management
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Landlords could show when units become available. Tenants could book viewings.
Why it's cut: This is an Airbnb feature for short-term stays with variable availability. Long-term rentals are either available or they are not. L3/L4/L5 know their unit is available when the tenant leaves — there is no calendar complexity. Viewing scheduling happens via phone call after the connection reveal.
Engineering cost avoided: 20–30 hours.
When to reconsider: NEVER for MVP or V2. This solves a problem that does not exist in long-term informal rentals.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Price Recommendation Engine
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Helping landlords price correctly could attract more listings and help tenants find fair deals.
Why it's cut: No reliable rent data exists for the informal segment. Lamudi data covers formal condos (₱20K+). Government data covers regulated housing. The ₱3K–8K apartment segment has no structured pricing data. Building a recommendation engine on zero data is impossible. L5 knows his market better than any algorithm.
Engineering cost avoided: 40–60 hours.
When to reconsider: After 500+ listings with rent data, the platform has enough data to build meaningful price benchmarks. Month 12+.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Desktop-First Interface
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Desktop provides more screen real estate for browsing and comparison.
Why it's cut: 98.5% of Philippine internet access is via phone. Android has 90%+ market share. The target user (BPO worker on ₱18K–25K salary) accesses the internet on a budget phone, not a desktop. The web version exists (Next.js) but is secondary to mobile. Web is for SEO/Google discoverability and admin dashboard — not for the primary user experience.
Engineering cost avoided: Not about cost — about priority. Every hour spent polishing desktop is an hour not spent on mobile 3G optimization.
When to reconsider: When web traffic exceeds 30% of total traffic, indicating desktop users exist.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXCLUDED: Deposit Dispute Resolution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Why it seems logical: Deposit disputes seem like a natural rental marketplace feature.
Why it's cut: Dead hypothesis. 0/5 landlords, 0/4 tenants, 9 interviews total, ZERO deposit disputes reported. The Mass Desires research confirmed: deposit complaints come from expats and formal-market renters, not the target informal segment. The Unique Mechanism Evaluator did not even produce a mechanism around deposits because the data does not support it.
Engineering cost avoided: 40–60 hours.
When to reconsider: NEVER. This is not a future feature. It is a non-feature. Do not mention it in any roadmap, pitch deck, or feature request list. The data is clear.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


---

## SECTION 5: THE VERIFICATION SYSTEM

### 5.1 — Verification Philosophy

"Verified" in this market does not mean "guaranteed safe." It means: this person has been identified by the platform using a government-issued ID, and their claimed identity matches their face. For landlords, it additionally means: this person has provided proof that they own or have authorization to rent the property at the listed address.

For a 28-year-old BPO agent from Leyte with no rental history (T1 profile): She can prove her identity (PhilSys National ID — 90.7 million Filipinos registered as of December 2025, ~80% coverage), her employment (Company ID, payslip, or Certificate of Employment — all legally mandated for BPO employers to provide within 3 days), and her residence (she is currently in a transient/bedspace arrangement, so current address proof is weak). She CANNOT prove rental history because it does not exist. She cannot prove she will pay on time because no credit system exists for informal rentals. What "verified" makes possible for her: a landlord in Pasig sees her profile with a green "Napatunayan" badge, sees she works at Accenture (company ID uploaded), sees her government ID was checked, and decides to accept her connection request — something that would never happen on Facebook where she is indistinguishable from a scammer.

For a 50-year-old landlord in Pasig with 4 units (L5 profile): He can prove his identity (government ID), his property ownership (tax declaration, barangay certification, or utility bill showing his address). What "verified" changes: his listing now carries a green badge that distinguishes it from the thousands of unverified Facebook listings that T1 has been burned by. When T1 sees "Ang landlord na ito ay napatunayan na," she knows this is not a ghost property, not a stolen photo, not a reservation fee scam. She knows the platform checked.

The Trust Deadlock structural explanation: L5 wants to see T1's ID before showing the unit. T1 cannot share her ID with someone she has not verified. This is the deadlock that Dormy.ph documented: "sharing government IDs with unverified agents is bad practice and must be avoided at all cost." The platform solves this by being the neutral third party — both sides verify TO THE PLATFORM, not to each other. The platform holds the sensitive documents (in a private R2 bucket with signed URLs), performs the review, and issues badges that represent the verification outcome without exposing the underlying documents. T1 never sees L5's government ID. L5 never sees T1's government ID. Both see each other's badges — and that is sufficient trust to reveal phone numbers and arrange a viewing.

### 5.2 — Landlord Verification — Complete Technical Specification

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LANDLORD VERIFICATION FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRE-CONDITION: Phone number verified (OTP completed), landlord profile created

STEP 1: Government ID Upload
├── Screen name: verify-id
├── User sees: "I-upload ang iyong government ID" header, list of accepted
│   ID types as selectable cards, camera button, instructions text:
│   "Siguraduhing malinaw ang picture — walang blur, walang takip."
│   PDPA consent checkbox: "Pinapayagan ko ang [RentRayda] na i-store
│   ang ID ko para sa verification. Tanging ang verification team lang
│   ang makakakita nito."
├── User action: Selects ID type, taps camera, photographs front of ID
├── Input fields: id_type | enum | required | government_id_photo | image/jpeg | max 5MB | required
├── System action: Requests presigned URL from backend (POST /storage/presigned-url
│   with bucket='verification-docs', path='{user_id}/government_id/{uuid}.jpg').
│   Client uploads directly to R2 private bucket. Client confirms upload
│   (POST /storage/confirm). Backend creates verification_documents row.
├── R2 upload: YES — RentRayda-verification-docs/ (PRIVATE bucket)
├── DB change: verification_documents: new row (user_id, document_type='government_id',
│   r2_object_key='{path}', status='pending', created_at=now())
├── Time user spends: 1–2 minutes
├── Error states:
│   - Camera permission denied → "Kailangan ng camera access para ma-picture ang ID mo. I-allow sa settings."
│   - Upload failed (network) → "Hindi na-upload. I-try ulit — check ang internet connection mo."
│   - File too large → "Masyadong malaki ang file. I-try ulit na mas malapit ang camera."
│   - PDPA consent not checked → "Kailangan mong pumayag bago mag-continue."
└── Trigger to next: Upload confirmation received → navigate to Step 2

STEP 2: Selfie Capture
├── Screen name: verify-selfie
├── User sees: "I-selfie mo ang sarili mo" header, face outline guide overlay,
│   instructions: "Siguraduhing malinaw ang mukha mo at magkatugma sa ID."
├── User action: Takes selfie using front camera
├── Input fields: selfie_photo | image/jpeg | max 3MB | required
├── System action: Upload to R2 private bucket. Update verification_documents
│   row with selfie_r2_key.
├── R2 upload: YES — same private bucket, path='{user_id}/selfie/{uuid}.jpg'
├── DB change: verification_documents: selfie_r2_key updated
├── Time user spends: 30 seconds
├── Error states:
│   - Front camera not available → "Walang front camera. I-picture ka ng kasama mo."
│   - Poor lighting detected (future) → At MVP: no detection. Accept all selfies.
└── Trigger to next: Upload confirmed → navigate to Step 3

STEP 3: Property Proof Upload
├── Screen name: verify-property
├── User sees: "Patunayan na ikaw ang may-ari o may karapatan sa property"
│   header, list of accepted proof types as selectable cards, camera button,
│   instructions: "Pwedeng land title, tax declaration, barangay certification,
│   utility bill na may pangalan mo, o building admin letter."
├── User action: Selects proof type, photographs document
├── Input fields: property_proof_type | enum | required | property_proof_photo | image/jpeg | max 5MB | required
├── System action: Upload to R2 private bucket. Create new verification_documents
│   row with document_type='property_proof'.
├── R2 upload: YES — same private bucket, path='{user_id}/property_proof/{uuid}.jpg'
├── DB change: verification_documents: new row (document_type='property_proof',
│   status='pending'); landlord_profiles.verification_status → 'pending'
├── Time user spends: 1–2 minutes
├── Error states: Same as Step 1 upload errors.
└── Trigger to next: Upload confirmed → navigate to Step 4

STEP 4: Confirmation Screen
├── Screen name: verify-submitted
├── User sees: "Na-submit na! Sinusuri pa — 24-48 oras." Large clock icon (yellow).
│   Body copy: "Iche-check ng team namin ang mga document mo. I-text ka namin
│   kapag verified na." Subtext: "Habang hinihintay, pwede ka nang gumawa ng listing."
│   Button: "Gumawa ng listing" (leads to listing-creation)
├── User action: Taps button to create listing, or closes app
├── System action: None (awaiting manual review)
├── DB change: None
├── Time user spends: 10 seconds (reads, then moves on)
└── Trigger to next: User taps "Gumawa ng listing" or app idle

[4 steps in happy path — within the 5-step maximum]

ACCEPTED DOCUMENTS:
For government ID proof:
├── PhilSys National ID — primary, 90.7M registered, free QR verification available
├── UMID — common among employed adults
├── Driver's License — widely held, machine-readable
├── Philippine Passport — strong ID, less common in target segment (₱950 cost)
├── PRC ID — for licensed professionals
├── Voter's ID / Voter's Certification — widely accessible
├── Postal ID — inexpensive (₱500), commonly held
├── Senior Citizen ID — for older landlords like L3 (age 75)
├── SSS ID — available to all employed individuals
├── NBI Clearance — required for BPO employment, high trust signal
└── Pag-IBIG Loyalty Card — available to contributing members

For property proof:
├── Land title — strongest proof, confirms ownership. Verified by checking owner name matches user's government ID name.
├── Tax declaration — annual, shows property address and declared owner. Common and accessible.
├── Barangay certification — free or low-cost from barangay hall. Confirms residency and known property ownership. L3/L4/L5 can easily obtain this.
├── Building administrator letter — for condos or apartment buildings with admin offices. Confirms the landlord's authorization to rent the unit.
├── Utility bill with matching address — Meralco (electricity) or Maynilad (water) bill showing landlord's name at the property address. Quick to photograph.
└── Lease-to-rent authorization — for landlords who lease a property and sublease rooms. Less common in target segment but legally relevant.

MANUAL REVIEW PROCESS (ops team — founders at MVP):
Step 1: Open pending verification in admin dashboard. View government ID photo via signed URL.
Step 2: Check ID: Is the name legible? Does the photo on the ID look like a real government document (not a photocopy of a photocopy)? Is the ID type one of the accepted types? Is the ID visually authentic (holograms, layout consistent with known templates)?
Step 3: View selfie via signed URL. Compare face in selfie to face on government ID. The standard is "reasonable resemblance" — same person, accounting for lighting, age, and photo quality differences. This is not biometric matching — it is human judgment (same standard used by bank tellers and security guards nationwide).
Step 4: For landlords: view property proof. Check: does the name on the property proof match the name on the government ID? Does the address make sense for a residential rental (not a commercial lot or an empty field)?
Step 5: Approve → set verification_documents.status = 'approved', update landlord_profiles.verification_status to 'partial' (if only ID done) or 'verified' (if both ID and property proof approved). Reject → set status = 'rejected', enter reason in reviewer_notes, trigger SMS to user with reason.
Time per review: 3–5 minutes per complete landlord verification (government ID + selfie + property proof). Capacity: 1 reviewer can process 12–20 verifications per hour.

VERIFICATION STATES:
├── Unverified: Just registered, no documents submitted
├── Pending: Documents submitted, awaiting review
├── Partial: Government ID verified, property proof still pending or not yet submitted
├── Verified: Both government ID and property proof confirmed
└── Rejected: Documents rejected — reason provided, user can resubmit

DB field: landlord_profiles.verification_status
Values: 'unverified' | 'pending' | 'partial' | 'verified' | 'rejected'

REJECTION FLOW:
├── User sees in app: Status changes to "Hindi naipasa — tingnan ang dahilan" (red)
├── Notification: SMS via PhilSMS — "Ang verification mo ay hindi naipasa. Dahilan: {reason}. Pwede kang mag-submit ulit sa app."
├── Rejection reasons (standard codes for reviewer to select):
│   - "Hindi malinaw ang picture ng ID — i-retake po."
│   - "Hindi tugma ang pangalan sa ID at property proof."
│   - "Hindi accepted ang document type — tingnan ang listahan ng accepted IDs."
│   - "Hindi malinaw ang property proof — i-picture ulit."
│   - "Other" with free text field
└── Resubmission: User navigates back to verify-id or verify-property screen and re-uploads. Previous submission remains in DB (not deleted) for audit trail.

BADGE DISPLAY:
Verified: Green checkmark circle + "Napatunayan" in green text. Appears on listing card, listing detail, profile view.
Partial: Half-green circle + "Partial — may kulang pa" in blue text. Landlord can still create listing but it will not appear in search until fully verified.
Pending: Yellow clock circle + "Sinusuri pa" in yellow text. Documents submitted, review in progress.
Unverified: Gray dashed circle + no label text. Profile exists but no verification attempted.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5.3 — Tenant Verification — Complete Technical Specification

PRIMARY PATH — BPO Employee:
Step 1: Government ID upload — identical to landlord Step 1 and Step 2 (ID photo + selfie). Same screen, same flow, same R2 bucket.
Step 2: Employment proof upload — tenant selects proof type (Company ID, latest payslip, Certificate of Employment). Photographs document. Upload to private R2 bucket. verification_documents row created with document_type='employment_proof'.
Step 3: Confirmation — "Na-submit na! Sinusuri pa." Same 24–48 hour review promise.
3 steps total for BPO tenant happy path.

SECONDARY PATH — Student:
Step 1: Government ID upload (same as primary path). If student does not have PhilSys or other primary ID, School ID is accepted AS A SECONDARY ID — must be paired with another document (e.g., PSA birth certificate or voter's certification).
Step 2: Student enrollment proof — enrollment form, student registration card, or current class schedule showing school name and semester. Upload to private R2 bucket.
Step 3: Confirmation.
3 steps total.

EDGE CASE PATH — Informal Worker / No Employment Proof:
This is a gap in the MVP. A freelancer, informal worker, or newly arrived migrant who has not yet started employment cannot provide Company ID or payslip. Options at MVP: (a) Accept barangay clearance from current residence + any secondary ID as a "basic verified" status that is lower than full verification. (b) Allow self-declaration of employment with the understanding that the verification badge will show "Partial" rather than "Verified." Decision: Option (b). The tenant can submit government ID + selfie for identity verification, resulting in 'partial' status. To reach 'verified,' employment proof is required. 'Partial' tenants can browse listings but CANNOT send connection requests. This is honest: the landlord sees the partial badge and knows employment is unconfirmed. The platform does not pretend to verify something it has not verified.

THE GOOD STRANGER PROFILE — what a BPO worker with zero rental history gets:
The tenant profile that a landlord sees includes: full name, profile photo, "Napatunayan" badge, employment type (e.g., "BPO Employee"), company name (e.g., "Accenture"), barangay where searching, and the optional message from the connection request. What is conspicuously absent: rental history, references, credit score, income amount. These do not exist for this user — and the platform does not fake them.

What creates trust in the absence of rental history: (1) The government ID verification — the tenant is a real person with a real name that the platform has confirmed. This eliminates the fake identity scam (Snappt: "Using a false name and identity, a potential candidate can rent an apartment from you"). (2) The employment verification — the tenant has a confirmed job at a named company. For a landlord whose main fear is midnight runners and non-payment, knowing the tenant has a stable BPO job (₱18K–25K monthly salary) is more reassuring than any reference letter. (3) The selfie match — the person who shows up at the viewing is the same person on the profile. No bait and switch. (4) The platform's own credibility — by checking both sides, the platform has staked its reputation on this match. If the tenant is fraudulent, the platform's brand suffers. This accountability is what Facebook lacks.

### 5.4 — Verification Technical Implementation

```
DECISION: Manual verification at launch. No paid KYC API.
Based on RESEARCH_FINDINGS.md Section 2.1: PhilSys QR verification is free for
  registered relying parties. ID Analyzer offers 100 free monthly credits as backup.
  All other providers cost $0.50–$2.50 per verification — too expensive at zero revenue.
  Research finding: "Skip all paid KYC APIs. Use PhilSys QR verification (free) + manual
  review by founding team for the first 500 users."

IF MANUAL AT LAUNCH (this is the decision):
├── Face comparison tool: Visual comparison by reviewer. Open government ID photo
│   and selfie side by side in admin dashboard. No automated tool at MVP. The standard
│   is "reasonable resemblance" — same as any bank teller or security guard performs daily.
├── ID authenticity check: Reviewer looks for: correct layout for the stated ID type,
│   readable text, photograph quality consistent with an official document (not a screen
│   capture of a screen capture), no obvious Photoshop artifacts. At MVP, reviewers are
│   the founders — they will develop pattern recognition after 50+ reviews.
├── Ops process: One founder reviews verifications. Target: morning batch (review all
│   submissions from overnight) and evening batch (review all submissions from daytime).
│   Two review sessions per day, 30 minutes each, processes ~20 verifications/day.
├── Volume capacity: 1 reviewer doing 2 sessions/day can process 20 verifications/day,
│   ~600/month. This covers the first 6+ months of growth.
└── Switch trigger: At 700+ verifications/month (reviewer hitting capacity), integrate
    ID Analyzer ($89/month for 1,000 verifications = $0.089 each) for automated initial
    screening. Manual review becomes exception-only for flagged cases.

DOCUMENT STORAGE:
├── Service: Cloudflare R2
├── Bucket: RentRayda-verification-docs/
├── Access: Signed URLs only, expiry 1 hour
├── Path format: verification-docs/{user_id}/{doc_type}/{uuid}.{ext}
├── Encryption: AES-256 server-side (R2 default, always-on)
├── PDPA compliance: Explicit electronic consent captured before any document upload
│   (checkbox with specific consent language). Consent timestamp and version stored
│   in users table. Data retention: verification documents retained for duration of
│   account existence + 1 year after account deletion (legal hold period for potential
│   disputes). Deletion process: automated R2 object deletion triggered 1 year after
│   account deletion, with audit log entry.
├── Retention: Active account = indefinite retention (required for ongoing verification
│   validity). Deleted account = 1 year retention then purge.
└── Who can access: Admin role only. No client-side access to verification documents.
    Signed URLs generated server-side with admin auth check.

FRAUD PREVENTION AT BOOTSTRAP SCALE:
├── Rate limiting: Maximum 3 verification submissions per user per 24 hours.
│   Prevents rapid re-submission to overwhelm reviewer.
├── Duplicate detection: Phone number uniqueness enforced at registration.
│   Government ID type + number combination checked for duplicates across users
│   (prevent same ID used on multiple accounts). If duplicate detected: reject with
│   message "Ang ID na ito ay ginamit na sa ibang account."
├── Obvious fraud signals (reviewer training):
│   - Government ID photo is a photo of a screen (screenshot of someone else's ID)
│   - Selfie does not match ID photo at all (different person)
│   - Property proof address is in a different city/province from the listing location
│   - Multiple accounts from the same phone with different names
│   - ID document appears physically altered or has mismatched fonts
└── Escalation: If suspected fraud → admin sets user status to 'suspended' and
    flags the account for co-founder review. If confirmed fraud: account permanently
    deactivated, phone number blocked from re-registration, incident documented
    for potential NPC/PNP reporting.
```

### 5.5 — The Verification Ceremony

```
VERIFICATION COMPLETION SCREEN

For landlord:
├── Screen title: "Napatunayan ka na!"
├── Visual treatment: Green checkmark animation (simple CSS animation, not a heavy
│   Lottie file — 3G constraint). Background shifts to a subtle warm green tint.
│   The badge appears prominently — the same VerifiedBadge component the landlord
│   will see on their listing, shown large so they recognize it.
├── Body copy: "Ang listing mo ay may 'Napatunayan' badge na. Ang mga tenant na
│   naghahanap ng apartment, makikita nila na legit ka. Hindi ka na katulad ng ibang
│   listing sa Facebook — ikaw, verified."
├── What they can do now: "Ang listing mo ay live na — makikita na ng mga verified
│   tenant." Button: "Tingnan ang listing ko" (view own listing in public view).
└── Share mechanism: "I-share sa Facebook o Messenger" button that copies the
    verified listing URL with a pre-written message: "May verified listing na ako
    sa [RentRayda]. Kung may kakilala kang naghahanap, share mo 'to: {url}"

For tenant:
├── Screen title: "Napatunayan ka na!"
├── Visual treatment: Same green checkmark animation. Badge shown prominently.
│   Subtle confetti effect (lightweight CSS, not JS library).
├── Body copy: "Hindi mo na kailangan ng kakilala sa Manila. Ikaw na mismo ang
│   katibayan — may verified ID ka, may confirmed na trabaho. Ang mga landlord,
│   makikita nila na legit ka. Hindi ka na stranger — napatunayan ka na."
├── What they can do now: "Pwede ka nang mag-connect sa verified landlords."
│   Button: "Humanap ng apartment" (navigates to listing search).
└── Share mechanism: "May batchmate ka ba na naghahanap din? Share mo 'to."
    Button generates Messenger message: "Napatunayan na ako sa [RentRayda] —
    verified ang mga landlord dito. Hindi scam. Download mo: {app_store_link}"
```

---

## SECTION 6: COMPLETE USER FLOWS

⚠️ **RELATIONSHIP TO SECTION 5:** Section 5 specifies the verification *system* (what documents are accepted, how manual review works, verification states, PDPA compliance). Section 6 specifies the complete user *journey* (every screen from app open to outcome). The verification screens in Section 6 implement the requirements from Section 5. When Section 5 and Section 6 describe the same screen, **Section 6 is the developer's implementation guide** (screen-by-screen with exact UI elements, DB changes, and error states). Section 5 is the ops team's review guide (what to check, how to approve/reject). A developer follows Section 6. An ops reviewer follows Section 5.

### FLOW A: LANDLORD ONBOARDING

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLOW: Landlord Onboarding — Registration to Live Listing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
START STATE: Landlord has heard about the app (from founder outreach, barangay
  flyer, or Facebook DM). Has the app installed on their Android phone.
END STATE: Landlord has a verified listing with badge visible to tenants in search.
TARGET TIME: Under 5 minutes for registration + profile + first listing (not counting
  verification review time which is 24-48 hours asynchronous).
THE TEST: L5 (Facebook-using landlord, conditional on free, some tech comfort, age
  40-50s) must complete this on first attempt without calling the founder for help.
ANDROID 3G CONSIDERATION: All photo uploads must have client-side compression.
  Progress indicator during upload. Retry button on network failure.

HAPPY PATH:

[Screen 1: phone-register]
├── User sees: App logo, "Mag-register" header, phone number input field
│   (09XX format pre-filled with country code), "Landlord" / "Tenant" role
│   selector (two large buttons), "Magpadala ng code" primary button.
├── User does: Enters phone number, selects "Landlord," taps send code
├── Input fields: phone_number | string | PH format validation (09XXXXXXXXX) | required
├── System does: POST /auth/send-otp → PhilSMS sends 6-digit OTP
├── Database change: users row created (phone, role='landlord', status='pending_otp')
├── R2 action: None
└── Trigger: OTP delivered via SMS → auto-navigate to OTP entry screen

[Screen 2: otp-verify]
├── User sees: "I-enter ang code na na-receive mo" header, 6-digit input,
│   countdown timer (10-minute expiry visible), "I-resend ang code" link
│   (available after 60 seconds), "I-verify" button
├── User does: Enters 6-digit code, taps verify
├── Input fields: otp_code | 6 digits | numeric only | required
├── System does: POST /auth/verify-otp → validates code, creates session
├── Database change: users.status → 'active', session created
├── R2 action: None
└── Trigger: Valid OTP → navigate to profile creation

[Screen 3: landlord-profile + government-id + selfie (combined screen)]
├── User sees: "Kumpletuhin ang profile mo" header. Fields: full name, barangay
│   (dropdown of launch zone barangays + "Iba pa" with text input), number of
│   units (1-20 selector). "I-upload ang government ID mo" section with ID type
│   selector and camera button. "Mag-selfie" section with front camera button.
│   PDPA consent checkbox at bottom. "I-submit" primary button.
├── User does: Fills profile fields, photographs ID, takes selfie, checks consent
├── Input fields: full_name | string | min 2 chars | required; barangay | string | required;
│   unit_count | integer | 1-20 | required; id_type | enum | required; id_photo | image |
│   required; selfie | image | required; pdpa_consent | boolean | required (must be true)
├── System does: Creates landlord_profile row. Uploads ID and selfie to private R2.
│   Creates verification_documents rows. Sets verification_status to 'pending.'
├── Database change: landlord_profiles created, verification_documents created (x2)
├── R2 action: Two uploads to private bucket (government_id + selfie)
└── Trigger: Submit success → navigate to property proof + listing creation

[Screen 4: property-proof + listing-creation (combined screen)]
├── User sees: Two sections. Top: "Patunayan ang property mo" with proof type
│   selector and camera button. Bottom: "Gumawa ng listing" with fields for
│   unit type, monthly rent, beds/rooms, inclusions checkboxes, short description,
│   "Mag-upload ng photos" button (1-5 photos). "I-publish" primary button.
├── User does: Photographs property proof, fills listing details, uploads photos
├── Input fields: property_proof_type | enum | required; proof_photo | image | required;
│   unit_type | enum | required; monthly_rent | integer | ₱500-50000 | required;
│   beds | integer | 1-20 | optional; rooms | integer | 1-10 | optional;
│   inclusions | string[] | optional; description | string | max 200 chars | optional;
│   listing_photos | image[] | 1-5 | at least 1 required
├── System does: Uploads property proof to private R2. Creates listing row (status='draft'
│   — will become 'active' when landlord is 'verified'). Uploads listing photos to public R2.
├── Database change: verification_documents (property_proof), listings (new row,
│   status='draft'), listing_photos (1-5 rows)
├── R2 action: 1 upload to private bucket (property_proof), 1-5 uploads to public bucket
└── Trigger: Publish success → navigate to confirmation screen

[Screen 5: submitted-confirmation]
├── User sees: "Tapos na! Sinusuri pa ang verification mo." Yellow clock icon.
│   "Listing mo:" preview card showing their listing (with "Sinusuri pa" badge).
│   "24-48 oras ang review. I-text ka namin kapag verified na."
│   "I-share sa Facebook" button with pre-written post + listing URL.
├── User does: Reads confirmation. Optionally shares. Closes app.
├── System does: Nothing — awaiting async manual review
├── Database change: None
├── R2 action: None
└── Flow complete. Landlord returns when push notification announces verification result.

[5 screens in happy path — exactly at the maximum]

DECISION POINTS:
If landlord skips property proof: Listing saved as draft. Verification stays 'partial.'
  Listing does not appear in search. Landlord gets SMS after 48 hours: "May kulang pa
  sa verification mo — i-upload ang property proof para ma-publish ang listing mo."
If landlord skips listing photos: Listing cannot be published — at least 1 photo required.
  Error: "Kailangan ng kahit isang photo ng unit."

EDGE CASES:
Landlord's phone has no front camera (for selfie): Allow rear camera selfie with
  instruction "I-hawak ang phone na nakaharap sa iyo." Selfie quality will be lower
  but acceptable for manual face comparison.
Landlord has a property proof that doesn't match any listed type: "Iba pa" option with
  free-text description of what the document is. Reviewer assesses manually.
Landlord accidentally selects "Tenant" role: Cannot change role after OTP verification.
  Must contact support (at MVP: contact founder directly). Future: role switch option.

ERROR STATES AND EXACT COPY:
Network failure during upload → "Hindi na-upload. I-check ang internet at i-try ulit."
OTP expired → "Nag-expire na ang code. Mag-request ng bago."
OTP incorrect 3 times → "Masyadong maraming pagkakamali. Subukan ulit pagkatapos ng 15 minuto."
Phone number already registered → "May account na sa number na ito. Mag-login ka na lang."
ID photo too blurry → Not detected at MVP. Reviewer rejects during manual review.

DROP-OFF RISK POINTS:
Screen 3 (profile + ID upload) is highest abandonment risk because it asks for the most
  sensitive action: uploading a government ID. Research: KYC step abandonment is 52%
  in fintech. Mitigation: PDPA consent copy is specific about WHO can see the ID
  ("tanging ang verification team lang"). The consent checkbox must feel like a privacy
  assurance, not a liability waiver.

DB STATE AT COMPLETION:
├── users: 1 row (phone, role='landlord', status='active')
├── landlord_profiles: 1 row (verification_status='pending')
├── verification_documents: 3 rows (government_id, selfie, property_proof — all 'pending')
├── listings: 1 row (status='draft', awaiting landlord verification to become 'active')
└── listing_photos: 1-5 rows (public R2 keys)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### FLOW B: TENANT ONBOARDING

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLOW: Tenant Onboarding — Registration to Verified Profile
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
START STATE: Tenant heard about the app from BPO batchmate, Facebook Group,
  or search. Actively looking for housing near their workplace.
END STATE: Tenant is verified and can send connection requests to landlords.
TARGET TIME: Under 4 minutes to reach "submitted for verification" state.
THE TEST: T1 (28yo BPO worker, almost scammed twice, 3-month search) must
  complete this and feel MORE safe than before she started.
ANDROID 3G CONSIDERATION: Skeleton loading while listings load after verification.

HAPPY PATH:

[Screen 1: phone-register] — Same as Landlord Screen 1, selects "Tenant"
[Screen 2: otp-verify] — Same as Landlord Screen 2

[Screen 3: tenant-profile + government-id + selfie]
├── User sees: "Kumpletuhin ang profile mo" header. Fields: full name,
│   barangay/area where searching, employment type (radio buttons: BPO,
│   Student, Office Worker, Freelancer, Other), company/school name (optional but
│   encouraged: "Para makita ng landlord na may trabaho ka").
│   Government ID upload section (same as landlord). Selfie section (same).
│   PDPA consent checkbox. "I-submit" button.
├── User does: Fills profile, uploads ID, takes selfie, consents, submits
├── System does: Creates tenant_profile, uploads to private R2, creates verification docs
├── Database change: tenant_profiles (new), verification_documents (x2)
├── R2 action: 2 uploads to private bucket
└── Trigger: Submit → navigate to employment proof

[Screen 4: employment-proof-upload]
├── User sees: "Patunayan ang trabaho mo" header. Proof type selector:
│   "Company ID" / "Latest payslip" / "Certificate of Employment" (for BPO path).
│   "School ID + enrollment form" (for Student path).
│   Camera button. Instructions: "Para makita ng landlord na may stable na income ka."
│   For BPO: "Yung company ID mo, i-picture lang."
│   Skip option: "Wala pa akong employment proof" → navigates to confirmation
│   with 'partial' verification status.
├── User does: Photographs employment document
├── System does: Upload to private R2, create verification_documents row
├── Database change: verification_documents (employment_proof), tenant_profiles.verification_status → 'pending'
├── R2 action: 1 upload to private bucket
└── Trigger: Upload confirmed → navigate to confirmation

[Screen 5: submitted-confirmation]
├── User sees: "Na-submit na! Sinusuri pa." Shows: "Habang hinihintay, tingnan
│   mo ang mga verified listings." Button: "Humanap ng apartment" → listing search.
│   (Note: tenant can BROWSE listings while verification is pending, but CANNOT
│   send connection requests until 'verified.')
├── User does: Taps to browse listings or closes app
└── Flow complete. Tenant returns when verification approved.

[5 screens for BPO tenant including registration]

BPO FAST PATH: Screens 1-2 (register/OTP) + Screen 3 (profile/ID/selfie) + Screen 4
  (company ID photo) + Screen 5 (confirmation) = 5 screens, under 4 minutes.

NON-EMPLOYED EDGE CASE: Same flow but skips Screen 4 (employment proof).
  Tenant reaches 'partial' verification only. Can browse but not connect. Profile
  shows "Partial" badge. Message to tenant: "Para ma-verify ka fully, i-upload ang
  employment proof mo." This is honest — the platform does not pretend to verify
  employment it has not verified.

EDGE CASES:
Student without primary government ID: Accept School ID + PSA birth certificate
  or voter's certification as combined proof. Reviewer assesses manually.
Tenant changes employment: No mechanism at MVP. Employment proof is a
  point-in-time verification. Future: re-verification prompts annually.

ERROR STATES AND EXACT COPY:
Same as Landlord Flow A for registration and upload errors.
Employment proof not clear → Handled during manual review (rejection with
  reason: "Hindi malinaw ang employment proof — i-retake.")
Skip employment → "Partial verification lang — hindi ka pa makakapag-connect.
  I-upload ang employment proof para maging fully verified."

DROP-OFF RISK POINTS:
Screen 3 (ID upload) — same risk as landlord flow. For tenants, the fear may be
  HIGHER because T1 was almost scammed by people asking for her ID. Mitigation:
  explicit copy: "Hindi ibinibigay ang ID mo sa landlord. Sa verification team lang namin."

DB STATE AT COMPLETION:
├── users: 1 row (role='tenant')
├── tenant_profiles: 1 row (verification_status='pending')
├── verification_documents: 2-3 rows (government_id, selfie, optionally employment_proof)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### FLOW C: THE MATCH

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLOW: Verified Connection — From Search to Phone Number Reveal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
START STATE: Verified tenant browsing listings. Verified landlord has active listing.
END STATE: Both have each other's phone numbers and can arrange an in-person viewing.
TARGET TIME: Under 2 minutes from finding a listing to sending a connection request.
  Landlord response time is asynchronous (hours to days).
THE TEST: T1 finds a listing she likes, sends a request, landlord accepts, and both
  see each other's phone number for the first time.

HAPPY PATH:

[Screen 1: listing-search]
├── User sees: Search bar with barangay filter, price range filter, listing cards
│   showing verified badges, photos, rent, area, freshness indicator.
├── User does: Searches "Ugong" (barangay), filters ₱3,000-₱8,000
├── System does: GET /listings?barangay=ugong&min_rent=3000&max_rent=8000
│   Only returns listings where landlord is 'verified'
└── Trigger: Tenant taps a listing card → navigate to listing detail

[Screen 2: listing-detail + connection-request]
├── User sees: Full listing detail (photos, rent, description, inclusions, landlord
│   name with "Napatunayan" badge, freshness label). At bottom: "Mag-connect"
│   button (green, prominent). If tenant is NOT verified: button shows "I-verify
│   muna ang profile mo" (yellow, links to verification flow).
├── User does: Reads listing, taps "Mag-connect." Modal appears with optional
│   message field and "I-send" button.
├── System does: POST /connections/request (validates tenant.verification_status =
│   'verified', creates connection_request row, sends push notification to landlord)
├── Database change: connection_requests (status='pending')
└── Trigger: Request sent → tenant sees "Na-send na! Hihintayin ang sagot."

[Screen 3: landlord-inbox (landlord's side, asynchronous)]
├── Landlord receives push notification: "May nagpadala ng connection request."
├── Landlord opens inbox, sees request with: tenant name, verified badge,
│   employment type, company name, optional message.
├── Landlord taps to view full tenant profile. Sees: selfie, employment info,
│   badge status. Does NOT see: government ID, employment documents, phone number.
├── Landlord decides: "Tanggapin" or "Tanggihan"
├── System does: PATCH /connections/:id/accept → triggers reveal logic
└── Trigger: Accept → mutual reveal

[Screen 4: connection-reveal (both sides)]
├── SYSTEM CHECK: landlord_profiles.verification_status = 'verified' AND
│   tenant_profiles.verification_status = 'verified' AND
│   connection_requests.status = 'accepted'
│   ALL THREE must be true. If any is false: connection stays pending.
│   Error to landlord if tenant somehow lost verification: "Hindi pa fully
│   verified ang tenant na ito. Hindi pa pwedeng i-reveal ang phone numbers."
├── BOTH users see reveal screen:
│   Tenant sees: Landlord's phone number in large text + "Tawagan mo na ang
│   landlord!" + landlord name + listing address. Copy button for phone number.
│   Landlord sees: Tenant's phone number in large text + "Pwede mo nang
│   tawagan ang tenant!" + tenant name + employment info. Copy button.
├── System does: Creates connections row with both phone numbers.
│   Sends push to both: "Connected na kayo! Tingnan ang phone number."
├── Database change: connections (new row with both phones), connection_requests
│   status → 'accepted'
└── Flow complete. Both users now communicate via phone/Messenger outside the app.

WHAT HAPPENS IF:
Tenant is verified but landlord is NOT yet verified: Connection request stays in
  'pending' state. Tenant sees: "Ang landlord ay sinusuri pa. Aabisuhan ka namin
  kapag ready na." This edge case should be rare because listings only appear in
  search when landlords are verified. But it could happen if a landlord's status is
  revoked after a listing was already viewed.

Landlord is verified but tenant is NOT yet verified: Tenant cannot send connection
  request in the first place — the "Mag-connect" button is replaced with
  "I-verify muna ang profile mo." This is enforced on both client and server side.

DB STATE AT COMPLETION:
├── connection_requests: 1 row (status='accepted')
├── connections: 1 row (tenant_user_id, landlord_user_id, listing_id,
│   tenant_phone, landlord_phone, connected_at)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### FLOW D: MIDNIGHT RUNNER DETERRENCE

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLOW: Midnight Runner Deterrence — Built Into Verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is not a separate product flow. It is a set of deterrent mechanisms embedded in
Flows A, B, and C that make the midnight runner scenario less likely WITHOUT contracts,
payment processing, or escrow.

DETERRENT 1: Identity is on file. When a tenant verifies, their real government ID
  (not a Facebook name, not a Messenger handle) is stored in the platform's private
  bucket. The tenant knows the platform knows who they are. This is the same mechanism
  that makes Grab riders identifiable — and why Grab has lower crime rates than
  traditional taxis. A midnight runner on Facebook is anonymous. A midnight runner
  with a verified PhilSys ID on file is identifiable. The deterrence is psychological, not
  legal — but it is real.

DETERRENT 2: Employment is confirmed. The tenant has uploaded proof of BPO
  employment. The landlord knows where the tenant works. This creates social
  accountability: if a tenant vanishes with unpaid rent, the landlord has a company name
  and can pursue accountability through employment channels (HR notification is not a
  platform feature — but the landlord HAVING this information changes the power dynamic).
  L5's midnight runner was completely anonymous — "completely empty because they
  moved out in the middle of the night." With verified employment, the tenant is not
  anonymous.

DETERRENT 3: The verified connection is recorded. The connections table records:
  when the connection was made, which listing it was for, both phone numbers, and both
  user IDs (linked to government ID records). This creates a permanent record of the
  rental relationship that did not exist before. If a dispute arises, the platform can
  produce evidence of the verified connection — admissible in barangay mediation.

DETERRENT 4: Reputation is at stake (future). While review systems are excluded
  from MVP (Section 4), the verified profile IS the beginning of a rental reputation.
  A tenant who successfully completes one rental can accumulate positive signals over
  time. The platform's existence creates an incentive for good behavior because the
  tenant's verified profile becomes more valuable with each successful rental.

WHAT THE LANDLORD'S INFORMATION POSITION IS AFTER VERIFICATION vs. BEFORE:
Before platform: Landlord knows tenant's face (from viewing), a name (possibly fake),
  a phone number (possibly prepaid, disposable), and "kutob" (gut feeling).
After platform: Landlord knows tenant's REAL name (government ID verified), a phone
  number linked to that real identity, confirmed employment (company name, proof type),
  and that a neutral third party has vouched for this information. This does not prevent
  all midnight runners. But it raises the social and practical cost of running.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```


---

## SECTION 7: UI AND VISUAL DIRECTION

### 7.1 — Visual Personality

```
ADJECTIVE: Maaasahan (Dependable)
Research grounding: T1's 3-month search was defined by unreliability — "responses took
  a long time, inquired at a lot of places" (T4). "Walang sumasagot" appeared 20+ times
  across the Mass Desires research. The product must feel like the opposite of ghosting.
In practice — copy: Every action gets immediate feedback in Taglish. Not "Processing..."
  but "Sinusuri pa — 24-48 oras." Not "Error" but "Hindi na-upload. I-try ulit."
In practice — UI: No blank loading states. Skeleton screens on every list view. Progress
  bars during uploads. Confirmation screens after every important action. Nothing ever
  feels like it disappeared into a void.
Reference app for this quality: GCash — every transaction gets a confirmation screen
  with a reference number. Users trust it because every action has a visible receipt.
Anti-reference to avoid: Lamudi — users report listings that are "already rented out" but
  still showing, agents who never respond, prices that don't match. The UI doesn't
  communicate that anyone is maintaining the platform.
```

```
ADJECTIVE: Tapat (Honest/Straightforward)
Research grounding: "Red flag agad" appeared 10+ times in the Mass Desires keyword
  analysis. "99% ng ads dyan… scam" — PinoyAU forum. T2's entire search strategy was
  about detecting dishonesty. The product must never hide uncomfortable information.
In practice — copy: When a listing is unverified, the UI says so explicitly: "Hindi pa
  verified ang landlord na ito." Rejection reasons are specific: "Hindi malinaw ang picture
  ng ID — i-retake po." Empty search results don't say "Check back later" — they say
  "Wala pang listing sa area na ito."
In practice — UI: Verification badges show ALL states — including negative ones. No
  verified badge means the user sees gray dashed circle, not a hidden element. Price
  information is complete: rent + deposit + advance all visible before any connection.
Reference app: Carousell PH — seller profiles show rating, items sold, join date.
  Transparent information about who you're dealing with.
Anti-reference: Facebook Marketplace — zero verification, no seller accountability,
  impossible to distinguish real from fake without personal investigation.
```

```
ADJECTIVE: Magaan (Light/Easy)
Research grounding: L5 uses Facebook. L3 is 75 years old. Budget phones have 3-4 GB RAM.
  Facebook Lite (1.24 MB) is the #1 social app in PH. Research: "Filipino mobile users
  prefer simplicity over complex features." Each 6 MB increase in app size costs 2% in
  install conversions.
In practice — copy: Maximum 10 words per instruction. "I-picture ang ID mo" not
  "Please take a clear photograph of the front of your government-issued identification
  document." Every label in Taglish.
In practice — UI: One primary action per screen. Large touch targets (48px minimum).
  No nested navigation (no hamburger menus, no drawer menus). Bottom tab bar with
  max 4 tabs. No animations that require GPU — CSS-only transitions.
Reference app: Facebook Lite — extreme simplicity, works on 2G, minimal RAM,
  immediate responsiveness on budget chipsets.
Anti-reference: Lamudi full app — heavy, feature-packed, multiple categories
  (buy/sell/rent/commercial) that overwhelm a user searching for a ₱5K bedspace.
```

### 7.2 — Color System

```
Primary color: #1B7A4E
Name: Tiwala Green (Trust Green)
Rationale: Green universally signals safety and verification. In Filipino cultural
  context, green represents growth and prosperity. The verified badge is the product's
  core visual element — it must be green. GCash uses green (#00B140) but darker/more
  muted to avoid confusion with GCash (which would imply payment functionality that
  does not exist).
Usage: Primary CTA buttons, navigation bar, verified badge fills.
On white contrast ratio: 5.8:1 — WCAG AA compliant: YES (both normal and large text)

Secondary color: #2563EB
Name: Aksyon Blue (Action Blue)
Rationale: Blue signals reliability and action. Used for interactive elements that are
  not the primary verification signal (links, secondary buttons, informational states).
Usage: Links, secondary CTAs, "Sinusuri pa" pending state, informational badges.
On white contrast ratio: 4.6:1 — WCAG AA compliant: YES (large text), borderline for
  small text. Use only for large text and interactive elements.

Verified/Safe color: #16A34A
Name: Napatunayan Green (Verified Green)
Rationale: Brighter green specifically for the "Napatunayan" verification badge. Must
  pop against both white and light gray backgrounds. Slightly different from primary
  to give the badge its own identity.
Usage: Verification badges (verified state only), success states, safe confirmations.
What it must NOT be: Not GCash green (#00B140 — too bright, implies payment).
  Not Grab green (#00B14F — would confuse with ride-hailing). Not Lamudi green
  (#2DAA6E — associated with the competitor's brand).

Warning color: #D97706
Name: Bantay Yellow (Caution Yellow)
Usage: "Sinusuri pa" (pending review) state, "Medyo matagal na" freshness label,
  information warnings that are not urgent.

Danger/Scam signal: #DC2626
Name: Babala Red (Warning Red)
Usage: "Hindi naipasa" (rejected) state, "I-report" button, scam warning screens,
  auto-pause notification. Used sparingly — reserve for genuine danger signals
  to prevent habituation (Qonto framework: "don't overuse warnings").

Background: #FAFAFA
Surface/Card: #FFFFFF
Text primary: #1A1A1A — contrast on background: 17.4:1
Text secondary: #6B7280 — contrast on background: 5.7:1
Border/Divider: #E5E7EB
```

### 7.3 — Typography

```
Primary font: Inter (Google Font — free, excellent Latin + Filipino diacritical rendering)
Why this font: Inter was designed specifically for screen readability. It handles the
  Filipino tilde (ñ), accent marks, and Taglish mixed-language text cleanly. It is available
  in variable weight, reducing font file size. Fallback: system sans-serif (Roboto on
  Android, San Francisco on iOS).
Body text: 16px minimum — Weight 400 (Regular) — Line height 1.5 (24px)
Heading scale: H1: 28px/700, H2: 22px/600, H3: 18px/600, H4: 16px/600
CTA text: 16px/600 (Semi-Bold) — slightly heavier than body for button labels
Caption/meta: 13px minimum (never smaller — 3G users on small screens must read
  freshness labels, timestamps, and badge text). Weight 400. Line height 1.4.
```

### 7.4 — Navigation

```
MOBILE BOTTOM NAVIGATION:

Tab 1: "Hanap" (Search) | Magnifying glass icon | Tenant only
Content: Listing search with filters, search results, listing cards.
Tab 2: "Inbox" | Envelope icon | Both (landlord sees requests, tenant sees connections)
Content: Landlord: incoming connection requests. Tenant: sent requests + active connections.
Tab 3: "Listing Ko" | House icon | Landlord only (hidden for tenants)
Content: Landlord's own listings, create new listing button, listing status toggles.
Tab 4: "Profile" | Person icon | Both
Content: User profile, verification status, settings, logout.

For tenants: 3 tabs (Hanap, Inbox, Profile). Tab 3 hidden.
For landlords: 4 tabs (Hanap not shown — replaced by Listing Ko, Inbox, Profile, and
  "Mga Tenant" which shows the same search but from landlord perspective — actually,
  simplify: landlords get Listing Ko, Inbox, Profile. 3 tabs.)

Final decision: 3 tabs for both user types.
Tenant tabs: Hanap | Inbox | Profile
Landlord tabs: Listing Ko | Inbox | Profile

Why this tab order: The first tab is the primary action. Tenants search (their primary
  need). Landlords manage listings (their primary action). Inbox is second because it
  represents the product's core value: connection requests. Profile is last because it
  is accessed least frequently after initial setup.

WEB NAVIGATION:
Top navbar with: logo (left), search bar (center, tenant only), and profile icon with
  dropdown (right). Admin dashboard has separate navigation (sidebar with Verification
  Queue, Reports, Metrics). Web is a companion to mobile — primarily for SEO/landing
  page and admin dashboard. Tenant experience on web mirrors mobile with responsive
  layout.
```

### 7.5 — The Make-or-Break Screen

```
SCREEN: listing-detail (Listing Detail View)
FLOW IT APPEARS IN: Flow C (The Match), Screen 2
WHY IT'S MAKE-OR-BREAK: This is where T1 decides if this app is different from
  Facebook/Lamudi/Rentpad. She has been scammed before. She is evaluating: "Legit ba
  ito?" Research finding: 50% of Airbnb trips involved guests visiting host profiles before
  booking — the profile/listing detail is where trust is assessed. Every scam she experienced
  started with a listing that looked real but was fake. This screen must immediately
  communicate: "This listing is different because it is verified."

EVERY UI ELEMENT:
├── Photo gallery: Horizontal swipeable, 1-5 real photos of the unit. Photos are the
│   first thing the eye sees. Must load fast (compressed to under 500KB). Skeleton
│   placeholder while loading (gray rectangle, not white void).
├── Landlord verification badge: Immediately below photos, prominently displayed.
│   Green "Napatunayan" badge with checkmark icon. Larger than any other text element
│   on screen except the rent price. This is the trust signal.
├── Anti-scam copy line: Below badge: "Ang landlord na ito ay napatunayan na — may
│   verified ID at property proof." Small text but always visible. Differentiation from
│   every other listing platform.
├── Rent price: ₱X,XXX/month — large, bold. Below it: "Advance: X buwan | Deposit: X
│   buwan" — complete pricing information upfront. No "Contact for price."
├── Location: Barangay + area name. No exact street address at this stage.
├── Unit details: Type (apartment/room/bedspace), beds, rooms, inclusions.
├── Freshness indicator: "Aktibo ngayon" (green) or "3 araw na" (blue). Positioned
│   near the listing date.
├── Landlord mini-profile: Small avatar, name, number of units. Not tappable at MVP
│   (landlord does not have a separate public profile page beyond what's shown here).
├── Description: Max 200 characters, landlord's own words.
├── Primary CTA button: "Mag-connect" (green, full-width, bottom of screen).
│   If tenant NOT verified: "I-verify muna ang profile mo" (yellow, links to verification).
├── Report button: Small "I-report" link in corner. Not prominent — available but not
│   distracting from the trust-building experience.

EXACT COPY (in Taglish):
├── Trust signal: "Napatunayan — may verified ID at property proof ang landlord na ito."
├── Primary CTA: "Mag-connect sa Landlord"
├── Unverified tenant CTA: "I-verify muna ang profile mo para makapag-connect"
├── Price label: "Buwanang upa"
├── Advance/deposit: "Advance: X buwan | Deposit: X buwan"
└── Empty description: "Walang description ang landlord — i-message siya para sa details."

WHAT MUST NOT APPEAR ON THIS SCREEN:
├── Broker badge or agent reference — this platform is direct owner-to-tenant.
│   Any broker language (Lamudi: "Certified Partner") would confuse the positioning.
├── "Contact for price" — full pricing must be visible. Hidden pricing is a red flag
│   in this market ("click bait" was mentioned 8+ times in Mass Desires research).
├── Exact street address — privacy concern for landlord at pre-connection stage.
│   Barangay-level location is sufficient for tenant to assess proximity to workplace.
├── Phone number — the entire product's trust model depends on phone numbers being
│   revealed ONLY after mutual verification + connection acceptance. Showing the phone
│   number here would eliminate the platform's value proposition entirely.

HOW THIS IS DIFFERENT FROM LAMUDI:
Lamudi shows: agent name, "Certified Partner" badge (widely criticized), multiple floor
  plans, mortgage calculators, "Request details" button that sends to an agent who may
  or may not be real. This platform shows: LANDLORD name (not agent), "Napatunayan"
  badge backed by actual document verification (not a subscription badge), real photos
  of the actual unit, complete pricing, and a direct connection path to the verified owner.
```

### 7.6 — Lamudi/Rentpad Differentiation — Visual

Lamudi uses information-dense cards with broker logos and "Request details" CTAs. This app uses simple cards with one large photo, one badge, one price, and one barangay name. Because the target user (T1, BPO worker on a budget phone with 3G) needs to assess trust in under 3 seconds, not parse a data-rich card.

Lamudi's color temperature is cool blue-green (#2DAA6E). This app uses warmer green (#1B7A4E) because warmth communicates approachability. The informal rental market is personal (L5 manages his 4 units himself, visits tenants to collect cash). The UI must feel personal, not corporate.

Lamudi's copy is in English: "Find your dream home." This app's copy is in Taglish: "Humanap ng verified na apartment." Because T1 speaks 70% Filipino, 30% English. Pure English copy signals "this was not made for me."

Lamudi emphasizes broker partnerships. This app emphasizes owner verification. Because 90% of agents in the Philippines are unlicensed (PAREB data from research) and the scam pattern starts with fake agents. Every mention of "agent" or "broker" would undermine the trust signal.

Lamudi prioritizes property photography (professional, staged). This app prioritizes human verification photography (real selfies, real IDs, real badge). Because in this market, the question is not "Is the apartment nice?" — the question is "Is the landlord real?" Trust infrastructure means verification comes before aesthetics.

Lamudi's navigation has 6+ categories (buy, sell, rent, commercial, new launches, agents). This app has 3 tabs. Because the target user has one need: find a verified apartment near work. Simplicity is the product.

### 7.7 — Five Custom Components

```
COMPONENT: VerifiedBadge
Used in: listing-card, listing-detail, tenant-profile-view, landlord-profile, user-own-profile
What it communicates: This person's identity has been confirmed by the platform.
  Emotional signal: "You can trust this person — we checked."
States: verified (green checkmark + "Napatunayan"), pending (yellow clock + "Sinusuri pa"),
  partial (half-green + "Partial"), unverified (gray dashed circle, no text), rejected (red X,
  not shown publicly — only on user's own profile)
Key design decision: The badge must be the FIRST non-photo element the eye sees on any
  listing card. It must be at least 20px tall and use the Napatunayan Green (#16A34A) with
  white text/icon for maximum visibility. On a dark background (photo overlay), use white
  badge with green text.
Visual description: Rounded pill shape (border-radius: 9999px). Left side: circular icon
  (checkmark, clock, half-circle, or dashed circle depending on state). Right side: text label.
  Background: state color with 10% opacity. Border: state color.
Taglish copy inside: "Napatunayan" / "Sinusuri pa" / "Partial — may kulang pa" / (no text)
```

```
COMPONENT: ListingCard
Used in: listing-search results, landlord listing management, web landing page
What it communicates: A snapshot of a rental listing with enough information to decide
  whether to tap for details.
States: active (normal), paused (grayed out, only shown in landlord's own listing view),
  rented (grayed + "Narentahan na" overlay, landlord view only)
Key design decision: Photo takes 60% of card height. Badge is overlaid on the photo bottom.
  Rent price is the largest text. This matches the decision hierarchy: (1) real photos prove
  the unit exists, (2) the badge proves the landlord is real, (3) the price proves affordability.
Visual description: White card with 8px border-radius. 1px border (#E5E7EB). Shadow: none
  (shadows waste rendering on budget GPUs). Photo fills top portion. Below photo: rent in bold,
  barangay in regular, freshness label in small colored text. Badge overlaid on bottom-right of
  photo area.
Taglish copy inside: Freshness labels — "Aktibo ngayon" / "Kamakailan lang" / "Medyo matagal na"
```

```
COMPONENT: ConnectionRequestCard
Used in: landlord inbox
What it communicates: A tenant wants to rent your unit. Here's who they are.
States: pending (actionable — accept/decline visible), accepted (green border, "Connected"),
  declined (gray, archived)
Key design decision: Tenant's selfie and verified badge must be the first thing the landlord
  sees, followed by employment type and company name. This directly addresses L4/L5's
  request for "tenant background profile." The card IS the background profile.
Visual description: White card with left-aligned tenant avatar (48px circle), name in bold,
  employment type + company in regular text, verified badge inline, optional message in
  italics below, timestamp, and two action buttons at bottom (green "Tanggapin" and gray
  "Tanggihan").
Taglish copy inside: "Tanggapin" (Accept) / "Tanggihan" (Decline)
```

```
COMPONENT: FreshnessLabel
Used in: listing-card, listing-detail
What it communicates: How recently the landlord was active on this listing. Stale listings
  are a top trust problem (Lamudi complaint: "already rented out" listings kept visible).
States: active-now (green dot + "Aktibo ngayon"), recent (blue + "Kamakailan lang"),
  aging (yellow + "Medyo matagal na"), stale (auto-paused, not visible to tenants)
Key design decision: Color-coded but text-primary. The text must be readable even to
  color-blind users. Position: always bottom-right of listing card, below the price.
Visual description: Small pill (font-size 13px) with colored dot left of text. No border.
  Background: transparent. Color carries full meaning.
Taglish copy inside: "Aktibo ngayon" / "Kamakailan lang" / "Medyo matagal na"
```

```
COMPONENT: AntiScamBanner
Used in: listing-detail (below the photo gallery)
What it communicates: This platform is actively fighting scams. This listing has been
  checked. "Hindi to scam."
States: Single state — always shown on every listing detail view.
Key design decision: This is not a generic trust badge. It uses the specific Taglish
  vocabulary from the extraction document: "napatunayan" (verified/proven). It must
  feel like a friend telling you "legit 'to" — not like a legal disclaimer.
Visual description: Full-width strip below the photo gallery. Light green background
  (#F0FDF4). Left: small green shield icon. Text in regular weight, 14px. No border.
  Subtle, always present, not shouting.
Taglish copy inside: "Napatunayan — may verified ID at property proof ang landlord na ito."
```

---

## SECTION 8: REAL-WORLD ADOPTION ANALYSIS

### 8.1 — Interview-by-Interview Adoption Assessment

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
L1 — Tita (~70), Premium landlord, Pasig/Makati, 5+ units, ₱15K+, companies/families
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Download app: NO
Reason: Uses personal network + brokers. Zero Facebook. Requires 3 personal references
  and postdated checks. Her system is professional and complete. Zero gaps.
Complete onboarding: NO
Reason: Would not upload government ID to an unknown app. Her properties are premium
  — she does not need a free platform.
Use actively: NO
What would change her mind: Nothing at MVP. She needs property management, not
  tenant discovery. NOT our target user.
Adoption probability: 2%
Value to platform: None at MVP stage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
L2 — Family Member #2 (~40s-50s), University landlord, 8+ units, PDC required, students
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Download app: MAYBE
Reason: "There has to be more value to it." Basic listing isn't enough. She wants management.
Complete onboarding: MAYBE
Reason: Would consider it if the platform also managed payments and maintenance. But
  MVP does not offer this. "Not to have to do it myself" is her core desire.
Use actively: NO
Reason: Her units fill automatically near universities. Zero tenant acquisition pain.
What would change her mind: Adding property management dashboard (Phase 2+).
Adoption probability: 10%
Value to platform: Low at MVP. High at Phase 2 (university expansion).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
L3 — 75-year-old compound landlord, Pasig, multiple units, fills in hours, cash only
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Download app: NO
Reason: "So far, I can still handle it." 75 years old. Fills units in hours through word of mouth.
  Zero digital search. Zero pain. "Walang kailangan" attitude.
Complete onboarding: NO
Reason: Unlikely to navigate a 5-step onboarding independently. Would need founder
  hand-holding that is not scalable.
Use actively: NO
What would change her mind: Nothing. She has zero need. But she IS valuable as a
  referral source (Section 8.6 — L3 Referral Design). She knows every landlord in
  her area.
Adoption probability: 1%
Value to platform: None as user. High as referral source for nearby L4/L5-type landlords.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
L4 — Family landlord, Pasig + Makati, son's unit vacant 3 months, "better background checking"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Download app: YES
Reason: Son's Makati unit vacant 3 months. Facebook not working. No local network for the
  Makati property. "Better background checking" explicitly requested.
Complete onboarding: YES (with founder assistance for son's Makati unit)
Reason: Has pain. Has stated the need. Free platform removes cost barrier. The verified
  tenant profile directly answers her "better background checking" request.
Use actively: MAYBE
Reason: Pasig units fill in 3 days through local network — she doesn't need the app for
  those. But the Makati unit is where the app has value. If the app helps fill Makati, she
  stays. If Makati fills through other means, she leaves.
What would change her mind from MAYBE to YES: If the first verified tenant for Makati is
  a good tenant — she becomes a long-term user and referral source.
Adoption probability: 60%
Value to platform: High — represents the absentee/out-of-area landlord segment.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
L5 — 4-unit landlord, Pasig, Facebook + signs, midnight runners, "if it's free"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Download app: YES (conditional on free)
Reason: Highest landlord pain score (4/5). Midnight runners. Late payments. Already uses
  Facebook. "If it's free, we might use it." "Especially if it includes a profile of the tenant's
  background."
Complete onboarding: YES
Reason: Uses Facebook (digitally comfortable). Has clear pain. Product directly addresses
  both his stated needs: free + tenant background profile.
Use actively: YES (if verified tenants actually connect)
Reason: Active user IF the platform delivers what it promises — better tenants. If the first
  verified tenant connection leads to a good rental experience, L5 becomes the platform's
  champion in Pasig.
What would change his mind from YES to NO: If no tenants connect within 30 days of
  listing. Empty inbox = abandoned app.
Adoption probability: 75%
Value to platform: Highest — anchor landlord for Pasig cluster. Reference case. Referral
  source within his barangay.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
T1 — 28yo BPO worker, migrant, 3 months searching, almost scammed twice, will pay 3%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Download app: YES
Reason: 3 months of searching. "Almost dead." Almost scammed twice. Friend WAS scammed.
  "Yeah. Much better. Yes." on the platform concept. Most pain of any interviewee.
Complete onboarding: YES
Reason: Desperate. BPO employment makes verification easy (Company ID readily available).
  Willing to upload ID because the alternative (3 more months of Facebook searching) is worse.
Use actively: YES (while searching)
Reason: Will use daily until she finds housing. After finding housing: stops using entirely
  (disintermediation — she has no reason to return). This is expected and acceptable.
What would change her mind: Nothing — she is the ideal early adopter. The risk is that
  the platform has too few listings in her area, leading to disappointment.
Adoption probability: 90%
Value to platform: Highest — anchor tenant for BPO acquisition channel. Her batch
  distribution referral (sharing with batchmates) is the flywheel engine.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
T2 — Sophisticated renter, PDCs, background checks, "said NO to platform"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Download app: NO
Reason: "Said NO to platform." Already has her own sophisticated system: PDCs, social media
  background checks, contract requirements. "More value" needed — MVP doesn't offer enough.
Complete onboarding: NO
Use actively: NO
What would change her mind: A premium tier with advanced features (credit checks,
  contract templates, landlord ratings). This is NOT the MVP.
Adoption probability: 5%
Value to platform: None at MVP. NOT our target user.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
T3 — Found place in 1 day, community-embedded, zero pain, cash, no Facebook
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Download app: NO
Reason: Zero need. Found place in 1 day through community referrals. "I still prefer to
  personally go there, walk around, and explore the area." Does not use Facebook for rooms.
  Landlord known through relatives. Zero pain.
Complete onboarding: NO
Use actively: NO
What would change her mind: Nothing. She has the kakilala. She IS the kakilala.
Adoption probability: 0%
Value to platform: None. She is the proof that the kakilala economy works — for those
  inside it. The platform exists for those outside it.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
T4 — "Airbnb for long-term stays," everything in one place, fees kill, cash, strongest reaction
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Download app: YES
Reason: "Strongest of all 9 interviews." Unprompted feature suggestions. "Airbnb for long-
  term stays." "Everything would just be in one place." Facebook search was slow and painful.
Complete onboarding: YES
Reason: High enthusiasm. Cash user (matches MVP — no payment features needed).
  "If there's a fee, they won't go there" — the platform is free. No barrier.
Use actively: YES (while searching, maybe after)
Reason: The "everything in one place" desire suggests T4 would check the app periodically
  even after finding a place, if the platform added useful post-rental features (maintenance
  requests, landlord ratings). At MVP, she stops using after finding housing.
What would change her mind: Nothing — she is the secondary ideal early adopter after T1.
Adoption probability: 80%
Value to platform: High — articulate advocate. Would generate detailed feedback.
  "Airbnb for long-term stays" is a positioning phrase we can use in marketing.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8.2 — 90-Day Forecast

```
ASSUMPTIONS DRIVING THIS FORECAST:
1. Non-technical founder is on the ground in Pasig full-time for 30 days
2. 20 landlord listings acquired through Actions 1-6 in Section 2.4
3. 15 of 20 landlords complete verification (75% completion — optimistic given white-glove)
4. BPO batch distribution begins after 5 verified tenants exist
5. Average BPO training batch size: 20 people. Average housing-seeking portion: 30% (6 per batch)
6. Conversion from listing view to connection request: 10% (conservative for new platform)
7. Conversion from connection request to acceptance: 50% (landlords accepting half of verified requests)
8. Manual review capacity: 20 verifications/day (1 reviewer, 2 sessions)

DAY 30:
├── Verified landlord listings live: 12–15 (of 20 acquired, accounting for 75% completion
│   rate and some taking longer than 30 days to fully verify both ID and property proof)
├── Verified tenant profiles: 8–12 (5 from founder white-glove + 3–7 from early BPO
│   batch word-of-mouth. Conservative — the batch flywheel takes time to start)
├── Successful matches (phone revealed both ways): 1–3 (with 10 tenants viewing 15
│   listings, approximately 15 connection requests at 10% conversion, 7–8 accepted at 50%,
│   1–3 resulting in mutual verified connections)
├── Scam reports received: 0 (expected — all landlords are founder-vetted at this stage)
└── Most likely failure: Not enough tenants. 12 verified tenants is the weakest link.
    If BPO batch distribution does not start by Day 20, tenant acquisition stalls.

DAY 60:
├── Verified landlord listings: 25–35 (organic growth from L5-type referrals + founder
│   expanding to Mandaluyong if Pasig proves viable. 2–3 new landlords/week)
├── Verified tenants: 30–50 (if the BPO batch flywheel started at Day 20–25, each
│   verified tenant brings 1–2 batchmates. 8 initial tenants × 2 referrals = 16 additional
│   over 30 days. Plus continued founder outreach: 30 + 16 + 4 new = 50)
├── Successful matches: 8–15 (cumulative. More tenants + more listings = higher match
│   rate. Estimated 3–5 new matches per 2-week period)
├── Is word-of-mouth starting? UNCLEAR — the metric is: are tenants signing up
│   without founder contact? If 10+ tenants registered without any founder involvement,
│   word-of-mouth has started. If all 50 required founder outreach, it has not.
└── Most likely failure: Landlord engagement drop-off. Landlords who listed on Day 10
    and received zero connection requests by Day 60 will assume the platform is dead.
    Mitigation: founder personally notifies landlords when any tenant views their listing
    ("May nag-view ng listing mo!" SMS).

DAY 90:
├── Verified landlord listings: 40–60 (if Mandaluyong expansion triggered at Day 60)
├── Verified tenants: 60–100 (exponential if flywheel is working, linear if not)
├── Successful matches: 20–35 (cumulative)
├── Geographic expansion ready? YES if: 50+ verified listings in Pasig cluster,
│   10+ matches, and tenant sign-up rate exceeding 5/week without founder outreach.
│   NO if tenant growth is still founder-dependent.
├── Flywheel started? METRIC: 5 consecutive tenant sign-ups where the referral source
│   is "batchmate told me" or the install came from the batch share link.
└── KILL CONDITION: Fewer than 5 successful verified connections (both phones revealed)
    after 90 days with 20+ verified listings live. This means either (a) tenants are not
    finding the listings (distribution failure), (b) tenants are finding but not connecting
    (trust signal failure), or (c) landlords are not accepting requests (wrong landlord
    segment). Any of these after 90 days of effort and 20+ listings requires a pivot
    conversation.

BASIS FOR THESE NUMBERS:
Landlord acquisition: 20 landlords from Section 2.4 actions. 75% verification completion
  based on fintech KYC completion of 48% (Gitnux) adjusted upward for white-glove
  founder assistance. 2-3 new landlords/week from referrals (each landlord knows 1-2
  others) after Week 4.
Tenant growth: BPO batch size of 20, 30% housing-seeking, 50% who have smartphones
  and would try a free app = 3 new tenants per batch reached. Founder reaches 2 batches
  in first 30 days through BPO corridor outreach = 6 tenants. Plus 5 from white-glove.
Match rate: 10% listing-view-to-request conversion is conservative (Airbnb's booking
  conversion is ~2-5%, but Airbnb has far more alternatives and higher commitment
  per transaction). 50% landlord acceptance is estimated (landlords are motivated to
  fill — the question is whether they trust the verified profile enough to accept).
```

### 8.3 — The Single Biggest Adoption Threat

```
THREAT: Landlord indifference — "I don't need this."
Evidence: 3/5 landlords fill units in hours to days (L3, L4 Pasig, L5). Only L4's son
  (Makati unit, no network) has genuine vacancy pain. L5's pain is bad tenants, not
  missing tenants. The platform's value proposition is "better tenants" not "more tenants."
  But "better tenants" is a prevention benefit — it prevents a problem (midnight runners)
  that happens maybe once every few years. Prevention benefits are notoriously hard to
  sell because the pain is intermittent, not constant. L5 might list, receive no connection
  requests for 2 weeks, and conclude "wala namang naghahanap dito" — not because
  the platform failed, but because he doesn't NEED tenants right now.
Probability: 55% chance this kills adoption in 90 days.
Mitigation: The shareable verified listing link (Section 2.3) gives landlords value
  independent of tenant supply. Even if zero tenants are on the platform, L5 can share
  his verified listing on Facebook to enhance his existing posts. The founder must
  demonstrate this value during white-glove onboarding: "I-post mo 'to sa Facebook
  group — may badge ka na, iba ka sa lahat ng post doon." Additionally: weekly SMS to
  landlords showing listing stats ("3 tenants viewed your listing this week") creates
  perceived activity even at low volumes.
If mitigation fails: Pivot from "better tenants" to "faster tenants" — change the value
  proposition from quality (verified profile) to speed (guaranteed response within 24
  hours from verified tenants). This requires building response-time tracking and landlord-
  response commitments that are not in the MVP, but could be added in a 2-week sprint.
```

### 8.4 — Behavior Change Audit

```
FOR LANDLORDS (L4/L5 profile):
Current behavior: Posts on Facebook group or puts up a "For Rent" sign. Waits for
  inquiries. Screens by conversation (kutob). Collects cash monthly.
Platform asks them to change: Upload government ID and property proof to an app.
  Create a listing with photos. Wait for verified tenant connection requests instead
  of responding to Facebook DMs.
Magnitude: Medium. The ID upload is the biggest behavior change — sharing a government
  ID with an unknown app. The listing creation is similar to a Facebook post (L5 already
  does this).
Precedent: L5 uses Facebook. He has uploaded photos to Facebook posts. He has shared
  personal information online. The verification step is new but the digital behavior
  pattern exists.
Realistic in 30 days: YES WITH FOUNDER SUPPORT. L5 will not do this independently
  on Day 1. With the founder sitting next to him, walking through each step, and
  explaining the PDPA consent in person, he will complete it. The question is whether
  landlord #6 through #20 can do it WITHOUT the founder. At Day 30, estimate 50%
  can self-serve, 50% still need founder or phone guidance.

FOR TENANTS (T1/T4 profile):
Current behavior: Searches Facebook groups. Sends 50+ messages. Visits 10+ places.
  Gets ghosted. Almost gets scammed. Eventually finds something through persistence.
Platform asks them to change: Download a new app. Upload government ID and employment
  proof. Wait for verification (24-48 hours). Then search and send connection requests.
Magnitude: Small for download and search (same behavior as Facebook). Medium for
  ID upload (new behavior — but T1 was ALREADY sharing IDs manually with landlords
  she visited in person). Low for employment proof (BPO workers have Company ID in
  their wallet daily).
Precedent: T1 already visits places in person and shows her ID to landlords. She already
  sends dozens of messages on Facebook. The platform replaces a behavior she is already
  doing — it just formalizes it and adds verification on the other side.
Realistic in 30 days: YES. T1-profile tenants are desperate. "Almost dead" after 3 months.
  Any new option that promises safety and verified listings will be tried immediately.
  The 24-48 hour verification wait is the only friction — but for a user who has been
  searching for 3 months, 2 days is nothing.
```

### 8.5 — Path From Free to Monetized

```
PHASE 1 — TRUST BUILDING (months 1-6):
├── Model: Free everything. Zero revenue.
├── Duration trigger: 500 verified users (250 landlords + 250 tenants) across
│   Pasig-Mandaluyong corridor, with 50+ successful verified connections.
├── Goal: Prove that verified connections lead to actual rental agreements.
│   The platform must demonstrate that "verified" has meaning — that landlords
│   who accept verified tenants have better experiences than Facebook tenants.
└── What "proven" looks like: 10+ landlords independently tell the founder (or
    respond to a survey) that the verified tenant was "okay" or better. This is
    qualitative proof that the screening value proposition is real.

PHASE 2 — FIRST REVENUE TEST (months 6-12):
├── What to charge: Tenant-side premium visibility. ₱199/month for "Priority Tenant"
│   status that moves verified tenants to the top of landlord inboxes. NOT a gate on
│   verification — verification stays free. The charge is for preferential placement,
│   not for access to verified landlords.
├── Why this specific charge: T4 said "if there's a fee regarding registration, they
│   won't go there." Registration stays free. The ₱199 fee is optional and positioned
│   as a "boost" — similar to Carousell's bump feature. T1 said she would pay 3% for
│   reservation protection (3% of ₱5K rent = ₱150). ₱199 is in the same range and
│   provides a different but analogous value.
├── Expected adoption impact: 90% of tenants continue using free tier. 10% upgrade
│   for faster landlord response. Zero landlord churn because landlord side stays free.
│   T4 explicitly: "If there's a fee, they won't go there" — but T4 was talking about
│   registration fees, not optional boost fees. This is a crucial distinction.
├── Based on: T4's fee sensitivity + T1's willingness to pay ₱150 for protection.
│   ₱199 is below T1's stated threshold and above zero.
└── Revenue estimate at 500 active tenants: 50 premium × ₱199 = ₱9,950/month (~$175)

PHASE 3 — SUSTAINABLE (months 12+):
├── Model: Freemium for tenants (basic search free, premium placement paid).
│   Landlord-side premium features (priority listing, multiple unit management,
│   analytics dashboard) at ₱499-999/month. Commission on successful matches
│   (₱500-1000 per verified connection) if and only if users accept this model
│   based on Phase 2 data.
└── This is speculative and should be revisited based on Phase 1 and 2 learnings.
```

### 8.6 — The L3 Referral Design

```
THE L3 REFERRAL TRIGGER:
What she needs to see/hear/experience: L3 (75 years old, fills units in hours, cash
  only) will never use the app. But she will hear about it from a neighboring landlord
  who DID use it. When L5 (who lives in the same Pasig area) tells L3: "May app na
  pala, free, may background profile ng tenant — alam mo na kung sino ang papasukin
  mo," L3's response will be: "Talaga? Pero kaya ko pa naman." And then, the next time
  she has a tenant problem (even minor), she will remember L5's mention.
How the platform creates this without her using it: The platform creates the L3
  referral trigger by making L5's experience visible in the local community. When L5
  shares his verified listing link on Facebook, L3's adult children (who DO use Facebook)
  see it. When L5's listing has a "Napatunayan" badge on a link that L3's nephew clicks,
  the nephew mentions it to L3. The platform spreads through the barangay gossip
  network — not through L3 using the app.
What she says to her neighbor: "Yung si [L5], may gamit na app. Verified daw yung mga
  tenant. Libre lang. Baka gusto mo i-try." In Taglish, word-of-mouth referrals are
  endorsements of PEOPLE, not products. L3 is not recommending the app — she is
  recommending L5's experience with the app.
What the neighbor sees: The neighbor (another L4/L5-type landlord) either asks L5
  directly or searches for the app. The neighbor's first experience is the landing page
  with verified listings from their own barangay — social proof that real local landlords
  are using it.
Why this is product design, not marketing: The shareable verified listing link is the
  product mechanism that enables L3's referral. Without a shareable link that L5 can
  post on Facebook and show to neighbors, the word-of-mouth chain breaks. The link
  must look trustworthy (branded, with badge visible in the preview card) and load
  fast on 3G (so the neighbor who clicks it sees the listing immediately, not a loading
  screen).
```

---

## SECTION 9: MINIMUM VIABLE TRUST SIGNAL

### 9.1 — The Primary Trust Signal

The primary trust signal is the "Napatunayan" verified badge on the listing card. Not the verification system. Not the process. The badge — the single green checkmark with the Taglish word "Napatunayan" — is what a user who has been scammed before sees on the home screen and thinks "this might be different."

The badge communicates three things simultaneously: (1) the landlord is a real person (government ID checked), (2) the property is real (ownership proof checked), and (3) someone other than the landlord checked (the platform, as a neutral third party). No other Philippine rental platform communicates all three of these on the listing card. Lamudi's "Certified Partner" badge means "this agent paid for a subscription." Dormy's tiered badges mean "this landlord provided some documents." Neither badge communicates that a neutral third party manually reviewed the documents and confirmed identity.

The badge must be the FIRST non-photo element visible on every listing card. It must use the Napatunayan Green (#16A34A) against white backgrounds for maximum contrast. The Taglish word "Napatunayan" (proven/verified) was selected from the Taglish Language Extraction document because it carries more weight in Filipino than "verified" — it implies something was tested and proven true, not just checked off a list. "Maaasahan" (dependable) was considered but is a quality description, not a factual claim. "Napatunayan" is factual: this person's identity was proven.

How it differs from Lamudi's badge: Lamudi's badge is sold (subscription-based). This badge is earned (document-verified). Lamudi's badge represents a financial relationship between agent and platform. This badge represents a trust relationship between platform and verified identity. Users who encounter Lamudi's badge learn quickly that it does not prevent bait-and-switch or fake pricing — one Trustpilot reviewer drove an hour to a "verified/certified" listing only to find the real price was "more than double." This badge must never become a paid feature.

### 9.2 — Building Credibility Before Track Record

```
CREDIBILITY MECHANISM 1: Founder Transparency
├── What it is: The landing page and "About" screen show the founders' real names,
│   real photos, and a brief story: "Nagsimula kami dahil sa nangyari sa kaibigan namin
│   — na-scam siya habang naghahanap ng apartment sa Manila. Gumawa kami nito para
│   hindi na maulit." Real people behind the app, not a corporate facade.
├── How to implement at bootstrap: A 200-word "About" section with founder selfies.
│   Takes 30 minutes to write and implement.
└── What user sees: "May tao talaga sa likod nito" — there are real people behind this.
    In a market where 67% of Filipinos encounter scams monthly, seeing real faces builds
    more trust than any feature list.

CREDIBILITY MECHANISM 2: Verification Process Transparency
├── What it is: A "Paano kami nag-verify?" section accessible from every badge tap.
│   Shows the exact steps: "1. Government ID checked. 2. Selfie matched to ID. 3.
│   Property proof reviewed. 4. Approved by our team." Not vague "we verify" — specific.
├── How to implement at bootstrap: A static screen/page with the verification steps.
│   30 minutes to build.
└── What user sees: The platform is not just claiming "verified" — it is showing the work.
    Transparency is a trust signal in itself.

CREDIBILITY MECHANISM 3: Real Listing Count
├── What it is: The landing page shows: "X verified landlords sa Pasig." Updated in
│   real-time from the database. Even if X = 12, showing a real number is more credible
│   than hiding the count. A platform that says "Thousands of listings!" with 12 listings
│   is caught lying. A platform that says "12 verified landlords sa Pasig" is honest.
├── How to implement: Database count query, displayed on landing page.
└── What user sees: Honesty. "Hindi marami, pero lahat verified." This resonates with
    the "tapat" (honest) brand adjective.
```

### 9.3 — Offline Trust Infrastructure

```
PARTNERSHIP 1: Barangay offices in target areas
├── What it looks like operationally: Founder visits barangay halls in Ugong, San Antonio,
│   and Kapitolyo. Requests to post a flyer and be listed as a "community resource for
│   rental verification." Does NOT ask for formal endorsement or partnership agreement.
│   Simply asks: "Pwede po ba kaming mag-post ng notice sa board niyo?"
├── What landlord or tenant sees: A flyer at the barangay hall referencing the app.
│   Implicit association: if the barangay allows it, there's a level of community acceptance.
├── First action: Visit Barangay Ugong hall, introduce to barangay captain. Week 1.
└── Success metric: 3 barangay halls with posted flyers within 30 days.

PARTNERSHIP 2: BPO company HR departments
├── What it looks like: Founder contacts HR departments of 3 BPO companies in
│   Ortigas (Accenture, Concentrix, TaskUs). Offers free "housing assistance" for
│   new hires: "We have verified apartments near your office. Here's a link your new
│   hires can use." Does NOT ask for formal partnership. Just offers value.
├── What tenant sees: If HR shares the link during orientation, the platform comes
│   with employer trust — the strongest signal for a new BPO hire.
├── First action: Email to Accenture PH HR with the link + verified listing count. Day 15.
└── Success metric: 1 BPO company shares the link with a training batch within 60 days.

PARTNERSHIP 3: Building administrators in apartment complexes
├── What it looks like: Founder identifies 5 apartment complexes in Pasig with multiple
│   landlords (buildings with 10+ units). Introduces the app to the building admin.
│   Offers to verify all landlords in the building at once (admin can vouch for ownership
│   more easily than individual document submission).
├── What tenant sees: Multiple verified listings from the same building — concentrated
│   supply that feels trustworthy.
├── First action: Visit the largest apartment complex in Barangay Ugong. Week 2.
└── Success metric: 1 building complex with 3+ verified landlords within 30 days.
```

### 9.4 — The Anti-Scam Script Break

The specific scam pattern documented by Dormy.ph and confirmed by T1 and T2's interviews: listing appears on Facebook → private message to interested renter → request for "reservation fee" (₱1,000–₱10,000) via GCash before viewing → scammer disappears after payment.

The script break occurs on the listing detail screen (Section 7.5). When a tenant views a verified listing, the AntiScamBanner component appears: "Napatunayan — may verified ID at property proof ang landlord na ito." This breaks the script because:

The scam requires anonymity. The verified landlord is not anonymous — the platform has their government ID, selfie, and property proof on file. A scammer would need to provide real identity documents to create a verified listing, which is self-defeating (the scam relies on being untraceable).

The scam requires private messaging. The platform's connection flow does not include private messaging between unverified strangers. A tenant cannot message a landlord until they themselves are verified. A landlord cannot see a tenant's phone number until both are verified and the connection is accepted. This eliminates the "DM me on Messenger" step that scammers use to move communication off-platform.

The scam requires advance payment. The platform explicitly does not process payments. There is no "reserve" button, no "deposit" mechanism, no GCash integration. The listing detail page does not contain any payment-related action. The only CTA is "Mag-connect" — which initiates a verified connection, not a financial transaction.

Specific copy that names the scam pattern: On the first listing a new tenant views, a one-time overlay appears with: "PAALALA: Huwag kang magbabayad ng reservation fee bago ma-view ang unit. Ang mga landlord dito, verified na — hindi ka hihingian ng advance bago magkita." The language comes directly from the Taglish extraction: "red flag agad" for the scam warning tone, "hindi to scam" for the reassurance tone.

### 9.5 — The Verification Ceremony

This section is consistent with Section 5.5.

```
TARGET FEELING: Pagiging kinikilala (Being Recognized / Having Standing)
Research grounding: The Kakilala Gap mechanism (140/165) identified LONELINESS (4.6/5)
  and SHAME as the core emotions of the Displaced Migrant avatar. T1 searched for 3 months
  — not because she was incompetent, but because the market did not recognize her as a
  legitimate renter. The verification ceremony is the moment the market recognizes her.
  "Hindi ako bobo. Wala lang akong network." → "May network na ako. Napatunayan na ako."
Screen elements that create this feeling:
  - Green checkmark animation (achievement symbol)
  - "Napatunayan ka na!" as the headline — stated as fact, not congratulation
  - The VerifiedBadge component shown large — the same badge landlords will see
  - Body copy that directly addresses the Kakilala Gap: "Hindi mo na kailangan ng kakilala
    sa Manila."
  - Share button designed for BPO batch distribution
Copy that creates this feeling (every word on screen, in Taglish):
  - Title: "Napatunayan ka na!"
  - Body: "Hindi mo na kailangan ng kakilala sa Manila. Ikaw na mismo ang katibayan — may
    verified ID ka, may confirmed na trabaho. Ang mga landlord, makikita nila na legit ka.
    Hindi ka na stranger — napatunayan ka na."
  - CTA 1: "Humanap ng apartment" (large green button)
  - CTA 2: "May batchmate ka ba na naghahanap din?" (share button, slightly smaller)
The moment this becomes shareable: When the tenant taps the share button, it generates
  a pre-written Messenger message that the tenant can send to their BPO batch GC. The
  message includes: the tenant's first name (social proof from a known person), the
  "Napatunayan" word (trust signal), and the app download link.
Connection to Kakilala Gap: "Hindi mo na kailangan ng kakilala sa Manila. Kailangan mo
  lang ng app na gumagawa ng trabaho ng kakilala." This phrase connects the individual
  verification moment to the structural promise of the platform.
```


---

## SECTION 10: TECH STACK — FINAL DECISIONS

### 10.1 — Monorepo Structure

```
DECISION: Turborepo monorepo with pnpm workspaces.
RATIONALE: Research confirms Turborepo + pnpm as community standard for Next.js + Expo
  monorepos. Claude Code works effectively with monorepos when packages have clear
  boundaries (<30K lines per module). pnpm must use node-linker=hoisted for Expo
  compatibility (Research Section 4.1).

EXACT FOLDER STRUCTURE:
/
├── apps/
│   ├── web/                    # Next.js 16.2 — App Router
│   │   ├── app/               # App Router pages (landing, admin, listing browse)
│   │   ├── components/        # Web-only components (admin dashboard, etc.)
│   │   └── package.json
│   ├── mobile/                # Expo SDK 55 — Expo Router v4.0
│   │   ├── app/               # Expo Router screens (all user-facing flows)
│   │   ├── components/        # Mobile-only components (camera capture, etc.)
│   │   └── package.json
│   └── api/                   # Hono 4.12.x backend
│       ├── routes/            # Route handlers grouped by domain
│       ├── middleware/        # Auth, rate limiting, validation
│       ├── lib/               # Utilities (R2 client, PhilSMS client, etc.)
│       └── package.json
├── packages/
│   ├── db/                    # Drizzle ORM schema and queries
│   │   ├── schema/            # One file per table (users.ts, listings.ts, etc.)
│   │   ├── migrations/        # Generated by drizzle-kit
│   │   ├── queries/           # Typed query functions used by API routes
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   ├── shared/                # Shared types, constants, validation schemas
│   │   ├── types/             # TypeScript types shared across web/mobile/api
│   │   ├── validators/        # Zod schemas used in both client and server
│   │   ├── constants.ts       # Barangay list, BPO company list, etc.
│   │   └── package.json
│   └── ui/                    # Shared UI components (cross-platform where possible)
│       ├── components/        # VerifiedBadge, ListingCard (design tokens)
│       └── package.json
├── CLAUDE.md                   # Context file for Claude Code sessions
├── package.json               # Root workspace config
├── pnpm-workspace.yaml        # Workspace definitions
├── turbo.json                 # Pipeline: build, dev, lint, typecheck
├── .npmrc                     # node-linker=hoisted (required for Expo)
└── .env.example               # All required env vars documented

WHY THIS STRUCTURE:
- apps/ contains deployable applications. packages/ contains shared libraries.
- Rule: If code is used by 2+ apps → packages/. If only one app → stays in apps/.
- Claude Code benefits: Each package is <5K lines at MVP. Claude Code can load one
  package at a time without context overflow. Clear boundaries prevent Claude Code
  from making changes that cross package boundaries unintentionally.
- The api/ is in apps/ (not packages/) because it is a standalone deployable service,
  not a shared library.
```

### 10.2 — Frontend Web

```
DECISION: Next.js 16.2 with App Router
RATIONALE: Research Section 4.1 confirmed Next.js as the community consensus for
  React-based web apps. App Router is the current default. Self-hosting requires
  output: 'standalone' mode. ISR is NOT used at MVP (avoids Redis dependency).

KEY DEPENDENCIES:
├── UI components: shadcn/ui (latest — individual component installs, not a package version)
│   Why: Free, customizable, works with Tailwind, Claude Code has extensive training data.
├── State: Zustand 4.5.5
│   Why: Simple, no boilerplate, works well with Claude Code pattern generation.
├── Data fetching: TanStack Query 5.x
│   Why: Server-side + client-side caching, shared pattern with mobile.
├── Forms: React Hook Form 7.x + Zod 3.23.x
│   Why: Validation shared between client and server via packages/shared/validators/.
├── Auth client: better-auth 1.5.x client
└── Image: next/image (built-in, requires sharp for self-hosted production optimization)

REJECTED ALTERNATIVES:
├── Remix: Smaller ecosystem, less Claude Code training data, harder to self-host.
└── SvelteKit: Claude Code has significantly less Svelte training data than React.

SELF-HOSTING NOTE:
- next.config.js must include: output: 'standalone'
- Run via: node apps/web/.next/standalone/server.js (behind Nginx proxy)
- Features that DON'T work self-hosted without extra config: ISR (needs custom cache
  handler + Redis), Image Optimization (needs sharp installed), Middleware Edge Runtime
  (runs in Node.js instead — acceptable for MVP).
- Static assets served by Nginx directly from apps/web/.next/static/
```

### 10.3 — Frontend Mobile

```
DECISION: Expo SDK 55 with Expo Router v4.0
RATIONALE: Research Section 4.1 confirmed Expo as React Native standard. Claude Code +
  Expo compatibility confirmed. Expo Router provides file-based routing matching
  Next.js patterns (reduces mental overhead for one developer).

KEY DEPENDENCIES:
├── Navigation: expo-router 4.x
├── UI: NativeWind 4.x (Tailwind CSS in React Native)
│   Why: Same utility classes as web — Claude Code writes consistent styles.
├── State: Zustand 4.5.5 (shared with web via packages/shared)
├── Data: TanStack Query 5.x (shared with web)
├── Camera: expo-camera 16.x + expo-image-picker 16.x
│   Why: ID photo capture and selfie for verification flow.
├── Secure storage: expo-secure-store 14.x
│   Why: Auth session tokens stored securely on device (not AsyncStorage).
├── Push: expo-notifications 0.29.x
│   Why: Two MVP notifications only (connection request + acceptance).
├── Image display: expo-image 2.x
│   Why: Fast image loading with caching, critical for 3G performance.
└── Lists: @shopify/flash-list 1.7.x
    Why: Performant list rendering for listing search results on budget devices.

ANDROID OPTIMIZATION:
├── Target SDK: 34 (Android 14) — covers 85%+ of Philippine Android
├── Minimum SDK: 24 (Android 7.0) — covers 98%+ of Philippine Android
├── Target APK size: Under 15MB
│   Why: Research Section 5 — Facebook Lite is 1.24MB and is #1 social app in PH.
│   Google research: each 6MB increase costs 2% install conversions.
├── Images: expo-image with aggressive compression (quality: 0.6 for listing photos)
└── List performance: FlashList with estimated item sizes for instant scroll.

EAS BUILD CONFIGURATION:
├── Development: Custom dev build via EAS (NOT Expo Go for production testing).
│   Research warns: "Expo Go not for production; use custom dev builds."
├── Preview: EAS Build free tier — 15 iOS + 15 Android builds/month.
├── Production: EAS Build — free tier sufficient at MVP scale.
│   If exceeded: $19/month Starter tier (Research Section 4.2).
└── OTA updates: expo-updates for critical bug fixes without full rebuild.

REJECTED ALTERNATIVES:
├── Flutter: Claude Code has significantly less Dart training data than TypeScript/React.
│   Would fragment the monorepo (separate language from web).
└── Bare React Native: Expo provides camera, push, secure storage out-of-box.
    Bare RN requires manual native module management — unnecessary ops burden.
```

### 10.4 — Backend

```
DECISION: Node.js 22 LTS with Hono 4.12.x
RATIONALE: Research Section 4.1 found Hono is 3-4x faster than Express with TypeScript-
  first design. Smaller ecosystem is acceptable because MVP routes are simple CRUD.
  TypeScript-first means Claude Code generates type-safe routes naturally.

WHY HONO OVER EXPRESS:
Research found developer community shifting toward Hono for new TypeScript projects.
TypeScript-first advantage: no @types packages needed, better inference.
Performance on small Droplet: 3-4x faster request handling matters on a 2 vCPU Droplet
  serving both web and API traffic.

API STYLE DECISION: REST (not tRPC)
RATIONALE: Despite Research Section 4.4 confirming tRPC works with Expo, REST is chosen
  for three reasons: (1) Claude Code has significantly more REST training data,
  (2) REST is universally debuggable with curl/Postman during development,
  (3) REST endpoints can be called from any client without TypeScript dependency —
  useful if a mobile client or third-party ever needs access. tRPC's type safety
  advantage is replicated by sharing Zod schemas from packages/shared/validators/.

KEY DEPENDENCIES:
├── Runtime: Node.js 22 LTS
├── Framework: Hono 4.12.x
├── ORM: Drizzle ORM 0.45
├── Validation: Zod 3.23.x (shared schemas from packages/shared/)
├── Auth: better-auth 1.5.x (server-side)
├── File upload: @aws-sdk/client-s3 3.x (R2 is S3-compatible)
├── Queue: BullMQ 5.25.x + Redis 7.4.x
│   Why: Async verification notification emails, non-blocking ops.
├── Email: Resend 4.1.x
│   Why: Free tier 3,000/month (100/day), simple API, TypeScript SDK.
└── SMS: Custom PhilSMS REST client (no official npm package — simple fetch wrapper)

API ROUTE STRUCTURE:
POST   /auth/send-otp          # Send OTP via PhilSMS
POST   /auth/verify-otp        # Verify OTP, create session
POST   /auth/logout             # Destroy session
GET    /auth/me                 # Get current user + profile

GET    /landlords/me            # Get landlord profile
PATCH  /landlords/me            # Update landlord profile
POST   /landlords/verify/id     # Upload government ID (returns presigned URL)
POST   /landlords/verify/property # Upload property proof (returns presigned URL)

GET    /tenants/me              # Get tenant profile
PATCH  /tenants/me              # Update tenant profile
POST   /tenants/verify/id       # Upload government ID + selfie
POST   /tenants/verify/employment # Upload employment proof

GET    /listings                # Search listings (with filters)
POST   /listings                # Create listing
GET    /listings/:id            # Get listing detail
PATCH  /listings/:id            # Update listing (owner only)
DELETE /listings/:id            # Soft-delete listing (owner only)

POST   /listings/:id/photos     # Get presigned URL for photo upload
DELETE /listings/:id/photos/:photoId # Remove photo

POST   /connections/request     # Tenant sends connection request
GET    /connections/requests     # Landlord: incoming requests; Tenant: sent requests
PATCH  /connections/:id/accept  # Landlord accepts → triggers reveal
PATCH  /connections/:id/decline # Landlord declines
GET    /connections             # Both: active connections with phone numbers

POST   /reports                 # Submit scam report
POST   /storage/presigned-url   # Generic presigned URL generator
POST   /storage/confirm         # Confirm upload completed

GET    /admin/verification-queue    # Admin: pending verifications
PATCH  /admin/verifications/:id     # Admin: approve/reject
GET    /admin/reports               # Admin: pending reports
PATCH  /admin/reports/:id           # Admin: resolve report
GET    /admin/metrics               # Admin: basic counts
```

### 10.5 — Database Schema
*(Written after Section 6 — as required. Every table derived from flow steps.)*

```sql
-- COMPLETE SCHEMA DERIVED FROM USER FLOWS
-- Naming: snake_case, plural table names
-- All timestamps: timestamptz (timezone-aware)
-- All IDs: uuid with gen_random_uuid() default

-- ============================================
-- USERS (Flow A Screen 2, Flow B Screen 2)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) UNIQUE NOT NULL,          -- Philippine format: 09XXXXXXXXX
  role VARCHAR(10) NOT NULL CHECK (role IN ('landlord', 'tenant', 'admin')),
  is_suspended BOOLEAN NOT NULL DEFAULT false, -- Admin can suspend (report queue)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_users_phone ON users(phone);

-- ============================================
-- LANDLORD_PROFILES (Flow A Screen 3)
-- ============================================
CREATE TABLE landlord_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  barangay VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  unit_count INTEGER NOT NULL DEFAULT 1,
  profile_photo_url TEXT,                      -- R2 public bucket URL
  verification_status VARCHAR(20) NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'partial', 'verified', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_landlord_profiles_verification ON landlord_profiles(verification_status);

-- ============================================
-- TENANT_PROFILES (Flow B Screen 3)
-- ============================================
CREATE TABLE tenant_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  profile_photo_url TEXT,
  home_province VARCHAR(100),
  current_barangay VARCHAR(100),
  current_city VARCHAR(50),
  employment_status VARCHAR(20) CHECK (employment_status IN ('bpo', 'student', 'self_employed', 'other')),
  company_name VARCHAR(100),                   -- BPO company or school name
  employment_verified BOOLEAN NOT NULL DEFAULT false,
  move_in_date DATE,
  budget_min INTEGER,                          -- ₱ amount
  budget_max INTEGER,                          -- ₱ amount
  preferred_barangays JSONB DEFAULT '[]',      -- Array of barangay names
  verification_status VARCHAR(20) NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_tenant_profiles_verification ON tenant_profiles(verification_status);

-- ============================================
-- VERIFICATION_DOCUMENTS (Flow A Screen 4, Flow B Screen 4-5)
-- ============================================
CREATE TABLE verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doc_type VARCHAR(30) NOT NULL
    CHECK (doc_type IN ('government_id_front', 'government_id_back', 'selfie',
                         'property_proof', 'employment_proof')),
  r2_object_key TEXT NOT NULL,                 -- NEVER exposed to client
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_id UUID REFERENCES users(id),       -- Admin who reviewed
  reviewed_at TIMESTAMPTZ,
  rejection_reason VARCHAR(200),
  consent_at TIMESTAMPTZ NOT NULL,             -- PDPA consent timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_verification_docs_user ON verification_documents(user_id);
CREATE INDEX idx_verification_docs_status ON verification_documents(status);

-- ============================================
-- LISTINGS (Flow A Screen 5 — listing creation)
-- ============================================
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES landlord_profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  monthly_rent INTEGER NOT NULL,               -- ₱ amount
  barangay VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  property_type VARCHAR(20) NOT NULL
    CHECK (property_type IN ('bedspace', 'room', 'studio', 'apartment')),
  beds_rooms INTEGER DEFAULT 1,
  amenities JSONB DEFAULT '[]',                -- Array: ['wifi','aircon','water_included',...]
  advance_months INTEGER DEFAULT 1,
  deposit_months INTEGER DEFAULT 2,
  description TEXT,
  available_from DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'paused', 'filled')),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_listings_search ON listings(status, city, barangay, monthly_rent);
CREATE INDEX idx_listings_landlord ON listings(landlord_profile_id);

-- ============================================
-- LISTING_PHOTOS (Flow A — listing photo upload)
-- ============================================
CREATE TABLE listing_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  r2_object_key TEXT NOT NULL,                 -- Public bucket key
  position INTEGER NOT NULL DEFAULT 0,         -- Display order
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_listing_photos_listing ON listing_photos(listing_id);

-- ============================================
-- CONNECTION_REQUESTS (Flow C Screen 2)
-- ============================================
CREATE TABLE connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant_profiles(id),
  listing_id UUID NOT NULL REFERENCES listings(id),
  landlord_id UUID NOT NULL REFERENCES landlord_profiles(id),
  message TEXT,                                -- Optional application message (max 500 chars)
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_connection_requests_unique ON connection_requests(tenant_id, listing_id);
CREATE INDEX idx_connection_requests_landlord ON connection_requests(landlord_id, status);

-- ============================================
-- CONNECTIONS (Flow C Screen 4 — the reveal)
-- ============================================
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_request_id UUID UNIQUE NOT NULL REFERENCES connection_requests(id),
  landlord_id UUID NOT NULL REFERENCES landlord_profiles(id),
  tenant_id UUID NOT NULL REFERENCES tenant_profiles(id),
  landlord_phone VARCHAR(15) NOT NULL,         -- Copied at reveal time
  tenant_phone VARCHAR(15) NOT NULL,           -- Copied at reveal time
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_connections_landlord ON connections(landlord_user_id);
CREATE INDEX idx_connections_tenant ON connections(tenant_id);

-- ============================================
-- REPORTS (scam report mechanism)
-- ============================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id),
  reported_user_id UUID REFERENCES users(id),
  reported_listing_id UUID REFERENCES listings(id),
  report_type VARCHAR(30) NOT NULL
    CHECK (report_type IN ('fake_listing', 'scam_attempt', 'identity_fraud', 'other')),
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_reports_status ON reports(status);

-- ============================================
-- SESSIONS (better-auth managed — included for reference)
-- ============================================
-- better-auth creates its own session table. Configuration:
-- Session type: database sessions (not JWT).
-- Reason: Database sessions allow instant revocation (suspend user → session
-- immediately invalid). JWT would require waiting for token expiry.
-- Expiry: 30 days sliding window.
-- Storage: Same PostgreSQL database.
```

### 10.6 — File Storage

```
SERVICE: Cloudflare R2
RATIONALE: Research Section 4.2 — $0 egress (vs. $0.01/GB for DigitalOcean Spaces).
  At scale, egress costs for listing photos viewed thousands of times would be significant
  on other providers. R2 egress is free forever.

BUCKET ARCHITECTURE:
├── RentRayda-verification-docs/     ← PRIVATE
│   ├── Access: Backend only via signed URLs (1hr expiry)
│   ├── Path: verification-docs/{user_id}/{doc_type}/{uuid}.{ext}
│   ├── Encryption: R2 server-side default (AES-256)
│   └── PDPA: 3-year retention after account closure. DPO registration required.
│
├── RentRayda-listing-photos/        ← PUBLIC
│   ├── Access: Public read via R2 public URL, write via presigned URL
│   ├── Path: listings/{listing_id}/{uuid}.{ext}
│   ├── Max size: 2MB per image (client-side compression enforced)
│   └── CDN: Cloudflare automatically caches at edge
│
└── RentRayda-profile-photos/        ← PUBLIC
    ├── Access: Public read
    ├── Path: profiles/{user_id}/avatar.{ext}
    └── Max size: 1MB

UPLOAD FLOW (all buckets):
1. Client requests presigned URL: POST /storage/presigned-url
   Body: { bucket: 'verification-docs'|'listing-photos'|'profile-photos', contentType: 'image/jpeg' }
2. Backend generates signed URL (PutObject, valid 5 minutes) via @aws-sdk/client-s3
3. Client uploads directly to R2 using signed URL (NOT through backend)
4. Client confirms upload: POST /storage/confirm
   Body: { objectKey: 'the-key-returned-in-step-2' }
5. Backend updates database with R2 object key

SDK: @aws-sdk/client-s3 configured with R2 endpoint
R2 endpoint format: https://{account-id}.r2.cloudflarestorage.com

ESTIMATED COST (from Research):
├── Storage: First 10GB free, then $0.015/GB-month
├── Class A writes: $4.50/million (1 million/month free)
├── Class B reads: $0.36/million (10 million/month free)
└── Egress: $0.00 — FREE always
At launch (~500 photos, ~200 verification docs): $0/month (within free tier)
At 10,000 users (~15,000 photos, ~30,000 docs, ~5GB): ~$0.08/month
```

### 10.7 — Authentication

```
DECISION: better-auth 1.5.x
RATIONALE: Research Section 4.1 — self-hosted, TypeScript-first, has dedicated
  @better-auth/expo plugin for mobile. Free and open-source. Research flagged
  Lucia v3 as DEPRECATED (March 2025) — do not use Lucia.

PRIMARY METHOD: Phone number + OTP
├── Why phone-first: T1/T4 profile — phone is primary device. Every Filipino has
│   a phone number. Not everyone has email. 98.5% access internet via phone.
├── Backup: None at MVP. Email recovery added post-MVP if needed.
└── No social auth at MVP: Facebook login adds OAuth complexity. Phone is sufficient.

SMS OTP PROVIDER: PhilSMS (philsms.com)
├── Rationale: Cheapest reliable PH provider with official telco routes to Globe,
│   Smart, and DITO. PhilGEPS accredited. Free Sender ID. No monthly minimum.
│   Credits valid 1 year. REST API with simple integration.
├── Cost per SMS: ₱0.35 (~$0.006) — all carriers
├── At 300 OTPs/month: ₱105 (~$1.80)
├── At 1,000 OTPs/month: ₱350 (~$6.00)
├── At 10,000 OTPs/month: ₱3,500 (~$60)
├── Fallback: iTexMo as secondary (₱0.15-0.25/SMS at scale, no dedicated OTP
│   routing but functional for burst capacity). If both fail: display "Hindi
│   ma-send ang OTP ngayon. I-try ulit in a few minutes."
└── Future migration: In-app TOTP (cost: $0/message) when user base is established.
    GCash shifted to in-app OTPs in Q1 2026 — validates this approach.
    BSP Circular 1213 mandates limiting SMS OTP by June 30, 2026 for financial
    institutions. Non-financial apps are not required to comply, but the industry
    direction is clear: SMS OTP is transitional, not permanent.

SMS PROVIDER DECISION BASIS:
│ Provider      │ Per SMS (₱)  │ OTP Route │ Monthly Min │ Why not chosen        │
│ PhilSMS       │ ₱0.35        │ Official  │ None        │ ✓ CHOSEN              │
│ iTexMo        │ ₱0.15-0.25   │ No        │ None        │ Backup — no OTP route │
│ Txtbox        │ ₱0.30        │ No        │ ₱250        │ Monthly min, no OTP   │
│ M360/Globe    │ ₱0.20-0.40   │ Yes       │ ₱299/mo     │ Globe-only at cheapest│
│ Semaphore     │ ₱0.50 (₱1 OTP)│ Yes      │ None        │ 2-3x more expensive   │
│ Twilio        │ ₱10-12       │ Yes       │ None        │ 30x more expensive    │
│ Infobip Globe │ ₱8.44        │ Yes       │ None        │ 24x more expensive    │
GCash uses Globe's m360 (internal sibling). Maya uses Smart/Soprano suite.
Both leverage parent telco infrastructure — unavailable to third-party apps.
PhilSMS provides the closest equivalent via official telco routing agreements.

OTP CONFIGURATION:
├── Length: 6 digits
├── Expiry: 10 minutes
├── Max attempts: 3 wrong codes → 15-minute lockout
└── Rate limit: 3 OTP sends per phone number per hour

SESSION:
├── Type: Database sessions (NOT JWT)
│   Reason: Database sessions allow instant revocation when admin suspends a user.
│   JWT would require waiting for expiry — unacceptable for fraud response.
├── Mobile: Session token stored in expo-secure-store (encrypted device storage)
├── Web: HTTP-only cookie with SameSite=Strict
└── Expiry: 30 days sliding window (refreshed on each request)

SECURITY:
├── All auth routes: 10 requests/min rate limit per IP
├── OTP brute force: 3 attempts → 15-min lockout (per phone number)
├── Account enumeration: POST /auth/send-otp returns same response whether
│   phone exists or not ("OTP na-send na" — always)
└── Session invalidation on password change: N/A (no passwords, phone-only)
```

### 10.8 — Infrastructure

```
HOSTING: DigitalOcean Droplet
TIER: $24/month (Research Section 4.2)
SPECS: 4 GiB RAM, 2 vCPU, 80 GiB SSD, 4 TB transfer
OS: Ubuntu 24.04 LTS
REGION: Singapore (sgp1) — lowest latency to Manila (~30-50ms)

WHY $24 OVER $12: The $12 Droplet (2 GiB, 1 vCPU) runs PostgreSQL + Node.js +
  Redis + Coolify dashboard on 2 GiB RAM. Coolify alone uses ~500MB. PostgreSQL
  uses ~200-500MB. Node.js app uses ~200MB. That leaves <800MB for actual request
  handling, which is dangerously tight under load. The $24 tier provides breathing room.

SERVICES ON THIS DROPLET (launch config):
├── Nginx (reverse proxy, SSL termination, static asset serving)
├── Node.js app (Hono backend via PM2 cluster mode)
├── Next.js standalone server (via PM2)
├── PostgreSQL 16.4
├── Redis 7.4 (BullMQ jobs + better-auth session store)
└── Coolify dashboard (deployment management)

DEPLOYMENT: Coolify (self-hosted, free)
RATIONALE: Research Section 4.3 — web GUI for managing services, Docker-based,
  auto SSL, S3 backups. Key weakness: consumes server resources for dashboard
  and had 7 CVEs in audit. Acceptable for MVP — the alternative (Dokku) is
  CLI-only, harder for a solo developer context-switching from Claude Code.

NGINX CONFIGURATION:
├── SSL: Let's Encrypt via Coolify auto-provision
├── Gzip: Enabled for text/html, application/json, text/css, application/javascript
├── Rate limiting: 20 req/sec per IP for API routes (burst 40)
├── Static: /apps/web/.next/static/ served directly (bypasses Node.js)
└── Proxy: /api/* → Node.js on port 3001, /* → Next.js on port 3000

CDN: Cloudflare free plan
├── All DNS proxied through Cloudflare (orange cloud)
├── DDoS protection: Free tier (sufficient for MVP)
├── Static assets: Cached at edge (listing photos load fast from nearest POP)
├── SSL: Full (strict) mode — Cloudflare ↔ Origin both encrypted
└── Analytics: Basic traffic stats (free)

COMPLETE MONTHLY COST AT LAUNCH:
├── DigitalOcean Droplet ($24 tier): $24.00/month
├── Cloudflare R2 storage: ~$0 (within free tier first months)
├── SMS OTP (PhilSMS, ~300 verifications): ~$1.80/month
├── Email (Resend, under 3,000/mo): $0/month
├── Expo EAS builds (free tier): $0/month
├── Domain (.ph registration): ~$35/year = ~$2.92/month
├── Monitoring (UptimeRobot free, 5-min checks): $0/month
├── Error tracking (Sentry free, 5,000 errors/month): $0/month
└── TOTAL: ~$27/month (well under $50 constraint)

SCALE TO 10,000 USERS:
├── Upgrade Droplet: At ~2,000 concurrent active users → $48 tier (8 GiB, 4 vCPU)
├── Separate DB: At ~5,000 users → DigitalOcean Managed PostgreSQL $15/month
├── Separate Redis: At ~5,000 users → stays on Droplet (lightweight)
└── Estimated total at 10,000 users: $48 (Droplet) + $15 (DB) + $10 (SMS) +
    $3 (domain) = ~$80/month

BACKUP:
├── Database: pg_dump daily → pipe to Cloudflare R2 backup bucket
├── Script: Cron job at 3:00 AM PHT (UTC+8)
├── Retention: 14 rolling days (oldest deleted when new backup created)
├── RTO (Recovery Time Objective): 2 hours (restore from R2 + replay)
├── RPO (Recovery Point Objective): 24 hours (acceptable for MVP)
└── Test restore: Monthly manual test to verify backup integrity

MONITORING:
├── Uptime: UptimeRobot free tier (5-minute checks, email + SMS alerts)
├── Errors: Sentry free tier (5,000 errors/month, source maps)
├── Basic metrics: Coolify built-in (CPU, RAM, disk per service)
└── Alerting: Email for downtime, Sentry for runtime errors

CI/CD:
├── GitHub Actions (free tier — 2,000 minutes/month)
├── Trigger: Push to main branch
├── Steps: Install → Typecheck → Lint → Build → Deploy via Coolify webhook
└── Zero-downtime: PM2 cluster mode reload (graceful restart)
```


---

## SECTION 11: CLAUDE CODE OPTIMIZATION

### 11.1 — The CLAUDE.md File

```markdown
# RentRayda — Claude Code Context
# ↑ REPLACE RentRayda with your actual app name on day one.
#   Search and replace all instances of RentRayda in this file.
# ALWAYS read this file before writing any code.
# Update the CURRENT FOCUS section at the start of every session.

## WHAT THIS APP IS

This is a trust-first rental connection app for the Philippine informal rental market
(₱3K-15K/month). It serves displaced provincial migrants (BPO workers) who need housing
in Metro Manila but have no local connections, and informal landlords (2-10 units, cash
rent) who need to screen strangers before opening their doors. The platform verifies
both landlord identity + property ownership and tenant identity + employment, then
reveals phone numbers only when BOTH sides are verified. It is NOT a property management
tool, NOT a payment platform, NOT a social network, and NOT a broker marketplace. The
core transaction is the verified connection reveal — the moment both parties get each
other's phone number. Everything else exists to get users to that moment.

## CURRENT FOCUS
# HOW TO UPDATE THIS SECTION:
# At the start of every Claude Code session, overwrite this section with:
# - Feature name you are building (from the product document Section 3)
# - Specific files you are working in
# - Acceptance criteria for today's session
# - Any decisions made in previous sessions that affect today
#
# Example:
# Working on: tenant-profile-creation
# Files: packages/db/schema/tenants.ts, apps/mobile/app/onboarding/
# Done when: Tenant can submit profile form, data saves to tenant_profiles table
# Previous decision: Using expo-image-picker for photo capture

## TECH STACK

Backend:
- Runtime: Node.js 22 LTS
- Framework: Hono 4.12.x
- Port: 3001 (development)
- Start: pnpm --filter api dev

Web Frontend:
- Framework: Next.js 16.2 App Router
- Port: 3000 (development)
- Start: pnpm --filter web dev

Mobile Frontend:
- Framework: Expo SDK 55 with Expo Router v4.0
- Start: cd apps/mobile && npx expo start
- Test on: Custom dev build (NOT Expo Go for production testing)

Database:
- PostgreSQL 16.4 at localhost:5432
- Database name: RentRayda_dev (development), RentRayda_prod (production)
- ORM: Drizzle 0.45
- Schema files: packages/db/schema/ (one file per table)
- Run migrations: pnpm --filter db migrate
- View data: pnpm --filter db studio (opens Drizzle Studio)

File Storage:
- Cloudflare R2 (S3-compatible API)
- SDK: @aws-sdk/client-s3 configured with R2 endpoint
- Upload pattern: ALWAYS presigned URL. Client uploads directly to R2.
- NEVER proxy file uploads through the backend.
- Verification docs bucket: PRIVATE — signed URLs only, 1hr expiry
- Listing photos bucket: PUBLIC — direct URL access via R2 public endpoint
- Profile photos bucket: PUBLIC — direct URL access

Authentication:
- Package: better-auth 1.5.x with @better-auth/expo plugin
- Primary method: Phone + SMS OTP via PhilSMS
- Session: Database sessions (NOT JWT) stored in PostgreSQL
- Check auth in backend:
  ```typescript
  import { auth } from '../lib/auth';
  // In Hono route:
  app.use('/api/*', async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: 'Unauthorized' }, 401);
    c.set('user', session.user);
    c.set('session', session.session);
    await next();
  });
  ```
- Check auth in mobile (Expo):
  ```typescript
  import { useSession } from '@better-auth/expo';
  const { data: session, isPending } = useSession();
  if (!session) redirect('/login');
  ```

## PROJECT STRUCTURE

```
/
├── apps/
│   ├── web/                    # Next.js 16.2 — landing page, admin dashboard, listing browse
│   ├── mobile/                # Expo SDK 55 — all user-facing onboarding and transaction flows
│   └── api/                   # Hono 4.12.x — REST API backend serving both web and mobile
├── packages/
│   ├── db/                    # Drizzle ORM — schema definitions, migrations, typed queries
│   ├── shared/                # Shared TypeScript types, Zod validators, constants
│   └── ui/                    # Shared UI component design tokens (VerifiedBadge, etc.)
├── CLAUDE.md                   # This file
├── package.json               # Root workspace (pnpm)
├── pnpm-workspace.yaml
├── turbo.json                 # Pipeline: build, dev, lint, typecheck
├── .npmrc                     # node-linker=hoisted (required for Expo)
└── .env.example               # All env vars documented
```

## DATABASE SCHEMA

Key tables and their purpose:
- users: Core identity — phone number, role (landlord/tenant/admin), suspension status.
- landlord_profiles: Landlord details — name, barangay, city, unit count, profile photo URL, verification_status.
- tenant_profiles: Tenant details — name, province, employment status, company name, budget range, preferred areas, verification_status.
- verification_documents: SENSITIVE — stores R2 object keys (never file content) for government IDs, selfies, property proofs, employment proofs. Includes reviewer ID, rejection reasons, PDPA consent timestamps.
- listings: Rental listings — title, rent, barangay, type, amenities JSON, status (draft/active/paused/filled), last_active_at for freshness.
- listing_photos: Photo references — R2 object keys for public listing photo bucket, display position order.
- connection_requests: Tenant-to-landlord connection attempts — includes optional message, status (pending/accepted/declined).
- connections: The revealed connection — stores both phone numbers, created only when both parties are verified and landlord accepts.
- reports: Scam reports — reporter, reported user/listing, type, description, review status.

Full schema: packages/db/schema/

Key relationships:
- users → landlord_profiles (one-to-one via landlord_profiles.user_id)
- users → tenant_profiles (one-to-one via tenant_profiles.user_id)
- users → verification_documents (one-to-many via verification_documents.user_id)
- landlord_profiles → listings (one-to-many via listings.landlord_profile_id)
- listings → listing_photos (one-to-many via listing_photos.listing_id)
- tenant_profiles + listings → connection_requests (many-to-many via tenant_id + listing_id)
- connection_requests → connections (one-to-one via connections.connection_request_id)
- users → reports (one-to-many as reporter via reports.reporter_id)

## AUTHENTICATION PATTERNS

How to protect an API route:
```typescript
// apps/api/routes/listings.ts
import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

const listings = new Hono();
listings.use('/*', authMiddleware); // All routes require auth

listings.get('/', async (c) => {
  const user = c.get('user');
  // user.id, user.role, user.phone available
  const results = await getActiveListings(c.get('db'));
  return c.json({ data: results });
});
```

How to check verification status:
```typescript
// In a route that requires verified user:
const profile = await getLandlordProfile(db, user.id);
if (profile.verificationStatus !== 'verified') {
  return c.json({ error: 'Kailangan mong ma-verify muna.' }, 403);
}
```

User types and their permissions:
- landlord: Can create/edit own listings, view incoming connection requests, accept/decline requests, view own connections, submit reports.
- tenant: Can browse all active verified listings, send connection requests (if verified), view own sent requests and connections, submit reports.
- admin: Can view verification queue, approve/reject verifications, view report queue, resolve reports, suspend users/listings, view basic metrics dashboard. Admin routes are under /admin/* prefix.

## VERIFICATION SYSTEM

Verification states (landlord_profiles.verification_status):
- 'unverified': Registered, no documents submitted. Listings in 'draft' only.
- 'pending': Documents submitted, awaiting ops team review.
- 'partial': Government ID verified, property proof still pending.
- 'verified': Fully verified — listings appear in search. Can accept connections.
- 'rejected': Documents rejected — user shown reason, can resubmit.

Verification states (tenant_profiles.verification_status):
- 'unverified': Registered, no documents submitted. Cannot send connection requests.
- 'pending': Documents submitted, awaiting review.
- 'verified': ID + employment confirmed. Can send connection requests.
- 'rejected': Documents rejected — can resubmit.

Connection reveal rule:
BOTH landlord.verification_status = 'verified' AND tenant.verification_status = 'verified'
must be true BEFORE phone numbers are revealed. This check happens SERVER-SIDE in the
PATCH /connections/:id/accept route. NEVER trust the client to enforce this.
NEVER reveal a phone number when either party is not verified.

## KEY BUSINESS RULES — NEVER VIOLATE

1. Zero payment processing — no GCash routes, no payment endpoints, no escrow logic.
2. Phone numbers revealed ONLY when BOTH parties have verification_status = 'verified' AND connection_request.status = 'accepted'.
3. Government ID images stored ONLY in PRIVATE R2 bucket — signed URLs with 1-hour expiry.
4. Never expose verification_documents.r2_object_key to any client response directly. Generate signed URLs server-side.
5. All /admin/* routes require user.role = 'admin' middleware check.
6. Listings appear in search results ONLY if the landlord's verification_status = 'verified' AND listing.status = 'active'.
7. Connection requests can ONLY be sent by tenants with verification_status = 'verified'.
8. Landlord onboarding must be 5 screens or fewer in happy path.
9. Never store government ID file content in the database — only R2 object keys.
10. Verification status changes ONLY through admin routes (PATCH /admin/verifications/:id). No self-service verification status changes.
11. Listing photos → PUBLIC R2 bucket. Verification docs → PRIVATE R2 bucket. Never swap these.
12. When writing new features: check this list first. If the feature conflicts with any rule, stop and get founder approval before proceeding.

## COMMON CODE PATTERNS

### API Route (Hono):
```typescript
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { db } from '../../packages/db';
import { listings } from '../../packages/db/schema/listings';
import { eq, and } from 'drizzle-orm';

const listingsRouter = new Hono();
listingsRouter.use('/*', authMiddleware);

listingsRouter.post('/',
  zValidator('json', z.object({
    unitType: z.enum(['bedspace', 'room', 'apartment']),
    monthlyRent: z.number().int().min(500).max(100000),
    barangay: z.string().min(2),
    beds: z.number().int().min(1).max(20).optional(),
    inclusions: z.array(z.string()).optional(),
    description: z.string().max(200).optional(),
  })),
  async (c) => {
    const user = c.get('user');
    const body = c.req.valid('json');
    const [listing] = await db.insert(listings).values({
      landlordProfileId: user.landlordProfileId,
      ...body,
      status: 'draft',
    }).returning();
    return c.json({ data: listing }, 201);
  }
);
```

### Database Query (Drizzle):
```typescript
import { db } from '../index';
import { listings } from '../schema/listings';
import { landlordProfiles } from '../schema/landlord-profiles';
import { listingPhotos } from '../schema/listing-photos';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function getActiveListings(filters: {
  barangay?: string;
  minRent?: number;
  maxRent?: number;
}) {
  const conditions = [
    eq(listings.status, 'active'),
    eq(landlordProfiles.verificationStatus, 'verified'),
  ];
  if (filters.barangay) conditions.push(eq(listings.barangay, filters.barangay));
  if (filters.minRent) conditions.push(gte(listings.monthlyRent, filters.minRent));
  if (filters.maxRent) conditions.push(lte(listings.monthlyRent, filters.maxRent));

  return db.select()
    .from(listings)
    .innerJoin(landlordProfiles, eq(listings.landlordProfileId, landlordProfiles.id))
    .leftJoin(listingPhotos, eq(listingPhotos.listingId, listings.id))
    .where(and(...conditions))
    .orderBy(listings.lastActiveAt);
}
```

### Presigned URL Generation:
```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function generateUploadUrl(bucket: string, prefix: string, contentType: string) {
  const key = `${prefix}/${randomUUID()}.jpg`;
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes
  return { uploadUrl: url, objectKey: key };
}

export async function generateViewUrl(bucket: string, key: string) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
}
```

### Error Response Format:
```typescript
// Standard error response shape — use everywhere
return c.json({
  error: 'Human-readable error message in Taglish',
  code: 'MACHINE_READABLE_CODE',
}, statusCode);
// Examples:
// { error: 'Hindi tama ang OTP code.', code: 'INVALID_OTP' }
// { error: 'Kailangan mong ma-verify muna.', code: 'NOT_VERIFIED' }
```

### Success Response Format:
```typescript
// Standard success response shape — use everywhere
return c.json({
  data: resultObject, // or resultArray
}, statusCode);
// Always wrap in { data: ... } for consistency
```

## ENVIRONMENT VARIABLES

Required in all environments:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/RentRayda_dev"
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_VERIFICATION="RentRayda-verification-docs"
R2_BUCKET_LISTINGS="RentRayda-listing-photos"
R2_BUCKET_PROFILES="RentRayda-profile-photos"
R2_ENDPOINT="https://{account-id}.r2.cloudflarestorage.com"
R2_PUBLIC_URL="https://pub-{hash}.r2.dev"
PHILSMS_API_KEY=""
RESEND_API_KEY=""
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL="http://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3001"
NODE_ENV="development"
PORT="3001"
REDIS_URL="redis://localhost:6379"
```
# When adding new env vars: add here AND to .env.example AND to Coolify config.
# Never hardcode secrets in source files — always use process.env.

## LOCAL DEVELOPMENT SETUP

1. Clone repo: git clone [repo-url] && cd RentRayda
2. Install dependencies: pnpm install
3. Copy env: cp .env.example .env (fill in all values)
4. Start PostgreSQL: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:16
5. Start Redis: docker run -d -p 6379:6379 redis:7
6. Create database: createdb RentRayda_dev
7. Run migrations: pnpm --filter db migrate
8. Start all services: pnpm dev (Turborepo runs all apps in parallel)
9. Open web: http://localhost:3000
10. Open mobile: cd apps/mobile && npx expo start

## DEPLOYMENT

1. Push to main branch on GitHub
2. GitHub Actions runs: typecheck → lint → build
3. If passes: Coolify webhook triggers deployment
4. Coolify pulls latest, builds Docker containers, deploys with zero-downtime restart
5. Verify: Check https://[domain]/api/health returns { status: 'ok' }
6. Verify: Check Sentry for new errors in the deployment
7. Verify: Run one full flow (register → verify → create listing) on production

## WHAT NOT TO DO

1. Never add payment routes or GCash/Maya/PayMongo integration
2. Never serve verification document files directly — presigned URLs only
3. Never reveal phone numbers without checking BOTH verification statuses server-side
4. Never use Supabase, Vercel, Firebase, or Heroku for any part of the stack
5. Never write raw SQL — use Drizzle query builder for all database operations
6. Never skip Zod validation on API routes — every input must be validated
7. Never add features that require money movement through the platform
8. Never make the landlord onboarding longer than 5 screens
9. Never store government ID file content in the database — R2 object keys only
10. Never put verification documents in the public R2 bucket
11. Never change verification_status without going through the admin verification route
12. Never add map/GPS features without founder approval (cost + complexity)
13. Never build review or rating features — excluded from MVP scope entirely
```

### 11.2 — Claude Code Session Protocol

```
BEFORE EACH SESSION:
1. Update CURRENT FOCUS section in CLAUDE.md with today's feature + files + criteria
2. Start with: "Read CLAUDE.md. We are building [feature]. Acceptance criteria: [criteria]."
3. Keep session scope to one feature flow or one API domain at a time

TASK SIZING:
- One API route + one mobile screen = good session size (2-4 hours)
- One complete feature (DB + API + screen) = large session, may need to split
- Database schema changes = always start a fresh session (run migrations first)
- Never ask Claude Code to refactor AND add features in the same session

WHEN CLAUDE CODE MAKES WRONG DECISIONS:
- Say: "Stop. This violates [specific CLAUDE.md rule #X]. Reset to [point].
  The constraint is: [restate the rule]. Try this instead: [new direction]."

SECURITY-CRITICAL CODE (always review manually before committing):
- Anything touching verification_documents table
- Anything generating or serving presigned URLs
- The connection reveal logic (PATCH /connections/:id/accept)
- Auth middleware and session validation
- All /admin/* route guards

ALWAYS RUN BEFORE COMMITTING:
- pnpm typecheck (catches type errors across all packages)
- pnpm lint
- Test the specific flow on mobile device or Expo Go
```

### 11.3 — Five Claude Code Session Prompts

```
PROMPT 1 — Database migration:
"Read CLAUDE.md. I need to add the listings table to the database.
Create a Drizzle schema file at packages/db/schema/listings.ts with
these columns: id (uuid, primary key), landlord_id (uuid, FK to
landlord_profiles), title (varchar 200), monthly_rent (integer),
barangay (varchar 100), city (varchar 50), property_type (enum:
bedspace, room, studio, apartment), beds_rooms (integer), amenities
(jsonb), advance_months (integer), deposit_months (integer),
description (text), available_from (date), status (enum: draft,
active, paused, filled), last_active_at (timestamptz), created_at,
updated_at. Then generate and run the migration. Do not modify
existing schema files."

PROMPT 2 — API endpoint:
"Read CLAUDE.md. Create a GET endpoint at /listings in
apps/api/routes/listings.ts. This endpoint returns active listings
where the landlord is verified. Accept query params: barangay (string,
optional), minRent (number, optional), maxRent (number, optional),
page (number, default 1). Validate with Zod. Return paginated results
(10 per page) with listing data + landlord name + verification badge
+ first photo URL. Auth required but no role restriction (both tenants
and landlords can browse). Follow the API Route pattern in CLAUDE.md."

PROMPT 3 — Mobile screen:
"Read CLAUDE.md. Create the TenantProfileScreen at
apps/mobile/app/onboarding/tenant-profile.tsx. This is Screen 3 in
Flow B from the product document. The user sees input fields for:
full_name, profile_photo (expo-image-picker selfie), home_province,
current_barangay, current_city (dropdown: Pasig, Makati, Mandaluyong,
Taguig), employment_status (BPO/Student/Self-employed/Other),
company_name (conditional on BPO or Student), move_in_date (date
picker), budget_min and budget_max (₱ number inputs). On submit:
PATCH /tenants/me with all fields. On success: navigate to verify-id
screen. Style with NativeWind. Design for Android 3G — no heavy
animations, compress profile photo before upload."

PROMPT 4 — Verification upload:
"Read CLAUDE.md. I am implementing the landlord government ID upload.
The screen is at apps/mobile/app/verify/landlord-id.tsx. Backend:
generate a presigned URL for the PRIVATE bucket
(RentRayda-verification-docs). Path format:
verification-docs/{user_id}/gov_id_front/{uuid}.jpg. After the client
confirms upload, create a verification_documents row with doc_type =
'government_id_front', the R2 object key, status = 'pending', and
consent_at = now(). Frontend: use expo-image-picker to capture the ID
photo, upload directly to R2 using the presigned URL, show upload
progress, then confirm via POST /storage/confirm. Include PDPA
consent checkbox that must be checked before upload starts. Do NOT
reveal the R2 object key to the client in any response — only the
presigned upload URL."

PROMPT 5 — Debug production:
"Read CLAUDE.md. There is an issue in production. Symptom: tenant
sees 'Mag-verify ka muna' even though they already submitted
documents. Expected: should show 'Nire-review pa' pending status.
Logs show: tenant_profiles.verification_status is still 'unverified'
after document upload. The relevant code is in apps/api/routes/
tenants.ts — the POST /tenants/verify/id endpoint. The verification
status should change to 'pending' after documents are uploaded. Do
not change any other files. Do not refactor. Show me the minimum fix."
```


---

## SECTION 12: 30-DAY BUILD PLAN

**WEEK 1: FOUNDATION (Days 1-7)**

```
DAY 1 — Infrastructure setup (NOT Claude Code — ops work)
├── Task: DigitalOcean Droplet provisioned ($24 tier, Singapore region)
├── Task: Coolify installed on Droplet, dashboard accessible
├── Task: Domain registered (.ph), Cloudflare DNS configured (orange cloud)
├── Task: GitHub repo created, Turborepo initialized with pnpm workspaces
├── Task: .npmrc with node-linker=hoisted created
├── Task: R2 buckets created (3 buckets: verification-docs, listing-photos, profile-photos)
├── Task: PhilSMS account created, API key obtained
├── Task: Resend account created, API key obtained
├── Task: CLAUDE.md written (from Section 11.1) and placed in repo root
├── Task: .env.example created with all vars documented
├── Claude Code use: NONE today — pure ops and infrastructure
├── Done when: Can deploy a "Hello World" Hono API via Coolify at https://[domain]/api/health
└── Realistic hours: 6-8 hours (infrastructure setup always takes longer than expected)

DAY 2 — Database schema + authentication (Claude Code starts)
├── Claude Code task: PostgreSQL schema for users, landlord_profiles, tenant_profiles
│   (Drizzle schema files in packages/db/schema/, migration generated and run)
├── Claude Code task: better-auth configuration with phone OTP via PhilSMS
│   (apps/api/lib/auth.ts — PhilSMS integration for SMS delivery)
├── Claude Code task: Auth middleware (apps/api/middleware/auth.ts)
├── Manual task: Test OTP delivery to a real Philippine phone number (Globe + Smart)
├── Test: Register → receive OTP → enter code → session created → GET /auth/me returns user
├── Done when: Full registration flow works with real SMS on Philippine carrier
└── Realistic hours: 5-7 hours (PhilSMS integration may require debugging carrier-specific issues)

DAY 3 — R2 storage + presigned URL infrastructure
├── Claude Code task: R2 client configuration (apps/api/lib/r2.ts) using @aws-sdk/client-s3
├── Claude Code task: POST /storage/presigned-url endpoint (generates signed upload URL)
├── Claude Code task: POST /storage/confirm endpoint (records upload completion in DB)
├── Claude Code task: verification_documents table schema + migration
├── Test: Client can request presigned URL, upload a test image to R2 private bucket,
│   confirm upload, and verify file exists in R2 dashboard
├── Done when: End-to-end upload via presigned URL works. File appears in R2.
└── Realistic hours: 4-6 hours

DAY 4 — Landlord onboarding screens 1-3 (mobile)
├── Claude Code task: PhoneEntryScreen (apps/mobile/app/auth/phone.tsx)
├── Claude Code task: OTPEntryScreen + RoleSelectionScreen (apps/mobile/app/auth/otp.tsx)
├── Claude Code task: LandlordProfileScreen (apps/mobile/app/onboarding/landlord-profile.tsx)
│   Profile photo capture via expo-image-picker, upload to R2 public bucket
├── Not today: Verification document upload, listing creation
├── Test: L5-type landlord can register via OTP and create basic profile
├── Done when: landlord_profiles row created with all fields, profile photo in R2 public bucket
└── Realistic hours: 5-7 hours (3 screens with navigation + camera integration)

DAY 5 — Landlord verification upload + listing creation
├── Claude Code task: VerifyIDScreen (apps/mobile/app/verify/landlord-id.tsx)
│   Government ID front + back + property proof upload with PDPA consent
├── Claude Code task: Listing creation form (apps/mobile/app/listings/create.tsx)
│   Minimum fields: title, rent, barangay, city, type, amenities, description
├── Claude Code task: listings table schema + migration
├── Claude Code task: listing_photos table + photo upload to R2 public bucket
├── Test: Landlord can upload ID, upload property proof, create listing with photos
├── Done when: Listing row in DB, photos in R2 public bucket, verification docs in R2 private bucket
└── Realistic hours: 6-8 hours (complex flow with multiple uploads)

DAY 6 — Admin verification dashboard (web only)
├── Claude Code task: Simple admin page (apps/web/app/admin/verifications/page.tsx)
├── Claude Code task: Queue display — list of pending verification_documents
├── Claude Code task: Document viewer — display ID photos via signed URL from R2 private bucket
├── Claude Code task: Approve/Reject buttons with reason codes
├── Claude Code task: Admin role guard middleware
├── Not today: Pretty UI, filters, search, metrics. Functional only.
├── Test: Admin can see submitted docs, view ID images, and approve/reject
├── Done when: Approval changes landlord verification_status to 'verified'
└── Realistic hours: 4-6 hours (internal tool, minimal styling)

DAY 7 — Week 1 testing and bug fixes
├── Task: End-to-end landlord flow tested on real Android device
│   Register → Profile → Upload ID + Property Proof → Create Listing → Admin Approves
├── Task: Fix critical bugs found during Days 2-6
├── Task: Verify OTP delivery reliability on Globe + Smart + DITO
├── Task: Verify R2 uploads work on slow mobile connection (throttle to 3G)
├── Task: Verify admin signed URLs display correctly
├── Done when: Full landlord happy path works on Android without crashes
└── Realistic hours: 6-8 hours (integration bugs always exist)
```

**WEEK 2: TENANT SIDE (Days 8-14)**

```
DAY 8 — Tenant registration + profile creation (mobile)
├── Claude Code task: Role selection branching — if tenant, route to tenant flow
├── Claude Code task: TenantProfileScreen (apps/mobile/app/onboarding/tenant-profile.tsx)
│   All fields: name, selfie, province, current area, employment status, company name,
│   move-in date, budget range, preferred barangays
├── Claude Code task: tenant_profiles table schema + migration
├── Test: T1-type user can register and create full profile
├── Done when: tenant_profiles row created, profile photo in R2 public bucket
└── Realistic hours: 4-6 hours (auth reused from Week 1)

DAY 9 — Tenant government ID + selfie upload (mobile)
├── Claude Code task: VerifyIDSelfieScreen — ID front + back + front-camera selfie
├── Claude Code task: Three verification_documents rows per tenant (id_front, id_back, selfie)
├── Claude Code task: All uploads to R2 private bucket via presigned URLs
├── Claude Code task: tenant_profiles.verification_status → 'pending' after upload
├── Test: T1 uploads ID + selfie, all 3 images in R2 private bucket, visible in admin queue
├── Done when: Documents in R2, DB updated, admin dashboard shows tenant submissions
└── Realistic hours: 5-7 hours (camera integration + private upload flow)

DAY 10 — BPO employment verification upload (mobile)
├── Claude Code task: EmploymentProofScreen with 3 paths (BPO/Student/Other)
├── Claude Code task: BPO path — company ID + payslip/COE upload
├── Claude Code task: Student path — school ID + enrollment form upload
├── Claude Code task: Other path — skip with explanation
├── Claude Code task: Known BPO company list in packages/shared/constants.ts
├── Test: BPO worker uploads company ID from known company → profile shows employer name
├── Done when: Employment docs in R2, linked to tenant profile
└── Realistic hours: 3-5 hours (reuses presigned URL pattern from Day 3)

DAY 11 — Listing search and browse (tenant mobile)
├── Claude Code task: SearchScreen (apps/mobile/app/search/index.tsx)
│   Filters: barangay multi-select, price range slider, property type
├── Claude Code task: GET /listings API with filter params + pagination
│   Rule enforced: only listings where landlord.verification_status = 'verified'
├── Claude Code task: ListingCard component with VerifiedBadge + FreshnessIndicator
├── Claude Code task: EmptyStateView for no results
├── Test: Tenant can search "Pembo" + "₱3,000-8,000" and see verified listing cards
├── Done when: Search returns real listings from Week 1 test data
└── Realistic hours: 5-7 hours (search + filter + list rendering + empty state)

DAY 12 — Connection request flow (tenant → landlord)
├── Claude Code task: "Mag-connect" button on listing detail
├── Claude Code task: ConnectionRequestModal with optional message field
├── Claude Code task: POST /connections/request API
│   Validation: tenant.verification_status must = 'verified' to send request
├── Claude Code task: connection_requests table schema + migration
├── Test: Verified tenant sends connection request; request appears in landlord inbox
├── Done when: connection_requests row created, landlord can see it
└── Realistic hours: 3-5 hours (straightforward at this point — patterns established)

DAY 13 — Landlord inbox + tenant profile viewer
├── Claude Code task: LandlordInboxScreen — list of connection requests
│   Each card shows: tenant name, VerifiedBadge, employment type, message preview
├── Claude Code task: TenantProfileCard — landlord's view of tenant
│   Shows: verified badge, employment, profile info. Does NOT show phone number yet.
├── Claude Code task: Accept / Decline buttons on connection request
├── Claude Code task: PATCH /connections/:id/accept and /decline endpoints
├── Test: Landlord sees tenant profile, taps accept, request status updates
├── Done when: Accept recorded in DB, both sides see status change
└── Realistic hours: 4-5 hours

DAY 14 — Week 2 integration testing
├── Task: Full flow test: landlord posts listing → admin verifies → tenant finds listing →
│   tenant sends connection request → landlord reviews tenant profile → landlord accepts
├── Task: Test on two real Android devices on actual mobile data
├── Task: Verify no phone numbers are revealed at any point yet (reveal flow is Day 15)
├── Task: Fix all broken navigation or DB state inconsistencies
├── Done when: Everything works up to the point of connection acceptance
└── Realistic hours: 6-8 hours (integration testing always surfaces bugs)
```

**WEEK 3: CORE LOOP AND TRUST LAYER (Days 15-21)**

```
DAY 15 — Mutual verified connection reveal (MOST CRITICAL FEATURE)
├── Claude Code task: The reveal logic in PATCH /connections/:id/accept:
│   Server-side check: landlord.verification_status = 'verified' AND
│   tenant.verification_status = 'verified' AND request.status = 'pending'
│   ONLY THEN: create connections row with both phone numbers from users table
├── Claude Code task: ConnectionRevealScreen (apps/mobile/app/connections/reveal.tsx)
│   Uses exact Taglish copy from Section 5.5: "Magkausap na kayo! ✓"
│   Shows: other party's name + verified badge + phone number + call/copy buttons
│   Share button with pre-filled Taglish message (Section 2.6 flywheel trigger)
├── Claude Code task: GET /connections endpoint — returns active connections with phones
├── SECURITY REVIEW: Before committing, manually test:
│   - Can an unverified tenant trick the API into revealing a phone number?
│   - Can the connection be created without both parties being verified?
│   - Does the API return phone numbers in any endpoint other than GET /connections?
├── Test: Two verified test users complete full flow → both see phone numbers on reveal screen
├── Done when: Phone reveal works AND no bypass is possible
└── Realistic hours: 6-8 hours (extra time for security audit — non-negotiable)

DAY 16 — Verified badge display across all screens
├── Claude Code task: VerifiedBadge component (packages/ui/components/VerifiedBadge.tsx)
│   States: verified, pending, partial, unverified, rejected (all visual treatments)
├── Claude Code task: Integrate VerifiedBadge into: ListingCard, ListingDetail,
│   TenantProfileCard (landlord view), ConnectionInbox items, ProfileScreen
├── Test: Create users in each verification state, verify correct badge displays
├── Done when: Every screen shows correct badge state. No false positives.
└── Realistic hours: 4-5 hours (component reuse makes this faster than building new)

DAY 17 — Scam report mechanism
├── Claude Code task: "I-report" link on listing detail + user profile
├── Claude Code task: Report modal — type selector + description field
├── Claude Code task: POST /reports API
├── Claude Code task: reports table schema + migration
├── Claude Code task: Admin report queue page (apps/web/app/admin/reports/page.tsx)
├── Claude Code task: Email notification to ops on new report via Resend
├── Test: Tenant reports a listing → report appears in admin queue → email received
├── Done when: Report flow complete end-to-end
└── Realistic hours: 3-4 hours

DAY 18 — Listing freshness indicator
├── Claude Code task: FreshnessIndicator component
│   Taglish labels: "Aktibo ngayon" / "Kahapon" / "3 araw na" / "1 linggo na" / "Matagal na"
├── Claude Code task: Auto-pause cron job for listings inactive >30 days
│   SMS to landlord via PhilSMS: "Kuya, active pa ba ang unit mo? I-update para hindi ma-pause."
├── Claude Code task: listings.last_active_at updated on any landlord action
├── Test: Create listings with varying ages, verify correct label displays
├── Done when: Freshness visible on all listing cards. Auto-pause fires for 30+ day old listings.
└── Realistic hours: 2-3 hours

DAY 19 — Web landing page + listing browse
├── Claude Code task: Landing page (apps/web/app/page.tsx)
│   Core promise copy from Section 1.2. Anti-scam messaging. App download link.
│   Trust signal: "X verified na landlord sa Pasig" counter.
│   Must NOT look like Lamudi or Rentpad (per Section 7.6).
├── Claude Code task: Web listing browse (apps/web/app/listings/page.tsx)
│   Same search + filter as mobile. For Facebook link preview SEO.
├── Claude Code task: Web listing detail (apps/web/app/listings/[id]/page.tsx)
│   Read-only — CTA: "I-download ang app para mag-connect"
├── Done when: Web shows landing page + listings + detail. Loads fast. Looks trustworthy.
└── Realistic hours: 5-6 hours

DAY 20 — Push notifications (minimal, connection only)
├── Claude Code task: expo-notifications setup + FCM configuration for Android
├── Claude Code task: Two notification types only:
│   1. "May nagpadala ng connection request sa listing mo" → to landlord
│   2. "Tinanggap na ang request mo! Mag-connect na kayo." → to tenant
├── Claude Code task: Store push tokens in users table, send via BullMQ job
├── NOT TODAY: Any other notification type. Only these two.
├── Test: Both notification types received on real Android device
├── Done when: Two notifications working end-to-end on Android
└── Realistic hours: 3-5 hours (FCM setup is the painful part)

DAY 21 — Week 3 security and integration audit
├── Task: Security review of all verification-related routes
│   Test: Can unverified user access verified-only routes?
│   Test: Can phone number be extracted without verified connection?
│   Test: Can verification status be spoofed via direct API calls?
│   Test: Are presigned URLs for private bucket truly expiring after 1 hour?
│   Test: Can admin routes be accessed without admin role?
├── Task: Full end-to-end test with two real phones on different carriers
├── Task: Verify all Taglish copy uses extraction document vocabulary
├── Task: Fix all critical security or flow issues found
├── Done when: Security audit passes. Full flow works on real devices.
└── Realistic hours: 8 hours (security review is non-negotiable)
```

**WEEK 4: POLISH, DEPLOY, FIRST REAL USERS (Days 22-30)**

```
DAY 22 — Verification ceremony polish
├── Claude Code task: Implement Section 5.5 verification ceremony screens exactly
│   Tenant ceremony: green shield animation + "Hindi mo na kailangan ng kakilala"
│   Landlord ceremony: green shield + "Napatunayan ka na, [Name]!"
│   Share buttons with pre-filled Taglish messages for Messenger/Viber
├── Test: Walk through verification with test user — observe emotional impact
├── Done when: Both ceremonies match Section 5.5 specification. Share links work.
└── Realistic hours: 3-4 hours

DAY 23 — Admin dashboard improvements
├── Claude Code task: Verification queue with side-by-side document preview
│   (ID photo + selfie displayed together for face comparison)
├── Claude Code task: Standard rejection reason codes (dropdown, not free text)
├── Claude Code task: Basic metrics dashboard: total users, pending verifications,
│   active listings, successful connections, reports pending
├── Done when: Ops team can efficiently process verifications at 20/hour
└── Realistic hours: 4-5 hours

DAY 24 — Error handling and empty states
├── Claude Code task: EmptyStateView for all empty screens (search, inbox, connections)
│   All copy in Taglish per Section 7.7
├── Claude Code task: Network error handling — retry logic for 3G failures
├── Claude Code task: Form validation errors in Taglish (not English "required field")
├── Claude Code task: Loading skeleton screens for all list views
├── Test: Turn on airplane mode → turn off → verify graceful recovery
├── Done when: No white screens, no unhandled errors, no English-only error messages
└── Realistic hours: 4-6 hours

DAY 25 — Production deployment
├── Task: All env vars set in Coolify production config
├── Task: R2 buckets confirmed accessible from production Droplet
├── Task: Domain SSL confirmed (Cloudflare Full Strict)
├── Task: PhilSMS production API key configured
├── Task: PostgreSQL production database created and migrated
├── Task: Run full end-to-end flow on production URL
├── Claude Code task: Fix any environment-specific bugs
├── Done when: App is live at https://[domain], full flow works in production
└── Realistic hours: 6-8 hours (deployment always has surprises)

DAY 26 — Performance optimization for 3G
├── Claude Code task: Client-side image compression before upload (target: <500KB)
├── Claude Code task: Skeleton loading screens on all list views
├── Claude Code task: Pagination for listing search (10 per page, load more button)
├── Claude Code task: expo-image with aggressive caching for listing photos
├── Test: Throttle to 3G speeds — core screens must be usable within 5 seconds
├── Done when: Listing search loads within 5 seconds on throttled 3G connection
└── Realistic hours: 4-5 hours

DAY 27 — First real landlord onboarding
├── Task: NON-DIGITAL — founder physically visits first target landlord in Pembo
│   Follow White-Glove Protocol from Section 2.8 exactly
├── Task: Guide landlord through entire onboarding flow in person
├── Task: Document every hesitation, confusion, question asked
├── Task: Submit verification documents → ops team reviews → approves
├── Claude Code task: Fix top 3 friction points observed
├── Done when: First real landlord has live verified listing in production
└── Realistic hours: 4 hours visit + 2-4 hours fixes

DAY 28 — First real tenant onboarding
├── Task: Find first T1-profile tenant (BPO worker, provincial, searching)
│   Where: BPO co-working space in Ortigas, or Facebook rental group outreach
├── Task: Guide through onboarding in person (coffee shop meeting)
├── Task: Document confusion points in verification flow especially
├── Claude Code task: Fix top 3 tenant friction points
├── Done when: First real verified tenant, has browsed listings, ideally sent connection request
└── Realistic hours: 4 hours meeting + 2-4 hours fixes

DAY 29 — First real match attempt
├── Task: If Day 27 landlord and Day 28 tenant are in same area, facilitate connection
├── Task: Both walk through connection reveal together — observe emotional reaction
├── Task: Document: Does the reveal feel like an achievement or just a button click?
├── Claude Code task: Any critical copy or flow adjustments based on observation
├── Done when: First real connection completed OR clear documentation of why it didn't happen
└── Realistic hours: Variable — this is product learning, not code

DAY 30 — Stability and documentation
├── Task: 48-hour stability check (no crashes, no data loss since Day 25 deploy)
├── Task: Run Day 30 Checklist (below) — every item must pass
├── Task: Document everything learned from Days 27-29
│   Update CLAUDE.md with any new business rules discovered in the field
├── Claude Code task: Only critical bugs — zero new features today
├── Done when: All checklist items pass. App is stable. Ready for controlled expansion.
└── Realistic hours: 4 hours + monitoring
```

**THE UGLY MVP — WHAT IT LOOKS LIKE AT DAY 30**

```
What will NOT be polished:
├── Visual design — functional but not beautiful. Colors correct, spacing rough.
│   Why acceptable: T4 said "everything in one place" — not "everything pretty."
├── Error handling — major errors caught, edge cases may show generic messages.
│   Why acceptable: <50 users means founders can fix issues in real-time.
├── Admin dashboard — bare-minimum functional. No charts, no pretty UI.
│   Why acceptable: Founders are the only admins. They know how to use it.

What will be MANUAL that looks automated:
├── Verification reviews: Founders personally review every document. Users see
│   "24-48 hours" which feels automated but is two people checking a queue 3x daily.
├── Report handling: Founders read every report and take action manually.
├── Listing quality: Founders may need to help landlords take better photos
│   during white-glove onboarding. No automated quality enforcement.

Why this is acceptable for THIS market:
├── T4 said "everything in one place" — functional beats beautiful.
├── T1 spent 3 months searching on Facebook — even ugly verified listings beat that.
├── L5 said "if it's free" — free + functional beats Lamudi's paid + broken.
├── Research: "Do it until it hurts, then automate it away." (Airbnb's Brian Chesky)
```

**DAY 30 COMPLETION CHECKLIST**

```
The MVP is ready to test with real users when ALL of these are true:
☐ Landlord can register with Philippine phone OTP (Globe/Smart/DITO work)
☐ Landlord can create profile with selfie photo
☐ Landlord can upload government ID (front + back) to private R2 bucket
☐ Landlord can upload property proof to private R2 bucket
☐ Landlord can create listing with photos (public R2 bucket)
☐ Admin can view verification queue and approve/reject with signed URL preview
☐ Approved landlord's listing appears in search with "Napatunayan na" badge
☐ Tenant can register with phone OTP
☐ Tenant can create profile with all fields
☐ Tenant can upload government ID + selfie for verification
☐ Tenant can upload employment proof (BPO company ID)
☐ Verified tenant can search listings by barangay and price
☐ Verified tenant can send connection request with optional message
☐ Landlord sees incoming requests with tenant verification badge
☐ When BOTH verified and landlord accepts → phone numbers revealed
☐ Connection reveal screen shows correct Taglish copy
☐ Scam report can be submitted and appears in admin queue
☐ Push notification works for connection request + acceptance (Android)
☐ App functions on throttled 3G connection (search loads within 5 seconds)
☐ No phone numbers visible anywhere except after mutual verified connection
☐ Government ID images accessible ONLY via signed URLs from admin dashboard
☐ Production deployment stable (no crashes in 48 hours)
☐ At least 1 real landlord and 1 real tenant have completed the flow
```


---

## SECTION 13: LEGAL MINIMUM

### 13.1 — Business Registration

Minimum viable legal structure for testing with real users: Register as a **sole proprietorship** with the Department of Trade and Industry (DTI). This is the fastest, cheapest business registration in the Philippines — can be done online (bnrs.dti.gov.ph) in 1-2 days for ~₱200-1,000. A sole proprietorship allows the founder to operate legally, issue receipts if needed, register with the NPC (required for PDPA), and open a business bank account.

What must happen BEFORE first users: DTI business name registration. This is required before NPC registration, which is required before collecting government IDs.

What can happen AFTER first users (within 90 days): BIR (tax) registration, Mayor's Permit, barangay business clearance. These are legally required but enforcement lag allows a 30-60 day grace period for startups in testing. Do not delay beyond 90 days — NPC enforcement is active (Research: May 2024 privacy sweep found 65 mall tenants without NPC registration).

When to incorporate as a corporation: When co-founders formalize equity split or when raising external investment. Not needed at MVP. Sole proprietorship is sufficient for testing.

### 13.2 — PDPA Compliance Non-Negotiables

From Research Section 2.6 — the Philippine Data Privacy Act (RA 10173) classifies government IDs as sensitive personal information. This triggers the highest protection requirements.

**Consent:** Explicit electronic consent MUST be captured before ANY government ID upload. Implementation: Checkbox on VerifyIDScreen that says "Pumapayag ako na i-store ang aking government ID para sa verification. Basahin ang Privacy Policy." This checkbox must be checked before the camera/upload button becomes active. Consent timestamp stored in verification_documents.consent_at. The consent text must link to a Privacy Policy page.

**Data Protection Officer:** A DPO must be appointed and registered with the NPC within 90 days of beginning to collect sensitive personal information. At MVP scale, the founder IS the DPO. Register at privacy.gov.ph.

**NPC Registration:** Required for entities processing sensitive data. Government IDs qualify. File via NPC's online registration system. Deadline: before collecting first real user's government ID in production.

**Privacy Policy requirements (minimum viable):**
What data is collected: phone number, name, profile photo, government ID images, selfie, employment documents, listing information. Why it's collected: for identity verification to enable trusted rental connections. How it's stored: government IDs in encrypted cloud storage (Cloudflare R2, AES-256), accessible only to authorized verification reviewers. Retention: active account lifetime + 3 years after account closure. User rights: right to access, correct, and delete their data. Contact: DPO email and phone number.

**Security requirements:** Encryption at rest (R2 default AES-256), encryption in transit (HTTPS via Cloudflare + Let's Encrypt), access control (admin role only for verification documents), signed URLs with 1-hour expiry (never permanent access to ID images).

**Breach notification:** If a data breach occurs: notify NPC within 72 hours, notify affected users within 72 hours, document the breach and remediation. At MVP scale, the founder handles this directly.

**Penalties for non-compliance:** Up to 7 years imprisonment and ₱5 million fines for unauthorized processing. Administrative fines ₱20,000-₱50,000 per incident. This is not theoretical — NPC conducts active enforcement sweeps.

### 13.3 — Terms of Service — Required Clauses

**Platform liability disclaimer:** "[App Name] ay verification service. Hindi kami responsible sa anumang nangyari between landlord at tenant after mag-connect kayo. Hindi namin gina-guarantee na safe o mabuti ang kahit sinong user — gina-guarantee lang namin na na-verify ang identity nila."

**Verification disclaimer:** "Verified" means identity has been confirmed against government-issued ID. It does NOT mean: the person is trustworthy, the person will pay rent, the property is in good condition, or that no problems will occur. The platform verifies identity — not character.

**What the platform is NOT responsible for:** Lease terms, rent payment, property condition, tenant behavior, landlord behavior, deposit handling, maintenance, disputes. The platform's responsibility ends at the verified connection reveal.

**Dispute resolution:** Barangay-first approach. Any disputes between landlord and tenant should be brought to the barangay level first (per existing Philippine law — barangay conciliation is required before court filing for disputes between residents of the same city). The platform provides the verified identity records that may be useful in barangay proceedings but does not mediate.

### 13.4 — When a Scam Occurs on Platform

**Platform response protocol:**
1. User submits report via in-app mechanism.
2. Ops team reviews within 24 hours.
3. If confirmed: Suspend the offending user's account (is_suspended = true). Preserve all verification documents and connection records (do NOT delete — evidence preservation).
4. Notify the reporter: "Na-review na ang report mo. Na-suspend na ang account ng ni-report mo."
5. If the scam involves financial loss: Recommend the user file a complaint with PNP Anti-Cybercrime Group (Report at pnp.gov.ph or call 117). Provide the verified identity information associated with the offending account to support the complaint (with the reporter's consent — share only what's needed for law enforcement).

**Evidence preservation:** All verification documents, connection records, and report details are retained for 5 years (or longer if required by active legal proceedings). Do not delete any data associated with a reported user until all legal proceedings are resolved.

**NPC reporting:** If the scam involved misuse of personal data collected by the platform, notify NPC within 72 hours as a potential data breach.

---

## FINAL SECTION: PRODUCT GUT CHECK

**QUESTION 1: Should this be built?**

Yes — with a specific caveat. The research base is unusually strong for a pre-product startup: 9 field interviews with identifiable pain points, 512 distinct online voices confirming the same three core desires, three validated mechanisms scoring 136-140/165, a ₱480 billion annual scam loss figure establishing market-wide damage, and a structural gap (no platform serves the ₱3K-15K informal rental segment) confirmed by every competitor analysis. The interview data is internally consistent — L4/L5 ask for screening, T1/T4 need verified listings, and the T1-vs-T3 comparison (3 months vs. 1 day) proves the kakilala economy is real. ZipMatch's failure ($3.5M burned) is the cautionary anchor — but ZipMatch targeted the wrong segment (mid-to-upper condos through brokers) with the wrong model (full marketplace). This product targets a different segment with a different approach (trust infrastructure at zero cost). The caveat: the product should be built as a lean 30-day test, not as a committed multi-year venture. The Day 90 kill condition exists because the biggest unknown — whether informal landlords will actually complete digital verification — has no data point in the research. Every interview where a landlord said "maybe" could become "no" in practice. Build to test, not to scale.

**QUESTION 2: The single most likely failure mode.**

Landlord verification completion drop-off. Research documents 40-70% KYC drop-off in the financial sector — and financial KYC has strong motivation (access your own money). A rental platform has weaker motivation (maybe get a slightly better tenant). L5 said "If it's free, we might use it" — but "might" after being asked is different from "will" when staring at an ID upload screen alone at home without a founder sitting next to them. The specific failure looks like this: 20 landlords are acquired through founder outreach (Section 2.4), 12 create profiles, but only 4 complete the full verification (ID + property proof). With 4 verified listings, no tenant search produces satisfying results. Tenants leave. The 4 verified landlords get zero connection requests. They stop checking the app. The platform dies in a quiet whimper of empty inboxes. Probability: 35-40%. Mitigation: The white-glove protocol (Section 2.8) exists specifically to prevent this — the founder physically sits with each of the first 5 landlords and completes verification with them. This converts "might" into "did." The risk shifts to: can the product self-serve after white-glove ends? That is the Day 25-35 milestone question.

**QUESTION 3: The unfair advantage — real or imagined?**

Partially real, partially story. The real structural advantage: this product targets a segment (₱3K-15K informal, cash-dominant, Facebook-native) that no funded competitor has successfully served. Lamudi charges ₱999/month minimum and targets brokers. Dormy targets students and has ~$50K in funding and 3 years of slow traction. Rentpad is broker-dominated. None of these competitors have a verification system designed for informal landlords who own 4 apartments in Pasig and collect cash rent in person. The "story" element: the interview data is strong but thin — 9 people. A skeptical investor would say "5 landlords and 4 tenants is not a market." They would be right that the data is directional, not conclusive. The advantage duration: Dormy/Suzy Rent could copy the verification model in 6-12 months if they see it work. The window is narrow. The only durable advantage is verified community density (Moat Layer 1) — which only becomes meaningful at 200+ verified users. Before that, the product is copyable. The honest assessment: the advantage is real but fragile. It depends on execution speed in the first 90 days more than on any structural moat.

**QUESTION 4: The decision with the highest long-term impact.**

The decision to make verification manual at launch instead of automated. This seems like a cost-saving shortcut, but it is actually the most strategically important decision in the entire document. Manual verification means every early user is personally reviewed by the founding team. This creates three irreplaceable outcomes: (1) the founders develop a visceral understanding of what real Philippine government IDs look like, what fraud attempts look like, and what edge cases exist — knowledge that no API documentation can provide; (2) every verified user represents a founder-quality stamp of approval, creating higher initial trust than any automated system; (3) the verification quality standard is set by human judgment, not by algorithm defaults, meaning the first 100 verified users are genuinely verified — not auto-approved by a lenient AI. Getting this wrong means: the platform launches with automated KYC, a fraudulent landlord slips through, a tenant gets scammed through a "verified" listing, and the platform's core promise — "napatunayan na" means something — is destroyed in week one. You cannot recover from that. The shortcut that is tempting is to use ID Analyzer's free tier from Day 1. Resist it. Manual verification is the product, not a stopgap.

**QUESTION 5: The research gap that should cause concern.**

The most important unknown: whether the verified connection actually leads to a successful rental transaction, or whether landlords and tenants exchange phone numbers and then revert to their existing offline negotiation patterns without the platform adding further value. The platform's core transaction is the phone reveal — but the rental transaction (viewing → agreement → move-in) happens entirely offline afterward. There is zero data on what happens after the reveal. T1 said "Not all the time" about using an app for recurring rent — confirming that post-connection disintermediation is expected. The assumption is that the value of pre-verified screening (knowing who you're meeting) is sufficient to make landlords and tenants come back for the next vacancy/search. This assumption has the least evidence of any in the document. Resolve it in the first 30 days: after each successful connection (Day 29 onwards), the founder personally calls both the landlord and tenant 7 days later and asks: "Kumusta? Nagkita na ba kayo? Nagkasundo ba kayo? Gagamitin mo ba ulit ang app next time?" The answers determine whether the product has post-connection value or whether it is a one-time use utility.

**QUESTION 6: Message to the developer co-founder.**

The tech decision with the most long-term impact is the database schema — specifically the verification_documents table and the connections table. Every other piece of code can be refactored. The database schema constrains everything built on top of it. Get the foreign key relationships right on Day 2. Make verification_status an enum with exactly the states listed in the schema. Do not add "maybe" or "in_progress" states — they will create ambiguity in every downstream query. The shortcut that is tempting: storing verification document URLs in the landlord_profiles or tenant_profiles tables directly instead of in a separate verification_documents table. This feels simpler. It is a trap. When you need to track review history, rejection reasons, resubmissions, and consent timestamps, you will need the separate table. Build it on Day 2. The thing to build manually when automation feels right: the presigned URL generation for R2 uploads. Claude Code will try to create a helper that auto-generates URLs for any bucket. Write the helper yourself and explicitly separate private-bucket and public-bucket functions with different expiry times. A single "generatePresignedUrl" function that accepts any bucket name WILL eventually be called with the wrong bucket, exposing private documents publicly. Two functions, clearly named, are safer than one clever one.

**QUESTION 7: Message to the non-technical co-founder.**

Your job in days 1-30 is NOT about the product. The developer is building. Your job is to be on the ground in Pasig, talking to landlords, talking to barangay captains, talking to BPO HR managers. Specifically: Days 1-10, walk Barangays Pembo and Comembo. Knock on every door with a "For Rent" sign. Talk to building administrators. Visit the barangay halls. You need to personally know 20 landlords by name before the app is ready for them. Days 10-20, start visiting BPO offices in Ortigas. Not email — show up. Ask to speak with someone in employee engagement or HR operations. Bring a printed one-pager in Filipino explaining the app. Days 20-30, you are the ops team. You review every verification document in the admin dashboard. You know what a real PhilSys ID looks like because you've seen 20 of them. You call every landlord after their listing goes live. You call every tenant after they send their first connection request. The product needs something Claude Code cannot provide: relationships with the first 20 landlords, trust from the first barangay captain, and the instinct to know when a verification document looks wrong. These are non-digital, non-scalable, non-automatable human tasks. They are the entire difference between a working product and a beautiful app that nobody uses.

---

## SELF-GRADE

```
SECTION 1 (Platform Identity): Meets standard
├── One-sentence definition: Passes all checklist items? YES
├── Three name candidates written and one selected? YES
├── Section 1.6: Five name directions with all 5 fields? YES
└── Issue: None.

SECTION 2 (Cold Start): Meets standard
├── 20-landlord acquisition plan: All 20 accounted for with specific actions? YES
├── Geographic sequence specified to barangay level? YES
├── Section 2.7 Competitive Defensibility: 3 moat layers with specifics? YES
├── Section 2.8 First-10-Users: Both protocols fully specified? YES
└── Issue: None.

SECTION 3 (Build Features): Meets standard
├── All 23 features: Complete format for every one? YES
├── Every feature has acceptance criteria? YES
└── Issue: None.

SECTION 4 (Don't Build): Meets standard
├── All 19 excluded features: Complete format for every one? YES
└── Issue: None.

SECTION 5 (Verification): Meets standard
├── Section 5.5 written before Section 9.5? YES
├── Landlord flow: Every step with all sub-fields? YES
├── Tenant flow: BPO path + student path + edge case? YES
├── Verification ceremony: Complete spec with Taglish copy? YES
└── Issue: None.

SECTION 6 (User Flows): Meets standard
├── All 4 flows: Complete step-by-step format? YES
├── Landlord onboarding: Maximum 5 screens enforced? YES (5 screens exactly)
├── All flows: DB state at completion listed? YES
├── All flows: Error states with Taglish copy? YES
└── Issue: None.

SECTION 7 (UI Direction): Meets standard
├── Three adjectives: All 5 sub-fields complete for each? YES
├── Color system: Every color has hex + contrast ratio? YES
├── Make-or-break screen: Every UI element listed? YES
├── All copy in Taglish using extraction document vocabulary? YES
└── Issue: None.

SECTION 8 (Adoption Analysis): Meets standard
├── All 9 interviewees assessed (L1-L5, T1-T4)? YES
├── 90-day forecast: Numbers derived not asserted? YES
├── Kill condition: Specific metric stated? YES
├── Path to monetization: Three phases specified? YES
└── Issue: None.

SECTION 9 (Trust Signal): Meets standard
├── Primary trust signal: One specific element, not a list? YES
├── Section 9.5 consistent with Section 5.5? YES
├── Anti-scam copy: Uses Taglish extraction vocabulary? YES
└── Issue: None.

SECTION 10.1-10.4 (Stack): Meets standard
├── Every decision stated as a decision, not an option? YES
├── Every package has version number? YES (major versions specified)
├── Monorepo: Complete folder tree with every folder explained? YES
├── API routes: Complete route list specified? YES
└── Issue: None.

SECTION 10.5 (Database Schema): Meets standard
├── Written AFTER Section 6 is complete? YES — non-negotiable rule followed.
├── Every table derived from a specific flow step? YES
├── No table exists that isn't required by a flow? YES
└── Issue: None.

SECTION 10.6-10.8 (Storage/Auth/Infrastructure): Meets standard
├── R2 bucket structure: All three buckets specified? YES
├── Upload flow: Presigned URL pattern documented? YES
├── Auth: SMS OTP provider decided with price from research? YES (PhilSMS, ₱0.35/SMS)
├── Complete monthly cost: Itemized and totaled? YES (~$27/month)
├── Scale to 10,000 users: Infrastructure path specified? YES
└── Issue: None.

SECTION 11 (CLAUDE.md): Meets standard
├── RentRayda: The ONLY bracket token in the file? YES
├── Zero other bracket-enclosed placeholders? YES — scanned for [version],
│   [What it stores], [Continue...], [Paste...], [JWT or session], etc.
│   All replaced with actual values.
├── All version tokens replaced with actual numbers? YES
├── Session type: "Database sessions (NOT JWT)" — filled, not placeholder? YES
├── All code patterns: Actual working code, not instructions? YES
├── All table descriptions: Actual field names and purposes? YES
├── All user permission lists: Actual route access listed? YES
├── Folder tree: Actual tree written? YES
├── All key relationships: Fully listed? YES
├── CURRENT FOCUS: Protocol for updating, not a value? YES
├── KEY BUSINESS RULES: All 12 rules present? YES
├── WHAT NOT TO DO: All 13 items present? YES
└── Issue: None.

SECTION 12 (30-Day Plan): Meets standard
├── All 30 days specified — no "[Same format]" stubs? YES
├── Every day: Tasks, Claude Code approach, done condition,
│   realistic hours — all four fields present? YES
├── Day 30 checklist: All items specific and testable? YES
└── Issue: None.

SECTION 13 (Legal): Meets standard
├── Business registration: Specific entity type named? YES (sole proprietorship)
├── PDPA compliance: Grounded in RESEARCH_FINDINGS.md? YES
└── Issue: None.

GUT CHECK: Meets standard
├── All 7 questions present? YES
├── Every question: 150+ words? YES (verified by rough count)
└── Issue: None.
```

**FINAL SELF-GRADE:**

Overall document grade: **A-**
Total word count (approximate): ~32,000 words
Would a developer be able to open Claude Code tomorrow and start building without asking a single clarifying question? **YES**
Does Section 10 contain any unresolved bracket tokens? **NO** (only RentRayda, as specified)
Are Sections 2.7 and 2.8 complete? **YES**

**Strengths:** Complete CLAUDE.md ready to paste into repo. Full database schema derived from user flows (schema rule followed). All 23 features and 19 exclusions with complete format. Real Taglish copy throughout. Honest adoption analysis with specific probabilities per interviewee. Kill condition is specific and measurable.

**Weaknesses:** Hetzner cost comparison mentioned in research but not deeply analyzed (DO chosen on ecosystem, not price). Some version numbers are major-only (e.g., "4.x" vs "4.5.2") — developer should pin exact versions at npm install time. The 30-day plan assumes both founders are available full-time — if the non-technical founder has other commitments, Days 27-29 field work may need rescheduling.

**Sections written in compressed form:** None. All sections meet or exceed minimum word counts.

---

*PRODUCT_DISCOVERY_DOCUMENT.md — Version 1.0 — April 4, 2026*
*Generated from: 9 field interviews + 512 online voices + 350+ research sources*
*For: One developer with Claude Code and one non-technical co-founder with a phone and good shoes.*

