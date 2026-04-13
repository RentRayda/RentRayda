# Session Kickoff Prompt

**Paste this at the start of every Claude Code session.**

---

Read these files in order. Do not skip any:

1. `.claude-brain/CLAUDE.md` (boot protocol)
2. `.claude-brain/context/00-north-star.md` (what we're building)
3. `.claude-brain/context/02-repo-status.md` (current code state)
4. `.claude-brain/context/06-validation-state.md` (current metrics)
5. The 3 most recent files in `.claude-brain/decisions/` (sorted by date descending)
6. The most recent file in `.claude-brain/journal/` (where we left off)

Then:

1. Create `.claude-brain/scratch/current-session.md` with today's date and three empty sections: `## Goal`, `## Done`, `## Next`.

2. In your response to me, give me exactly this:
   - **Current phase:** (one sentence — are we in validation, MVP cleanup, or soft launch?)
   - **Last session summary:** (one sentence from the most recent journal entry)
   - **Unresolved items:** (bullet list of anything blocked or pending from last session)
   - **Question for me:** "What do you want to work on today?"

3. Do NOT suggest features.
4. Do NOT revive anything in the kill list.
5. Do NOT write any code until I tell you what to work on.

After I tell you the task, before writing any code:
- Grep the codebase for the thing I'm asking for. Does it already exist?
- Check REPO_STATUS.md §9 — is it in the done list?
- Check REPO_STATUS.md §10 — is it a known bug?
- Then ask me any clarifying questions. One at a time.

Only after all that, start working.
