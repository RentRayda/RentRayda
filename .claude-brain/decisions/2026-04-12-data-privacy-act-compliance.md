# Decision: DPA compliance is a launch blocker, not a post-launch task

**Date:** 2026-04-12
**Status:** Active — LAUNCH BLOCKER
**Criticality:** Penalty includes imprisonment up to 7 years. Do not launch without these items complete.

---

## Context

Deep research (2026-04-12) surfaced that RA 10173 (Data Privacy Act) compliance has teeth:
- Imprisonment up to 7 years for unauthorized processing / malicious disclosure of sensitive personal information
- NPC enforcement is accelerating — Worldcoin Cease and Desist, September 2025
- RentRayda stores government IDs, employment proofs, property titles → ALL classified as sensitive personal information
- Launching without compliance infrastructure creates personal liability for founders

Our specific exposure surface:
- Gov ID photos (tenant + landlord)
- Property proofs (title/deed/utility bill with address)
- Employment proofs (COE with employer name + salary)
- Biometric selfies (if we add face-matching for verification)
- Phone numbers, addresses, locations, transaction records

---

## Decision

**The following items are LAUNCH BLOCKERS. No public launch until all are complete:**

### 1. DPO (Data Protection Officer) appointed
- Co-founder serves as DPO initially (Miguel)
- Email: dpo@rentrayda.com (must route to real mailbox)
- Post contact info visibly in Privacy Policy + footer

### 2. Privacy Impact Assessment (PIA) completed
- Document every data type collected
- Document every processing purpose
- Document every storage location (R2 buckets, Postgres, BullMQ/Redis)
- Document retention periods
- Document who has access
- Template: https://privacy.gov.ph (NPC has downloadable template)

### 3. Privacy Policy drafted in Tagalog AND English
- Plain-language summary at top
- Legal detail below
- Must be linkable from every consent checkbox
- Must be linkable from app settings
- Must be updatable with version history

### 4. Consent flows implemented correctly
- Separate consent for:
  - Identity verification (ID upload)
  - Marketing communications (SMS/email)
  - Data sharing with matched counterparty (landlord sees tenant's name/ID type, tenant sees landlord's name/property proof)
  - Analytics (can opt out)
- `verification_documents.consent_at` timestamp required
- `users.marketing_consent_at` timestamp required

### 5. 72-hour breach notification protocol documented
- Incident response playbook written
- NPC contact info: complaints@privacy.gov.ph
- Affected users notified within 72 hours of breach detection
- Rehearse at least once before launch

### 6. Encryption at rest for all sensitive data
- R2 private bucket uses server-side encryption (already enabled)
- Postgres column-level encryption for phone numbers (better-auth handles)
- ID photo keys rotated quarterly
- No sensitive data in logs (audit grep of apps/api/src/ before launch)

### 7. User deletion endpoint before launch
- `/api/users/me/delete` implemented
- Cascade deletes across: users, verification_documents, listings, connection_requests, connections, reports
- R2 object deletion triggered
- Retention exception: completed transaction records (anonymized) for tax/audit

### 8. NPC registration (trigger: 1,000+ data subjects)
- Submit proactively at 500 data subjects to avoid deadline risk
- Annual filing required
- Penalty for non-registration: up to ₱5M fine

---

## Alternatives considered

**Launch first, add compliance later:** REJECTED. Founder personal liability includes imprisonment. Non-negotiable.

**Outsource compliance to a law firm:** Consider for Phase 3+. Pre-launch, we do the minimum ourselves using NPC templates.

**Skip encryption at rest:** REJECTED. Required by DPA Implementing Rules.

---

## Consequences

### Positive
- Legal launch
- Trust signal to users (privacy policy visible)
- Protects founders from personal liability
- Puts us ahead of informal competitors who ignore DPA

### Negative
- 2-3 weeks of work before launch (can parallel with validation test — validation doesn't store sensitive data)
- Ongoing DPO obligation (time cost ~4 hrs/month)
- Audit trail requirements add complexity

---

## Revive trigger

**Check quarterly:**
- Have we hit 1,000 data subjects? → Submit NPC registration
- Has NPC issued new guidance? → Review and update
- Has a competitor been fined/prosecuted? → Case study, tighten our posture

---

## Review date

Pre-launch: every item marked complete before we announce publicly.
Ongoing: 2026-07-12 and quarterly thereafter.

---

## References

- `context/08-pestel-snapshot-2026.md` § LEGAL
- RA 10173 text: https://privacy.gov.ph/data-privacy-act/
- NPC Implementing Rules: https://privacy.gov.ph/implementing-rules-and-regulations-of-republic-act-no-10173/
- Worldcoin C&D (Sept 2025): precedent for aggressive NPC enforcement
- Research source: Deep research 2026-04-12 Part 7 PESTEL finding #5
