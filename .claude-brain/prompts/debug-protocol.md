# Debug Protocol

**Paste this when something is broken and you need Claude Code to help fix it.**

---

When something breaks, follow this protocol. Do NOT skip steps. Do NOT guess.

## 1. Read the actual error

Read the error message word by word. Do not paraphrase. Do not assume.

Copy the exact text:
- Stack trace
- File path
- Line number
- Error code

## 2. Check the brain

Before touching any code:

- Is this thing listed as "working" in `.claude-brain/context/02-repo-status.md`?
- Check git log for last commit touching the affected file: `git log -5 -- path/to/file.ts`
- Check `.claude-brain/journal/` for recent entries mentioning this area

If recent work touched this file, the bug is likely in the recent change.

## 3. Isolate the failure

Create the smallest possible reproduction:
- Can you trigger it with one specific input?
- Does it happen in dev only? Staging? Production?
- Does it happen for all users or one?
- Is it deterministic or intermittent?

Write the reproduction steps in `.claude-brain/scratch/current-session.md` under a "## Debug" header.

## 4. Search for similar working patterns

Before writing a fix, search the codebase for:
- Similar routes that DO work
- Similar components that render correctly
- Similar queries that execute successfully

Use: `grep -rn "pattern" apps/ packages/`

If a similar pattern works elsewhere, the fix is to match that pattern.

## 5. Propose the fix

Tell me:
- **Root cause:** (one sentence)
- **Proposed fix:** (specific file and line)
- **Scope:** (only this file, or does anything else need to change?)
- **Risk:** (what could this break?)

Wait for my approval before writing the fix.

## 6. Fix with minimum scope

When approved:
- Change ONLY the file(s) we discussed
- Do NOT refactor adjacent code
- Do NOT "improve while you're there"
- Do NOT add tests that weren't requested
- Do NOT reformat unrelated lines

## 7. Verify the fix

Run the exact reproduction from step 3. Does it pass?

Also run:
```bash
pnpm turbo typecheck
pnpm turbo build
```

Both must pass.

## 8. Document

Update `.claude-brain/scratch/current-session.md` with:
- What broke
- Root cause (one sentence)
- How we fixed it
- Files changed

## 9. Commit

Follow `.claude-brain/prompts/pre-commit-check.md` before committing.

Commit message format: `fix(scope): description`

Example: `fix(api): r2 presigned url expiring too fast for slow uploads`

---

## Stop conditions

If you've tried 3 fixes and it's still broken:

**STOP.** Do not keep trying.

More attempts at this point create cascading bugs and burn context. Tell me:
- What you tried (bullet list of 3 attempts)
- What each attempt changed
- Why you think the 3rd attempt didn't work
- What you would try next, and why you're uncertain

Then wait. I will either give you more context or take over.

---

## What NOT to do when debugging

- Do NOT add `try/catch` that swallows the error just to make it "work"
- Do NOT disable the test that's failing
- Do NOT add `// @ts-ignore` to silence TypeScript
- Do NOT add `any` type to bypass type errors
- Do NOT comment out the broken code and "come back to it"
- Do NOT upgrade the dependency as the first fix
- Do NOT clear node_modules as the first fix
- Do NOT blame "caching"

Real bugs have real root causes. Find the cause before applying the fix.
