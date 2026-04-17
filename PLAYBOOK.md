# PLAYBOOK — 47 God Prompts from Install to Infrastructure

This is the canonical execution sequence for RentRayda. Every prompt is engineered to work with Claude Code's failure modes: reminds Claude what to read, constrains scope explicitly, specifies verifiable acceptance criteria, and includes recovery protocols.

---

## Strategic North Star: Trust Infrastructure (not just placement)

**Added:** 2026-04-14
**Grounded in:** Deep research — Mamikos (Indonesia, $750K raised, acquired 2020), Rukita ($16.5M, 1.4M rooms, EBITDA positive), QuintoAndar (Brazil, $5.1B valuation, replaced fiador guarantor system), OYO (India, standardized 50K budget hotels), M-Pesa (Kenya, digitized cash economy through agents).

RentRayda is building **trust infrastructure for the Philippine informal rental market** — not just a placement service. Placement is the **wedge** (Prompts 1-37). Infrastructure is the **destination** (Prompts 38-47).

**The 4-step pattern from every successful informal economy digitizer:**
1. **Ride alongside cash** — don't fight it. The deposit is the digital moment. Monthly rent stays cash for now.
2. **Standardize supply FOR them** — physical verification, Messenger onboarding. The supply side never self-digitizes.
3. **Become infrastructure** — management tools, verification API, RentRayda Score. Not a transaction, a layer.
4. **Data moat** — first informal rental dataset in PH. Credit scoring, pricing intelligence, migration patterns. Whoever digitizes first owns it.

**What this means for every prompt below:**
- Every placement generates data for the RentRayda Score (track default rates from Day 1)
- Every landlord onboarding builds the verified supply database (schema must be reusable, not rental-specific)
- Every discovery call tests infrastructure signals (4 extra questions added to Prompt 12)
- Features that build toward infrastructure (verification, scoring, management) are prioritized over features that only serve the placement wedge (flood risk is nice, listing verification is essential)

**Key comps to remember:**
- Mamikos started with 50 kos-kosan in Yogyakarta. We start with 50 boarding houses in Pasig.
- QuintoAndar founders biked to apartments. We walk barangays.
- QuintoAndar replaced Brazil's fiador with a credit score. We replace kakilala with the RentRayda Score.
- Rukita manages 1.4M rooms and is EBITDA positive. That's the operational model we evolve toward.
- Mamikos's #1 user complaint is scams/no verification. Our ENTIRE thesis solves their biggest failure.

---

## How to use this playbook

1. Paste the boxed prompt text **verbatim** into Claude Code. Do not edit to "save time" — the constraints are load-bearing.
2. Let Claude finish one prompt completely before starting the next. Check acceptance criteria BEFORE moving on.
3. If Claude resists, drifts, or proposes scope creep: paste `.claude-brain/prompts/claude-reset.md`, then re-paste the current prompt from scratch.
4. Every prompt produces a commit. Git history IS the execution log.
5. Session time cap: 2 hours per prompt. If not done in 2h, reset and break the prompt smaller.
6. Do NOT skip prompts. Do NOT combine prompts. Each has its own scope.

**Anatomy of every prompt:**
- 🎯 Goal — one sentence
- ⏱️ Time — realistic estimate
- 🔒 Prerequisites — must be true before starting
- 📖 Read first — the files Claude must load
- 📋 The prompt — paste verbatim
- ✅ Acceptance — verifiable done-criteria
- 🚫 Forbidden — scope guardrails
- 🆘 Recovery — what to paste if stuck
- 🏁 Handoff — next step

**Universal forbidden (all 40 prompts):**
- Reviving kill-list items (FINAL_DECISION.md §3, 19 items)
- Adding dependencies without written reason
- Hardcoding secrets
- Skipping typecheck/build before commit
- Creating files outside the structure without a decision file first
- Claiming completion without verifying acceptance criteria

---

# PHASE 0 — SETUP & GROUNDING (Prompts 1–5)

Phase time: 3–4 hours. Outcome: brain installed, dev env verified, founder aligned on validation plan.

---

## Prompt 1 — Verify brain and boot session

**🎯 Goal:** Brain already installed (2026-04-13). Verify everything still works after the 2026-04-17 strategic overhaul (pricing change, GCash purge, supply model). Boot a clean session.

**⏱️ Time:** 15 min (verification only — brain is already installed)

**🔒 Prerequisites:**
- Brain already in `.claude-brain/` (installed 2026-04-13, updated through 2026-04-17)
- Pre-commit hooks already installed
- You're at a terminal inside the git repo root

**📖 Read first:** `.claude-brain/CLAUDE.md`, `.claude-brain/README.md`

**📋 Paste into Claude Code:**

