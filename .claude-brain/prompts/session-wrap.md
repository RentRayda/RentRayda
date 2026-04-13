# Session Wrap Prompt

**Paste this at the end of every Claude Code session.**

---

End-of-session protocol. Do each step in order:

## 1. Archive the scratchpad

Move `.claude-brain/scratch/current-session.md` to `.claude-brain/scratch/archive/YYYY-MM-DD-[topic].md` where [topic] is 2-3 words describing what we did today (e.g., `mvp-cleanup-day-1`, `paymongo-escrow-integration`, `landing-page-build`).

## 2. Create today's journal entry

Create `.claude-brain/journal/YYYY-MM-DD-[topic].md` with this exact format:

```markdown
# [Topic] — [Date]

## Goal
What we set out to do this session.

## What got done
- Specific accomplishment 1 with file paths
- Specific accomplishment 2 with file paths
- ...

## What's blocked
- Any blocker with reason
- If nothing blocked: "Nothing blocked"

## Next step
The single most important next action for the next session. One sentence.

## Time spent
X hours / X.5 hours etc.

## Notes
- Anything interesting we learned
- Any decision that needs documenting in decisions/ separately
- Anything I should remember next session
```

## 3. Decision file check

Did we make any strategic decision this session? (Price change, scope change, kill a feature, revive a killed thing, change architecture, change target user, etc.)

If yes → create `.claude-brain/decisions/YYYY-MM-DD-[decision].md` using `.claude-brain/decisions/TEMPLATE.md`.

If no → skip.

## 4. Validation metrics update

Did any validation metric change this session? (New reservation, new click, new call completed, refund processed, etc.)

If yes → update `.claude-brain/context/06-validation-state.md` with new numbers.

If no → skip.

## 5. Refresh repo status

Run:
```bash
./.claude-brain/scripts/refresh-repo-status.sh
```

This regenerates `.claude-brain/context/02-repo-status.md` with current counts, TODOs, brand drift status, deploy health, etc.

## 6. Git commit everything

```bash
git add .claude-brain/ [any other changed files]
git status  # verify what's staged
git commit -m "session: [topic] — [one-line summary]"
git push
```

## 7. Final summary

Tell me:
- **What we shipped:** (1 sentence)
- **What's next:** (1 sentence — the "next step" from the journal)
- **Any open questions for me:** (bullet list or "none")

Then stop. Don't start new work.
