# Business Rules — Non-Negotiable

**These rules override any feature request, user preference, or helpful impulse.**

If you find yourself wanting to relax one of these rules, STOP. Create a decision file in `decisions/` documenting why. Do NOT silently violate.

---

## TRUST & VERIFICATION

1. **Phone numbers revealed ONLY when BOTH parties verified AND connection accepted.**
   - Triple-check enforced in `apps/api/src/routes/connections.ts`
   - Do NOT add bypass paths for "admin override" or "premium users"
   - Do NOT relax for "verified email only"

2. **Government IDs go in PRIVATE R2 bucket only.**
   - Bucket: `rentrayda-verification-docs`
   - Signed URLs expire in 1 hour for viewing
   - Signed URLs expire in 5 minutes for uploading
   - Object keys NEVER returned in API responses to client

3. **PhilSys eVerify integration stays.**
   - Free government API, already working
   - Do NOT replace with paid third-party KYC

3b. **Verified tenant = one person, one ID, one unit.**
   - Group occupancy beyond the verified signer violates verification terms and is grounds for reporting
   - Addresses "Tao Elev" / POGO group fraud pattern (L6 interview: 1 signs contract, 5 occupy, damage unit, leave)
   - Landlord pitch: "Isang tao, isang ID, isang workplace. Hindi Tao Elev."
   - If group fraud reported on a RentRayda-verified tenant, flag account + investigate

---

## REVENUE

4. **Landlord side is FREE FOREVER.**
   - Research-validated (L5 explicit: "if it's free")
   - Do NOT add landlord subscription tiers
   - Do NOT add landlord paid placements
   - Do NOT add landlord analytics paywalls
   - Do NOT skim any fee from the landlord's deposit receipt
   - When in doubt: landlord pays nothing, ever

5. **Transaction-based revenue only. No subscriptions.**
   - Two tenant-paid paths (see Tier 1 and Tier 2 below)
   - Research-validated (fees kill adoption on recurring basis)
   - Do NOT introduce monthly/weekly billing

6. **Three tiers of product access:**
   - **Tier 0 (free forever for everyone):** browse, list, verify, connect. Landlord and tenant both use this at ₱0.
   - **Tier 1 (tenant pays 3% of deposit):** escrow-only for DIY users. Min ₱300, max ₱750. Landlord receives full deposit.
   - **Tier 2 (tenant pays ₱999):** full concierge — ₱199 reservation + ₱800 on move-in.

7. **Money-back guarantee on Tier 2 is real.**
   - If we can't deliver 3 verified matches in 7 days → full refund
   - If user wants to cancel before match → full refund
   - Do NOT add "restocking fees" or "processing deductions"

8. **Escrow/deposit protection for Tier 1 and Tier 2.**
   - Tenant deposit routes through licensed EMI partner (GCash hypothesis dead — 0/6 landlords accept; Paymongo or manual bank transfer as interim alternatives). We never custody.
   - Paymongo handles card payment gateway for reservations only (₱99/₱199)
   - Our 3% fee is a marketplace commission settled AFTER EMI partner releases funds to landlord
   - Landlord always receives the full deposit amount they agreed to with the tenant

---

## PAYMENTS

9. **We NEVER hold, transmit, or control user funds directly.**
   - BSP classifies fund-holding as OPS or EMI — requires licensing we don't have
   - AFASA (RA 12010) adds fraud detection obligations we can't meet at our scale
   - All fund flows route through a licensed EMI partner (partner TBD — GCash rejected by 0/6 landlords, Paymongo handles reservation payments, deposit flow requires alternative approach)
   - Paymongo handles card payment gateway for reservations (Tier 1 ₱99 / Tier 2 ₱199)
   - Deposits (₱15K+): mechanism TBD. Manual bank transfer with founder-verified receipt for first 10 placements. EMI partnership for scale.
   - Our 3% fee is a marketplace commission settled AFTER the deposit is confirmed received by landlord
   - See `decisions/2026-04-12-escrow-via-gcash-partnership.md` (principle valid: never custody. Implementation needs revisiting given GCash rejection data)

10. **Deposit confirmation requires BOTH parties.**
   - Tenant confirms "I moved in and unit matches listing" in-app
   - Landlord confirms "I received the deposit" in-app
   - If tenant disputes within 48h of landlord confirmation → fund release frozen, admin review
   - Do NOT auto-release on timer without dual confirmation

---

## DATA PRIVACY (RA 10173 Data Privacy Act)