```
Read .claude-brain/CLAUDE.md in full and execute the SESSION KICKOFF PROTOCOL literally — every step, no skipping. Report back the exact files you read in order.

Then run these 10 verification commands one at a time and show output:

1. `ls .claude-brain/context/*.md | wc -l` (expect 14 — includes 14-interview-tracker.md added 2026-04-17)
2. `ls .claude-brain/decisions/*.md | wc -l` (expect 16 — includes TEMPLATE + 3 new decisions from 2026-04-17)
3. `ls .claude-brain/prompts/*.md | wc -l` (expect 5)
4. `ls artifacts/*.md | wc -l` (expect 4)
5. `./.claude-brain/scripts/check-sync.sh` (expect: "Canonical docs in sync")
6. `./.claude-brain/scripts/refresh-repo-status.sh` (expect exit 0)
7. `ls -la .git/hooks/pre-commit` (must exist, executable)
8. `grep -c "^### 3\." FINAL_DECISION.md` (expect 19 — the kill list)
9. `grep -c "^## Prompt [0-9]" PLAYBOOK.md` (expect 47)
10. `grep "₱499" .claude-brain/context/05-business-rules.md | head -1` (verify pricing is ₱499 not ₱999)

If ANY check fails: stop and report the failure. Do NOT attempt to fix without my confirmation.

Then summarize RentRayda in exactly 3 bullets:
- What's already built (from context/02-repo-status.md)
- What's blocked and why
- The single most important next action

Finally: ask me what I want to work on. Do NOT start coding.
```

**✅ Acceptance:** All 10 commands produce expected output. Pre-commit hook exists and is executable. 3-bullet summary matches canonical docs. Zero code written.

**🚫 Forbidden:** Writing code. Proposing brain structure "improvements". Skipping verification. Guessing instead of running commands.

**🆘 Recovery:** If any check fails, paste: *"Verification failed at step X. Do NOT fix. Explain what's wrong and what you think caused it. Wait for my confirmation on fix approach."*

**🏁 Handoff:** → Prompt 2.

---

## Prompt 2 — Ground-truth codebase against the brain

**🎯 Goal:** Verify `.claude-brain/context/02-repo-status.md` matches reality; flag drift before any work.

**⏱️ Time:** 45 min

**🔒 Prerequisites:** Prompt 1 complete. Clean working tree.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `context/02-repo-status.md`, `context/03-architecture.md`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Then verify that brain assumptions match actual code. For each claim below, open the files and run the commands. Do NOT auto-reconcile any drift — flag it.

1. connections.ts has the triple-check reveal logic.
   - `wc -l apps/api/src/routes/connections.ts` (expect ~336 lines)
   - Show lines containing "pending" + landlord verified + tenant verified checks

2. BullMQ workers NOT started in apps/api/src/index.ts.
   - `grep -n "new Worker\|createWorker" apps/api/src/index.ts` (expect: imports only, no instantiation)

3. resend NOT installed.
   - `grep "\"resend\"" apps/api/package.json` (expect: no match in dependencies)

4. Mobile tab icons are letter placeholders.
   - Show icon section in `apps/mobile/app/(tabs)/_layout.tsx`

5. Web admin unprotected.
   - `ls apps/web/middleware.ts 2>/dev/null || echo "missing"`
   - `grep -rn "requireAdmin\|adminAuth" apps/web/app/admin/ | head -5`

6. Mobile TODO count:
   - `grep -rn "TODO\|FIXME" apps/mobile/app/ --include="*.ts" --include="*.tsx" | wc -l` (brain claims 8)

7. Brand drift counts:
   - `grep -rn "NotoSansOsage\|TANNimbus" apps/mobile | wc -l` (brain claimed 306, REPO_STATUS said 1142 — run to get ACTUAL count)
   - `grep -rn "#2563EB\|#2B51E3" apps/mobile | wc -l` (brain claimed 87, REPO_STATUS said 733, 5 fixed 2026-04-17 — run to get ACTUAL count)

8. Migrations applied:
   - `ls packages/db/migrations/` (expect 0000_*.sql, 0001_*.sql, meta/)

Create `.claude-brain/journal/$(date +%Y-%m-%d)-ground-truth-audit.md` with a table: Claim | Actual | Drift?

If ANY drift is material (>10% off, or claim entirely wrong): STOP and wait for me. Do NOT update either the brain or the code.

No code modifications in this prompt.
```

**✅ Acceptance:** Journal file with claim-vs-actual table for all 8 checks. All drifts flagged, not silently reconciled. Zero code changes.

**🚫 Forbidden:** Reverse-reconciling (editing code to match brain). Updating brain without founder approval. Making assumptions instead of running commands.

**🆘 Recovery:** If brain is badly stale, paste: *"Stop all work. List every drift found with exact file:line evidence. Do not propose fixes. I need to triage manually."*

**🏁 Handoff:** → Prompt 3. If material drift found, update relevant context files FIRST.

---

## Prompt 3 — Verify local dev environment end-to-end

**🎯 Goal:** Install, typecheck, build, API boots, mobile compiles — all work locally.

**⏱️ Time:** 60 min (mostly install wait)

**🔒 Prerequisites:** Prompt 2 complete. Node 22, pnpm 10+, Postgres 16, Redis installed.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `context/03-architecture.md`, `.env.example`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Then verify dev env end-to-end. Run commands IN ORDER, show output of each. STOP at first failure.

PRE-FLIGHT:
1. `node -v` (≥ v22)
2. `pnpm -v` (≥ 10)
3. `which psql && psql -U postgres -h localhost -c "SELECT version()"`
4. `which redis-cli && redis-cli ping` (expect PONG)

ENV:
5. `ls -la .env` (must exist)
6. `diff <(grep -v '^#' .env | cut -d= -f1 | sort) <(grep -v '^#' .env.example | cut -d= -f1 | sort)` (no missing vars)

INSTALL:
7. `pnpm install` (zero errors)
8. `ls node_modules/@rentrayda` (expect api, db, mobile, shared, ui, web)

DATABASE:
9. `pnpm --filter @rentrayda/db run migrate`
10. `psql $DATABASE_URL -c "\dt"` (expect 9 tables)

BUILD:
11. `pnpm turbo typecheck` (expect: 8 tasks successful)
12. `pnpm turbo build` (expect: 6 tasks successful)

RUNTIME:
13. `pnpm --filter @rentrayda/api run dev &` then `curl -sS http://localhost:3001/health`
14. `kill %1` to stop API
15. `pnpm --filter @rentrayda/mobile run typecheck`

If ANY step fails: show exact error and STOP. Do NOT fix without approval — PH dev environments are finicky.

If all pass: save `.claude-brain/journal/$(date +%Y-%m-%d)-dev-env-verified.md` with timestamp + versions. No commit.
```

**✅ Acceptance:** All 15 steps pass. Journal entry created. No silent failures.

**🚫 Forbidden:** Installing extra deps to "fix" env issues. Skipping steps. Starting production servers.

**🆘 Recovery:** If Postgres/Redis won't start, paste: *"Don't fix infrastructure from Claude Code. Tell me exact error + OS. I'll fix manually."*

**🏁 Handoff:** → Prompt 4.

---

## Prompt 4 — Align on validation plan before any user-facing work

**🎯 Goal:** Founder and Claude have identical understanding of the 14-day validation gate. No ambiguity surviving this prompt.

**⏱️ Time:** 30 min

**🔒 Prerequisites:** Prompt 3 complete. Clean working tree.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `FINAL_DECISION.md` §6 and §7, `decisions/2026-04-12-validate-before-build.md`, `decisions/2026-04-12-two-revenue-paths.md`, `artifacts/landing-page-copy-and-discovery-script.md`, `context/06-validation-state.md`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Read the listed files IN FULL (not summaries). Then answer 10 questions in `.claude-brain/scratch/validation-alignment.md`. DO NOT summarize — quote the canonical doc for each answer with specific file:line reference.

1. What is the BUILD threshold? (quote exact number from FINAL_DECISION.md)
2. What is the KILL threshold? (quote exact number)
3. What is the placement CTA and its reservation amount?
4. What happens to reservation money if we KILL? (quote refund policy verbatim)
5. What is the threshold for 30+ reservations?
6. What are the expected unit economics per Verified Placement? (quote from FINAL_DECISION.md §6.5)
7. Which acquisition channels are prioritized in validation, in what order?
8. What is the customer discovery call process — who calls whom, within what window?
9. Name the 3 psychographic pain points driving conversion per context/09.
10. What does context/06-validation-state.md currently track?

AFTER saving the doc, compare to my understanding. If we disagree on any answer, FLAG IT. The canonical docs might have an internal contradiction we must fix BEFORE launching anything.

DO NOT: start building, propose changes to the validation plan, modify canonical docs.
```

**✅ Acceptance:** Alignment doc saved. Every answer has file:line citation. Contradictions flagged. Founder confirms before Prompt 5.

**🚫 Forbidden:** Paraphrasing canonical docs. Filling gaps with assumptions. Proposing "improvements" to validation plan.

**🆘 Recovery:** If Claude summarizes instead of quoting, paste: *"Stop. Re-do with direct quotes and file:line only. If no direct quote exists, write 'NO DIRECT ANSWER IN CANONICAL DOCS' and move on."*

**🏁 Handoff:** Founder approves alignment. → Prompt 5.

---

## Prompt 5 — Draft day-by-day 14-day validation calendar

**🎯 Goal:** Concrete day-by-day plan for validation with owner + deliverable + verification per day.

**⏱️ Time:** 45 min

**🔒 Prerequisites:** Prompt 4 complete + founder-approved.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `scratch/validation-alignment.md` (from Prompt 4), all 4 files in `artifacts/`, `decisions/2026-04-12-tiktok-primary-awareness-channel.md`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Draft 14-day plan at `.claude-brain/scratch/validation-plan.md`. Table columns: Day | Date | Action | Owner | Deliverable | Blocker | Verification.

HARD REQUIREMENTS (do not relax):
- Day 1: landing page live + first TikTok video posted + 3 FB Page posts
- Day 2-4: scale organic traffic through BPO groups + university groups + personal network (target 500 unique visitors by Day 4 end)
- Day 5-7: customer discovery calls with EVERY reserver within 24h
- Day 8-10: iterate landing copy based on first 5-10 call patterns (A/B, not full swap)
- Day 11-13: second traffic wave with iterated copy; complete remaining discovery calls
- Day 14: go/no-go analysis

Per day:
- Action: ONE primary action (not 5 things)
- Owner: "Founder" or "Claude Code" or "Nano-influencer [TBD]"
- Deliverable: specific verifiable output
- Blocker: what would stop this day
- Verification: how I know it's done

ADD after the table:

"Critical Path" section — 5-7 actions that if slipped put the test at risk.

"Kill Switches" section — 3 metrics that if tripped mid-validation trigger immediate cancellation:
- e.g. "Paymongo down >24h"
- e.g. "<10 visitors in first 72h"
- e.g. "All reservers refund after discovery call"

DO NOT build anything. Planning only. I review before code touches code.
```

**✅ Acceptance:** 14 rows filled. Critical path with 5-7 items. 3 kill switches defined. Founder approves.

**🚫 Forbidden:** Adding items outside validation plan. Vague ownership. Unverifiable deliverables.

**🆘 Recovery:** If Claude proposes scope creep, paste: *"You're adding things not in validation plan. Re-read scratch/validation-alignment.md. Fake-door + discovery calls + iteration. That's it."*

**🏁 Handoff:** Founder approves. → PHASE 1.

---

# PHASE 1 — VALIDATION LAUNCH (Prompts 6–10)

Phase time: 8–12 hours. Outcome: landing page live, reservations working, launch content posted, metrics dashboard live.

---

## Prompt 6 — Build landing page with free browse + paid placement (rentrayda.com)

**🎯 Goal:** Production landing page with browse CTA + paid placement CTA live; copy matches artifact verbatim.

**⏱️ Time:** 3–4 hours

**🔒 Prerequisites:** Phase 0 complete. Dev env verified. Current `apps/web/app/page.tsx` reviewed (backup if desired).

**📖 Read first:** `.claude-brain/CLAUDE.md`, `artifacts/landing-page-copy-and-discovery-script.md` (EXACT copy), `context/04-brand.md`, `decisions/2026-04-12-two-revenue-paths.md`, current `apps/web/app/page.tsx`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Build landing page in `apps/web/app/page.tsx`.

COPY FIDELITY RULE (absolute): Copy is in `artifacts/landing-page-copy-and-discovery-script.md`. Copy VERBATIM. Do not paraphrase. Do not translate Taglish. If it says "Libre po talaga", those exact words go on the page.

REQUIREMENTS:
1. Mobile-first. Must render cleanly at 360px in Chrome DevTools.
2. Two primary CTAs (stacked mobile, side-by-side desktop):
   - "Browse listings" → /listings (free, Tier 0)
   - "Reserve verified placement — ₱149" → /reserve/placement
3. Hero: "Verified rentals in Pasig/Ortigas. Scam-protected. Landlord-safe."
4. Three trust signals with icons: PhilSys verified landlord IDs, verified deposit protection, female-only options available
5. Two-path explainer (Tier 0 free / Tier 1 Verified Placement ₱499) per artifact Section 2
6. "Why we exist" empathy section per artifact Section 3
7. "How it works" three columns per artifact Section 4
8. "Safety matters" four indicators per artifact Section 5
9. "Who we serve" per artifact Section 6 — BROAD (provincial migrants, not BPO-only)
10. FAQ section with exactly 6 questions per artifact Section 7
11. Footer: DPO contact dpo@rentrayda.com

BRAND (from context/04-brand.md):
- Primary: #2D79BF (NOT #2563EB, NOT #2B51E3)
- Fonts: BeVietnamPro-Bold (headings), Sentient-Medium (display), BeVietnamPro-Regular (body)
- Verified green badge RESERVED — not a general success indicator

TECHNICAL:
- Use existing Radix components/ui/*
- Reuse components/LandingSections.tsx patterns where they fit spec
- NO new npm dependencies
- NO analytics scripts yet (that's Prompt 10)
- SEO: page title "RentRayda — Verified rentals for provincial migrants in Pasig/Ortigas"

VERIFY BEFORE COMMIT:
1. `pnpm turbo build` passes
2. `pnpm turbo typecheck` passes
3. Open localhost:3000, resize to 360px — no layout break
4. Tab order: Browse → Reserve placement → FAQ
5. `grep -rn "#2563EB\|#2B51E3" apps/web/app/page.tsx` → 0 matches

COMMIT: `feat(web): validation landing page with browse + verified placement CTA`

If any step fails: stop and show me. Do NOT fall back to the old landing page.
```

**✅ Acceptance:** Typecheck+build pass. 360px + desktop render clean. Browse + placement CTAs with correct labels/hrefs. Content sections present. Zero old brand colors. Committed.

**🚫 Forbidden:** Paraphrasing. Inventing copy. Adding images we don't have. Adding testimonials (we have none yet). Adding press logos. New npm deps. Bypassing build verification.

**🆘 Recovery:** If Claude paraphrases, paste: *"Stop. Revert the last turn. Copy in artifact is verbatim. If a section is unclear, ASK ME — don't improvise."*

**🏁 Handoff:** → Prompt 7.

---

## Prompt 7 — Wire Paymongo for reservations ONLY (never custody funds)

**🎯 Goal:** Paymongo reservation intents working for ₱149 Verified Placement. Webhook-signed, idempotent, no fund-holding.

**⏱️ Time:** 4–5 hours

**🔒 Prerequisites:** Prompt 6 complete. Paymongo TEST keys available. Clean working tree.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `context/12-gotchas.md` BSP/AFASA section, `decisions/2026-04-12-escrow-via-gcash-partnership.md` (HYPOTHESIS DEAD — 0/6 landlords accept GCash per field interviews; principle of no fund custody still valid), `context/03-architecture.md` API response envelope + rate-limit patterns, `packages/db/schema/users.ts` (schema pattern), `apps/api/src/routes/auth.ts` (route pattern)

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. BEFORE any code, re-read `context/12-gotchas.md` BSP landmines + `decisions/2026-04-12-escrow-via-gcash-partnership.md` in full (NOTE: GCash hypothesis dead — 0/6 landlords accept GCash — but the no-fund-custody principle remains). State back in one sentence: what distinguishes a "reservation" from an "escrow" in our architecture? If you get this wrong we'll build a BSP violation.

Then implement Paymongo RESERVATIONS ONLY. No deposit escrow. No fund-holding. ONE tier: Verified Placement at ₱149 reservation (₱350 balance on move-in, ₱499 total).

STEP 1 — Migration 0002 (reservations table):
- `packages/db/schema/reservations.ts`:
  - id uuid pk
  - tier enum('placement') — single tier only
  - amount_centavos int (14900)
  - currency text default 'PHP'
  - status enum('pending','paid','refunded','expired')
  - paymongo_intent_id text unique not null
  - email text, phone text, name text nullable
  - utm_source, utm_campaign, utm_medium, referrer — all text nullable
  - variant text nullable (for Prompt 13 A/B)
  - created_at, paid_at (nullable), refunded_at (nullable), updated_at
- Add to `schema/relations.ts`, re-export from `schema/index.ts`
- `pnpm drizzle-kit generate` — review SQL before applying
- `pnpm drizzle-kit migrate`
- Verify: `psql $DATABASE_URL -c "\d reservations"`

STEP 2 — Paymongo client (`apps/api/src/lib/payments/paymongo.ts`):
- `createReservationIntent({amount_centavos, email, phone, utm})` → Paymongo POST /payment_intents, metadata includes {tier: 'placement', email, phone, utm}. Returns {intent_id, client_key, next_action}.
- `verifyWebhookSignature(rawBody, signature)`: HMAC-SHA256 using PAYMONGO_WEBHOOK_SECRET.
- `refund(intent_id, amount_centavos, reason)` for Day 14 if we KILL.
- Zod schemas in `packages/shared/validators/payment.ts`.

STEP 3 — Routes (`apps/api/src/routes/payments.ts`):
- POST /payments/reservations
  - Rate limit: 5/IP/hour (reuse middleware/rate-limit.ts)
  - Create DB row status='pending', tier='placement', amount_centavos=14900
  - Call paymongo.createReservationIntent
  - Return {reservation_id, client_key}
- POST /payments/webhook
  - Verify signature FIRST, before any DB access
  - On paymongo.paid: find by intent_id (unique), update status='paid', set paid_at=now()
  - IDEMPOTENCY: if already 'paid', return 200 without mutation
  - DB transaction
  - Response <500ms (defer heavy work to BullMQ)
  - Audit to `reservations_events` table (create it)
- Register routes in `apps/api/src/index.ts`

STEP 4 — Env:
- Add to .env.example: PAYMONGO_SECRET_KEY, PAYMONGO_PUBLIC_KEY, PAYMONGO_WEBHOOK_SECRET
- Validate in apps/api/src/lib/env.ts

STEP 5 — Tests (`apps/api/tests/payments.test.ts`):
- valid tier → intent_id returned
- invalid signature → 401
- valid signature + paid event → status updated
- duplicate webhook → no double-mutation (idempotency)
- `pnpm --filter @rentrayda/api test` must pass

VERIFY:
1. `pnpm turbo typecheck` + `build` pass
2. Migration applied (`\dt` shows reservations + reservations_events)
3. Tests green
4. Smoke test with Paymongo card 4343 4343 4343 4345
5. `grep -c "custody\|hold funds\|escrow wallet" apps/api/src/lib/payments/paymongo.ts` → MUST be 0

COMMIT: `feat(api): paymongo reservations for verified placement validation (no fund custody per EMI partnership decision)`

If you find yourself adding fund-holding logic, STOP.
```

**✅ Acceptance:** Migration applied. paymongo.ts exports 3 functions. Routes registered. 4 tests pass. Smoke test completes. Zero fund-custody references in code. Single tier 'placement' at ₱149 (14900 centavos).

**🚫 Forbidden:** Deposit escrow logic (that's Phase 4 via licensed EMI partner TBD — GCash hypothesis dead). Storing card details. Production Paymongo keys. Skipping signature verification. Slow webhook (>500ms). In-memory or DB-backed wallet/balance. Multiple tier types (only 'placement').

**🆘 Recovery:** If Claude proposes holding funds, paste: *"STOP. You're about to violate BSP regulations — personal legal liability for the founder. Re-read decisions/2026-04-12-escrow-via-gcash-partnership.md (GCash hypothesis dead, but no-custody principle stands) and context/12-gotchas.md BSP section. Revert any fund-holding code now."*

**🏁 Handoff:** → Prompt 8.

---

## Prompt 8 — Wire landing page CTAs to reservation flow end-to-end

**🎯 Goal:** Landing → Paymongo checkout → webhook → DB record → thank-you page. Full E2E.

**⏱️ Time:** 3–4 hours

**🔒 Prerequisites:** Prompt 7 complete. Local webhook tunnel (ngrok) ready. Paymongo test dashboard open.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `apps/web/app/page.tsx` (from 6), `apps/api/src/routes/payments.ts` (from 7), `context/05-business-rules.md` Rules 11–14 (DPA consent)

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Build end-to-end reservation flow connecting landing to Paymongo. ONE reservation path only (Verified Placement at ₱149).

STEP 1 — Reservation form:
- `apps/web/app/reserve/placement/page.tsx`:
  - Fields: email (required), phone (required, +63 validation), name (optional), desired_barangays (multi-select), move_in_date, budget_min/max
  - Consent checkbox (DPA): "I agree to RentRayda's Privacy Policy and consent to storing my contact information for rental matching" — links to /privacy (stub OK)
  - Info: "3 verified matches in 48 hours or full refund."
  - Submit POST /api/payments/reservations tier='placement'
- Capture UTM from URL query string, submit with request

STEP 2 — Payment redirect:
- Form submit → API returns {reservation_id, client_key}
- Frontend redirects to Paymongo Checkout URL with client_key
- Paymongo handles card entry (we never see card data)
- Success → /reserved/thank-you?id={reservation_id}
- Failure → /reserved/retry?id={reservation_id}

STEP 3 — Thank-you page:
- Server-side fetch /api/reservations/:id
- Display: amount (₱149), date
- Next steps:
  - "We'll call you within 24h at +63[redacted]"
  - "Expect 3 verified matches within 48 hours. ₱350 balance due on move-in (₱499 total)."
- Footer: dpo@rentrayda.com

STEP 4 — Retry page:
- Brief message; retry button uses SAME reservation_id (don't create new)

STEP 5 — Public reservation fetch:
- GET /reservations/:id → {id, tier, status, amount, created_at, paid_at}
- No auth (UUID unguessable)
- DO NOT return email/phone/UTM in public endpoint

STEP 6 — Webhook tunnel doc:
- `.claude-brain/journal/$(date +%Y-%m-%d)-webhook-tunnel-setup.md`: how to expose localhost:3001 via ngrok for Paymongo local dev

VERIFY:
1. typecheck + build pass
2. E2E with card 4343 4343 4343 4345:
   - localhost → placement CTA → form → Paymongo → payment → thank-you shows "paid"
   - DB row status='paid', tier='placement', amount_centavos=14900
   - reservations_events has webhook record
3. Failure: card 4000 0000 0000 0002 → retry page
4. Idempotency: replay webhook → status stays 'paid', no duplicate row

COMMIT: `feat(web+api): end-to-end reservation flow with paymongo checkout`

No "coming soon" fallback — defeats validation.
```

**✅ Acceptance:** /reserve/placement route live. Thank-you shows paid. Retry works. Tunnel doc created. All 4 verification tests pass.

**🚫 Forbidden:** Requiring account before reservation. Storing card data. Multiple reservations per payment intent. Showing PII via public endpoint. Skipping DPA consent checkbox.

**🆘 Recovery:** If webhook doesn't fire locally, paste: *"Stop fixing in code. Tunnel issue. Tell me what URL Paymongo is receiving and my ngrok URL. I'll reconcile."*

**🏁 Handoff:** → Prompt 9.

---

## Prompt 9 — Draft all Day-1 launch content

**🎯 Goal:** 8 content pieces drafted, reviewed, ready for Day-1 publication.

**⏱️ Time:** 2–3 hours

**🔒 Prerequisites:** Prompt 8 complete (CTAs clickable). Landing page deployed to rentrayda.com.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `artifacts/tiktok-scripts-first-3-videos.md`, `artifacts/landing-page-copy-and-discovery-script.md`, `decisions/2026-04-12-facebook-page-only-no-groups.md`, `decisions/2026-04-12-tiktok-primary-awareness-channel.md`, `context/09-target-psychographics-primary.md`, `context/07-facebook-policy.md`. **Also reference:** `Second Brain/COG-second-brain/04-projects/rentrayda/braindumps/2026-04-17-content-strategy.md` — this is the 14-day content calendar with per-channel format guides, posting schedules, metrics targets, and funnel projections. Day-1 content (8 pieces below) should align with this calendar's Day 1 plan.

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Draft all Day-1 launch content in ONE file: `.claude-brain/scratch/day-1-launch-content.md`.

TONE:
- FB group posts: Taglish, first-person, warm and direct
- TikTok creator outreach: Professional-friendly, quick to ask
- LinkedIn: Professional, data-driven, founder voice
- Personal Messenger: Warm, specific

8 PIECES:

1. FB GROUP POST — "Pasig Bedspace"
   - Near-scam story hook
   - Natural intro of RentRayda
   - 150-200 words
   - Link: rentrayda.com?utm_source=fb_pasig_bedspace
   - CTA: "check niyo para hindi kayo ma-scam"

2. FB GROUP POST — "BPO Hiring Philippines"
   - BPO training deadline + housing stress hook
   - Different entry story from #1
   - utm_source=fb_bpo_hiring
   - Emphasize free browse, no signup

3. FB GROUP POST — "Ortigas Housing Rentals"
   - Verified landlord angle
   - utm_source=fb_ortigas_housing
   - Emphasize verified deposit protection

4. TIKTOK OUTREACH #1 — female BPO creator 2-5K followers
   - Find 3 REAL candidates by searching #BPOlife #ConcentrixBPO; provide URLs
   - DM template: 4-6 sentences, ₱2K/video pitch
   - Include TikTok Script 1 ready to paste

5. TIKTOK OUTREACH #2 — student creator (DLSU/UP/PUP) 2-5K followers
   - Draft 60-sec student-variant script alongside DM

6. TIKTOK OUTREACH #3 — fresh grad / nurse creator
   - Draft fresh-grad variant script alongside DM

7. LINKEDIN POST — founder voice
   - Title: "The PH rental scam crisis nobody's solving"
   - 250-300 words
   - One data point per paragraph (cited; NO fabricated stats)
   - utm_source=linkedin_founder
   - Professional + emotionally honest
   - Footer: DPO email dpo@rentrayda.com

8. PERSONAL MESSENGER — for 10 BPO friends/family
   - Warmer than group post
   - THREE asks: (1) landing page feedback, (2) referrals, (3) share with one person
   - 100-150 words

FINAL CHECKS:
- Zero fabricated statistics (every number cited or labeled "estimate")
- Zero promises we can't keep
- No BIR references in landlord-facing content (gotchas rule)
- UTMs consistent across links
- 3 TikTok scripts genuinely different (persona, setting, pain — not just gender-swap)
- DPO email in LinkedIn footer

DO NOT POST ANYTHING. Draft-for-review only. I approve each before live.
```

**✅ Acceptance:** 8 pieces in one reviewable file. 3 real TikTok creators with URLs. 3 distinct scripts. UTMs on every link. No fabricated stats. Founder approves before Day 1.

**🚫 Forbidden:** Auto-posting. Inventing TikTok creators (must be real URLs). Using "our data" for stats we don't have. Copy-paste across posts.

**🆘 Recovery:** If Claude hallucinates stats, paste: *"Remove any statistic without a source URL. If you need a number and don't have a source, write '[STAT NEEDED]' — I'll fill it in."*

**🏁 Handoff:** → Prompt 10.

---

## Prompt 10 — Build validation metrics dashboard

**🎯 Goal:** Founder sees reservation count, channel breakdown, funnel health in real-time without asking Claude Code.

**⏱️ Time:** 3–4 hours

**🔒 Prerequisites:** Prompt 9 complete. Reservations flowing (even test ones).

**📖 Read first:** `.claude-brain/CLAUDE.md`, `context/06-validation-state.md`, `apps/web/app/admin/dashboard/page.tsx` (existing pattern), `apps/api/src/routes/admin.ts`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Build validation dashboard at `/admin/validation` (not /admin/dashboard — that's existing).

TEMPORARY AUTH:
- Admin pages currently unprotected (per REPO_STATUS).
- Add HTTP Basic Auth at `apps/web/middleware.ts`, matcher `/admin/validation`.
- ADMIN_USER and ADMIN_PASSWORD from .env (add to .env.example).
- TEMPORARY — full auth in Prompt 23. DO NOT remove this Basic Auth before Prompt 23 without explicit instruction.

BACKEND (extend `apps/api/src/routes/admin.ts`):
- GET /admin/validation/metrics returns:
  - total_reservations (all-time + today + last 24h)
  - by_tier: {placement: n}
  - by_status: {pending, paid, refunded, expired}
  - by_utm_source: {[source]: count}
  - by_day: [{date, tier, count}] last 14 days
  - conversion_rate: paid / (paid + pending + expired)
  - refund_rate: refunded / paid
- GET /admin/validation/reservations — paginated with filters
- All endpoints protected by the Basic Auth above

FRONTEND (`apps/web/app/admin/validation/page.tsx`):
- Header metric snapshot (LARGE numbers):
  - Combined reservations: N / 30 target
  - Days elapsed: X / 14
  - Projected day-14 total: P (linear extrapolation)
- UTM source breakdown — bar chart (simple SVG, no lib)
- Tier split — pie or split-bar
- Daily trajectory chart — last 14 days
- Reservation list table — sortable (date, tier, status)
- Status indicators:
  - Green: on track for BUILD (30+)
  - Yellow: EXTEND path (15-29)
  - Red: KILL path (<15)

CLI SNAPSHOT (`.claude-brain/scripts/validation-snapshot.sh`):
- Curl /admin/validation/metrics
- Pretty-print terminal
- Append daily line to `context/06-validation-state.md` "Daily snapshots" section
- Make executable

VERIFY:
1. typecheck + build pass
2. /admin/validation with Basic Auth works; 401 without
3. All 5 metrics render (0 values OK if no data)
4. Create 3 test reservations via real flow → counts update
5. CLI snapshot runs and appends to 06-validation-state.md

COMMIT: `feat(admin): validation metrics dashboard + cli snapshot + temporary basic auth`
```

**✅ Acceptance:** /admin/validation works with auth; 401 without. All 5 metrics visible and updating. CLI snapshot working. 06-validation-state.md being appended daily.

**🚫 Forbidden:** Skipping Basic Auth. Adding chart libraries (SVG enough). Showing email/phone in dashboard (DPA). Caching metrics >60s.

**🆘 Recovery:** If Claude adds chart lib, paste: *"Remove the dependency. SVG suffices. This is validation, not a BI tool."*

**🏁 Handoff:** PHASE 1 COMPLETE. Founder can launch Day 1.

---

# PHASE 2 — RUNNING VALIDATION (Prompts 11–15)

Phase time: fixed 14 calendar days, ~20h Claude Code time. Outcome: go/no-go decision at Day 14 with rich data.

---

## Prompt 11 — Daily reservation intake ritual (run every morning, 14 times)

**🎯 Goal:** 15-minute daily standup with Claude on validation progress.

**⏱️ Time:** 15 min/day × 14 = ~3.5h total

**🔒 Prerequisites:** Phase 1 complete. ≥1 day of validation elapsed.

**📖 Read first (every morning):** `.claude-brain/CLAUDE.md`, `context/06-validation-state.md`, latest journal entry, previous day's intake entry

**📋 Paste into Claude Code every morning:**

```
Daily validation intake for [TODAY'S DATE].

Follow session kickoff protocol. Then:
1. `./.claude-brain/scripts/validation-snapshot.sh`
2. Read the resulting update to `context/06-validation-state.md`

Tell me:
1. Reservations last 24h: N (by tier)
2. New reservers needing discovery calls in next 24h — names + phones + time-since-reservation
3. Paymongo webhook failures or duplicate records? Check reservations_events where status='failed' last 24h
4. UTM source breakdown — which channel producing most reservations per post? Highest-ROI channel?
5. Projected Day-14 total (linear extrapolation)
6. Am I on BUILD path (30+), EXTEND (15-29), or KILL (<15)?
7. Biggest risk right now (one sentence)
8. Recommended action for today (one sentence)

Save as `.claude-brain/journal/$(date +%Y-%m-%d)-validation-day-N.md` using template `.claude-brain/prompts/validation-daily-template.md` (if template doesn't exist, create it based on these 8 questions).

DO NOT: propose pivots, new features, or scope expansion. Data synthesis only.
```

**✅ Acceptance:** Snapshot ran. 8 questions answered with specific numbers/names. Daily journal entry created. No scope-creep recommendations.

**🚫 Forbidden:** Product changes mid-validation. Expansion to new geo/channels. Ignoring journal history.

**🆘 Recovery:** If Claude suggests pivots, paste: *"Still in validation. Only decision at Day 14 is build/extend/kill. Until then: data collection."*

**🏁 Handoff:** Continue daily until Day 14; → Prompt 12 when calls arrive.

---

## Prompt 12 — Discovery call batch synthesis (every 5 calls)

**🎯 Goal:** Qualitative patterns surfaced from every 5 calls.

**⏱️ Time:** 45 min/batch

**🔒 Prerequisites:** ≥5 discovery calls done. Notes captured (Messenger/voice memo).

**📖 Read first:** `.claude-brain/CLAUDE.md`, `artifacts/landing-page-copy-and-discovery-script.md` Section 2 (15-question framework), previous batch syntheses, `context/09-target-psychographics-primary.md`

**📋 Paste into Claude Code after every 5 calls:**

```
Follow session kickoff protocol. Pasting 5 discovery call notes below. Synthesize into batch insight report.

[PASTE CALL NOTES HERE — format doesn't matter]

For EACH call, extract:
| Caller | Tier | Channel | Top Fear | Top Desire | Deal-Breaker | WTP Signal | Referral Offered |

Across all 5:
1. PATTERNS (said 3+ times verbatim or near-verbatim)
2. CONTRADICTIONS (1 caller directly contradicting another)
3. SURPRISING DATA (not predicted from psychographic research)
4. MESSAGING IMPLICATION — ONE specific landing page copy change (before/after text, not redesign)

INFRASTRUCTURE SIGNAL EXTRACTION (4 extra questions — ask every reserver):
For each call, also extract answers to these 4 questions testing the bigger play:

Q-I1: "If paying rent through our app could build your credit score for bank loans, would that matter to you?"
→ Extract: Yes/No/Maybe + verbatim reasoning. Tags: credit-history-value

Q-I2: "If we told a landlord you're verified — ID confirmed, employed at [company], paid on time at your last place — do you think they'd prefer you over a random Facebook inquiry?"
→ Extract: Yes/No + their take on landlord behavior. Tags: verification-value-to-landlord

Q-I3: "What else do you need in your first 30 days in Manila besides housing?"
→ Extract: top 3 needs mentioned. Tags: adjacent-needs

Q-I4: "We can help process your NBI clearance, police clearance, and barangay clearance for ₱399 all-in — would you use that?"
→ Extract: Yes/No + willingness to pay amount. Tags: document-processing

Across the 4 infrastructure questions, report:
- Credit history interest: X/5 said yes (threshold: 7+/10 callers = viable)
- Verification value to landlords: X/5 said landlords would prefer (threshold: 8+/10 callers = strong signal)
- Top 3 adjacent needs (ranked by frequency)
- Document processing demand: X/5 said yes at ₱399 (threshold: 5+/10 callers = build it)
- (4th signal — guarantee-lite landlord reception — tracked separately in Prompt 34: threshold >60% excited)

Then compare to ALL previous batch syntheses in journal/:
- Patterns consistent across batches, or changing?
- Is our messaging implication reinforced or contradicted?
- Approaching the 10-call threshold for action?
- Infrastructure signals strengthening or weakening across batches?

Save `.claude-brain/journal/$(date +%Y-%m-%d)-discovery-batch-N.md`.

DO NOT: propose product changes yet (need 10+ calls). Invent patterns. Fake quotes. Recommend abandoning a tier based on single-batch data.
```

**✅ Acceptance:** Structured table all 5 calls. Patterns = only things said 3+ times. Messaging implication = specific copy change, not redesign. Saved to journal with batch number.

**🚫 Forbidden:** Fabricating quotes. Architecture/product changes. Generalizing from 1-2 calls. Jumping past 10-call threshold.

**🆘 Recovery:** If Claude generalizes prematurely, paste: *"5 calls insufficient to conclude X. Add to pattern list with 'WATCH' tag; revisit at 10."*

**🏁 Handoff:** Every 5 calls, repeat. After 10 → potentially Prompt 13.

---

## Prompt 13 — Mid-validation copy A/B test (trigger Day 7 IF pattern strong)

**🎯 Goal:** Test ONE copy change based on strongest pattern from first 10 calls.

**⏱️ Time:** 2h

**🔒 Prerequisites:** ≥10 discovery calls synthesized. Pattern strong enough (6+/10 mentions). Day 7 of validation (not earlier — earlier = noise).

**📖 Read first:** `.claude-brain/CLAUDE.md`, ALL discovery batch syntheses, `apps/web/app/page.tsx`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Based on 10+ call synthesis, implement ONE copy A/B test.

STEP 1 — Identify strongest pattern:
Review all `.claude-brain/journal/*-discovery-batch-*.md`. Strongest = one that:
- Mentioned in 6+/10 calls verbatim or near-verbatim
- Has clear copy implications
- Is NOT about a feature we lack

Tell me the pattern, show 6+ supporting quotes, propose the specific before/after copy change.

WAIT FOR MY APPROVAL before proceeding.

STEP 2 — Implement A/B:
- Cookie-based 50/50 split (no 3rd-party tools)
- variant_a = current copy (control)
- variant_b = new copy
- Store variant in reservations.variant column (migration if needed — we added it in Prompt 7 migration)
- Track conversions by variant
- Show variant in /admin/validation

STEP 3 — Commit:
```
feat(web): A/B test "[pattern name]" copy change

Before: "[old copy]"
After:  "[new copy]"

Based on 6+ call patterns (journal/YYYY-MM-DD-discovery-batch-N.md)
Runs Days 7-14; conversion compared in Day-14 go/no-go.
```

DO NOT: launch without showing me change first. Change multiple copy elements. Abandon control variant. Change pricing. Change tier structure.

If no pattern strong enough (nothing 6+), journal-entry that fact; wait until Day 10.
```

**✅ Acceptance:** Pattern identified with 6+ supporting quotes. ONE specific copy change. A/B infrastructure in place. Variant tracked in DB + dashboard.

**🚫 Forbidden:** Multi-variate testing. Pricing changes. Structural redesigns. Testing unsupported patterns.

**🆘 Recovery:** If Claude proposes redesign, paste: *"Copy A/B, not redesign. Revert to single-word or single-sentence change."*

**🏁 Handoff:** Let test run to Day 14. → Prompt 14.

---

## Prompt 14 — Day 14 go/no-go analysis

**🎯 Goal:** Founder decides build/extend/kill with full data, grounded in the gate.

**⏱️ Time:** 2–3h

**🔒 Prerequisites:** Day 14 of validation. All discovery calls done. A/B (if run) has data on both variants.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `FINAL_DECISION.md` §7, all validation journal entries, `context/06-validation-state.md`

**📋 Paste into Claude Code at end of Day 14:**

```
Follow session kickoff protocol. Day 14 go/no-go analysis. Be rigorous. If data says KILL, say KILL.

STEP 1 — NUMBERS (pull from dashboard + journal):
- Total paid reservations: N (target 30+ BUILD)
- UTM breakdown: which channel produced most
- Refund rate: Z%
- Discovery call completion: W% within 24h
- A/B result (if run): variant_a vs variant_b conversion

STEP 2 — DECISION (per FINAL_DECISION.md §7):
- 30+ paid reservations → BUILD (MVP cleanup → Phase 3)
- 15-29 → EXTEND (7 more days with iterated positioning)
- <15 → KILL (refund everyone, post-mortem, archive)

State decision in ONE WORD: BUILD, EXTEND, or KILL.

STEP 3 — IF BUILD:
- Top 3 customer quotes (conviction)
- Top 3 weakest signals (don't get overconfident)

STEP 3b — INFRASTRUCTURE SIGNAL ANALYSIS (only if BUILD):
Across all discovery calls + landlord onboarding data, aggregate the 4 infrastructure signals:
- Credit history interest: X/total callers said yes. If 7+/10 callers → viable (rent payment tracking is Year 2 priority)
- Verification value to landlords: X/total callers said landlords would prefer. If 8+/10 callers → strong signal
- Document processing demand: X/total callers said yes at ₱399. If 5+/10 callers → build it (near-term revenue, Prompt 44)
- Guarantee-lite landlord reception: X% excited across Prompt 34 onboarding. If >60% excited → viable (Prompt 42)
- Adjacent needs (ranked): top 3 across all calls → informs Prompts 41-47 prioritization
- Overall infrastructure viability: STRONG (3+ of the 4 signals above their respective threshold) / MODERATE (1-2) / WEAK (0)
  - STRONG → pursue full infrastructure roadmap (Prompts 41-47 after Phase 3)
  - MODERATE → pursue placement + management tools only, defer verification API
  - WEAK → stay as placement service, don't over-invest in infrastructure

- Handoff to Prompt 16

STEP 4 — IF EXTEND:
- Propose ONE change for 7-day extension (new channel, copy variant, price point)
- Revised gate Day 21 = same 30+ threshold (no moving goalposts)
- Don't move goalposts below 30

STEP 5 — IF KILL:
- Draft refund execution plan (Prompt 15)
- Draft LinkedIn post-mortem with honest lessons
- Don't soften ("we pivoted") — call it closure

STEP 6 — Save full analysis to `.claude-brain/journal/$(date +%Y-%m-%d)-day-14-decision.md` with decision prominently at top.

DO NOT: move goalposts to avoid killing. Recommend partial ship (Frankenbuild). Claim patterns stronger than quotes support. Advocate — synthesize.
```

**✅ Acceptance:** Decision stated at top of journal. All numbers cited from actual data. Tier recommendation (if BUILD) data-driven. Handoff prompt referenced.

**🚫 Forbidden:** Moving goalposts. Soft pivots. Advocacy. Making decision for founder.

**🆘 Recovery:** If Claude softens KILL, paste: *"Data is data. If KILL, KILL. I handle truth better than false positives."*

**🏁 Handoff:** BUILD → Prompt 16. EXTEND → re-run daily for 7 days. KILL → Prompt 15.

---

## Prompt 15 — Refund execution (only if KILL)

**🎯 Goal:** Every reserver refunded, honestly messaged, offered manual help.

**⏱️ Time:** 4–6h (mostly sending)

**🔒 Prerequisites:** Day 14 = KILL. Founder processed emotionally.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `decisions/2026-04-12-validate-before-build.md` refund policy, all reservations where status='paid'

**📋 Paste into Claude Code:**

```
Executing KILL. Refund protocol. Carefully and humanely.

STEP 1 — Pull refund list:
SELECT id, email, phone, tier, amount_centavos, paymongo_intent_id FROM reservations WHERE status='paid';
Save to `.claude-brain/scratch/refund-list.csv`. Confirm count matches Day 14 paid total.

STEP 2 — Refund in batches of 10:
For each:
- Call paymongo.refund(intent_id, amount_centavos, reason='validation failed')
- Wait for confirm before next
- Update reservations.status='refunded' + refunded_at=now()
- Log failures to `scratch/refund-failures.csv`

STEP 3 — Message template (ONE version for all):
`scratch/kill-message-template.md`:
- Honest opener ("We ran a 14-day test and didn't find enough demand to justify building further")
- Immediate reassurance ("Refunded in full via Paymongo; 3-5 business days")
- Genuine thanks ("Your reservation gave us real data")
- Manual help offer ("If still looking for Pasig/Ortigas housing, reply — I'll personally help from my landlord contacts, free, no strings")
- Sign-off with Miguel's real name + number

I approve before any sends.

STEP 4 — Send in batches:
- First SMS, then Messenger for those with it
- 10/hour (handles replies real-time, avoids spam filters)
- Log each send to `scratch/refund-sends.csv`

STEP 5 — Post-mortem LinkedIn post:
`scratch/post-mortem-linkedin.md`:
- Title: "What we learned from 14 days and [N] reservations"
- Honest failure framing (NOT "we pivoted")
- 3 specific lessons (what we'd do differently)
- Thanks to interviewees/reservers
- NO next-venture pitch (stay focused on closure)

I approve before live.

STEP 6 — Archive:
- `git tag v0.1.0-killed`
- README.md: "Project Status: Archived" header linking to post-mortem
- Make GitHub repo private
- DO NOT delete repo — historical record

DO NOT: send refund messages before refunds actually process. Soften ("we're pausing"). Solicit future venture. Blame users. Blame market (if untrue).
```

**✅ Acceptance:** 100% paid reservations refunded (verified Paymongo). Every reserver messaged. Post-mortem published with approval. Repo archived tag v0.1.0-killed.

**🚫 Forbidden:** Soft framing. Future product pitch. Market blame. Leaving reservers unnotified.

**🆘 Recovery:** If refunds fail, paste: *"Paymongo refund failures need manual dashboard work. Don't retry programmatically. List me the failures — I'll do them by hand."*

**🏁 Handoff:** Archived. You tried. You learned. Take a break.

---

# PHASE 3 — MVP CLEANUP (Prompts 16–25)

**Only run if Day 14 = BUILD.** Phase time: 40–50h across 5–7 working days.

---

## Prompt 16 — Cleanup phase planning session

**🎯 Goal:** Ordered plan for 10 cleanup items with dependencies + parallelizability.

**⏱️ Time:** 90 min

**🔒 Prerequisites:** Day 14 = BUILD. Clean tree. Day 14 journal entry.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `context/02-repo-status.md`, `context/03-architecture.md`, REPO_STATUS.md §10 if available

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Draft cleanup execution plan at `.claude-brain/journal/$(date +%Y-%m-%d)-phase-3-cleanup-plan.md`.

TASKS (from context/02-repo-status.md):
1. Auth TODOs in mobile (8 specific file:line)
2. Brand drift: 1142 old fonts + 733 old colors (updated 2026-04-14; verify with ground-truth audit in Prompt 2)
3. BullMQ workers not started
4. Missing resend package
5. Sentry integration (API + web + mobile) with DPA filters
6. ESLint configuration (root + workspace)
7. Web admin auth (replace Basic Auth with better-auth)
8. Web listings: wire to real API (remove mocks)
9. Mobile tab icons (RaydaIcon, not letters)
10. Testing foundation (auth flow + connection security smoke tests)

Per task:
- Estimated hours (conservative)
- Dependencies on other tasks (explicit)
- Parallelizable with: [list]
- Risk: what might go wrong
- Who: Claude Code solo / pair with founder

5-day sequence:
Day 1 (~8h): [tasks]
Day 2 (~8h): [tasks]
...

SEQUENCING RULES (hard):
- Auth TODOs BEFORE brand drift (auth-driven state conflicts with UI changes)
- ESLint BEFORE major refactors (catch issues as they happen)
- Sentry on a quiet day (hard to debug if Sentry breaks)
- Web admin auth BEFORE real API wiring (admin page would expose API)

DELIVERABLES:
- What commits per day
- What acceptance tests per day
- "Done" state

DO NOT: start cleanup. Change the 10 tasks. Skip sequencing justification. Over-promise hours.
```

**✅ Acceptance:** All 10 tasks scoped with hours + deps. 5-day sequence with rationale. Founder approves before Prompt 17.

**🚫 Forbidden:** Starting work. Changing scope. Feature additions during cleanup.

**🆘 Recovery:** If Claude adds tasks, paste: *"These 10 only. If something else needs fixing, note but don't add."*

**🏁 Handoff:** → Prompt 17.

---

## Prompt 17 — Wire 8 mobile auth TODOs (one at a time)

**🎯 Goal:** Every TODO replaced with real auth session; mobile screens use real user state.

**⏱️ Time:** 6–8h

**🔒 Prerequisites:** Prompt 16 complete. Mobile dev build working.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `apps/mobile/lib/auth.ts` (20 LOC), `apps/api/src/lib/auth.ts` (55 LOC), each of the 8 TODO files before editing

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Fix 8 mobile auth TODOs ONE AT A TIME. After each: typecheck, build, commit. Then next.

PATTERN: Replace hardcoded/mock values with configured better-auth client.

ORDER (safest → riskiest):
1. `apps/mobile/app/index.tsx:10` — "TODO: Check auth state and redirect accordingly"
   → Use auth.useSession() to redirect to /(auth)/phone if no session, else /(tabs)
2. `apps/mobile/app/(tabs)/_layout.tsx:8` — USER_ROLE hardcoded
   → Read from auth.useSession().user.role; if undefined, redirect to /(onboarding) role picker
3. `apps/mobile/app/(tabs)/inbox/index.tsx:42` — isLandlord hardcoded
   → Derive from session role
4. `apps/mobile/app/(onboarding)/employment-proof.tsx:40` — employmentType from profile/params
   → Fetch tenant profile via api.get('/tenants/me')
5. `apps/mobile/app/(onboarding)/submitted.tsx:9` — derive from session
   → auth.useSession(), show current name + role
6. `apps/mobile/app/(onboarding)/verified.tsx:17` — fetch from profile
   → Fetch profile endpoint matching role; show verification ceremony with real name
7. `apps/mobile/app/(onboarding)/verified.tsx:18` — derive from auth
   → Same pattern as #6
8. `apps/mobile/app/(tabs)/search/[id].tsx:305` — open connection request modal
   → Wire onPress to setConnectRequestModalOpen(true); ensure ConnectionRequestModal has real state

AFTER EACH FIX:
- `pnpm --filter @rentrayda/mobile run typecheck` passes
- Visual smoke: Expo dev build, navigate to affected screen
- Commit: `fix(mobile): wire auth at [file:line]`

DO NOT: fix brand drift here (Prompt 18). Refactor adjacent components. Change auth.ts config. Bypass typecheck between fixes. Squash all 8 into one commit.

Any regression → revert immediately, flag.
```

**✅ Acceptance:** 8 TODOs resolved. 8 separate commits. Typecheck passes after each. Expo build renders affected screens with real user data.

**🚫 Forbidden:** Batch-fixing. Touching brand drift. Refactoring auth client/server.

**🆘 Recovery:** If a fix breaks nav, paste: *"Revert last commit. Show error. Let's triage before retrying."*

**🏁 Handoff:** → Prompt 18.

---

## Prompt 18 — Eliminate brand drift (1142 fonts + 733 colors)

**🎯 Goal:** Mobile matches brand spec; zero old references.

**⏱️ Time:** 4–5h

**🔒 Prerequisites:** Prompt 17 complete. Clean tree.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `context/04-brand.md`, confirm BeVietnamPro-*.ttf + Sentient-*.otf in `apps/mobile/assets/fonts/`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Systematic brand cleanup across apps/mobile ONLY.

PRE-FLIGHT COUNT:
- `grep -rn "NotoSansOsage\|TANNimbus" apps/mobile | wc -l` (expect 1142)
- `grep -rn "#2563EB\|#2B51E3" apps/mobile | wc -l` (expect 733)

If counts differ: STOP and tell me — drift may have changed.

FONTS FIRST (one commit):
Mapping:
- 'NotoSansOsage-Bold' → 'BeVietnamPro-Bold'
- 'NotoSansOsage-Regular' → 'BeVietnamPro-Regular'
- 'NotoSansOsage-Medium' → 'BeVietnamPro-Medium'
- 'TANNimbus' → 'Sentient-Medium' (display only; if in body text, map to BeVietnamPro-Regular)
- 'NotoSansOsage' (bare) → 'BeVietnamPro-Regular'

After:
- `ls apps/mobile/assets/fonts/*.ttf apps/mobile/assets/fonts/*.otf` (font files exist)
- `apps/mobile/app/_layout.tsx` loads new families
- Re-grep: `grep -rn "NotoSansOsage\|TANNimbus" apps/mobile | wc -l` → 0
- Expo dev build renders
- Commit: `fix(mobile): replace 1142 deprecated font references with BeVietnamPro + Sentient`

COLORS NEXT (separate commit):
- '#2563EB' → '#2D79BF'
- '#2B51E3' → '#2D79BF'

After:
- Re-grep colors → 0
- Expo dev build — check brand consistency across screens
- Commit: `fix(mobile): replace 733 deprecated color references with brand blue #2D79BF`

FINAL:
- `pnpm turbo typecheck` passes
- `pnpm turbo build` passes
- Visual smoke of all tab screens

DO NOT: change font sizes/weights (only family names). Change color meaning. Touch web. Squash commits.
```

**✅ Acceptance:** Zero grep matches for old fonts/colors. Typecheck+build pass. Expo renders. Two separate commits.

**🚫 Forbidden:** Sizes/weights changes. Bulk find-replace via editor (use grep + str_replace for predictability). Touching web.

**🆘 Recovery:** If Expo build fails after changes, paste: *"Revert both commits. Show Expo error. Fix font loading config before retrying."*

**🏁 Handoff:** → Prompt 19.

---

## Prompt 19 — Start BullMQ workers

**🎯 Goal:** Push notifications actually send. Auto-pause cron actually runs.

**⏱️ Time:** 2–3h

**🔒 Prerequisites:** Prompt 18 complete. Redis running locally. Jobs defined in `apps/api/src/jobs/`.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `apps/api/src/jobs/push-notification.ts`, `apps/api/src/jobs/auto-pause-listings.ts`, `apps/api/src/lib/queue.ts`, `apps/api/src/index.ts`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Start BullMQ workers properly.

CURRENT STATE:
- Handlers defined in apps/api/src/jobs/*
- Queue configured in lib/queue.ts
- Workers NEVER STARTED in apps/api/src/index.ts
- Result: push notifications enqueued but never processed; auto-pause cron never runs

FIX in apps/api/src/index.ts:
1. Import handler modules
2. After app.listen, create Workers:
   - notificationWorker for 'notifications' queue, concurrency 5, processor = push-notification handler
   - cleanupWorker for 'cleanup' queue, concurrency 1, processor = auto-pause-listings
3. Schedule auto-pause cron (repeatable):
   `queue.add('auto-pause-listings', {}, { repeat: { cron: '0 19 * * *' } })` (19:00 UTC = 03:00 PHT)
4. Graceful shutdown on SIGTERM: `await Promise.all([notificationWorker.close(), cleanupWorker.close()])`
5. Log "workers started" + "workers stopped"

TEST:
1. Start API locally
2. Enqueue test push (create POST /test/enqueue-push endpoint if needed)
3. Verify worker processes (logs; Expo token hit if configured)
4. Verify repeatable job: `redis-cli ZRANGE 'bull:cleanup:repeat' 0 -1`

PRODUCTION SAFETY:
- Don't start workers if NODE_ENV='test' (breaks unit tests)
- Malformed jobs → log + move to failed queue (don't crash)
- Add Sentry to worker processor (wired in Prompt 21)

COMMIT: `fix(api): start BullMQ workers for push notifications + auto-pause cron`
```

**✅ Acceptance:** Workers start on boot (log visible). Test push processed E2E. Repeatable job registered. Graceful shutdown works.

**🚫 Forbidden:** Adding new job types (scope). Modifying handler logic. Starting workers in test mode.

**🆘 Recovery:** If Redis connection fails, paste: *"Show Redis error. Don't try to fix — could be env or Redis state."*

**🏁 Handoff:** → Prompt 20.

---

## Prompt 20 — Add missing resend package

**🎯 Goal:** resend installed; email sends work.

**⏱️ Time:** 30 min

**🔒 Prerequisites:** Prompt 19 complete. Resend API key (test mode OK).

**📖 Read first:** `.claude-brain/CLAUDE.md`, `apps/api/src/lib/email.ts`, `apps/api/src/lib/magic-link-email.ts`, `apps/api/package.json`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Fix missing resend dependency.

DIAGNOSIS:
- `grep "from 'resend'" apps/api/src/lib/email.ts` (import exists)
- `cat apps/api/package.json | grep resend` (NOT in deps)
- Imported but not installed → runtime error waiting

FIX:
1. `pnpm add resend --filter @rentrayda/api`
2. Verify: `cat apps/api/package.json | grep resend` shows dependency
3. `pnpm --filter @rentrayda/api run typecheck` passes

TEST:
1. Send test magic link:
   `curl -X POST http://localhost:3001/api/auth/magic-link -H "Content-Type: application/json" -d '{"email":"test@example.com"}'`
2. Check Resend test-mode dashboard — email appears
3. If magic-link-email.ts has broken template, report first; don't auto-fix

COMMIT: `fix(api): add missing resend dependency`
```

**✅ Acceptance:** resend in apps/api/package.json deps. Typecheck passes. Test email sends via test mode.

**🚫 Forbidden:** Rewriting email.ts beyond minimal fixes. Changing templates without approval. Adding other email packages.

**🆘 Recovery:** If install fails, paste: *"Show pnpm error. Might be workspace version conflict."*

**🏁 Handoff:** → Prompt 21.

---

## Prompt 21 — Sentry integration (API + Web + Mobile) with DPA filters

**🎯 Goal:** Errors captured. No sensitive data leaked.

**⏱️ Time:** 3–4h

**🔒 Prerequisites:** Prompt 20 complete. Sentry project created, DSN in hand.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `context/12-gotchas.md` DPA section, `decisions/2026-04-12-data-privacy-act-compliance.md`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Install + configure Sentry across all three apps with DPA-compliant filters.

SENTRY_DSN env var already in .env.example but no @sentry/* packages installed.

STEP 1 — INSTALL:
- `pnpm add @sentry/node --filter @rentrayda/api`
- `pnpm add @sentry/nextjs --filter @rentrayda/web`
- `pnpm add @sentry/react-native --filter @rentrayda/mobile` (follow Expo setup guide)

STEP 2 — INIT:
- API: Sentry.init() at top of `apps/api/src/index.ts` BEFORE route definitions
- Web: standard @sentry/nextjs integration with next.config.js
- Mobile: Sentry.init() in `apps/mobile/app/_layout.tsx`

STEP 3 — DPA FILTER (critical):
Add beforeSend to ALL THREE apps:

```typescript
beforeSend(event) {
  if (event.request?.url?.match(/\/(verify|storage|profile)/)) {
    event.request.data = '[REDACTED - DPA]';
  }
  if (event.user?.email) event.user.email = '[REDACTED]';
  if (event.user?.phone) event.user.phone = '[REDACTED]';
  if (event.message?.match(/\d{6}/)) {
    event.message = event.message.replace(/\d{6}/g, '[OTP-REDACTED]');
  }
  return event;
}
```

STEP 4 — Source maps + release tagging:
- Each app's build uploads source maps to Sentry
- Tag release with git SHA: `SENTRY_RELEASE=$(git rev-parse HEAD)`

STEP 5 — Test:
- Throw test error in each app
- Appears in Sentry dashboard
- Body redacted if endpoint in sensitive list
- No phone/email/OTP in captured events

STEP 6 — Update `context/12-gotchas.md` if any DPA edge case uncovered.

COMMIT: `feat: sentry integration across api, web, mobile with DPA-compliant filters`
```

**✅ Acceptance:** All 3 apps send test errors. Sensitive data redacted. Source maps uploaded. git SHA tagged.

**🚫 Forbidden:** Capturing request bodies from verification endpoints. Storing PII in tags. Skipping beforeSend. Low sample rate missing errors (100% for now).

**🆘 Recovery:** If DPA filter blocks legit errors, paste: *"Show me what's blocked. Refine regex — but never weaken redaction."*

**🏁 Handoff:** → Prompt 22.

---

## Prompt 22 — ESLint configuration + fix blocker errors

**🎯 Goal:** Linting works. Blocker errors fixed. Style warnings deferred.

**⏱️ Time:** 3–4h

**🔒 Prerequisites:** Prompt 21 complete. Clean tree.

**📖 Read first:** `.claude-brain/CLAUDE.md`, root package.json + each workspace (confirm `"lint": "echo 'no linter configured'"` placeholder)

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Set up ESLint at monorepo root + per-workspace overrides.

STEP 1 — INSTALL:
`pnpm add -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-next eslint-plugin-react-native -w`

STEP 2 — ROOT CONFIG `.eslintrc.json`:
- Extends: eslint:recommended, plugin:@typescript-eslint/recommended
- Parser: @typescript-eslint/parser
- Rules:
  - no-unused-vars: 'error'
  - @typescript-eslint/no-explicit-any: 'warn'
  - no-console: ['warn', { allow: ['warn', 'error'] }]
  - prefer-const: 'error'

STEP 3 — WORKSPACE OVERRIDES:
- apps/web: next/core-web-vitals
- apps/mobile: plugin:react-native/all
- apps/api: node

STEP 4 — SCRIPTS:
Replace every `"lint": "echo 'no linter configured'"` with `"lint": "eslint . --ext .ts,.tsx"`

STEP 5 — TURBO:
Add lint to turbo.json pipeline (parallelizable)

STEP 6 — FIX BLOCKERS ONLY:
- `pnpm turbo lint` — expect many errors
- Fix only 'error'-level rules
- DO NOT fix warnings yet

STEP 7 — CI:
Add `pnpm turbo lint` as required check in `.github/workflows/deploy.yml`

COMMIT 1: `feat: ESLint configuration at monorepo root + workspace overrides`
COMMIT 2: `fix: resolve ESLint blocker errors across packages`

FINAL: `pnpm turbo lint` → zero errors (warnings OK). CI fails PRs introducing new errors.
```

**✅ Acceptance:** `pnpm turbo lint` exits 0 for errors. CI updated. Placeholder scripts removed.

**🚫 Forbidden:** Fixing warnings (deferred). Disabling rules (fix the code). Skipping CI integration.

**🆘 Recovery:** If too many errors, paste: *"Don't silence with eslint-disable. Fix the code. Non-trivial fix → its own commit."*

**🏁 Handoff:** → Prompt 23.

---

## Prompt 23 — Protect web admin with real auth

**🎯 Goal:** Replace temporary Basic Auth with better-auth session. /admin/* fully protected.

**⏱️ Time:** 4–5h

**🔒 Prerequisites:** Prompt 22 complete. better-auth config in `apps/api/src/lib/auth.ts` working.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `apps/api/src/lib/auth.ts`, `apps/web/middleware.ts` (Basic Auth from Prompt 10)

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Replace temporary Basic Auth with real better-auth session.

STEP 1 — ADMIN USER:
- Role check in users table (already has role column)
- Admin role = 'admin' (distinct from 'landlord' and 'tenant')
- Bootstrap migration: insert initial admin user with founder email

STEP 2 — ADMIN LOGIN (`apps/web/app/admin/login/page.tsx`):
- Email + password form
- Calls better-auth sign-in endpoint
- Success → redirect to /admin/dashboard
- Failure → friendly error

STEP 3 — MIDDLEWARE (`apps/web/middleware.ts`):
- Replace Basic Auth with better-auth session check
- Matcher: /admin/:path*
- No session → redirect to /admin/login?redirect_to={original_path}
- Session but role != 'admin' → 403 page
- Session cookie secure + httpOnly

STEP 4 — SEO:
- /admin/robots.txt: disallow everything
- next.config.js: X-Robots-Tag 'noindex' header for /admin/*

STEP 5 — REMOVE BASIC AUTH:
- Delete ADMIN_USER and ADMIN_PASSWORD env vars from .env.example
- Replace with ADMIN_BOOTSTRAP_EMAIL (initial seed only)
- Update `context/03-architecture.md` env vars section

STEP 6 — TEST:
- Hit /admin/dashboard without login → /admin/login redirect
- Admin login → dashboard accessible
- Landlord login → 403
- Tenant login → 403

COMMIT: `feat(web): replace basic auth with better-auth session for admin pages`
```

**✅ Acceptance:** Unauthenticated → login redirect. Non-admin → 403. noindex + robots.txt in place. Basic Auth removed.

**🚫 Forbidden:** Adding JWT (DB sessions per non-negotiable). Sharing admin session with user sessions. Leaving Basic Auth as fallback.

**🆘 Recovery:** If session check fails unexpectedly, paste: *"Show better-auth return value in middleware context. Don't bypass — debug."*

**🏁 Handoff:** → Prompt 24.

---

## Prompt 24 — Wire web listings to real API

**🎯 Goal:** /listings and /listings/[id] render real data, not mocks.

**⏱️ Time:** 3h

**🔒 Prerequisites:** Prompt 23 complete. API has real listing data (at minimum, dev test data).

**📖 Read first:** `.claude-brain/CLAUDE.md`, `apps/web/app/listings/page.tsx` (mock-based), `apps/web/app/listings/[id]/page.tsx`, `apps/web/lib/mock-data.ts`, `apps/api/src/routes/listings.ts`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Replace mock data with real API calls.

STEP 1 — ANALYZE:
- Read listings/page.tsx — imports mockListings from lib/mock-data.ts
- Read lib/mock-data.ts shape
- Confirm apps/api/src/routes/listings.ts GET /listings response format

STEP 2 — SSR FETCH (listings/page.tsx):
- Next.js server component
- Fetch `${process.env.NEXT_PUBLIC_API_URL}/listings?barangay=X&minPrice=Y&maxPrice=Z`
- Accept query params from URL
- Pass typed data to existing ListingsClient component
- `revalidate: 60` (listings change slowly)

STEP 3 — DETAIL (listings/[id]/page.tsx):
- Fetch `${API_URL}/listings/{id}`
- 404 if missing
- `generateStaticParams` for initial 100 listings (ISR)

STEP 4 — DEV FALLBACK:
- Keep lib/mock-data.ts
- Env flag USE_MOCK_DATA (default false)
- true → mocks (offline dev); false → API

STEP 5 — STATES:
- Next.js loading.tsx for /listings (use existing SkeletonCard)
- error.tsx for graceful API failure ("Listings temporarily unavailable")

STEP 6 — IMAGES:
- next/image with Cloudflare R2 public bucket domains whitelisted in next.config.js
- Sizes: 400w for card, 800w for detail

STEP 7 — TEST:
- Visit /listings with API up → listings render
- Stop API → error page
- USE_MOCK_DATA=true → mocks render
- Visit /listings/[random-id] → 404

COMMIT: `feat(web): wire listings pages to real API with ISR + fallback`
```

**✅ Acceptance:** Real listings render. 404 graceful. Error page if API down. Dev fallback via env flag.

**🚫 Forbidden:** Removing mock-data.ts (keep for dev fallback). Client-side fetching (server components). Leaking internal IDs or private fields.

**🆘 Recovery:** If API shape mismatches, paste: *"Show exact API response vs component expectation. Fix serializer, not component."*

**🏁 Handoff:** → Prompt 25.

---

## Prompt 25 — Mobile tab icons + testing foundation

**🎯 Goal:** Real tab icons. 2 critical tests (connection security + auth flow) pass.

**⏱️ Time:** 3h

**🔒 Prerequisites:** Prompt 24 complete. `packages/ui/icons/RaydaIcon.tsx` exists.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `apps/mobile/app/(tabs)/_layout.tsx`, `packages/ui/icons/RaydaIcon.tsx`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Two bundled tasks.

A. MOBILE TAB ICONS:
- Current: letter placeholders S/H/I/P in `apps/mobile/app/(tabs)/_layout.tsx`
- Fix: import RaydaIcon from packages/ui/icons/RaydaIcon.tsx
- Map:
  - Search tab → 'search'
  - Listings tab → 'home' (or 'building' if available)
  - Inbox tab → 'inbox'
  - Profile tab → 'user'
- Size: 24px
- Color: active = '#2D79BF'; inactive = '#999999'
- Test: Expo dev build renders

B. TESTING FOUNDATION:
- `pnpm add -D vitest @testing-library/react -w`
- `apps/api/tests/connections.test.ts` — 4 tests for triple-check in connections.ts reveal logic:
  1. pending + landlord verified + tenant verified → reveal succeeds
  2. 'accepted' (already) → throws FORBIDDEN
  3. landlord not verified → throws NOT_VERIFIED
  4. tenant not verified → throws NOT_VERIFIED
  (THE core security. MUST pass.)
- `apps/mobile/tests/auth-flow.test.ts` — 3 smoke tests:
  1. phone submitted → OTP form shown
  2. OTP verified → role selector shown
  3. role selected → navigate to appropriate tab
  (Mock better-auth client)
- Add to turbo.json: `"test": { "dependsOn": ["^build"], "outputs": [] }`
- `pnpm turbo test` passes

COMMIT 1: `fix(mobile): tab icons use RaydaIcon instead of letter placeholders`
COMMIT 2: `test: foundation tests for connection reveal + mobile auth flow`

FINAL VERIFY:
- `pnpm turbo test` green
- `pnpm turbo typecheck` green
- `pnpm turbo build` green
- `pnpm turbo lint` green
```

**✅ Acceptance:** Tab icons render in Expo. 7 tests pass (4 connection + 3 auth flow). All turbo tasks green.

**🚫 Forbidden:** Skipping one of the two parts. Writing more than 7 tests (scope). Removing mocks from tests (appropriate for unit tests).

**🆘 Recovery:** If tests fail unexpectedly, paste: *"Show failing output. Do NOT skip with .skip(). If failing for a real bug — flag the bug. More valuable than a passing test."*

**🏁 Handoff:** PHASE 3 COMPLETE. MVP clean. → PHASE 4.

---

# PHASE 4 — FEATURES BUILDOUT (Prompts 26–32)

Phase time: 50–70h across 7–10 working days.

---

## Prompt 26 — Phase 4 planning with partnership status check

**🎯 Goal:** Honest plan reflecting real partnership status.

**⏱️ Time:** 2h

**🔒 Prerequisites:** Phase 3 complete. Founder checked licensed EMI partner + PSA eVerify status. (GCash hypothesis dead — 0/6 landlords accept GCash per field interviews. Evaluate Maya, Tonik, or manual bank transfer as alternatives.)

**📖 Read first:** `.claude-brain/CLAUDE.md`, all 4 partnership-relevant decisions, `artifacts/partnership-outreach-gcash-and-philsys.md` (GCash sections are historical reference only)

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Draft Phase 4 plan at `.claude-brain/journal/$(date +%Y-%m-%d)-phase-4-plan.md`.

FIRST ask me:
1. Licensed EMI partner — status? (GCash DEAD per field interviews. Evaluating: Maya / Tonik / manual bank transfer / other?)
2. PSA eVerify institutional onboarding — status?
3. OPC registration — complete?
4. DPO appointment + NPC registration — status?

For each feature: BUILD NOW / STUB (typed interface no implementation) / WAIT (blocked on external):

1. Migration 0002 payments + match_requests — always BUILD (no dependency)
2. Paymongo production hardening — always BUILD
3. Deposit orchestration via licensed EMI partner (TBD) — BUILD if partnership signed, STUB otherwise
4. PhilSys eVerify — BUILD if PSA onboarded, STUB otherwise
5. HazardHunter flood-risk — always BUILD (public data)
6. Listing verification managed agent — always BUILD (uses Anthropic API)
7. Dual-confirmation deposit state machine — BUILD if EMI partner signed, STUB otherwise

Sequence considering dependencies:
- Migration 0002 first
- Paymongo hardening before EMI deposit integration (we're live with it)
- Flood risk can run parallel with anything
- Managed agent can run parallel, needs Anthropic key

Hours per feature.

DO NOT: build partnership-dependent features without signed partnership. Recommend going live without DPA items. Propose regulatory bypasses.

If critical partnerships blocked, Phase 4 may be shorter — better wait than violate regulations.
```

**✅ Acceptance:** Partnership status captured truthfully. Build/Stub/Wait decisions per feature. Sequence reflects dependencies.

**🚫 Forbidden:** Building partnership-dependent features on "probably will sign". Skipping DPA items. Proposing regulatory bypasses.

**🆘 Recovery:** N/A — pure planning.

**🏁 Handoff:** → Prompt 27.

---

## Prompt 27 — DPA compliance technical infrastructure

**🎯 Goal:** Consent tracking, user deletion endpoint, encryption verification — all live.

**⏱️ Time:** 6–8h

**🔒 Prerequisites:** Prompt 26 complete. Founder working on non-technical items in parallel.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `decisions/2026-04-12-data-privacy-act-compliance.md` (all 8 items), `context/12-gotchas.md` DPA

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Implement 3 TECHNICAL DPA items. Items 1, 2, 3, 5, 8 in the decision are founder tasks (DPO, PIA, privacy policy, breach protocol, NPC registration) — founder handles.

STEP 1 — CONSENT TRACKING:
Migration adds to users table:
- marketing_consent_at (timestamp, nullable)
- data_sharing_consent_at (timestamp, nullable)
- terms_accepted_version (text, nullable)
- terms_accepted_at (timestamp, nullable)
- Update reg flow to require explicit consent (checkbox on /reserve already exists from Prompt 8 — wire to DB)
- API endpoint: PATCH /users/me/consents

STEP 2 — USER DELETION ENDPOINT:
- POST /api/users/me/delete (auth required)
- Cascade delete IN ORDER (respect FKs):
  1. connections → user
  2. connection_requests → user
  3. reports → user
  4. listing_photos of listings owned
  5. listings owned
  6. verification_documents
  7. tenant_profile or landlord_profile
  8. user row
- R2 object cascade: delete all referenced R2 keys (S3 batch delete)
- Audit: insert to `deletion_audit` table (NEW) with user_id, timestamp, reason, IP
- Return 204
- Invalidate session (forced logout)
- Mobile UI: profile "Delete my account" button with confirmation modal

STEP 3 — ENCRYPTION VERIFICATION:
- Confirm R2 buckets SSE enabled: `aws s3api get-bucket-encryption --bucket $R2_BUCKET_VERIFICATION` (Cloudflare API)
- Test: `apps/api/tests/encryption.test.ts` checks bucket encryption status
- If not enabled: enable via terraform/infra + document

TEST:
- Register test user, delete, verify all rows gone
- Verify R2 objects deleted (Cloudflare dashboard)
- Verify deletion_audit row exists
- Verify session invalidated (old token → 401)

COMMIT: `feat(dpa): consent tracking + user deletion cascade + encryption verification`

DO NOT: auto-generate privacy policy (founder legal). Exempt admins. Skip audit log (5-year retention required). Soft-delete.
```

**✅ Acceptance:** Consent fields in users table. Deletion cascades all rows. R2 objects gone. Audit row written. Session invalidated.

**🚫 Forbidden:** Soft-delete. Skipping cascade. Drafting privacy policy. Indefinite retention.

**🆘 Recovery:** If cascade fails midway, paste: *"Use a transaction. Any step fails → roll back all. Better to fail cleanly than half-delete."*

**🏁 Handoff:** → Prompt 28.

---

## Prompt 28 — Migration 0002 — payments + match_requests tables

**🎯 Goal:** Schema ready for Phase 4 payment flows.

**⏱️ Time:** 2–3h

**🔒 Prerequisites:** Prompt 27 complete. Existing reservations from Prompt 7 (don't touch).

**📖 Read first:** `.claude-brain/CLAUDE.md`, `packages/db/schema/*.ts` patterns, `context/03-architecture.md` Phase 2 env vars

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Migration 0002 adds match_requests + payments (reservations was in Prompt 7).

STEP 1 — `packages/db/schema/match_requests.ts`:
- id uuid pk
- tenant_user_id fk → users
- reservation_id fk → reservations, nullable (founder can create manual request)
- tier enum('placement')
- form_data jsonb: {work_location, budget_min, budget_max, move_in_date, gender_preference, must_haves[]}
- status enum('submitted','matching','matches_ready','viewing_scheduled','moved_in','completed','cancelled')
- matched_landlord_ids jsonb array nullable
- created_at, matched_at (nullable), moved_in_at (nullable), completed_at (nullable)
- Index on status for queue queries

STEP 2 — `packages/db/schema/payments.ts` (NEW — different from reservations):
- id uuid pk
- user_id fk → users
- type enum('reservation','commission','refund','placement_balance')
- related_entity_id uuid nullable (e.g. match_request id for commissions)
- amount_centavos int (negative for refunds)
- currency text default 'PHP'
- provider enum('paymongo','emi_partner','manual')  -- was 'gcash', now generic pending partner selection
- provider_reference text unique when not null
- status enum('pending','succeeded','failed','reversed')
- metadata jsonb
- created_at, processed_at (nullable)

STEP 3 — GENERATE + REVIEW:
- `pnpm drizzle-kit generate`
- Review generated SQL in packages/db/migrations/0002_*.sql
- Tell me the migration filename before applying

STEP 4 — APPLY:
- `pnpm drizzle-kit migrate`

STEP 5 — RELATIONS:
- Update packages/db/schema/relations.ts
- Re-export from index.ts

STEP 6 — TYPECHECK:
- `pnpm turbo typecheck`

COMMIT: `feat(db): migration 0002 — match_requests + payments`

DO NOT: store card details. Add wallet/balance columns (regulatory — not EMI). Drop reservations. Combine with schema changes from other prompts.
```

**✅ Acceptance:** Migration applied cleanly. Both tables visible in psql `\dt`. Typecheck passes. Relations work.

**🚫 Forbidden:** Card details. Wallet/balance concepts. Non-idempotent migration.

**🆘 Recovery:** If migration fails midway, paste: *"Revert with `pnpm drizzle-kit down`. Show error. Don't hotfix — clean up first."*

**🏁 Handoff:** → Prompt 29.

---

## Prompt 29 — Paymongo production hardening

**🎯 Goal:** Paymongo production-safe: signatures verified, idempotent, rate-limited, logged.

**⏱️ Time:** 3–4h

**🔒 Prerequisites:** Prompt 28 complete. Paymongo PRODUCTION keys (founder has).

**📖 Read first:** `.claude-brain/CLAUDE.md`, `apps/api/src/lib/payments/paymongo.ts` (from Prompt 7), `apps/api/src/routes/payments.ts`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Harden Paymongo for production.

STEP 1 — SIGNATURE AUDIT:
- Confirm HMAC-SHA256 verification in webhook (from Prompt 7)
- Test: invalid → 401; valid → 200

STEP 2 — IDEMPOTENCY AUDIT:
- Confirm paymongo_intent_id unique constraint
- Test: replay webhook → no duplicate row

STEP 3 — RESPONSE SLA:
- Webhook responds <500ms
- If verification + DB > 500ms, defer heavy work to BullMQ
- Sentry performance monitoring on webhook endpoint

STEP 4 — REFUND HARDENING:
- POST /payments/:id/refund (admin-only via better-auth from Prompt 23)
- Full refund only (no partial yet)
- Prevent re-refund (check status first)
- Log to payments type='refund' amount_centavos=-(original)
- Trigger confirmation email

STEP 5 — RATE LIMITING:
- POST /payments/reservations: 5/IP/hour
- POST /payments/webhook: NO rate limit (Paymongo must retry unlimited)
- POST /payments/:id/refund: 20/admin/hour

STEP 6 — AUDIT LOGGING:
- `payment_events` table (NEW) — every state transition
- Log: event_type, payment_id, from_status, to_status, metadata, timestamp
- 2-year retention (DPA financial records)

STEP 7 — PRODUCTION SAFETY:
- Feature flag PAYMENTS_LIVE=true — if false, reject all payment attempts
- Document flag in .env.example
- Kill switch if bug in prod

TEST:
- Production signature with real webhook secret
- Refund E2E with test card
- Rate limit kicks in at 6th IP request
- Sentry webhook latency <500ms

COMMIT: `feat(api): paymongo production hardening — signatures, idempotency, audit, rate limits`
```

**✅ Acceptance:** All 7 items verified. Kill switch works. Sentry tracking live.

**🚫 Forbidden:** Removing feature flag. Logging raw card data. Skipping signature check any path.

**🆘 Recovery:** If signature fails in prod, paste: *"Flip PAYMENTS_LIVE=false immediately. Don't debug in prod. Reproduce locally."*

**🏁 Handoff:** → Prompt 30.

---

## Prompt 30 — Deposit mechanism integration (STUB path — GCash hypothesis dead)

> **HYPOTHESIS DEAD (2026-04-16):** GCash partnership was the original plan for deposit orchestration. Field interviews invalidated this: 0/6 landlords accept GCash. The PRINCIPLE (we never custody funds — route through a licensed EMI) remains valid. The IMPLEMENTATION is TBD. For the first 10 placements, use manual bank transfer with founder-verified receipts.

**🎯 Goal:** Deposit stub routes exist. Manual bank transfer interim documented. Architecture ready for future EMI partner (Maya, Tonik, or other).

**⏱️ Time:** 2–3h (stub + manual interim docs)

**🔒 Prerequisites:** Prompt 29 complete. Founder has NOT signed any EMI partnership yet.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `decisions/2026-04-12-escrow-via-gcash-partnership.md` (historical — GCash hypothesis dead, no-custody principle still valid)

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. EMI deposit partner NOT signed (GCash hypothesis dead — 0/6 landlords accept GCash per field interviews). Stub + manual interim.

CRITICAL: We never custody. When an EMI partner IS signed, they hold funds per their license. Until then, manual bank transfer with founder-verified receipts.

STEP 1 — `apps/api/src/lib/payments/emi-partner.ts` TypeScript interfaces ONLY:
- Generic EMI partner interface (not GCash-specific) — designed to work with Maya, Tonik, GCash, or any BSP-licensed EMI
- No API calls
- All functions throw 'NOT_IMPLEMENTED_PENDING_PARTNERSHIP'
- Export types matching expected real implementation

STEP 2 — `apps/api/src/routes/deposits.ts` route stubs:
- Routes exist, return 503 with {error: "Deposit orchestration pending EMI partnership", code: "PARTNERSHIP_PENDING"}
- POST /deposits/manual-confirm (admin-only): for founder to log manual bank transfer receipt during interim period

STEP 3 — MANUAL INTERIM FLOW (first 10 placements):
Document in `.claude-brain/journal/$(date +%Y-%m-%d)-deposit-interim-manual.md`:
- Tenant sends deposit directly to landlord via bank transfer (BDO/BPI/UnionBank)
- Tenant sends screenshot of transfer receipt to founder via Messenger
- Founder verifies receipt + amount, logs via POST /deposits/manual-confirm
- Commission collected separately via Paymongo (method on file from reservation)
- This is TEMPORARY — scales to ~10-15 placements before it breaks

STEP 4 — Journal:
`.claude-brain/journal/$(date +%Y-%m-%d)-emi-partnership-status.md`:
- GCash: DEAD (0/6 landlord acceptance per field interviews)
- Maya Business API: status [Not evaluated / Evaluating / Sent / Negotiating]
- Tonik: status [Not evaluated / Evaluating / Sent / Negotiating]
- Manual bank transfer: ACTIVE as interim for first 10 placements
- Blocked: automated deposit orchestration, automated commission collection
- Next step: evaluate Maya Business API terms

COMMIT: `chore(api): deposit stubs with manual interim flow (gcash hypothesis dead, emi partner tbd)`
```

**✅ Acceptance:** Generic EMI interfaces exist. Manual interim documented. Partnership status journaled. 503 returned on automated deposit routes. Manual-confirm route works for admin.

**🚫 Forbidden:** Building GCash-specific integration. Partial integration without partnership. Pretending any EMI partner is signed when not.

**🆘 Recovery:** If all EMI partnerships stall, paste: *"Manual bank transfer is fine for first 10 placements. Update journal. Move to Prompt 31. Don't wait forever — the manual process IS the MVP."*

**🏁 Handoff:** → Prompt 31.

---

## Prompt 31 — HazardHunter flood-risk layer (OPTIONAL — deprioritize if time-constrained)

**⚠️ PRIORITY NOTE:** This prompt is nice-to-have, not core to the trust infrastructure thesis. If Phase 4 is running long, SKIP this and move to Prompt 32 (listing verification agent), which IS core. Flood risk can be added in Phase 5 or later.

**🎯 Goal:** Every Pasig listing has flood-risk badge from government data.

**⏱️ Time:** 4–5h

**🔒 Prerequisites:** Prompt 30 (built or stubbed). HazardHunter data source identified.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `decisions/2026-04-12-flood-risk-indicators.md`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Implement flood-risk indicators per decision.

STEP 1 — DATA SOURCE:
- Visit hazardhunter.georisk.gov.ph
- If public API → document
- If no API → identify data format (HTML/KML/PDF); plan one-time extraction

STEP 2 — ACQUISITION:
- Target barangays: Ugong, San Antonio, Kapitolyo, Oranbo (Pasig) + 10 buffer
- Per barangay: Low / Moderate / High
- Document source + date

STEP 3 — SCHEMA:
Migration: `barangay_flood_risk` table:
- id, barangay_name, city, risk_level enum(low/moderate/high), data_source, last_updated

STEP 4 — SEED:
- Insert 4 launch + 10 buffer barangays
- `scripts/seed-flood-risk.ts`

STEP 5 — API:
- GET /listings joins flood_risk by barangay+city
- Include flood_risk field in response

STEP 6 — MOBILE UI:
- ListingCard: flood-risk badge (🟢/🟡/🔴)
- Listing detail: tap-tooltip — "Flood risk based on DILG HazardHunter. Verify during viewing."

STEP 7 — WEB UI:
- Mirror: badge on card + tooltip on detail

STEP 8 — REFRESH:
- BullMQ cron: weekly refresh
- If no API: monthly manual via `scripts/update-flood-risk.ts`

STEP 9 — REMINDERS:
- DO NOT block listings in red zones — inform, don't gatekeep
- DO NOT claim real-time flood status (only static hazard rating)

COMMIT: `feat: flood-risk indicators via HazardHunter data for all listings`
```

**✅ Acceptance:** 14 barangays seeded. All listings show badge. Tooltip with attribution.

**🚫 Forbidden:** Blocking listings. Real-time flood claims. Scraping HazardHunter continuously.

**🆘 Recovery:** If data format inaccessible, paste: *"Reduce scope: seed only 4 launch barangays manually from PAGASA reports. Document source. Revisit full coverage later."*

**🏁 Handoff:** → Prompt 32.

---

## Prompt 32 — Listing verification managed agent (CORE — trust infrastructure essential)

**⚠️ PRIORITY NOTE:** This is CORE to the trust infrastructure thesis. Mamikos's #1 user complaint is scams and no verification — users search on Mamikos then transact OUTSIDE the app because they don't trust it. This agent IS the trust layer that differentiates us. Do NOT skip or deprioritize.

**🎯 Goal:** New listings get automated scam-screening before admin review.

**⏱️ Time:** 6–8h

**🔒 Prerequisites:** Prompt 31 complete. Anthropic API key. managed-agents API beta access.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `context/11-managed-agents-use-cases.md`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Build listing verification managed agent per context/11 use case 1.

STEP 1 — AGENT SPEC:
Create `.claude-brain/agents/listing-verifier.md` — agent system prompt:

"You are a listing verification agent for RentRayda, a Philippine rental marketplace.

Given a new listing, investigate:
1. Reverse-image-search each photo — flag if matches other site (Airbnb, OLX, etc.)
2. Check whether address exists
3. Cross-reference price against neighborhood comparables (query DB median)
4. Check landlord's verification status
5. Check flood-risk rating for the barangay

Output structured JSON:
{
  \"verdict\": \"green\" | \"yellow\" | \"red\",
  \"confidence\": 0-1,
  \"flags\": [{ \"type\": \"...\", \"evidence\": \"...\", \"severity\": \"low\"|\"medium\"|\"high\" }],
  \"recommendation\": \"approve\" | \"review\" | \"reject\"
}

Be conservative — prefer yellow over green. Admin makes final call."

STEP 2 — CLIENT (`apps/api/src/agents/listing-verifier.ts`):
- @anthropic-ai/claude-code managed-agents SDK
- Session with:
  - Instruction = contents of .claude-brain/agents/listing-verifier.md
  - Tools: web_search, web_fetch, database_query (read-only listings)
  - Permissions: read listings; write only to verification_reports
- Guardrails:
  - Hard timeout: 10 min/session
  - Hard token budget: 100K/session
  - Daily cost cap: ₱500 (check Anthropic usage API before starting)

STEP 3 — SCHEMA:
Migration: `verification_reports` table:
- id, listing_id, verdict, confidence, flags jsonb, recommendation, agent_session_id, cost_centavos, created_at

STEP 4 — TRIGGER:
- POST /listings (new listing) → enqueue verification job
- Worker runs agent, stores report
- Admin dashboard shows report alongside listing in /admin/verifications

STEP 5 — HUMAN-IN-LOOP:
- Admin MUST approve every agent output for first 50 listings
- After 50: spot-check 20%; skip for 80% if verdict=green
- NEVER auto-approve red verdict

STEP 6 — KILL SWITCH:
- Feature flag LISTING_AGENT_ENABLED (default true, off if cost cap hit)
- Daily cost check in worker

STEP 7 — TEST:
- 5 test listings through agent
- One real, one "stolen Airbnb photo" test, etc.

COMMIT: `feat(agents): listing verification managed agent with human review for first 50`

DO NOT: let agent write to other tables. Auto-approve during first 50. Remove cost cap. Skip feature flag.
```

**✅ Acceptance:** Agent runs on 5 test listings. Verdicts stored. Admin dashboard shows reports. Cost cap enforced.

**🚫 Forbidden:** Auto-approval during first 50. Removing kill switch. Agent writing to listings/users.

**🆘 Recovery:** If agent burns tokens, paste: *"Flip LISTING_AGENT_ENABLED=false. Review agent instructions — probably prompted too open-endedly."*

**🏁 Handoff:** PHASE 4 COMPLETE. Ready for production launch.

---

# PHASE 5 — PRODUCTION LAUNCH + FIRST PLACEMENTS (Prompts 33–37)

Phase time: 2–3 weeks calendar, ~40h Claude Code time.

---

## Prompt 33 — Production deployment

**🎯 Goal:** Live production: API + web + Android APK. All smoke tests pass.

**⏱️ Time:** 6–8h

**🔒 Prerequisites:** Phases 3+4 complete. All production env vars set. DPA founder items complete (DPO, PIA, Privacy Policy, NPC).

**📖 Read first:** `.claude-brain/CLAUDE.md`, `apps/*/Dockerfile`, `.github/workflows/deploy.yml`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Production deploy — be paranoid.

PRE-FLIGHT (any failure → STOP, do not deploy):
1. `git status` — clean tree
2. `pnpm turbo test` — all pass
3. `pnpm turbo lint` — clean
4. `pnpm turbo typecheck` — clean
5. `pnpm turbo build` — clean
6. All 20+ production env vars in Coolify (compare against .env.example)
7. Paymongo LIVE keys set (not TEST)
8. Sentry DSN points to production project
9. DB production with migrations 0000, 0001, 0002 applied
10. Redis running in production
11. R2 buckets CORS configured for production domain
12. DNS: rentrayda.com → web; api.rentrayda.com → API
13. SSL certs valid both domains
14. Privacy Policy published at rentrayda.com/privacy
15. DPO contact working (dpo@rentrayda.com delivers)

DEPLOY:
1. Tag: `git tag v0.1.0-mvp-live && git push --tags`
2. Build Docker images for api + web
3. Push to registry
4. Coolify deploy (dashboard or CLI)
5. Wait for health check

SMOKE TESTS (any failure = rollback):
1. `curl -sS https://api.rentrayda.com/health` → {"status":"ok"}
2. `curl -sS https://rentrayda.com/` → 200
3. `curl -sS https://rentrayda.com/listings` → 200 (empty OK)
4. Admin: log in at /admin/login → dashboard loads
5. User: create test reservation via /reserve/placement → Paymongo checkout opens
6. Paymongo webhook → /api/payments/webhook fires
7. Sentry: no errors last 5 min

