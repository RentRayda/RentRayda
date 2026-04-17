# Partnership Outreach — GCash + PhilSys

## GCash PARTNERSHIP HYPOTHESIS DEAD (0/6 landlords accept, 2026-04-17). This outreach draft is ARCHIVED. Do not send. See decisions/2026-04-17-gcash-hypothesis-dead-supply-model.md

Two drafts ready to send. Both critical blockers for Phase 2.

---

## DRAFT 1: GCash Business API Partnership Email

**To:** business@mynt.xyz (public Mynt/GCash business email)
**Subject:** Marketplace partnership inquiry — RentRayda (verified rental platform for provincial migrants in Metro Manila)
**From:** founder@rentrayda.com

---

Dear GCash Business Team,

My name is Miguel [Full Name], co-founder of RentRayda — a new rental marketplace serving provincial migrants (BPO new hires, students, fresh grads, young professionals) in the Pasig/Ortigas corridor. I'm writing to explore a formal partnership for facilitating deposit payments between tenants and landlords through GCash.

**The opportunity in one paragraph**

The Philippine informal rental market ($3K-15K/month price point) has a trust crisis: tenants lose roughly ₱5,000-10,000 to fake-listing scams regularly, 88% of young women in Metro Manila report harassment, and landlords have no reliable way to screen tenants before committing to a move-in. Our platform solves this through PhilSys-backed identity verification for both sides, but the most fragile part of the user journey — the moment a tenant sends ₱15,000 to a landlord before move-in — is exactly where GCash already has trust at scale.

We've done the regulatory analysis (with counsel). Building our own escrow triggers BSP OPS classification and AFASA (RA 12010) obligations we can't realistically meet pre-PMF. We explicitly do NOT want to hold funds. What we want is a clean marketplace commission structure: tenant sends deposit to landlord through GCash using our app as the orchestration layer, move-in is confirmed by both parties in our app, and a 3% marketplace fee is settled from our side after the fund flow completes.

**Specifically, we'd like to explore**

