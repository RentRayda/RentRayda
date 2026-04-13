# Pre-Commit Check

**Paste this before every commit. Run each item. If any fails, block the commit.**

---

Before I commit, verify each item in order. Tell me the result of each check before committing.

## 1. Scope check

- Does this change align with `.claude-brain/context/00-north-star.md` Section "Build List"?
- Does it violate anything in `.claude-brain/context/05-business-rules.md`?
- Does it revive anything in the kill list (`FINAL_DECISION.md` Section 3 or `context/00-north-star.md`)?

If kill list violated → STOP. Do not commit. Ask me.

## 2. Decision trail check

- If this change introduces a new strategic decision, have I created a file in `.claude-brain/decisions/` using the TEMPLATE?
- If I modified `.claude-brain/context/`, have I documented why in a decision file?

If missing → create the decision file BEFORE committing.

## 3. Code quality check

Run in order:

```bash
pnpm turbo typecheck
```
Must pass with zero errors. If fails, fix before committing.

```bash
pnpm turbo build
```
Must pass with zero errors.

```bash
pnpm turbo lint
```
(Once ESLint is configured.)

## 4. Security check (2 minutes, manual)

```bash
# R2 object keys must never appear in API responses
grep -r "r2_object_key\|r2ObjectKey" apps/api/src/routes/
# If this returns matches in response objects → STOP, fix

# No hardcoded secrets
grep -r "password\|secret\|api_key\|api-key" apps/ --include="*.ts" -l
# Check each file — all secrets must come from env vars

# New routes have authMiddleware?
# Check manually in apps/api/src/routes/ — any new route file must use middleware

# Presigned URL expiry correct?
# Upload: 5 min. View: 1 hour. Check apps/api/src/lib/r2.ts
```

## 5. Drift check

```bash
# Old font references (should NEVER increase)
grep -r "NotoSansOsage\|TANNimbus" apps/mobile | wc -l
# If count increased vs last commit → STOP, you reintroduced drift

# Old color references
grep -r "#2563EB\|#2B51E3" apps/mobile apps/web apps/api | wc -l
# Same rule — count must not increase
```

## 6. Git diff review

```bash
git diff --stat
git diff
```

Read every line. Ask yourself:
- Any files changed that shouldn't have been? (Usually "Yes" when AI refactors adjacent code without asking)
- Any console.log left behind?
- Any commented-out code?
- Any `TODO` or `FIXME` added?
- Any `any` types added?
- Any `// @ts-ignore` added?

If any of these are present and not explicitly discussed → revert them.

## 7. Commit message

Must follow: `type(scope): description`

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `session`

Good examples:
- `feat(payments): add paymongo webhook handler for payment.paid`
- `fix(mobile): wire auth TODO at inbox/index.tsx:42`
- `chore(brain): update repo-status after week 1 day 3`
- `session: mvp cleanup day 2 — brand drift fixed`

Bad examples:
- `updates` (what?)
- `fix stuff` (what stuff?)
- `improvements` (which improvements?)

---

If every check passes, commit. Otherwise, fix what's failing before committing.