ANDROID BUILD:
1. `pnpm --filter @rentrayda/mobile eas build --platform android --profile production`
2. Download APK
3. Install on real device
4. Full auth flow: phone → OTP → role → verify → browse
5. Submit to Play Store console (internal testing track)

ROLLBACK TRIGGERS:
- Any smoke test failure
- Sentry error rate >1% first 10 min
- Paymongo webhook failures >2 in 10 min

ROLLBACK PROCEDURE:
- Coolify: revert to previous container
- git revert to last stable tag
- Drain traffic via load balancer (if applicable)
- Post-mortem journal entry

COMMIT (only if successful): `feat: production launch v0.1.0-mvp-live`
```

**✅ Acceptance:** All pre-flight pass. All smoke tests pass. APK installs on device. Play Store internal testing live.

**🚫 Forbidden:** Deploying with any pre-flight failure. Skipping smoke tests. Disabling Sentry. Pushing without tag.

**🆘 Recovery:** Any failure → rollback first, debug second. Paste: *"Rollback now. Post-mortem after."*

**🏁 Handoff:** → Prompt 34.

---

## Prompt 34 — Onboard first 30–50 landlords via Messenger

**🎯 Goal:** 30–50 verified landlords with live listings in launch barangays.

**⏱️ Time:** 2–3 weeks calendar, ~20h Claude Code time

**🔒 Prerequisites:** Production deployed. Founder available for barangay walks.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `artifacts/landlord-messenger-onboarding-script.md` (all 9 stages)

**📋 Paste into Claude Code (repeat per landlord engagement):**

```
Follow session kickoff protocol. Onboarding landlords manually via Messenger per artifacts/landlord-messenger-onboarding-script.md. Your job is TRACKING, not scripting (founder sends every message).

