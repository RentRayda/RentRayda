# Brain Bundle Changelog

Tracks what changed in each version so Claude Code can see evolution.

---

## v6 — 2026-04-13 (god-tier playbook + scope cleanup sweep)

### Added
- `PLAYBOOK.md` — full rewrite as 40 "god prompts" (2,600 lines, up from 1,095 in v5). Every prompt now has the full 9-part anatomy: 🎯 Goal, ⏱️ Time, 🔒 Prerequisites, 📖 Read first, 📋 Paste-ready prompt body, ✅ Acceptance criteria, 🚫 Forbidden, 🆘 Recovery, 🏁 Handoff. Constraints are now load-bearing: every prompt explicitly blocks scope creep, forbids specific failure modes, and gives the founder a reset script to paste when Claude drifts.
- Phase structure unchanged (0-6) but each phase now has explicit phase-outcome + phase-hours estimate.

### Modified (v5 drift fixes)
- `context/01-research-findings.md:78` — "Female BPO new hires" bullet → broader wedge (provincial migrants, multiple employer types) with female BPO noted as marketing focus. Matches v5 scope correction that hadn't fully propagated.
- `decisions/2026-04-12-validate-before-build.md:53` — wedge phrasing in alternatives-rejected section broadened to match.
- `FINAL_DECISION.md:1069` — "Create all 4 files in .claude-brain/prompts/" → "Create all 5 files" (we ship 5: claude-reset, debug-protocol, pre-commit-check, session-kickoff, session-wrap).
- `artifacts/partnership-outreach-gcash-and-philsys.md` — subject line + 3 body references broadened from "BPO workers" → "provincial migrants" (BPO new hires, students, fresh grads, young professionals, OFW families). GCash partnership pitch now matches platform scope.

### Context
v6 responds to founder's request: "make the prompts more god prompts more extensive more relevant best for the second brain also check every single file." Every prompt re-engineered for Claude Code's actual failure modes: loss of context between turns, drift toward scope creep, skipping verification steps, and fabricating completion. The 9-part anatomy exists because in testing, removing any one part caused Claude Code to fail a specific way.

Script integrity check: `check-sync.sh`, `refresh-repo-status.sh`, `install-hooks.sh`, `verify.sh` all exit 0 after v6 changes.

---

## v5 — 2026-04-12 (audit fixes + scope correction + playbook)

### Added
- `PLAYBOOK.md` at bundle root — 40 ordered prompts from setup through Month 3 retro
- `SETUP.md` at bundle root — 7-step install guide

### Modified (scope correction)
- `context/00-north-star.md` — "Female BPO new hires" → broader wedge pattern (provincial migrants without kakilala); female BPO is marketing focus, not product gate
- `context/05-business-rules.md` — Rule 17 rewritten to separate marketing focus from platform restriction
- `context/09-target-psychographics-primary.md` — scope note added at top clarifying this is the sharpest empathy target, not an exclusionary filter
- `FINAL_DECISION.md` §6.3 — Tier 2 target broadened to all provincial migrants (students, fresh grads, OFW families included)
- `artifacts/landing-page-copy-and-discovery-script.md` — headlines, empathy section, "who we serve" broadened
- `artifacts/tiktok-scripts-first-3-videos.md` — scope note added; planned variants for male + student + fresh grad voices