**Penalty note: DPA violations carry imprisonment up to 7 years, not just fines. NPC enforcement is accelerating (Worldcoin C&D Sept 2025). This is not theoretical risk.**

11. **Explicit consent before storing sensitive data.**
   - Gov IDs, property proofs, employment proofs all require checkbox consent
   - `verification_documents.consent_at` timestamp required
   - Consent language in Tagalog AND English
   - Separate consent for verification vs. marketing vs. data sharing

12. **No data sold to third parties. Ever.**
    - Founding principle, not a preference
    - Includes anonymized/aggregated data

13. **User can request deletion within 30 days.**
    - Implement `/api/users/me/delete` endpoint before launch
    - Cascade delete across all tables
    - Retain only what's legally required (e.g., completed transaction records for tax/audit, anonymized)

14. **DPO appointed before launch.**
    - Co-founder serves as DPO initially
    - Privacy Impact Assessment (PIA) completed before launch
    - NPC registration triggered at 1,000+ sensitive data subjects — submit proactively at 500
    - 72-hour breach notification protocol documented and rehearsed
    - Gov IDs encrypted at rest in R2 private bucket; keys rotated quarterly

---

## SCOPE DISCIPLINE

15. **Pasig/Ortigas corridor only at launch.**
    - Target barangays: Ugong, San Antonio, Kapitolyo, Oranbo
    - Do NOT launch in Cebu, Davao, or BGC without validation data

16. **Android only at launch.**
    - 90% PH market share
    - iOS after Android traction validates (Month 2+)

17. **Provincial migrant without kakilala network is the primary wedge; female BPO new hire is the marketing focus.**
    - Platform serves ALL genders, ALL employer types, ALL provincial migrants without network
    - Do NOT restrict signups by gender, employer, or program type
    - Do NOT write UI copy that excludes male/non-BPO/non-migrant users
    - Marketing content leans female BPO because safety-first messaging lands hardest there (88% harassment rate for women 18-24 in Metro Manila)
    - All decisions tested against the 72-hour decision window
    - Track gender + employer in customer discovery to surface wedge variants we haven't interviewed yet
    - Expand marketing to male migrants, students, fresh grads AFTER female BPO wedge validates

---

## TECHNICAL DISCIPLINE

18. **Database sessions, NOT JWTs.**
    - better-auth default
    - Enables easy session revocation

19. **Response envelope format.**
    - Success: `{ data: ... }`
    - Error: `{ error: 'User-facing message', code: 'MACHINE_CODE' }`
    - Do NOT break this across endpoints

20. **Rate limits enforced per TRD.md §10.**
    - Do NOT disable rate limits for "testing"
    - Do NOT raise limits without understanding why

21. **No new dependencies without asking.**
    - Every `pnpm add` requires explicit approval
    - Exception: pre-approved packages in TRD.md tech stack

22. **TypeScript strict mode stays on.**
    - `pnpm turbo typecheck` must pass before any commit
    - Do NOT use `any` as an escape hatch
    - Do NOT add `// @ts-ignore` without a decision file

---

## OPERATIONAL DISCIPLINE

23. **Every reserver gets a customer discovery call within 24 hours.**
    - Non-negotiable during validation phase
    - 20-minute call, 7-question script (in `prompts/` eventually)
    - Document every call in `journal/`

24. **Every placement gets a post-move-in follow-up.**
    - 48 hours after confirmed move-in
    - If unhappy → immediate refund consideration
    - Document outcome in `journal/`

25. **Refund rate above 30% = stop and investigate.**
    - Do NOT paper over with more marketing
    - Something is broken

---

## WHAT WE DO NOT DO

These are the paths documented in `FINAL_DECISION.md` Section 3 (kill list). Never revive without a new decision file:

- Scraping any third-party site
- Auto-posting to Facebook Groups (impossible per Meta ToS)
- B2B BPO HR partnerships as primary revenue
- AI chatbot as primary UX
- Monthly/weekly subscriptions
- Landlord-paid features
- iOS before Android validates
- Multi-city before Pasig/Ortigas dominated
- Fundraising before Day 120 PMF proof
- Blueprints longer than 500 lines
- Refactoring outside immediate scope

---

## THE META RULE

When in doubt, ask: **"Does this help us get 30+ paid reservations (across Tier 1 or Tier 2) in 14 days?"**

If no → it's not MVP scope. Defer it.
If yes → ship it simply.
If unclear → ask the human before building.
