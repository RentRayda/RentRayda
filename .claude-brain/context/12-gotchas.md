# Philippine-Specific Gotchas for Claude Code

**Purpose:** Warn Claude Code about Philippine legal, regulatory, and cultural landmines that could damage RentRayda if stepped on. This is context, not code.

**Rule:** If Claude Code is about to implement something touching payments, identity data, landlord communication, or tenant disputes — re-read this file first.

**Last updated:** 2026-04-12

---

## LEGAL LANDMINES (PENALTY = IMPRISONMENT, NOT JUST FINES)

### 1. Data Privacy Act (RA 10173) — 7 years imprisonment max

**What triggers it:**
- Storing gov IDs, employment proofs, property titles without explicit consent
- Processing data without a Privacy Impact Assessment on file
- No DPO (Data Protection Officer) appointed
- Failing to register with NPC at 1,000+ sensitive data subjects
- Failing 72-hour breach notification
- Data transferred abroad without proper basis

**Recent enforcement:** NPC issued Cease and Desist to Worldcoin Sept 2025. Enforcement is accelerating.

**What Claude Code must NEVER do:**
- Add endpoints that store new sensitive fields without going through `decisions/2026-04-12-data-privacy-act-compliance.md` checklist
- Log sensitive data in Sentry or any log aggregator
- Return encrypted R2 keys in API responses (even error messages)
- Email gov IDs or employment proofs (even for debugging)
- Bypass consent tracking fields like `verification_documents.consent_at`

**Reference:** `decisions/2026-04-12-data-privacy-act-compliance.md`

### 2. BSP Payment System Regulations (OPS/EMI classification)

**What triggers it:**
- Holding tenant funds in any account we control
- Orchestrating transfers without EMI partnership
- Acting as intermediary on rent payments (monthly)

**Recent:** AFASA (RA 12010) signed July 2024 adds fraud detection obligations.

**What Claude Code must NEVER do:**
- Add code that routes deposit funds to a RentRayda-controlled account
- Implement "escrow wallet" for any purpose
- Store user GCash balances or credentials
- Process rent payments (only deposit facilitation through GCash partnership)

**Reference:** `decisions/2026-04-12-escrow-via-gcash-partnership.md`

### 3. Anti-Cybercrime Act (RA 10175)

**What triggers it:**
- Allowing identity spoofing
- Data breaches that expose user info
- Unauthorized access to user accounts

**What Claude Code must NEVER do:**
- Skip the triple-check in `apps/api/src/routes/connections.ts` for phone reveal
- Add admin bypass routes that reveal user contact info without both verifications
- Store passwords in plaintext or weak hashing
- Bypass rate limits "for testing"

---

## CULTURAL LANDMINES (WILL DAMAGE TRUST, NOT LEGALITY)

### 4. The BIR Fear

**Cultural fact:** 95%+ of informal landlords operate in cash specifically to avoid BIR paper trail. They are not BIR-registered, do not issue OR, do not report rental income.

**What happens if we step on this:**
- Landlord sees anything that feels like "reporting to BIR" → they leave and tell other landlords
- Supply-side collapse

**What Claude Code must NEVER do:**
- Add "BIR registration number" as a required field for landlords
- Send emails to landlords with "official receipt" language (even for our own fees)
- Mention BIR anywhere in the landlord UX
- Create a "tax report" feature for landlords (they don't want it — it's threatening)
- Store Philippines TIN numbers without separate, explicit consent AND a clear non-reporting statement

**What we SHOULD do:**
- Privacy policy explicitly states "We do not report landlord income to BIR"
- Landlord onboarding explicitly addresses this (see `artifacts/landlord-messenger-onboarding-script.md` Stage 1)
- If a landlord asks about BIR, follow the script response — never improvise

### 5. "Nahihiya Ako" — Filipino Politeness Paralysis

**Cultural fact:** "Hiya" (shame/embarrassment) is a core Filipino emotion. It causes:
- Landlords who won't collect rent from struggling tenants (secondary psychographic: "nahihiya ako magsingil")
- Tenants who won't report harassment
- Both sides avoiding direct confrontation

**What Claude Code must NEVER do:**
- Write UI copy that is confrontational ("Your payment is OVERDUE")
- Auto-generate collection messages that feel aggressive
- Remove friction from difficult conversations (we WANT those to require human involvement)

**What we SHOULD do:**
- Write UI copy softer than feels "professional" in English
- "Pwede po ba i-check yung payment status?" not "Pay now or face fees"
- Escalate disputes to humans, not AI
- Provide scripts for hard conversations (see the Messenger onboarding script)