1. **GCash Business API access** for triggering send-money flows from within our app with pre-populated recipient (the verified landlord's GCash account)
2. **Marketplace commission structure** — 3% of each deposit transaction settled to our business account, charged to the tenant (not the landlord)
3. **Dispute coordination protocol** — if tenant reports scam within 48h of move-in, what's the process for GCash to freeze/review that specific transaction
4. **Co-branding consideration** — could tenants see "Secured by GCash" messaging during the transaction? This would significantly increase trust conversion

**Why we're approaching you now**

We're in pre-launch validation. Our MVP is 95% built (Expo/Android, Hono API, Postgres, full auth flow, R2 document storage). We're running a 14-day fake-door validation test in the next month before committing to Phase 2 integrations. If we proceed to build, the GCash integration is the critical path to launch — we've structured our entire revenue model around not holding funds ourselves.

At expected Month 12 volume (roughly 1,500-2,500 placements), we'd route roughly ₱22.5M-37.5M in deposit volume through GCash. Early stage, but the segment we serve (provincial migrants moving to Metro Manila, concentrated near BPO hubs in Pasig/Ortigas) are already GCash-native — 94M of 109M PH population use GCash, and young migrants + BPO workers are above that average.

**What we bring**

- Curated, verified marketplace (both sides KYC'd, reducing GCash's fraud exposure on these transactions)
- Unique data signal (BPO-vertical rental transactions) not currently served by GCash's direct consumer flow
- Co-marketing potential (we're building TikTok content for female BPO new hires — a high-value GCash customer segment)

**Suggested next step**

A 30-minute video call to scope whether there's alignment. I can share our technical architecture, our regulatory analysis, and our validation data before the call if helpful. Available next 2 weeks at times convenient to your team.

Thank you for your time. I've admired what GCash has built — 89% market share isn't luck, it's earned trust. We want to partner with that, not compete with it.

Best,
Miguel [Full Name]
Co-founder, RentRayda
founder@rentrayda.com
+63 [phone]
rentrayda.com

---

**Pre-send checklist:**
- Replace [Full Name] with real name
- Replace [phone] with real PH number
- Confirm founder@rentrayda.com is a real, monitored mailbox
- Keep the signature plain — no banners, no marketing graphics
- Send from Gmail/Google Workspace on rentrayda.com domain (not personal Gmail)
- Expected response time: 5-15 business days (enterprise partnership teams are slow)
- Follow up once at 10 business days if no response, then again at 20 business days, then stop

**What to NOT say:**
- Don't mention Maya as a backup (shows lack of commitment)
- Don't over-claim user numbers you don't have yet
- Don't ask about pricing upfront (let them propose)
- Don't attach a full pitch deck (keep it email-scannable)

---

## DRAFT 2: PSA Institutional Onboarding Letter (PhilSys eVerify)

**Format:** Formal business letter, printed on company letterhead, delivered in person OR as PDF email attachment
**To:** Philippine Statistics Authority (PSA), PhilSys Registry Office
**Address:** PSA Complex, East Avenue, Diliman, Quezon City
**Email:** info@philsys.gov.ph (for electronic delivery)

---

[RentRayda Letterhead with logo]

[Date]

The PhilSys Registry Office
Philippine Statistics Authority
PSA Complex, East Avenue
Diliman, Quezon City

**Subject: Request for Institutional Onboarding — PhilSys eVerify API Access**

Dear Sir/Madam:

Greetings from RentRayda. We are respectfully requesting institutional onboarding for access to the PhilSys eVerify Portal (everify.gov.ph) for the purpose of verifying the identity of users on our rental housing platform.

**About RentRayda**

RentRayda is a verification-first rental marketplace platform based in the Philippines, serving the informal rental market (₱3,000-₱15,000/month price segment). Our primary users are provincial migrants moving to Metro Manila for work or school — BPO new hires, students, fresh graduates in hospitals/banks/retail, and OFW families. They currently face significant scam risk when seeking housing through social media channels. We provide verified listings with verified landlord identities, allowing tenants to make safer, more informed housing decisions.

Our registered business details:
- Registered business name: [Legal entity — OPC name]
- DTI/SEC registration: [number]
- Business address: [Pasig City address]
- BIR TIN: [number]
- Legal form: One Person Corporation (OPC)
- Founded: 2026

**Purpose of eVerify Integration**

We seek to use the PhilSys eVerify API for two specific purposes, both of which directly align with the national policy goals of the PhilSys program:

1. **Tenant identity verification** — When a Filipino citizen registers on our platform as a rental seeker, we will offer them the option to verify their identity via PhilSys eVerify. This reduces scammer activity and builds trust for landlords who rely on identity verification to feel safe offering rooms to strangers.

2. **Landlord identity verification** — When a property owner lists a rental unit on our platform, we will verify their identity via PhilSys eVerify before their listing is published. This directly addresses the most common scam pattern (fake listings with stolen photos) by ensuring only verified real people can create rental listings.

In both cases, verification is optional for the user, but strongly encouraged through reduced friction in subsequent platform interactions. Our goal is not surveillance — our goal is trust infrastructure in a segment of the housing market where none currently exists.

**Data Privacy Act Compliance**

RentRayda is committed to full compliance with RA 10173 (Data Privacy Act). Specifically:

- Our DPO is [DPO Name], reachable at dpo@rentrayda.com
- We have completed a Privacy Impact Assessment (PIA) for all data processing activities
- Users give explicit, documented consent before we initiate PhilSys verification
- We will only store the verification status (verified/not verified) — we will not retain PSNs (Permanent Serial Numbers) or detailed PhilSys data
- We maintain encryption at rest for all sensitive personal information in accordance with NPC Implementing Rules
- We have 72-hour breach notification protocols in place
- Full privacy policy available at rentrayda.com/privacy (Tagalog and English)

**Expected Verification Volume**

At our pre-launch stage, we anticipate the following verification volume:
- Month 1 (soft launch): 50-200 verifications
- Month 3: 500-1,500 verifications
- Month 6: 2,000-5,000 verifications
- Month 12: 5,000-15,000 verifications

**Integration Approach**

We intend to integrate the eVerify API through our production infrastructure (Hono/Node.js on Coolify-managed DigitalOcean), following documented PSA standards. Our engineering team has reviewed the eVerify Developer Portal documentation and is prepared to implement to PSA specifications.

**Next Steps Requested**

We kindly request your guidance on the following:

1. What is the institutional onboarding procedure and timeline?
2. Are there onboarding fees, API usage fees, or minimum volume commitments?
3. What documentation do you require from us? We have prepared a Data Protection Addendum and can provide additional materials upon request.
4. Is there an account manager or technical contact who can support our integration effort?
5. Are there pilot program opportunities for new platforms like ours?

We would be grateful for the opportunity to schedule an introductory meeting at your convenience, either in person at the PSA Complex or via video conference. Our founders are available at your earliest opportunity.

Thank you for your time and for the transformational work the PhilSys program has accomplished for Filipino citizens. We are honored to have the opportunity to build on top of this national infrastructure in a manner that genuinely serves Filipino housing seekers.

Respectfully yours,

[Signature]

**Miguel [Full Name]**
Founder & Data Protection Officer
RentRayda [OPC Legal Name]
founder@rentrayda.com
+63 [phone]

---

**Attachments:**
1. Copy of DTI/SEC business registration
2. Company profile (one-pager — operations, leadership, funding status)
3. Privacy Policy (draft, pending final legal review)
4. Privacy Impact Assessment summary (one page)
5. Proposed Data Protection Addendum

---

**Pre-send checklist:**
- Complete OPC registration BEFORE sending this letter (you cannot legally contract with PSA as a sole proprietor for institutional API access in the same way)
- Appoint a real DPO (can be you, but register formally with NPC)
- Have the PIA completed (even a rough version — they want to see due diligence)
- Deliver via both email AND physical mail for maximum signal of seriousness
- Expect 4-8 weeks for initial response
- First meeting likely virtual; subsequent technical meetings may require in-person visit to PSA Complex

**What to NOT do:**
- Don't offer payment upfront — wait for them to specify fees
- Don't claim existing user numbers you don't have
- Don't describe use cases beyond what you've stated (scope creep kills government partnerships)
- Don't bundle eVerify request with unrelated asks (e.g., PSA census data — keep this focused)

---

**Background on why PhilSys partnership unlocks the business:**

> **NOTE (2026-04-17):** GCash partnership is ARCHIVED (0/6 landlords accept GCash). Deposits flow directly landlord-to-tenant. Paymongo handles only ₱499 Verified Placement fee. No escrow tier.

Without PhilSys: our "verified" badge has no institutional backing and can be replicated by any competitor.

With PhilSys: we have institutional-grade verification — a defensible moat that no existing informal rental channel offers. Combined with Paymongo for Verified Placement payments, this is the platform's core value proposition rendered technical.

**Priority:**
- GCash email: send within 2 weeks of FINAL_DECISION approval (parallel with validation test)
- PhilSys letter: prepare over next 4-6 weeks, send after OPC registration completes AND validation passes

Do not send the PhilSys letter if validation fails. Refund and archive.