SUPPLY ACQUISITION CHANNELS (new — adapted from QuintoAndar doorman strategy):
In addition to direct barangay walks, use these referral channels:

1. BARANGAY CAPTAIN REFERRALS: Visit barangay halls in Ugong, San Antonio, Kapitolyo, Oranbo. Explain RentRayda (free for landlords, verified tenants). Ask captain/tanod to refer boarding house owners. ₱100-200 per successfully onboarded landlord (paid after listing goes live). Track in landlord-pipeline.md with source='brgy_captain_[name]'.

2. SARI-SARI STORE REFERRALS: Stores near BPO offices see every FOR RENT tarp. ₱50 per referral that leads to a conversation. Track with source='sarisari_[location]'.

3. BPO HR DEPARTMENTS: Contact Concentrix, TaskUs, Teleperformance HR. Ask to be added to their "accredited housing" list for new hires. Free distribution — they want housing solutions for their trainees. Track with source='bpo_hr_[company]'.

GUARANTEE-LITE PITCH (new — use during onboarding):
After initial rapport, pitch this: "Ate/Kuya, ang tenants na isesend namin sa inyo, verified na po — may PhilSys ID, confirmed na employed, at may record ng on-time payment. Kung umalis sila within 3 months, hahanap kami ng kapalit within 7 days, libre po. Mas maganda po sila kaysa random sa Facebook."