### 6. The 72-Hour Decision Window

**Psychographic fact:** Our primary target (female BPO new hire, provincial migrant) decides where to live in 1-3 days after arriving in Manila. Not 14 days.

**What this means for product UX:**
- Any flow that takes more than minutes to complete will lose her to a scammer
- Messaging delays of more than 1-2 hours during her decision window = lost customer
- "Get back to you within 48 hours" is unacceptable — she will be scammed by then
- Our support must be responsive within 1-4 hours during PH waking hours

**What Claude Code must NEVER do:**
- Design flows that assume 2-3 days of consideration time
- Add "cooling off period" that delays urgent bookings
- Queue messages to landlords without urgency escalation

---

## TECHNICAL LANDMINES (WILL BREAK THE PRODUCT)

### 7. Facebook API Changes

**Hard constraint:** Facebook Groups API was deprecated April 22, 2024. No workaround exists. See `context/07-facebook-policy.md`.

**What Claude Code must NEVER do:**
- Add code that posts to Facebook Groups programmatically
- Scrape Facebook Marketplace, Facebook Groups, or any third-party rental listing site
- Implement any "fake user" flow to access Facebook content
- Use Puppeteer/Playwright against Facebook at any scale

### 8. Android Device Diversity

**Market fact:** Target demographic uses budget Vivo, Oppo, Realme, Xiaomi with 3-4GB RAM, Android 11+.

**What Claude Code must NEVER do:**
- Add dependencies that bloat APK past 50MB
- Use APIs requiring Android 13+ (cuts off too many users)
- Assume high-end device performance in animations or transitions
- Use WebView for core features (memory-hungry on low-end devices)

### 9. Data Cost Sensitivity

**Market fact:** Target demographic on prepaid data plans at ₱11-12.50/GB. They watch data usage closely.

**What Claude Code must NEVER do:**
- Auto-download listing photos without user action
- Auto-play videos
- Sync background data aggressively
- Use high-resolution photos when lower resolution would suffice (compress to max 800px on mobile)

### 10. Typhoon/Flood Seasonality

**Environmental fact:** Pasig City entered red alert July 2025 due to Wawa Dam. Our launch area floods.

**What Claude Code must NEVER do:**
- Ignore listing photo quality that looks like a flooded area
- List properties in red-alert barangays without flood risk indicator
- Assume listings remain valid during typhoon season without active verification

**What we SHOULD do:**
- Integrate HazardHunter data into listing cards (see `decisions/2026-04-12-flood-risk-indicators-on-listings.md`)
- Color-code listings by barangay flood risk
- Alert tenants during active PAGASA warnings about their listing area

---

## WHEN CLAUDE CODE ENCOUNTERS A GRAY AREA

If Claude Code is about to implement something that MIGHT touch one of these landmines:

1. **STOP. Don't implement yet.**
2. Check the relevant decision file in `.claude-brain/decisions/`
3. Check the relevant context file in `.claude-brain/context/`
4. If still unclear, tell the human operator in plain language:
   > "I'm about to implement X. This might touch [landmine name] because [reason]. I want to confirm before proceeding: should I still build this as specified, or should I propose an alternative approach?"

Never assume you know the answer. These landmines are jurisdictional and cultural — they are not patterns Claude should generalize from.

---

## Kill switch for any of these

If Claude Code has already implemented something that touches a landmine (e.g., pushed a fund-holding feature before the GCash partnership was signed), the remediation is:

1. **Immediately feature-flag it off** — `.env` variable disables the endpoint
2. **Assess exposure** — how many users hit this path? What data was processed?
3. **Document in journal** with date, impact, and remediation taken
4. **If DPA or BSP exposure** — notify DPO, consult legal before next public statement
5. **Do not silently fix and move on** — create an incident report in `.claude-brain/journal/YYYY-MM-DD-incident-[topic].md`

Reputation in the Philippine startup scene is small. One BSP violation or NPC enforcement action kills the company. Paranoia here is appropriate.

---

## References

- `decisions/2026-04-12-data-privacy-act-compliance.md`
- `decisions/2026-04-12-escrow-via-gcash-partnership.md`
- `context/07-facebook-policy.md`
- `context/08-pestel-snapshot-2026.md`
- `context/09-target-psychographics-primary.md` (72-hour window, data cost sensitivity)
- `context/10-target-psychographics-secondary.md` (BIR fear, hiya paralysis)
