# .claude-brain — Canonical project memory for Claude Code

This directory is Claude Code's persistent memory across sessions. Without it, Claude rebuilds decisions we already made, suggests killed ideas, and hallucinates features. With it, Claude stays grounded in what actually exists and what we're actually building.

## How it works

Every Claude Code session starts by reading `.claude-brain/CLAUDE.md` (the boot protocol). That file tells Claude to read the rest of the brain in a specific order before touching any code.

During the session, Claude writes to `scratch/current-session.md` as a live scratchpad — so even if context degrades on a long session, Claude can re-ground itself.

At session end, Claude updates the journal, archives the scratchpad, and if any strategic decision was made, creates a new file in `decisions/`.

## Directory layout

```
claude-brain-bundle/              # What you installed
├── FINAL_DECISION.md             # Canonical project decision doc (copy this to repo root)
├── .claude-brain/                # Project memory (copy this to repo root)
│   ├── CLAUDE.md                 # Boot protocol — read first every session
│   ├── README.md                 # This file
│   ├── CHANGELOG.md              # Version history of the brain
│   ├── .gitignore                # Excludes scratch/current-session.md
│   ├── context/                  # Persistent project knowledge (13 files)
│   │   ├── 00-north-star.md          # What we're building and why (canonical)
│   │   ├── 01-research-findings.md   # Distilled 9 interviews + hypothesis status
│   │   ├── 02-repo-status.md         # Current code state (auto-refreshed)
│   │   ├── 03-architecture.md        # TRD.md highlights
│   │   ├── 04-brand.md               # Brand rules (colors, fonts, voice)
│   │   ├── 05-business-rules.md      # 25 non-negotiables
│   │   ├── 06-validation-state.md    # Live metrics dashboard
│   │   ├── 07-facebook-policy.md     # Meta ToS reality
│   │   ├── 08-pestel-snapshot-2026.md            # Philippine PESTEL analysis
│   │   ├── 09-target-psychographics-primary.md   # Female BPO new hire profile
│   │   ├── 10-target-psychographics-secondary.md # Informal Filipina landlord profile
│   │   ├── 11-managed-agents-use-cases.md        # When to use Claude Managed Agents
│   │   └── 12-gotchas.md             # PH legal/cultural landmines
│   ├── decisions/                # Strategic decisions with dates (13 files)
│   │   ├── TEMPLATE.md
│   │   ├── 2026-04-10-kill-scraping.md
│   │   ├── 2026-04-11-tenant-only-revenue.md
│   │   ├── 2026-04-12-validate-before-build.md
│   │   ├── 2026-04-12-facebook-page-only-no-groups.md
│   │   ├── 2026-04-12-two-revenue-paths.md
│   │   ├── 2026-04-12-escrow-via-gcash-partnership.md
│   │   ├── 2026-04-12-landlord-onboarding-messenger.md
│   │   ├── 2026-04-12-philsys-verification-integration.md
│   │   ├── 2026-04-12-tiktok-primary-awareness-channel.md
│   │   ├── 2026-04-12-data-privacy-act-compliance.md
│   │   ├── 2026-04-12-flood-risk-indicators.md
│   │   └── 2026-04-12-no-bir-paper-trail.md
│   ├── prompts/                  # Reusable Claude prompts (5 files)
│   │   ├── session-kickoff.md
│   │   ├── pre-commit-check.md
│   │   ├── session-wrap.md
│   │   ├── debug-protocol.md
│   │   └── claude-reset.md
│   ├── journal/                  # One entry per work session
│   │   └── [YYYY-MM-DD-topic.md]
│   ├── scratch/                  # Live session scratchpad
│   │   ├── current-session.md    # Claude writes here during work (gitignored)
│   │   └── archive/              # Old scratchpads
│   └── scripts/                  # Automation (4 files)
│       ├── install-hooks.sh      # One-time setup
│       ├── refresh-repo-status.sh # Regenerates context/02-repo-status.md
│       ├── verify.sh             # Pre-commit guardrails
│       └── check-sync.sh         # FINAL_DECISION ↔ north-star drift check
└── artifacts/                    # Drafted tactical deliverables (4 files)
    ├── landlord-messenger-onboarding-script.md    # 9-stage Taglish Messenger flow
    ├── tiktok-scripts-first-3-videos.md           # 3 ready-to-film video scripts
    ├── partnership-outreach-gcash-and-philsys.md  # GCash email + PSA letter
    └── landing-page-copy-and-discovery-script.md  # rentrayda.com copy + call script
```

## Setup (one-time)

Run once after cloning:

```bash
chmod +x .claude-brain/scripts/*.sh
./.claude-brain/scripts/install-hooks.sh
./.claude-brain/scripts/refresh-repo-status.sh
```

## Daily rhythm

**Start of day:**
```bash
./.claude-brain/scripts/refresh-repo-status.sh
```
Then start Claude Code. It reads CLAUDE.md automatically.

**End of day:**
Claude handles session-wrap automatically per the boot protocol.

## Rules

1. Every Claude Code session starts by reading `CLAUDE.md`
2. Before any code change, Claude checks `context/05-business-rules.md` for violations
3. Every strategic decision must be documented in `decisions/` before implementation
4. After every session, `journal/` is updated and `context/02-repo-status.md` is refreshed
5. Never modify `context/` without creating a `decisions/` file explaining why

## Never do

These are the most common hallucinations. If Claude suggests any of them, stop and reset:

- Build features from V1-V5 blueprints (archived noise)
- Add scraping of Facebook, Lamudi, OLX, or any third-party site
- Post to Facebook Groups via API (impossible per Meta ToS since April 22, 2024)
- Charge landlords any fee (research-validated non-negotiable)
- Build AI chatbot as primary UX (users want buttons, not prompts)
- Propose B2B BPO partnerships as primary revenue (BPO is shrinking)
- Add monthly subscriptions (transaction-only model)
- iOS before Android traction validates
- Multi-city before dominating Pasig/Ortigas
- Fundraise before Day 120 PMF proof

Full kill list with reasons: `FINAL_DECISION.md` Section 3.

## The reset command

If Claude goes off the rails mid-session, paste this:

```
Stop. Re-read FINAL_DECISION.md Section 3 (kill list) and Section 4 (build list).
Tell me in one sentence what I actually asked for.
Tell me in one sentence what you were about to do.
Wait for my correction.
```

That's the whole recovery protocol.

## The one test

Before shipping anything:
**"Does this help us get 30+ paid reservations (across Tier 1 or Tier 2) in 14 days?"**

If no — it's not MVP scope.
If yes — ship it.
