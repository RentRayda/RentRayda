# SETUP — How to install this second brain into your RentRayda repo

**Time required:** 10 minutes
**Result:** Claude Code will read project memory automatically at every session start, preventing hallucinations, reviving killed ideas, or drifting off-plan.

---

## Step 1: Unzip and inspect

```bash
unzip rentrayda-brain-bundle-v6.zip
cd claude-brain-bundle
ls -la
```

You should see:
- `FINAL_DECISION.md` — the canonical plan
- `SETUP.md` — this file
- `.claude-brain/` — the memory directory
- `artifacts/` — drafted tactical deliverables

---

## Step 2: Copy into your repo

Assuming your RentRayda repo is at `~/code/rentrayda`:

```bash
cp -r .claude-brain ~/code/rentrayda/
cp FINAL_DECISION.md ~/code/rentrayda/
cp PLAYBOOK.md ~/code/rentrayda/
cp SETUP.md ~/code/rentrayda/
cp -r artifacts ~/code/rentrayda/
cd ~/code/rentrayda
```

Verify:
```bash
ls -la .claude-brain
ls -la artifacts
ls PLAYBOOK.md SETUP.md FINAL_DECISION.md
```

---

## Step 3: Install the git hook

```bash
chmod +x .claude-brain/scripts/*.sh
./.claude-brain/scripts/install-hooks.sh
```

You'll see:
- `✓ Git repo detected`
- `✓ chmod +x applied`
- `✓ Pre-commit hook installed`
- `✓ Initial repo status refresh`
- Summary of installation

The pre-commit hook now blocks commits that introduce:
- Killed concepts (scraping, deprecated Facebook Groups API, etc.)
- Brand drift (old fonts/colors being added)
- Hardcoded secrets
- Failed TypeScript typecheck

---

## Step 4: Run the first refresh

```bash
./.claude-brain/scripts/refresh-repo-status.sh
```

This reads your actual repo state (git status, TODOs, brand drift counts, deploy health) and writes it to `.claude-brain/context/02-repo-status.md`. Run this at the start of every work session.

---

## Step 5: Verify canonical doc sync

```bash
./.claude-brain/scripts/check-sync.sh
```

You should see `✓ Canonical docs in sync`. If not, reconcile `FINAL_DECISION.md` and `.claude-brain/context/00-north-star.md` (they should agree on validation gate + kill list + revenue model).

---

## Step 6: Commit the brain

```bash
git add .claude-brain/ FINAL_DECISION.md artifacts/
git commit -m "chore: install v6 second brain for Claude Code memory"
git push
```

---

## Step 7: Start executing — follow the PLAYBOOK

**The brain is installed. Now follow `PLAYBOOK.md` — 40 ordered prompts that take you from first Claude Code session through Month 3 retrospective.**

Open Claude Code in your repo and paste **Prompt 1** from `PLAYBOOK.md` verbatim. After it completes, commit its work and paste **Prompt 2**. Continue sequentially. Do not skip prompts. Do not combine them.

The playbook is phased:
- **Phase 0 — Setup (Prompts 1-5):** Grounds Claude Code in your real repo state
- **Phase 1 — Validation launch (Prompts 6-10):** Build dual-path landing page + reservations
- **Phase 2 — Running validation (Prompts 11-15):** 14-day test with real money
- **Phase 3 — MVP cleanup IF validation passes (Prompts 16-25):** ~40 hours
- **Phase 4 — Phase 2 features (Prompts 26-32):** DPA compliance, GCash, PhilSys, flood risk
- **Phase 5 — Launch + first placements (Prompts 33-37):** Production + manual concierge delivery
- **Phase 6 — Scale prep (Prompts 38-40):** TikTok engine + Month 3 retro

Read `PLAYBOOK.md` section "The meta-rules across all 40 prompts" before starting. It tells you when to deviate and when not to.

---

## Daily rhythm

### Start of every work session
```bash
./.claude-brain/scripts/refresh-repo-status.sh
```
Then open Claude Code. It reads the fresh status automatically.

### Before every commit
The pre-commit hook runs automatically. If it blocks, fix the reason before retrying.

### End of every work session
Ask Claude Code: "Wrap the session per `.claude-brain/prompts/session-wrap.md`."