Track landlord reaction to guarantee-lite in pipeline: excited / neutral / skeptical / rejected. This data informs Prompt 42.

RENTRAYDA SCORE DATA (new — track from Day 1):
For every placed tenant, begin tracking:
- PhilSys verification status
- Employment verification status + company name
- Move-in date
- Monthly payment status (on-time / late / missed) — check monthly via Messenger with landlord
- Any incidents reported
This data feeds the RentRayda Score (Prompt 41) and future insurance-backed guarantee.

EACH TIME I PASTE A LANDLORD INTERACTION:
1. I paste the Messenger transcript
2. You extract:
   - Landlord name + Messenger URL
   - Barangay + unit count + price point
   - Current stage in onboarding script (1–9)
   - Verification status (ID + property proof)
   - Listing created Y/N
   - Any concerns raised (BIR? Privacy? Fees?)
   - Referral source (walk / brgy_captain / sarisari / bpo_hr / tenant_referral)
   - Reaction to guarantee-lite pitch (excited / neutral / skeptical / rejected)
3. Update `.claude-brain/context/landlord-pipeline.md` (create if doesn't exist) — one row per landlord
4. Flag red flags:
   - Scammer indicators (no photos, won't verify, extreme price)
   - Stale conversations (>48h no response)
   - Concerns we don't handle well (noted for script improvement)
5. Every 10 landlords, synthesize:
   - What's working in script (quote specific responses)
   - What's NOT working (same)
   - One specific script improvement to propose
   - Which referral channel has highest conversion rate
   - Guarantee-lite reception: X/10 excited, X/10 neutral, X/10 skeptical
6. Save synthesis to journal every 10 landlords

DO NOT: auto-generate messages (I write every message). Propose script changes until 10+ data points. Add new stages without founder approval.
```

**✅ Acceptance:** landlord-pipeline.md exists and updating. 30–50 landlords in funnel by Week 2. 10+ verified with live listings by Week 3. Script improvements synthesized every 10.

**🚫 Forbidden:** Auto-messaging. Script changes without data. Removing human-assisted approach.

**🆘 Recovery:** If extreme dropoff, paste: *"Analyze all conversations for where dropoff happens. Don't fix script yet — tell me the pattern first."*

**🏁 Handoff:** → Prompt 35.

---

## Prompt 35 — First 10 verified placements (manual, white-glove)

**🎯 Goal:** 10 real tenants placed in real units by founder, all journaled.

**⏱️ Time:** 2–4 weeks calendar

**🔒 Prerequisites:** Prompt 34 in progress (30+ landlords). Verified Placement reservers from validation waiting.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `decisions/2026-04-12-landlord-onboarding-messenger.md`, `FINAL_DECISION.md` §6.4

**📋 Paste per placement:**

```
Follow session kickoff protocol. Executing placement #[N] manually. Document it.

EACH PLACEMENT — I paste the timeline:
- Reservation date + tier + ₱ amount
- Discovery call date + key quotes
- Matches proposed (3 landlords)
- Viewings scheduled + attended
- Commit date (tenant chose place)
- Deposit flow used (EMI partner live? or manual bank transfer + founder verifies receipt?)
- Balance collection (₱350 via Paymongo)
- Move-in date
- 48h post-move-in check-in result

You save: `.claude-brain/journal/$(date +%Y-%m-%d)-placement-[N].md`

ATTRIBUTES TO TRACK:
- Total founder-hours on this placement
- Total Messenger messages sent
- Number of viewings (ideal 1–2; >3 = inefficient)
- Discovery call → move-in (target 48 hours for matches, then move-in; measure reality)
- Tenant satisfaction (happy / minor issue / major issue / silent)
- Landlord satisfaction (same)
- Friction points that should be automated in Phase 6

VERIFICATION RAW DATA (track for EVERY placement — this feeds the RentRayda Score in Prompt 41):
- Tenant PhilSys verified: Y/N
- Tenant employment verified: Y/N
- Tenant employer / company name: [text]
- Tenant monthly income bracket: [₱ range]
- Tenant months at current job: [number]
- Unit monthly rent: ₱[amount]
- Rent-to-income ratio: [%]
- Month 1 rent payment: on-time / late [X days] / missed
- Month 2 rent payment: on-time / late [X days] / missed
- Month 3 rent payment: on-time / late [X days] / missed
- Any incidents: Y/N + description
- Tenant still in unit at Month 3: Y/N
- Landlord would accept another RentRayda tenant: Y/N

NOTE: The RentRayda Score algorithm does not exist yet (built in Prompt 41).
The raw data above IS the training set. Collect it now; score it later.

FIRST RUN ONLY — create the tracking file if it doesn't exist:
```
if [ ! -f .claude-brain/context/placement-outcomes.md ]; then
cat > .claude-brain/context/placement-outcomes.md << 'TEMPLATE'
# Placement Outcomes Tracker

Raw verification + payment data for first 10 verified placements.
This data feeds the RentRayda Score (Prompt 41) and proves whether
verified tenants default LESS than the market average (8-12%).

Hypothesis: verified tenants default at 2-3%. If confirmed →
insurance partner can underwrite real guarantee → unlock landlord
management fees (Prompt 42).

## Placement 1
- Date:
- PhilSys verified: Y/N
- Employment verified: Y/N
- Employer:
- Monthly income bracket:
- Months at current job:
- Unit monthly rent: ₱
- Rent-to-income ratio: %
- Month 1 payment:
- Month 2 payment:
- Month 3 payment:
- Incidents: N
- Still in unit at Month 3:
- Landlord would accept another RentRayda tenant:

(Copy this block for Placements 2–10)
TEMPLATE
fi
```

Track in: `.claude-brain/context/placement-outcomes.md`
This data proves whether verified tenants default LESS than the market average (8-12%).
Hypothesis: verified tenants default at 2-3%. If confirmed → insurance partner can underwrite real guarantee → unlock landlord management fees (Prompt 42).

AFTER 10 PLACEMENTS:
Synthesize: `.claude-brain/journal/$(date +%Y-%m-%d)-10-placements-retro.md`:
- Average founder-hours per placement (brutal honesty — include message-drafting)
- Biggest friction point (one, not list)
- What to automate in Phase 6 (specific tool proposals)
- What SHOULD stay human (relationship work)
- Unit economics: did we hit ₱397 gross margin per placement?

DO NOT: propose automation during first 10 (feel friction first). Hide failures. Inflate satisfaction.
```

**✅ Acceptance:** 10 placements journaled individually. Synthesis at Placement 10. Unit economics validated or invalidated. Automation candidates identified.

**🚫 Forbidden:** Automation during first 10. Hiding failures. Inflating outcomes.

**🆘 Recovery:** If satisfaction data soft, paste: *"Re-contact the 3 'fine' tenants. Ask literal: 'Would you refer a friend?' yes/no. That's our signal."*

**🏁 Handoff:** → Prompt 36.

---

## Prompt 36 — Post-move-in feedback system

**🎯 Goal:** Every tenant gets 48h check-in. Problems surface fast.

**⏱️ Time:** 3h build, ongoing to run

**🔒 Prerequisites:** Prompt 35 in progress. PhilSMS + Messenger Meta API configured.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `apps/api/src/lib/sms.ts`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Build post-move-in feedback loop.

STEP 1 — SCHEMA:
Add to match_requests: moved_in_at, feedback_requested_at, feedback_received_at, feedback_sentiment enum(happy/minor_issue/major_issue/silent), feedback_text

STEP 2 — TRIGGER:
- match_request.status → 'moved_in' sets moved_in_at=now()
- BullMQ cron: hourly check moved_in rows where feedback_requested_at null AND moved_in_at > 48h ago → enqueue feedback request

STEP 3 — TEMPLATES:
`.claude-brain/prompts/post-move-in-checkin.md` with 3 SMS (<160 chars each):
- "Happy prompt": "Kumusta po sa bagong tirahan? Reply 1 = maayos, 2 = may issue, 3 = may major problem. — RentRayda"
- "Silent prompt" (24h later if no reply): "Hi po, kumusta po si [tenant_first_name]? Message pa rin kung may issue. — Miguel"
- "Problem prompt" (if reply = 2 or 3): "Salamat po sa pag-reply. Tatawag ako within 2 hours para tulungan. — Miguel"

Plus Messenger variants (longer, warmer).

STEP 4 — ADMIN DASHBOARD:
- /admin/placements: list (tenant, landlord, move-in date, feedback status, last contact)
- Filter: feedback_sentiment in ['major_issue', 'minor_issue']

STEP 5 — ESCALATION:
- 'major_issue' → auto-email miguel@rentrayda.com + Sentry high-priority
- 'major_issue' within 7 days of move-in → Verified Placement guarantee review

STEP 6 — TEST:
- Create test placement, set moved_in_at = 2 days ago
- Cron enqueues SMS
- SMS sends (PhilSMS test mode)

COMMIT: `feat: post-move-in feedback system with 48h trigger + escalation`
```

**✅ Acceptance:** 48h trigger works. SMS sends via PhilSMS. Major issues escalate. Admin dashboard shows placements.

**🚫 Forbidden:** Spamming (max 2 SMS + 1 Messenger over 7 days). Leading questions. Ignoring silent tenants (silence might mean unhappy).

**🆘 Recovery:** If silence rate >30%, paste: *"Something's wrong with check-in. Review templates. Maybe perceived as spam."*

**🏁 Handoff:** → Prompt 37.

---

## Prompt 37 — Testimonial generation with consent

**🎯 Goal:** 3 published testimonials by end of Month 2.

**⏱️ Time:** 4h over weeks

**🔒 Prerequisites:** ≥5 happy placements. Consent flow clear to founder.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `context/12-gotchas.md` (DPA consent)

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Generate testimonials from first 5 happy placements.

STEP 1 — CANDIDATES:
Query: match_requests where feedback_sentiment='happy' AND feedback_text not null
Filter: exclude anyone who flagged ANY concern

STEP 2 — CONSENT REQUEST (founder sends per template):
`.claude-brain/prompts/testimonial-consent-request.md`:
"Hi [tenant name], si Miguel po. Salamat ulit sa pag-trust sa RentRayda. Maybe-ask lang po kung pwede i-share yung story ninyo (first name lang, no photo unless you want) sa Facebook/TikTok namin para malaman ng iba na may safe option for housing. Please reply YES or NO — walang pressure. Kung YES, i-draft ko po muna and you approve before publishing."

STEP 3 — DRAFT (only if consent = YES):
- Based on discovery call notes + feedback_text
- 150 words Taglish, first-person, specific details (barangay, how they found us, what surprised them)
- NOT a corporate quote — must sound like them
- Submit to tenant for approval verbatim
- DO NOT publish until explicit "sige, ok"

STEP 4 — PUBLICATION:
- Once approved: post to FB Page + transcribe to TikTok script (creator re-voices)
- No name tagging without SEPARATE explicit consent
- utm_source=testimonial_[first_name]

STEP 5 — ARCHIVE:
- Approved testimonials: `.claude-brain/artifacts/testimonials/` (create folder)
- Consent ledger: `testimonial_consents.csv`

DO NOT: publish before written consent (Messenger screenshot OK). Use last names or faces without SEPARATE consent. Edit after approval (re-approve if edited). Use testimonials from complex placements.
```

**✅ Acceptance:** 3+ testimonials published. Explicit consent on record. No fabrications.

**🚫 Forbidden:** Publishing without consent. Editing post-approval. Last names/faces without separate consent.

**🆘 Recovery:** If consent withdrawn after publish, paste: *"Remove immediately from all platforms. Email confirmation. Update consent ledger to revoked."*

**🏁 Handoff:** PHASE 5 COMPLETE. → PHASE 6.

---

# PHASE 6 — SCALE PREP (Prompts 38–40)

Phase time: ~30h Claude Code time over 2–3 weeks.

---

## Prompt 38 — TikTok nano-influencer engine

> **NOTE (2026-04-16, updated 2026-04-17):** Paid marketing (including creator fees) requires careful unit economics at early scale. At ₱149 reservation with ₱499 total placement fee, a ₱2-5K creator fee needs 4-10 placements to break even PER VIDEO. Prioritize organic content (founder-filmed, tenant testimonials from Prompt 37) before scaling paid creator work. Only activate this prompt when organic is producing consistent reservations and you need to scale beyond founder bandwidth.

**🎯 Goal:** 3 creators per week, tracked, measured, renewed or dropped by data.

**⏱️ Time:** 4h setup, ongoing to run

**🔒 Prerequisites:** Phase 5 complete. Budget approved (₱30K/month max). Organic TikTok already producing measurable reservations (do not skip to paid before validating organic).

**📖 Read first:** `.claude-brain/CLAUDE.md`, `artifacts/tiktok-scripts-first-3-videos.md` creator sourcing

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Operationalize TikTok creator engine.

STEP 1 — CREATOR CRM:
`.claude-brain/context/tiktok-creator-pipeline.md` with table:
| Creator | URL | Followers | Videos Produced | Aggregate Views | Reservations Driven | Cost | ROI | Status |
Status: prospect / pitched / declined / live / dropped / renewed

STEP 2 — SOURCING RITUAL (weekly):
Search TikTok for 3 new creators (2–20K followers, BPO/student/fresh-grad content)
- Paste URLs + follower counts
- You update CRM with "prospect"

STEP 3 — PITCH TRACKING:
When I DM a creator:
- Paste the DM
- You log in CRM with "pitched"
- Remind me at 7 days if no response

STEP 4 — PERFORMANCE:
After each video goes live:
- Track views at 24h, 72h, 7 days
- Track reservations via utm_source=tiktok_[creator_name]
- ROI = (reservations × ₱397 margin) ÷ creator_fee

STEP 5 — DECISION GATES:
- Video 1: >5K views → sign 4-video/month contract ₱3–5K per; <1K → drop
- Video 4: ROI >3x cost → renew; <1x → drop
- Feature flag: monthly budget cap ₱30K; if hit, defer new creator work

STEP 6 — PLATFORM:
- DO NOT auto-DM (TikTok ToS violation)
- Human-driven outreach only

COMMIT: `chore(brain): tiktok creator pipeline CRM + weekly sourcing ritual`
```

**✅ Acceptance:** CRM tracking 10+ creators. Weekly sourcing in place. ROI computed per creator.

**🚫 Forbidden:** Auto-DMing. Exceeding budget. Renewing low-ROI creators.

**🆘 Recovery:** If budget hit early, paste: *"Freeze new pitches. Run current cohort to contract end. Re-evaluate month-end."*

**🏁 Handoff:** → Prompt 39.

---

## Prompt 39 — Month 3 retrospective

**🎯 Goal:** Honest assessment of whether we hit targets; data-driven scope plan for next 90 days.

**⏱️ Time:** 4–6h

**🔒 Prerequisites:** End of Month 3 post-launch. All metrics available.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `FINAL_DECISION.md` §6.5 targets, `decisions/2026-04-12-two-revenue-paths.md` unit economics, all Phase 5 journal entries

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Month 3 retrospective — unvarnished.

PULL DATA:
- Total placements: actual vs 100/month target (optimistic; base case 50-100)
- Verified Placement: actual vs 100/month projection
- Total revenue
- Gross margin per placement vs ₱397 assumption
- Refund rate
- Landlord retention (repeat listings per landlord)
- Tenant NPS (referral rate)
- Channel ROI table
- Top 3 complaints (feedback data)
- Top 3 operational pain points (journal)

COMPUTE:
- Hit/miss per target (%)
- Unit economics: actual margin per placement vs ₱499 Verified Placement assumption
- Churn: of first 30 landlords, how many still active?
- LTV signal: of first 20 tenants, how many returned or referred?

INFRASTRUCTURE HEALTH CHECK (new):
Re-evaluate the 4 canonical infrastructure signals against their thresholds (same thresholds from Prompt 12/14):
- Credit history interest: across all discovery calls, X/total callers said yes. Threshold: 7+/10 callers = viable
- Verification value to landlords: X/total callers said landlords would prefer. Threshold: 8+/10 callers = strong signal
- Document processing demand: X/total callers said yes at ₱399 + actual revenue vs projected ₱10.5K/month. Threshold: 5+/10 callers = build it
- Guarantee-lite landlord reception: X% excited across all Prompt 34 onboarding. Threshold: >60% excited

Also pull from `.claude-brain/context/placement-outcomes.md`:
- Verified tenant default rate: X% (hypothesis was 2-3% vs market 8-12%)
- Referral channel ROI: barangay captains vs walks vs sari-sari vs BPO HR
- RentRayda Score data quality: enough to build v1? (need 50+ placements with 3-month tracking)
- Verification API demand signal: any third parties asked about it?

Overall infrastructure viability: STRONG (3+ of the 4 signals above their respective threshold) / MODERATE (1-2) / WEAK (0)

SYNTHESIS (`.claude-brain/journal/$(date +%Y-%m-%d)-month-3-retro.md`):
1. Targets: hit / missed / partial with numbers
2. What's working (3 things): each with specific evidence
3. What's NOT working (3 things): same
4. Updated kill list (any new concepts proved dead)
5. Updated business rules (any changed)
6. Infrastructure play viability: PROCEED / DEFER / ABANDON based on data
   - Credit history interest above 7+/10 threshold? Y/N
   - Verification value to landlords above 8+/10 threshold? Y/N
   - Document processing demand above 5+/10 threshold? Y/N
   - Guarantee-lite landlord reception above >60% excited threshold? Y/N
   - Count: X/4 signals above threshold → STRONG (3+) / MODERATE (1-2) / WEAK (0)
7. Next 90-day scope decision — which to pursue? (Pick 1-2 max)
   A. Build RentRayda Score v1 (Prompt 41) — prerequisite: 50+ placements with outcome data
   B. Launch guarantee-lite formally (Prompt 42) — prerequisite: landlord reception >60% excited
   C. Messenger property management tools (Prompt 43) — prerequisite: 30+ active landlords
   D. Document processing revenue (Prompt 44) — prerequisite: validation demand signal 5+/10
   E. Expand geography (Makati, BGC, QC) — prerequisite: Pasig/Ortigas saturated
   F. iOS launch — prerequisite: Android retention >30% Week 4
   G. Fundraising prep — prerequisite: default rate data + 500+ verified users
   H. AI automation scale-up — prerequisite: manual process bottleneck identified

Per option:
- Prerequisite gate (what must be true to consider)
- Expected cost (founder time + capital)
- Expected impact (revenue, user growth, infrastructure progress)
- Risk
- Infrastructure contribution: does this build toward the platform play?

DO NOT: soften misses (brutal). Advocate for expansion (synthesize). Fabricate signal. Hide bad quotes. Pursue infrastructure without data support.
```

**✅ Acceptance:** Every target has actual-vs-projected. Honest synthesis (not sales doc). Phase 3 options framed with gates.

**🚫 Forbidden:** Softening misses. Advocacy. Hiding data.

**🆘 Recovery:** If data bad and Claude softens, paste: *"Re-do. Data is data. I need truth, not comfort."*

**🏁 Handoff:** → Prompt 40.

---

## Prompt 40 — Phase 3 (next 90 days) planning

**🎯 Goal:** Concrete plan for next 90 days informed by retrospective.

**⏱️ Time:** 3–4h (founder + Claude)

**🔒 Prerequisites:** Prompt 39 complete. Month 3 retro accepted by founder.

**📖 Read first:** `.claude-brain/CLAUDE.md`, Month 3 retrospective journal, `FINAL_DECISION.md` (see §7.6 "If we scale beyond Pasig/Ortigas")

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Draft Phase 3 (next 90 days) plan based on Month 3 retro.

STEP 1 — PICK SCOPE:
Based on retro + infrastructure health check, which 1–2 for next 90 days?

INFRASTRUCTURE PATH (prioritize if signals are STRONG from Prompt 39):
A. Build RentRayda Score v1 (Prompt 41)
B. Launch guarantee-lite formally (Prompt 42)
C. Messenger property management tools (Prompt 43)
D. Document processing revenue (Prompt 44)
E. Barangay captain referral program at scale (Prompt 45)

GROWTH PATH (pursue alongside or instead of infrastructure):
F. Expand geography (Makati, BGC, QC)
G. iOS launch
H. AI automation scale-up
I. Fundraising prep with infrastructure data

Recommendation priority: infrastructure options A-E first IF data supports them. Growth options F-I only after infrastructure foundation is solid or if infrastructure signals are WEAK.

You pick with rationale; I approve/override.

STEP 2 — PREREQUISITES CHECKLIST:
For chosen scope, every prerequisite that must be true to start. Example for A:
- Pasig/Ortigas >300 MAU sustained for 2 months
- First-month Pasig placements saturate supply (<50% demand met)
- Founder bandwidth for duplicate landlord onboarding

If ANY prereq not met: recommend NOT pursuing.

STEP 3 — NEW DECISION:
Create `.claude-brain/decisions/$(date +%Y-%m-%d)-phase-3-[scope].md` using TEMPLATE.md.

STEP 4 — UPDATE CANONICALS:
- FINAL_DECISION.md: add Phase 3 section (don't overwrite earlier)
- .claude-brain/CHANGELOG.md: v[next] entry documenting scope
- .claude-brain/context/00-north-star.md: update if wedge expanding

STEP 5 — UPDATE PLAYBOOK:
If scope is major (new geography, new platform), draft Prompts 41–60 using same god-prompt format as 1–40.

STEP 6 — FOUNDER REVIEW:
Final call mine. Explain recommendation but don't advocate.

DO NOT: commit to scope before prereqs met. Skip decision file. Update FINAL_DECISION without CHANGELOG. Write Phase 3 prompts until scope locked.
```

**✅ Acceptance:** Scope chosen with rationale. Prerequisites checklist. New decision file. FINAL_DECISION + CHANGELOG updated. Founder approves before any building.

**🚫 Forbidden:** Commitment without prereqs met. Skipping decision file. Overwriting earlier phases.

**🆘 Recovery:** If prereqs not met, paste: *"Not ready for Phase 3. Keep running Phase 5–6 ops until prereqs met. Revisit 30 days."*

**🏁 Handoff:** Phase 3 begins (new playbook 41–60 if needed).

---

# END OF PHASE 6 (Prompts 1-40: Wedge)

If you made it through all 40, you:
1. Validated demand with real money on the table
2. Cleaned a 95% MVP into something deployable
3. Integrated regulated payment flows without custody
4. Built production safeguards (Sentry, ESLint, auth, tests)
5. Shipped to production with Android + web
6. Onboarded 30–50 landlords manually
7. Delivered 10+ placements by hand
8. Scaled content through nano-influencers
9. Did a rigorous retrospective
10. Scoped the next 90 days on real data

**If the data said KILL and you killed — you also succeeded.** Cost of killing at Day 14: ~₱2,000. Cost of building something no one wants: 6–18 months and hundreds of thousands of pesos. Killing honestly is a win.

---

# PHASE 7 — TRUST INFRASTRUCTURE (Prompts 41–47)

**Only run if:** Phase 6 complete AND Month 3 retro (Prompt 39) infrastructure health check = STRONG (3+ of these 4 signals above their respective threshold: credit-history interest 7+/10 callers, verification-value to landlords 8+/10 callers, document-processing demand 5+/10 callers, guarantee-lite landlord reception >60% excited). If MODERATE (1-2 signals) or WEAK (0 signals), stay on Prompts 38-40 growth path and defer infrastructure.

**Phase time:** 60–80h across 2–3 months. Some prompts run in parallel.

**Grounded in:** Mamikos/Rukita (standardized informal supply), QuintoAndar (replaced guarantor with credit score, guaranteed rent to landlords), OYO (standardized with checklists), M-Pesa (data from transactions → financial services).

---

## Prompt 41 — Build the RentRayda Score v1

**🎯 Goal:** Composite trust score for tenants that replaces kakilala — like QuintoAndar replaced Brazil's fiador with proprietary credit scoring.

**⏱️ Time:** 8–10h

**🔒 Prerequisites:** 50+ placements with 3-month outcome data in `placement-outcomes.md`. Default rate data available.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `context/placement-outcomes.md`, QuintoAndar credit scoring research in `braindumps/2026-04-14-mamikos-deep-dive-and-quinto-andar-strategy.md`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Build RentRayda Score v1 — the algorithmic replacement for kakilala.

STEP 1 — ANALYZE OUTCOME DATA:
Read placement-outcomes.md. For each placement, correlate:
- PhilSys verification status → payment behavior
- Employment verification → payment behavior
- Company type (BPO vs other) → payment behavior
- Placement source (organic Tier 0 vs Verified Placement) → payment behavior
- Any other predictive signals in the data

Compute: verified tenant default rate vs market baseline (8-12%).
If our rate is <5%, the score has predictive value. If >5%, we need more signals.

STEP 2 — DESIGN SCORE (0-100):
Weighted composite:
- PhilSys ID verified: +25 points
- Employment verified (with company): +25 points
- BPO employment specifically: +5 bonus (regular income, HR-accessible)
- Previous RentRayda rental with on-time payments: +20 points per rental
- No incidents on record: +15 points
- Referral from existing verified tenant: +10 points

Score bands:
- 80-100: "Gold Verified" — top-tier tenant, guaranteed quality
- 60-79: "Verified" — standard verified, reliable
- 40-59: "Basic Verified" — ID only, no rental history yet
- <40: "Unverified" — needs more documentation

STEP 3 — SCHEMA + SCORE FUNCTION:
Migration: add two columns to `packages/db/schema/tenant-profiles.ts`:
  rentraydaScore: integer('rentrayda_score').default(0).notNull(),
  scoreComponents: jsonb('score_components').default('{}'),
Match existing column patterns (camelCase JS, snake_case DB). Add index:
  index('idx_tenant_score').on(t.rentraydaScore)
Generate migration: `pnpm --filter @rentrayda/db drizzle-kit generate`
Review generated SQL, then apply: `pnpm --filter @rentrayda/db drizzle-kit migrate`

Score computation function: `apps/api/src/lib/rentrayda-score.ts`
- Export `computeRentraydaScore(tenantId: string): Promise<{ score: number; components: Record<string, number>; band: string }>`
- Called from: PATCH tenant profile, POST verification completion, POST rental payment recorded, POST incident report
- Recompute triggers: add calls in `apps/api/src/routes/tenants.ts` (profile update), `apps/api/src/routes/admin.ts` (verification approval)

VERIFY:
  pnpm turbo typecheck   # zero errors
  pnpm turbo build       # clean build
  grep -r 'rentrayda_score' packages/db/   # field exists in schema
  grep -r 'computeRentraydaScore' apps/api/src/   # function imported in routes

STEP 4 — DISPLAY:
- Landlord sees tenant's score + band when reviewing connection requests
- "Gold Verified" badge on tenant profile (visible to landlords only)
- Score breakdown available on tap (which components contributed)

STEP 5 — LANDLORD-FACING COPY:
The score replaces kakilala. Frame it as:
"Hindi mo na kailangan ng kakilala — ang RentRayda Score ang katibayan."
("You don't need connections anymore — the RentRayda Score is the proof.")

STEP 6 — TEST:
- Compute score for all 50+ existing tenants retroactively
- Verify score correlates with actual payment behavior (the data should confirm the weighting)
- If correlation is weak, adjust weights before launch

COMMIT: `feat(api): RentRayda Score v1 — tenant trust composite replacing kakilala`

DO NOT: expose score to tenants (landlord-facing only for v1). Use score to BLOCK tenants (inform, don't gatekeep). Overcomplicate the algorithm — simple weighted sum beats ML at 50 data points. Add new dependencies.
```

**✅ Acceptance:** Score computed for all existing tenants. Correlation with payment behavior validated. Landlord UI shows score + badge. Framing copy in place. `pnpm turbo typecheck` and `pnpm turbo build` both pass. `grep -r 'rentrayda_score' packages/db/schema/tenant-profiles.ts` returns the column definition. `apps/api/src/lib/rentrayda-score.ts` exists and exports `computeRentraydaScore`.

**🚫 Forbidden:** ML models on 50 data points (overfitting guaranteed). Tenant-visible scores (creates anxiety). Using score to deny service.

**🆘 Recovery:** If correlation is weak, paste: *"Score v1 doesn't predict well. Defer to v2 with more data. Keep showing verification badges only — they still add value without a numeric score."*

**🏁 Handoff:** → Prompt 42.

---

## Prompt 42 — Launch guarantee-lite to landlords

**🎯 Goal:** Formally offer landlords: "verified tenants + 7-day replacement guarantee if they leave within 3 months." Zero financial guarantee. Zero liquidity required.

**⏱️ Time:** 4–6h

**🔒 Prerequisites:** Prompt 41 complete. Guarantee-lite reception from Prompt 34 data: >60% excited/positive.

**📖 Read first:** `.claude-brain/CLAUDE.md`, landlord-pipeline.md guarantee-lite reactions, `context/10-target-psychographics-secondary.md`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Formalize the guarantee-lite offer.

STEP 1 — DEFINE THE GUARANTEE:
"Sa RentRayda Verified Tenants, naka-verify na po ang ID at employment nila. Kung umalis sila within 3 months, hahanap kami ng kapalit within 7 days — libre po."

What it IS:
- Verified tenant with RentRayda Score 60+
- If tenant leaves within 3 months: free replacement tenant within 7 days
- Landlord pays ₱0

What it is NOT:
- NOT a financial guarantee (we don't cover missed rent)
- NOT insurance (no payout on default)
- NOT binding (we commit to best effort, not legal obligation)

STEP 2 — LANDING PAGE (landlord-facing):
File: `apps/web/app/landlords/page.tsx`
SEO: `<title>Verified Tenants for Your Property | RentRayda</title>`
Content:
- Hero: "Verified tenants. Free forever."
- How verification works (PhilSys + employment + RentRayda Score)
- The guarantee-lite offer (use exact Taglish from Step 1)
- Testimonials from first 5 satisfied landlords (Prompt 37)
- CTA: "List your unit via Messenger" → opens `https://m.me/[PAGE_ID]` deep link
  - Test: deep link opens Messenger on mobile (Android + iOS)
  - Test: deep link opens messenger.com on desktop
- Zero sign-up forms. Zero app downloads.
- Font: Be Vietnam Pro (body) + Sentient (headings) — match DRD.md §1.4
- Colors: brand #2D79BF for CTA buttons, #16A34A for verified badges

STEP 3 — MESSENGER ONBOARDING SCRIPT UPDATE:
Update `artifacts/landlord-messenger-onboarding-script.md` to include guarantee-lite as Stage 3 (after initial rapport, before listing creation).

STEP 4 — TRACK:
- Landlords who signed up BECAUSE of guarantee-lite vs. other reasons
- Replacement requests triggered (tenant left within 3 months)
- Replacement delivery time (target: 7 days)
- Landlord satisfaction with replacement

VERIFY:
  pnpm turbo build                     # clean build
  pnpm --filter @rentrayda/web dev     # start dev server
  # Manual: open http://localhost:3000/landlords at 360px mobile width in DevTools — no horizontal scroll
  # Manual: click Messenger CTA → Messenger opens (or messenger.com on desktop)
  grep -r 'guarantee' apps/web/app/landlords/page.tsx   # guarantee-lite copy present

COMMIT: `feat(web): landlord-facing guarantee-lite page + updated onboarding script`

DO NOT: promise financial coverage. Use legal language ("guarantee" is marketing, not contractual). Launch without founder reviewing every word of the landlord page.
```

**✅ Acceptance:** Landlord page live at `/landlords`. `pnpm turbo build` passes. Page renders at 360px mobile width without horizontal scroll. Messenger deep link opens correctly. Onboarding script updated. Tracking in place.

**🚫 Forbidden:** Financial guarantee language. Legal obligations. Requiring landlord app downloads.

**🏁 Handoff:** → Prompt 43.

---

## Prompt 43 — Messenger property management tools (Mamirooms-lite)

**🎯 Goal:** Landlords receive automated rent reminders, vacancy alerts, and tenant screening reports — all via Messenger. They blame "the system" instead of being embarrassed to collect rent.

**⏱️ Time:** 8–10h

**🔒 Prerequisites:** 30+ active landlords. Messenger API configured.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `context/10-target-psychographics-secondary.md` (nahihiya magsingil insight), Rukita Mamirooms model

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Build Messenger-based property management tools.

KEY INSIGHT: The secondary psychographic says landlords are embarrassed to collect rent ("nahihiya ako magsingil"). Automated reminders solve this — she can blame "the system."

FILES TO CREATE/MODIFY:
- Route: `apps/api/src/routes/management.ts` (new — mount at `/api/management` in `apps/api/src/index.ts`)
- BullMQ job: `apps/api/src/jobs/rent-reminder.ts` (new — follows pattern in `apps/api/src/jobs/push-notification.ts`)
- Messenger lib: `apps/api/src/lib/messenger.ts` (new — Meta Graph API wrapper)
- Queue: add `managementQueue` to `apps/api/src/lib/queue.ts` (follows existing `notificationQueue` pattern)

STEP 1 — AUTOMATED RENT REMINDERS:
- BullMQ repeatable job in `apps/api/src/jobs/rent-reminder.ts`: runs daily at 08:00 PHT
- 3 days before rent due → send Messenger to tenant: "Hi [name], reminder po na due na ang rent ninyo sa [date]. Pwede po i-bank transfer sa landlord or bayaran in person. — RentRayda"
- 1 day overdue → send to landlord: "Hi [landlord], si [tenant] ay 1 day overdue sa rent. Nag-send na po kami ng reminder. Kung gusto niyo, pwede kaming mag-follow up."
- Landlord NEVER has to ask directly. The system does it.
- Configurable: landlord can turn reminders on/off per tenant

STEP 2 — VACANCY ALERTS:
- When a tenant signals moving out (or lease end approaches): notify landlord via Messenger
- "Hi [landlord], si [tenant] sa Unit [X] ay aalis po sa [date]. Gusto niyo po bang maghanap kami ng kapalit?"
- If yes → create internal match request, use verified supply to fill

STEP 3 — TENANT SCREENING REPORTS:
- When a new connection request comes in, auto-generate a one-page tenant report:
  - RentRayda Score + band
  - PhilSys verification status
  - Employment (company, verified Y/N)
  - Previous rental history on platform (if any)
  - Payment record (on-time %, late %)
- Send to landlord via Messenger as formatted message or PDF attachment
- Replaces landlord's "kutob" (gut feeling) screening

STEP 4 — PRICING:
- Free for first 3 properties (get adoption)
- ₱299/month for 4+ properties (tests if landlords will pay for TOOLS even though they won't pay for LISTINGS)
- Track conversion: how many upgrade from free to paid?

STEP 5 — META MESSENGER PLATFORM API:
File: `apps/api/src/lib/messenger.ts`
- Use Send API: `POST https://graph.facebook.com/v21.0/me/messages` with Page Access Token
- CRITICAL: Meta's 24-hour messaging window — you can ONLY send messages within 24 hours of the user's last message to your Page.
  - For rent reminders (sent outside 24hr window): use Message Tags. Allowed tag: `CONFIRMED_EVENT_UPDATE` (rent due date = confirmed event). This is the ONLY tag that fits; `POST_PURCHASE_UPDATE` does NOT apply.
  - If Meta revokes tag access or user hasn't messaged the Page: fall back to SMS via PhilSMS (`apps/api/src/lib/sms.ts` — already built).
  - Log every message attempt + delivery status in a `messenger_log` table or structured log.
- Env vars (add to .env.example):
  META_PAGE_ACCESS_TOKEN=""     # From Meta Developer Portal → Page Settings
  META_PAGE_ID=""               # Facebook Page ID
  META_APP_SECRET=""            # For webhook signature verification
- Webhook: `POST /api/management/messenger-webhook` for delivery receipts + user replies

VERIFY:
  pnpm turbo typecheck        # zero errors
  pnpm turbo build            # clean build
  grep -r 'managementQueue' apps/api/src/lib/queue.ts   # queue registered
  grep -r 'rent-reminder' apps/api/src/jobs/            # job file exists
  # Manual: trigger test reminder via API → verify Messenger delivery OR SMS fallback

COMMIT: `feat(api): messenger property management tools — rent reminders, vacancy alerts, tenant screening`

DO NOT: spam tenants (max 2 reminders per rent cycle). Send sensitive data in Messenger (score only, not full ID details). Charge landlords before they see value. Send messages outside 24hr window without Message Tags.
```

**✅ Acceptance:** Rent reminders fire on schedule (BullMQ repeatable job visible in queue). Vacancy alerts work. Tenant screening report generates. Free tier works. Paid tier charges correctly. `pnpm turbo typecheck` and `pnpm turbo build` both pass. SMS fallback works when Messenger delivery fails.

**🚫 Forbidden:** Spamming. Exposing PII in Messenger. Charging before value demonstrated.

**🏁 Handoff:** → Prompt 44.

---

## Prompt 44 — Document processing revenue stream

**🎯 Goal:** Tenants can process NBI, police, and barangay clearances through RentRayda for ₱399 all-in. Revenue from Day 1 of offering.

**⏱️ Time:** 4–6h

**🔒 Prerequisites:** Founder has established connection with clearance processing partner. Validation signal: 5+/10 discovery call respondents said yes.

**📖 Read first:** `.claude-brain/CLAUDE.md`, `braindumps/2026-04-13-revenue-streams-evaluation.md` (#15)

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Build document processing service.

STEP 1 — DEFINE SERVICE:
Package: "RentRayda Clearance Bundle" — ₱399 all-in
Includes:
- NBI clearance processing (gov fee ₱155 + processing)
- Police clearance processing
- Barangay clearance processing
Tenant pays ₱399. We pay partner ~₱255 (gov fees + fixer). Margin: ~₱144/clearance.

STEP 2 — FLOW:
- Tenant selects "Need clearances?" during onboarding or from profile
- Fills form: full name, birthdate, address, contact
- Pays ₱399 via Paymongo
- We forward details to processing partner
- Partner processes (3-5 business days)
- Clearances delivered to tenant (pickup point or digital if available)
- Clearances auto-verify tenant's verification status on platform

STEP 3 — INTEGRATION:
Schema file: `packages/db/schema/clearance-orders.ts` (new — follow pattern in `packages/db/schema/reports.ts`)
```
export const clearanceOrders = pgTable('clearance_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantUserId: uuid('tenant_user_id').notNull().references(() => users.id),
  status: varchar('status', { length: 20 }).notNull().default('ordered'),
    // Values: 'ordered' | 'processing' | 'ready' | 'delivered' | 'cancelled'
  paidAt: timestamp('paid_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  partnerReference: varchar('partner_reference', { length: 100 }),
  amountPaid: integer('amount_paid').notNull(),  // pesos (399)
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('idx_clearance_tenant').on(t.tenantUserId),
  index('idx_clearance_status').on(t.status),
]);
```
Export from `packages/db/schema/index.ts`. Add relation in `packages/db/schema/relations.ts`.
Generate migration: `pnpm --filter @rentrayda/db drizzle-kit generate`
Review SQL, then: `pnpm --filter @rentrayda/db drizzle-kit migrate`

Route file: `apps/api/src/routes/clearances.ts` (new — mount at `/api/clearances` in `apps/api/src/index.ts`)
Endpoints:
- POST /api/clearances/order — create order (auth required, tenant role only)
- GET /api/clearances/my-orders — list tenant's orders (auth required)
- PATCH /api/clearances/:id/status — update status (admin only, uses `adminMiddleware` from `apps/api/src/middleware/admin.ts`)
Status tracking: ordered → processing → ready → delivered
Push notification at each status change (reuse `notificationQueue` from `apps/api/src/lib/queue.ts`)

STEP 4 — MOBILE UI:
- Card in tenant onboarding: "Walang clearance? Kaya namin yan — ₱399 all-in"
- Status tracker in profile tab
- Receipt/confirmation for tax purposes

STEP 5 — METRICS:
- Orders per month
- Completion rate
- Average processing time
- Revenue: orders × ₱144 margin

VERIFY:
  pnpm turbo typecheck                  # zero errors
  pnpm turbo build                      # clean build
  grep -r 'clearance_orders' packages/db/schema/   # table defined
  grep -r 'clearanceOrders' packages/db/schema/index.ts   # exported
  # curl test (with valid auth token):
  # curl -X POST http://localhost:3001/api/clearances/order -H 'Authorization: Bearer TOKEN' -H 'Content-Type: application/json' -d '{"fullName":"Juan Cruz","birthdate":"1995-01-15","address":"123 Main St, Pasig","contactPhone":"09171234567"}' → 201
  # curl http://localhost:3001/api/clearances/my-orders -H 'Authorization: Bearer TOKEN' → 200 with array

COMMIT: `feat(api): document processing service — NBI, police, barangay clearance bundle`

DO NOT: promise specific delivery times (depends on government offices). Handle documents containing sensitive data in our DB (partner handles physical documents). Launch without confirmed partner agreement. Add Paymongo dependency in this prompt if not already installed — reuse existing integration.
```

**✅ Acceptance:** Order flow works E2E. Payment processes. Partner receives order. Status tracking updates. `pnpm turbo typecheck` and `pnpm turbo build` both pass. `clearance_orders` table exists in schema. Admin can update order status.

**🚫 Forbidden:** Storing government document contents. Promising delivery dates. Launching without partner.

**🏁 Handoff:** → Prompt 45.

---

## Prompt 45 — Barangay captain referral program at scale

**🎯 Goal:** Systematize the barangay captain/tanod referral channel that proved effective in Prompt 34. Scale from 4 barangays to 15+.

**⏱️ Time:** 3–4h

**🔒 Prerequisites:** Prompt 34 data shows barangay captain referrals have >20% conversion rate.

**📖 Read first:** `.claude-brain/CLAUDE.md`, landlord-pipeline.md referral channel data

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Operationalize barangay captain referral program.

STEP 1 — ANALYZE Prompt 34 DATA:
- Which barangays produced most referrals?
- Conversion rate: referral → onboarded landlord
- Cost per acquisition: ₱100-200 per referral × conversion rate
- Compare to: direct walk CPA, sari-sari CPA, BPO HR CPA

STEP 2 — REFERRAL PARTNER CRM:
Create `.claude-brain/context/referral-partners.md` if it doesn't exist (same pattern as `placement-outcomes.md` — create on first run, append thereafter):
```markdown
# Referral Partners CRM
| Partner | Type | Barangay | Referrals sent | Converted | CPA | Status | Last contact |
|---------|------|----------|----------------|-----------|-----|--------|-------------|
```

STEP 3 — SCALE PLAN:
- Identify 15 target barangays in Pasig/Ortigas corridor
- Visit each barangay hall, meet captain or chief tanod
- Pitch: "Free verified tenants for your constituents' boarding houses. ₱200 per boarding house owner you connect us with."
- Leave printed one-pager (Taglish) with QR code to landlord Messenger flow
- Schedule monthly check-in with each partner

STEP 4 — TRACKING:
- Every referral tagged with source in landlord-pipeline.md
- Monthly report: referrals by partner, conversion, cost
- Top partners get bonus: ₱500 for 10+ successful referrals/month

STEP 5 — SARI-SARI STORE NETWORK:
- Same model but ₱50/referral (lower because less targeted)
- Post flyers in stores near BPO offices
- QR code → Messenger onboarding

COMMIT: `chore(brain): barangay captain referral program CRM + scale plan`

DO NOT: automate outreach (personal relationships). Promise exclusivity. Pay for referrals before landlord is successfully onboarded.
```

**✅ Acceptance:** CRM tracking 15+ partners. Monthly report template. Cost per acquisition benchmarked.

**🏁 Handoff:** → Prompt 46.

---

## Prompt 46 — Verification API for third parties

**🎯 Goal:** Other platforms can verify rental identities through RentRayda's system. First partner onboarded.

**⏱️ Time:** 10–12h

**🔒 Prerequisites:** 500+ verified users (landlords + tenants). At least one third party has expressed interest (BPO HR, Carousell, barangay office).

**📖 Read first:** `.claude-brain/CLAUDE.md`, `braindumps/2026-04-14-alphafold-moment-for-informal-rentals.md`

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. Build verification API — the infrastructure layer.

THIS IS THE TRANSITION FROM SERVICE TO PLATFORM. The API is how RentRayda becomes the "PhilSys for rentals" — a trust layer other platforms build on top of.

STEP 1 — API DESIGN:
Route file: `apps/api/src/routes/verify-api.ts` (new — mount at `/v1/verify` in `apps/api/src/index.ts`)
This is a PUBLIC API — does NOT use `authMiddleware`. Uses API key auth instead (custom middleware below).

POST /v1/verify/tenant
- Input: `{ phone_number?: string, user_id?: string }` + `Authorization: Bearer <api_key>` header
- Output: `{ verified: true/false, score: 72, band: "Verified", employment_verified: true, rental_history: { placements: 2, on_time_rate: 100 } }`
- Does NOT expose: full name, ID number, address, employer name (DPA compliance)
- Rate limit: 100/day per API key (free tier), 10,000/day (paid)

POST /v1/verify/landlord
- Input: `{ phone_number?: string, user_id?: string }` + `Authorization: Bearer <api_key>` header
- Output: `{ verified: true/false, property_verified: true, listings_count: 3, active_tenants: 2 }`

GET /v1/verify/status/:verification_id
- Check status of a pending verification request

STEP 2 — API KEY MANAGEMENT:
Schema file: `packages/db/schema/api-partners.ts` (new):
```
export const apiPartners = pgTable('api_partners', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  company: varchar('company', { length: 100 }).notNull(),
  useCase: text('use_case'),
  callbackUrl: text('callback_url'),
  apiKeyHash: varchar('api_key_hash', { length: 64 }).notNull(),  // SHA-256 hash, never store plaintext
  tier: varchar('tier', { length: 10 }).notNull().default('free'),
    // Values: 'free' | 'paid' | 'enterprise'
  dailyLimit: integer('daily_limit').notNull().default(100),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const apiUsageLog = pgTable('api_usage_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  partnerId: uuid('partner_id').notNull().references(() => apiPartners.id),
  endpoint: varchar('endpoint', { length: 50 }).notNull(),
  requestedPhone: varchar('requested_phone', { length: 15 }),  // for audit only
  responseType: varchar('response_type', { length: 20 }).notNull(),  // 'verified' | 'not_found' | 'no_consent' | 'error'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('idx_usage_partner').on(t.partnerId),
  index('idx_usage_created').on(t.createdAt),
]);
```
Export from `packages/db/schema/index.ts`. Generate + apply migration.

API key middleware: reuse `rateLimiter` from `apps/api/src/middleware/rate-limit.ts` with custom `keyExtractor`:
```typescript
rateLimiter({
  max: 100,  // overridden per partner from DB
  windowMs: 24 * 60 * 60 * 1000,
  keyPrefix: 'verify-api',
  keyExtractor: (c) => c.get('apiPartnerId') || null,
})
```

Admin routes for partner management: add to `apps/api/src/routes/admin.ts`:
- POST /admin/api-partners — create partner, return plaintext API key (only time it's visible)
- GET /admin/api-partners — list partners with usage stats
- PATCH /admin/api-partners/:id — update tier/limit/active

STEP 3 — PRICING:
- Free tier: 100 verifications/day (for BPO HR, barangay offices)
- Paid tier: ₱5/verification for 10,000+/day (for marketplaces like Carousell)
- Enterprise: custom pricing for banks/insurers

STEP 4 — FIRST PARTNER:
- Identify the most receptive partner from Prompt 34 contacts (probably a BPO HR department)
- Offer free tier
- Integrate and track: verifications requested, conversion, feedback

STEP 5 — DPA COMPLIANCE:
- Tenant must CONSENT to third-party verification (opt-in, not opt-out)
- Add column to `packages/db/schema/tenant-profiles.ts`:
  thirdPartyVerifyConsent: boolean('third_party_verify_consent').default(false).notNull(),
  consentUpdatedAt: timestamp('consent_updated_at', { withTimezone: true }),
- Generate + apply migration for new columns.
- Mobile UI: consent toggle in tenant profile settings: "Allow partner verification of my RentRayda status"
- API check: `/v1/verify/tenant` MUST check `thirdPartyVerifyConsent === true` before returning any data. If false → return `{ error: 'no_consent', message: 'Tenant has not consented to third-party verification' }` with 403.
- Audit log: every API call logged in `api_usage_log` table with partner, timestamp, what was returned

STEP 6 — DOCUMENTATION:
- API docs at docs.rentrayda.com (simple, Stripe-quality)
- Integration guide with code examples (Node, Python, curl)

VERIFY:
  pnpm turbo typecheck                  # zero errors
  pnpm turbo build                      # clean build
  grep -r 'api_partners' packages/db/schema/       # table defined
  grep -r 'third_party_verify_consent' packages/db/schema/tenant-profiles.ts   # consent field exists
  grep -r 'verify-api' apps/api/src/routes/        # route file exists

  # curl tests (replace API_KEY with key from admin create):
  # Create partner:
  # curl -X POST http://localhost:3001/admin/api-partners -H 'Authorization: Bearer ADMIN_TOKEN' -H 'Content-Type: application/json' -d '{"name":"Test BPO","company":"Concentrix","useCase":"Employee housing verification"}' → 201 with api_key in response

  # Verify tenant (with consent):
  # curl -X POST http://localhost:3001/v1/verify/tenant -H 'Authorization: Bearer API_KEY' -H 'Content-Type: application/json' -d '{"phone_number":"09171234567"}' → 200 with score

  # Verify tenant (no consent):
  # curl -X POST http://localhost:3001/v1/verify/tenant -H 'Authorization: Bearer API_KEY' -H 'Content-Type: application/json' -d '{"phone_number":"09179999999"}' → 403 no_consent

  # Rate limit test:
  # Send 101 requests → 101st returns 429

COMMIT: `feat(api): verification API v1 for third-party trust queries`

DO NOT: expose PII through the API. Skip consent. Launch without DPA review. Over-engineer for imaginary scale (100/day free tier is enough for first partner). Store API keys in plaintext (hash with SHA-256). Add new dependencies.
```

**✅ Acceptance:** API serves verification requests. First partner integrated. Consent flow works. Audit logging in place. `pnpm turbo typecheck` and `pnpm turbo build` both pass. All four curl tests above return expected responses. Rate limiting works per API key. Consent check blocks non-consenting tenants.

**🚫 Forbidden:** PII exposure. Skipping consent. Building without a real partner ready. Storing plaintext API keys.

**🏁 Handoff:** → Prompt 47.

---

## Prompt 47 — Data licensing and credit scoring exploration

**🎯 Goal:** Explore whether RentRayda's rental data has commercial value for banks, insurers, or developers. Identify first data partnership.

**⏱️ Time:** 4–6h (research + outreach prep, not code)

**🔒 Prerequisites:** 1,000+ verified users. 6+ months of payment tracking data. Prompt 46 API live.

**📖 Read first:** `.claude-brain/CLAUDE.md`, placement-outcomes.md, `braindumps/2026-04-14-alphafold-moment-for-informal-rentals.md` (M-Pesa → M-Shwari section)

**📋 Paste into Claude Code:**

```
Follow session kickoff protocol. This is RESEARCH, not code. Explore data monetization.

STEP 1 — DATA INVENTORY:
What data do we have that nobody else does?
- Informal rental prices by barangay (₱3-15K segment — no structured source exists)
- Tenant payment behavior (on-time %, default rate by verification level)
- Landlord occupancy rates (fill time, vacancy duration)
- Migration patterns (where tenants come from, where they move to)
- Scam frequency and patterns
- Demand signals by area (which barangays have most unmet demand)

Quantify: how many data points per category? Statistical significance?

STEP 2 — POTENTIAL BUYERS:
Research and list 5 potential data customers:
1. Banks offering microloans (e.g., Tonik, Maya Bank, UnaPay) — rental payment history as credit signal
2. Insurance companies (e.g., Pioneer, Cebuana) — rental risk profiles for renters insurance products
3. Real estate developers — demand signals for where to build affordable housing
4. Urban planners / DHSUD — migration and housing data for policy
5. BPO companies — housing demand data for employee benefits programs

STEP 3 — VALUE PROPOSITION PER BUYER:
For each, draft a 1-paragraph pitch explaining what data we have and why it's valuable to them.

STEP 4 — LEGAL CHECK:
- DPA compliance for anonymized data sharing
- What level of anonymization is required?
- Does consent from Prompt 46 cover data licensing or need separate consent?

STEP 5 — OUTREACH PLAN:
Identify 3 specific people/companies to approach first. Draft outreach messages.

Save to `.claude-brain/journal/$(date +%Y-%m-%d)-data-licensing-exploration.md`

DO NOT: share actual data before legal review. Promise data products we can't deliver. Fabricate statistical significance. Approach banks without DPA clearance.
```

**✅ Acceptance:** Data inventory quantified. 5 potential buyers identified with pitches. Legal requirements documented. 3 outreach targets with draft messages.

**🚫 Forbidden:** Sharing data prematurely. Fabricating significance. Skipping DPA review.

**🏁 Handoff:** PHASE 7 COMPLETE if all prompts executed. You now have trust infrastructure: RentRayda Score + guarantee-lite + management tools + verification API + data exploration.

---

# END OF 47 PROMPTS

If you made it through all 47, you:
1. Validated demand with real money on the table
2. Cleaned a 95% MVP into something deployable
3. Integrated regulated payment flows without custody
4. Built production safeguards (Sentry, ESLint, auth, tests)
5. Shipped to production with Android + web
6. Onboarded 30–50 landlords manually with barangay captain referrals
7. Delivered 10+ placements by hand with RentRayda Score tracking
8. Scaled content through nano-influencers
9. Did a rigorous retrospective with infrastructure health check
10. Built the RentRayda Score (kakilala replacement)
11. Launched guarantee-lite for landlords
12. Built Messenger property management tools
13. Opened verification API to third parties
14. Explored data licensing for credit scoring

**You've evolved from a placement service (C+) to trust infrastructure (B+/A-).** The moat is the verified supply database + the data nobody else has.

**If the data said KILL at any point — you also succeeded.** Killing with data is wisdom, not failure.

---

## Meta-rules across all 47 prompts

1. Every prompt starts with reading the brain. Never assume memory persists across sessions.
2. Every prompt has acceptance criteria. Tell Claude what "done" looks like before it starts.
3. Every prompt bans scope creep explicitly. "Do not fix X while in this prompt."
4. Every prompt references the kill list. Claude is reminded what NOT to do.
5. Every prompt produces a commit. Git history is the execution log.
6. Every prompt is interruptible. Paste `claude-reset.md`, regroup, resume.
7. No prompt is optional within its phase. Each builds on the previous.
8. Prompts 1–5 are non-destructive. Prompts 6–15 put money on the table. Prompts 16–40 only run if validation passes. Prompts 41–47 only run if infrastructure signals are STRONG at Month 3 retro.
9. God prompts aren't longer for length's sake — they're longer because constraint is the product.
10. If you deviate, create a new decision file FIRST. The brain can evolve. Silent drift kills it.
11. **Infrastructure lens (new):** Every prompt now serves two masters — the immediate deliverable AND the long-term infrastructure play. When making design decisions within a prompt, prefer choices that accumulate reusable data, build toward the verification API, and strengthen the RentRayda Score.

---

*This playbook is the execution half of the second brain. The other half (context + decisions + scripts) prevents drift; this half causes progress. Together they ship. Prompts 1–40 build the wedge. Prompts 41–47 build the infrastructure. The wedge without the infrastructure is a small business. The infrastructure without the wedge is a fantasy. Both matter.*
