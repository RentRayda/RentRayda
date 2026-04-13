# CLAUDE.md — RentRayda Session Boot Protocol

**This file is read by Claude Code BEFORE any other file in every session. These rules override all other instructions, defaults, or helpful impulses.**

---

## HARD RULES (violating any = stop immediately)

1. **Never write code before reading `.claude-brain/context/00-north-star.md`.** If you skip this, you will hallucinate features we killed.
2. **Never suggest anything in `FINAL_DECISION.md` Section 3 (kill list).** That section documents 19 specifically rejected paths. If you find yourself proposing one, stop.
3. **Never add a dependency without asking.** New packages = new attack surface, new bugs, new context we don't have.
4. **Never refactor beyond the immediate scope.** If I ask for a fix in `file-A.ts`, do not "while I'm here" touch `file-B.ts`.
5. **Never write a blueprint longer than 500 lines.** We don't do blueprints anymore. We ship code against the existing plan.

---

## BEFORE ANY RESPONSE INVOLVING CODE

Run these mental checks in order:

1. **Does it already exist?** Grep the codebase for the thing I'm asked to build. If it exists in REPO_STATUS.md §9 (the 25 done items), tell me before writing new code.
2. **Is it a known bug?** Check REPO_STATUS.md §10. If yes, reference the specific file:line in your response.
3. **Is it in the build list?** Check FINAL_DECISION.md Section 4. If not, ask why we're building it before writing.
4. **Is there a decision file about it?** Check `.claude-brain/decisions/`. Recent decisions override older assumptions.
5. **What's the minimum scope?** Narrow it before touching any file.

---

## SESSION KICKOFF PROTOCOL

At the start of every session, you do this automatically — no prompting needed:

1. Read `.claude-brain/context/00-north-star.md` (what we're building)
2. Read `.claude-brain/context/02-repo-status.md` (current code state)
3. Read `.claude-brain/context/06-validation-state.md` (current metrics)
4. Read `.claude-brain/context/12-gotchas.md` (PH-specific landmines to avoid)
5. Read the 3 most recent files in `.claude-brain/decisions/` (sorted by date)
6. Read the most recent file in `.claude-brain/journal/` (where we left off)
7. If the user's task touches marketing, customer onboarding, partnerships, or landing pages — check `artifacts/` for pre-drafted content before writing new content
8. Create `.claude-brain/scratch/current-session.md` with today's date and empty sections for "Goal", "Done", "Next"
9. Summarize in 3 bullets the current state of the project
10. Ask what I want to work on today. If I reply with a prompt number (e.g., "prompt 7"), find that prompt in `PLAYBOOK.md` at repo root and execute it literally — do not interpret, do not combine, do not skip.

Do NOT suggest features unless I explicitly ask.
Do NOT revive anything from the kill list.
Do NOT generate content when `artifacts/` has pre-drafted versions — use those instead.
Do NOT skip reading `PLAYBOOK.md` if I mention a prompt number — that file is the execution sequence.

---

## DURING THE SESSION

After every 10 tool calls, update `.claude-brain/scratch/current-session.md` with:
- What I'm trying to accomplish (1 sentence)
- What I've done so far (bullet list)
- What I'm about to do next (1 sentence)

If context starts feeling stale, re-read `current-session.md` first. This fights context degradation on long sessions.

---

## PRE-COMMIT CHECKS

Before I commit, run through `.claude-brain/prompts/pre-commit-check.md` completely. If any check fails, block the commit. Do not override silently.

---

## SESSION END PROTOCOL

At the end of every session:

1. Move `.claude-brain/scratch/current-session.md` → `.claude-brain/scratch/archive/YYYY-MM-DD-[topic].md`
2. Create today's journal entry: `.claude-brain/journal/YYYY-MM-DD-[topic].md`
3. If any strategic decision was made, create a new file in `.claude-brain/decisions/` using the template
4. If validation metrics changed, update `.claude-brain/context/06-validation-state.md`
5. Run `.claude-brain/scripts/refresh-repo-status.sh` to update the repo status doc
6. Commit everything including brain files

---

## THE RESET COMMAND

If I say "reset" or "you're wrong" or "stop":

1. Stop writing code immediately. Do not defend your previous output.
2. Re-read `.claude-brain/context/00-north-star.md` in full.
3. Re-read the last 3 messages I sent you.
4. Tell me what I actually asked for in one sentence.
5. Tell me what you were about to do in one sentence.
6. Tell me why those are different.
7. Wait for my correction before writing any more code.

Never argue. Never explain. Never justify. Just reset and wait.

---

## WHAT YOU WILL BE TEMPTED TO DO (AND MUST NOT)

Based on prior sessions, you have a history of:

- Suggesting Facebook/Lamudi scraping (killed — Section 3.2, 3.3)
- Building AI chatbot UX (killed — Section 3.1)
- Writing 14,000-line blueprints (killed — Section 3.12)
- Proposing B2B BPO partnerships (killed — Section 3.4)
- Adding monthly subscriptions (killed — Section 3.5)
- Reviving V1-V5 documents (archived noise — Section 3.12)
- Refactoring adjacent code during bug fixes
- Inventing file paths or API signatures that don't exist
- Over-explaining simple changes with long commentary

If you catch yourself doing any of these, stop and re-read this file.

---

## THE ONE SIMPLE TEST

Before shipping anything, ask:
**"Does this help us get 30+ paid reservations (across Tier 1 or Tier 2) in 14 days?"**

If no — it's not MVP scope.
If maybe — justify it in writing.
If yes — ship it.

---

*This file is canonical. Changes require a decision file in `.claude-brain/decisions/` explaining why.*