It will:
- Archive `scratch/current-session.md` to `scratch/archive/`
- Create `journal/YYYY-MM-DD-[topic].md`
- Create a new decision file if strategy changed
- Update `06-validation-state.md` if metrics changed
- Refresh repo-status
- Commit everything

### When Claude goes off the rails
Paste:
```
Reset per .claude-brain/prompts/claude-reset.md
```

Claude will stop, re-read canonical docs, identify drift, and wait for correction.

---

## What's in the brain

### `.claude-brain/CLAUDE.md`
Boot protocol. Hard rules. First file Claude reads.

### `.claude-brain/README.md`
Full directory map + philosophy.

### `.claude-brain/CHANGELOG.md`
Version history v1 → v6.

### `.claude-brain/context/` (13 files)
Persistent project knowledge:
- **00-north-star.md** — canonical product + validation gate
- **01-research-findings.md** — distilled interviews (L1-L5, T1-T4)
- **02-repo-status.md** — auto-refreshed code state
- **03-architecture.md** — TRD condensed, grounded in real file paths
- **04-brand.md** — colors, fonts, voice, verified badge spec
- **05-business-rules.md** — 25 non-negotiables
- **06-validation-state.md** — live metrics dashboard (dual-path tracking)
- **07-facebook-policy.md** — Meta ToS reality
- **08-pestel-snapshot-2026.md** — PH PESTEL analysis
- **09-target-psychographics-primary.md** — female BPO new hire profile
- **10-target-psychographics-secondary.md** — informal landlord profile
- **11-managed-agents-use-cases.md** — when to use Claude Managed Agents
- **12-gotchas.md** — PH-specific legal/cultural landmines

### `.claude-brain/decisions/` (13 files)
Strategic decisions with revive triggers:
- Kill scraping, tenant-only revenue, validate-before-build, Facebook Page only, two revenue paths, GCash escrow partnership, landlord onboarding via Messenger, PhilSys verification, TikTok as primary channel, DPA compliance as launch blocker, flood-risk indicators, no BIR paper trail

### `.claude-brain/prompts/` (5 files)
Copy-paste prompts for Claude Code:
- session-kickoff, pre-commit-check, session-wrap, debug-protocol, claude-reset

### `.claude-brain/scripts/` (4 files)
- install-hooks.sh — one-time setup
- refresh-repo-status.sh — daily
- verify.sh — runs pre-commit
- check-sync.sh — canonical doc drift check

### `artifacts/` (4 files)
Drafted tactical deliverables ready to use:
- **landlord-messenger-onboarding-script.md** — 9-stage Taglish Messenger flow
- **tiktok-scripts-first-3-videos.md** — 3 ready-to-film scripts + creator sourcing plan
- **partnership-outreach-gcash-and-philsys.md** — email to GCash + formal letter to PSA
- **landing-page-copy-and-discovery-script.md** — rentrayda.com copy + 20-min call script

---

## Troubleshooting

**Pre-commit hook blocks a valid commit:**
```bash
git commit --no-verify  # bypasses, use sparingly
```
Then fix the root cause in a follow-up commit.

**Script not found:**
```bash
chmod +x .claude-brain/scripts/*.sh
```

**`refresh-repo-status.sh` fails:**
- Check you're in the git repo root
- Check you have `curl` installed
- Check `pnpm` is on PATH

**Claude Code ignores the brain:**
Paste at the start of the session:
```
Before doing anything, read .claude-brain/CLAUDE.md fully and follow the session kickoff protocol literally. Do not skip any step.
```

**Sync check fails:**
Reconcile manually. Both `FINAL_DECISION.md` and `.claude-brain/context/00-north-star.md` must agree on the validation gate (30+ paid reservations in 14 days), the kill list, and the landlord-free revenue model.

---

## What this gives you

Before this brain: Claude Code treats every session as a blank slate. It invents features, suggests killed approaches, refactors things you didn't ask about, and forgets yesterday's decisions.

With this brain: Claude Code reads canonical memory at every session start, blocks commits that violate decisions, maintains a journal, and resets itself when it drifts. You get consistent behavior across hundreds of sessions without re-explaining context every time.

The brain is not magic. It's a constraint system. It works because you commit to using it — reading the kill list before suggesting features, creating decision files before changing strategy, writing journal entries after sessions. If you treat it as optional documentation, it becomes stale; if you treat it as the project's memory, it stays alive.

Go ship.
