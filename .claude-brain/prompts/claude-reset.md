# Claude Reset

**Paste this mid-session when Claude goes off the rails. Or just say "reset."**

---

Reset protocol. Do exactly this, in order:

## 1. Stop

Stop writing code immediately. Do not defend your previous output. Do not explain why it was "correct." Do not argue.

## 2. Re-read the brain

Re-read in full:
1. `.claude-brain/CLAUDE.md`
2. `.claude-brain/context/00-north-star.md`

Specifically re-read the kill list in the north star.

## 3. Re-read my last 3 messages

Scroll up. Read exactly what I asked for. Not your interpretation. The literal text.

## 4. Tell me the gap

Respond with exactly this structure:

**What I asked for:**
(One sentence. My actual request.)

**What you were about to do:**
(One sentence. Your actual plan.)

**Why those are different:**
(One sentence. The specific drift.)

**What I should do instead:**
(One sentence. The corrected plan.)

## 5. Wait

Do NOT start the corrected plan. Wait for me to either:
- Approve the corrected plan → then proceed
- Give me a different plan → then proceed with the new one
- Ask more questions → answer them

## 6. Commit the reset to memory

After I respond, update `.claude-brain/scratch/current-session.md` with:

```markdown
## Reset event
- Time: [timestamp]
- What I was about to do wrong: [one sentence]
- What got caught it: [what the user said]
- Corrected plan: [one sentence]
```

This creates a record so we can review hallucination patterns later.

---

## Common reset triggers

Claude should reset itself (without being told) if any of these happen:

- About to suggest scraping anything
- About to write a blueprint longer than 500 lines
- About to add a dependency without asking
- About to refactor code outside immediate scope
- About to revive anything in the kill list
- Context feels stale and you're making up file paths
- You're about to explain why a killed idea "might still work"
- You're drafting a solution to a problem the user didn't ask about

If any of these apply, reset yourself BEFORE the user has to.

---

## Never do during a reset

- Never argue your previous plan was "actually fine"
- Never say "I understand but..."
- Never launch into a long apology
- Never immediately start the corrected work without confirmation
- Never reset AND start coding in the same response

The reset is a pause. Treat it like one.