### Modified (audit fixes)
- `FINAL_DECISION.md` line 106 — "zero fund custody ever" (replaced stale Paymongo-escrow reference)
- `FINAL_DECISION.md` §4.1 — dual-path CTA plan (₱99 Tier 1 + ₱199 Tier 2), removed stale `/fast-plus ₱1,499` A/B
- `FINAL_DECISION.md` §4.3 — GCash orchestration (replaced "Paymongo escrow flow")
- `FINAL_DECISION.md` §6.3 — Tier 1 flow rewritten for GCash EMI partnership (never custody)
- `FINAL_DECISION.md` §8.2 — Week 2 cleanup clarifies Paymongo-for-reservations-only
- `FINAL_DECISION.md` Day 1 tasks — single dual-CTA page (not `/fast` + `/fast-plus`)
- `context/05-business-rules.md` Rule 8 — escrow via GCash, Paymongo is card gateway only
- `context/06-validation-state.md` — removed Reddit channel table rows (deprecated channel)
- `decisions/2026-04-12-validate-before-build.md` — A/B price test removed; dual-CTA plan
- `CLAUDE.md` — "19 specifically rejected paths" (was "14")
- `CLAUDE.md` — session kickoff now references `context/12-gotchas.md` and `artifacts/` directory
- `scripts/check-sync.sh` — baseline 16 → 19; error message "all 19 items"
- `README.md` — full directory tree including v5 files (context 00-12, 13 decisions, artifacts/, CHANGELOG.md, SETUP.md, PLAYBOOK.md)
- `context/02-repo-status.md` — grounded in actual REPO_STATUS.md audit data (1,626 API LOC, 5,103 mobile LOC, etc.)
- `context/03-architecture.md` — real file paths + line counts; Phase 2 env vars documented

### Removed
Nothing — all prior decisions preserved.

### Core shifts
1. **Wedge broadened:** female BPO new hire is marketing focus; product serves all provincial migrants without network
2. **40-prompt execution playbook** added — enables end-to-end execution from install → Month 3 retrospective
3. **All stale Paymongo-as-escrow references corrected** — GCash orchestration is canonical
4. **Architecture doc grounded in real code** — no more invented paths
5. **SETUP + PLAYBOOK at bundle root** — setup path is crystal clear

### What stayed UNCHANGED
- Landlord pays ₱0 forever
- No scraping
- Android only at launch
- 14-day validation gate (30+ combined paid reservations)
- Three-tier structure (Tier 0 free, Tier 1 3% escrow, Tier 2 ₱999 concierge)
- Pasig/Ortigas corridor at launch
- Safety-first positioning

---

## v4 — 2026-04-12 earlier (deep research integration)

### Added
- `context/08-pestel-snapshot-2026.md`
- `context/09-target-psychographics-primary.md`
- `context/10-target-psychographics-secondary.md`
- `context/11-managed-agents-use-cases.md`
- `context/12-gotchas.md`
- `decisions/2026-04-12-escrow-via-gcash-partnership.md`
- `decisions/2026-04-12-landlord-onboarding-messenger.md`
- `decisions/2026-04-12-philsys-verification-integration.md`
- `decisions/2026-04-12-tiktok-primary-awareness-channel.md`
- `decisions/2026-04-12-data-privacy-act-compliance.md`
- `decisions/2026-04-12-flood-risk-indicators.md`
- `decisions/2026-04-12-no-bir-paper-trail.md`
- `artifacts/` directory with 4 drafted deliverables
- `CHANGELOG.md` (this file)

### Core shifts
1. Escrow model changed: GCash partnership (never custody)
2. Landlord onboarding: human-assisted Messenger, not self-serve app
3. TikTok primary awareness channel (Reddit deprioritized)
4. DPA compliance = launch blocker
5. Product positioning: safety-first for wedge
6. Decision window: 72 hours not 14 days

---

## v3 — 2026-04-12 earlier (dual-path revenue restructure)

Added two-revenue-paths decision; three-tier structure (Tier 0 free / Tier 1 3% escrow / Tier 2 ₱999 concierge); kill list extended to 16.

---

## v2 — 2026-04-12 earlier (bug fixes)

Fixed verify.sh typecheck pipe masking exit code; redundant `|| echo 0`; .gitkeep content; missing .gitignore; curl/set -e interaction crash.

---

## v1 — 2026-04-12 earliest (initial bundle)

Initial `.claude-brain/` structure with CLAUDE.md, context, decisions, prompts, scripts, journal, scratch.

---

## How to read this file

If you're Claude Code starting a new session:
1. Read the most recent version entry above
2. Look at "Core shifts" — these are the things that matter most
3. Look at "Added" files — new context you should be aware of
4. Look at "Modified" files — assumptions that may have changed

If you're the human operator:
- v5 is the current version
- All prior decisions are still valid unless explicitly reversed in a newer entry
- Kill list in FINAL_DECISION.md is authoritative — if something is on it, don't revive without a new decision file
