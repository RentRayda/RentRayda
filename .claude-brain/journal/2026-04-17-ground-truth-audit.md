# Ground-truth audit — 2026-04-17

## Goal
Verify `.claude-brain/context/02-repo-status.md` and `03-architecture.md` match actual codebase. Flag drift.

## Audit Results

| # | Claim | Expected | Actual | Drift? |
|---|-------|----------|--------|--------|
| 1a | connections.ts line count | ~336 | **336** | No |
| 1b | Triple-check reveal logic present | pending + landlord verified + tenant verified | Lines 188, 193, 202: all 3 checks confirmed | No |
| 2 | BullMQ workers NOT started in index.ts | No `new Worker`/`createWorker` | Grep returned empty — no worker instantiation | No |
| 3 | resend NOT installed | No match in package.json | No match | No |
| 4 | Mobile tab icons are letter placeholders | Letters S/H/I/P | Confirmed: `icon="S"`, `icon="H"`, `icon="I"`, `icon="P"` in `_layout.tsx` | No |
| 5a | Web middleware.ts missing | missing | **missing** | No |
| 5b | No admin auth in web | No matches | Zero matches for requireAdmin/adminAuth in admin/ | No |
| 6 | Mobile TODO count | 8 (brain claim) | **8** | No |
| 7a | Old font refs (NotoSansOsage/TANNimbus) | REPO_STATUS claims 1142, architecture claims 306 | **Source files: 306** (mobile only). REPO_STATUS 1142 includes `.next/dev/` build cache (773 refs in build artifacts) | **YES — REPO_STATUS inflated** |
| 7b | Old color refs (#2563EB/#2B51E3) | REPO_STATUS claims 728, architecture claims 87 | **Source files: ~85** (mobile only, 5 fixed 2026-04-17). REPO_STATUS 728 includes `.next/dev/` build cache (552 refs in build artifacts) | **YES — REPO_STATUS inflated** |
| 8 | Migrations | 0000_*.sql, 0001_*.sql, meta/ | `0000_true_karnak.sql`, `0001_moaning_texas_twister.sql`, `meta/` | No |

## Material Drift Found

### DRIFT 1: refresh-repo-status.sh counts build artifacts in brand drift

**File:** `.claude-brain/scripts/refresh-repo-status.sh` lines 92-93

**Problem:** The script uses `grep -r "NotoSansOsage\|TANNimbus" apps/` which matches inside `apps/web/.next/dev/` (Next.js dev build cache). This inflates the count from ~306 actual source refs to 1142, and from ~85 actual source color refs to 728.

**Impact:** Brain claims 1142 font refs and 728 color refs, making brand drift look 3-4x worse than it actually is. The architecture doc (03-architecture.md) correctly states 306/87 for mobile source files — that number is accurate.

**Root cause:** `grep -r` hits `.next/dev/server/chunks/ssr/` and `.next/dev/static/chunks/` which contain compiled bundles that mirror source-file content.

**Fix needed:** Add `--exclude-dir=.next` to the grep commands in refresh-repo-status.sh. Alternatively, exclude `apps/web/.next` specifically. The actual source-code brand drift is ~306 font refs and ~85 color refs, all in `apps/mobile/`.

### DRIFT 2: 03-architecture.md vs 02-repo-status.md disagree on counts

**03-architecture.md** (line 248-249) says: "306 old font references" and "87 old color references" — these are correct for source files.

**02-repo-status.md** (auto-generated) says: 1142 and 728 — inflated by build cache.

Both are in the brain. A reader who checks both gets conflicting numbers.

## What was NOT drifted (confirmed accurate)

- connections.ts triple-check logic: exact match, 336 LOC
- BullMQ workers: correctly flagged as not started
- resend: correctly flagged as missing
- Mobile icons: correctly flagged as letter placeholders
- Web admin: correctly flagged as unprotected
- TODO count: exactly 8
- Migrations: exactly as claimed

## Next step

Wait for founder decision on drift fix approach before modifying refresh script or brain docs.

## Time spent
~30 minutes
