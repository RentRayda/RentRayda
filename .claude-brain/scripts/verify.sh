#!/bin/bash
# .claude-brain/scripts/verify.sh
# Pre-commit guardrail. Blocks commits that violate core rules.
# Installed as a git hook by install-hooks.sh.

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  RentRayda pre-commit verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

FAILED=0
WARNED=0

# ============================================================================
# 1. Get list of staged files
# ============================================================================
STAGED=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null || echo "")

if [ -z "$STAGED" ]; then
  echo -e "${YELLOW}⚠ No staged files. Nothing to verify.${NC}"
  exit 0
fi

# Application code only (excludes brain docs and archived files — they document
# banned patterns as "don't use these" and would false-positive every scan).
STAGED_APP=$(echo "$STAGED" | grep -v "^\.claude-brain/" | grep -v "^docs/archive/" || true)

# ============================================================================
# 2. Check for killed concepts in staged files
# ============================================================================
echo ""
echo "→ Checking for killed concepts..."

KILLED_PATTERNS=(
  "scraper"
  "scrapers"
  "scrape_facebook"
  "scrape_lamudi"
  "puppeteer"
  "playwright-core"
  "publish_to_groups"
  "groups_access_member_info"
)

for pattern in "${KILLED_PATTERNS[@]}"; do
  # Search only application code files, exclude brain and archive
  MATCHES=$(echo "$STAGED_APP" | grep -E '\.(ts|tsx|js|jsx)$' | xargs grep -l "$pattern" 2>/dev/null || true)
  if [ ! -z "$MATCHES" ]; then
    echo -e "${RED}✗ BLOCKED:${NC} Staged file(s) reference killed concept '$pattern':"
    echo "$MATCHES" | sed 's/^/    /'
    echo "    See FINAL_DECISION.md Section 3 (kill list)"
    FAILED=1
  fi
done

if [ "$FAILED" -eq 0 ]; then
  echo -e "${GREEN}✓ No killed concepts found${NC}"
fi

# ============================================================================
# 3. Brand drift check — old fonts/colors shouldn't INCREASE
# ============================================================================
echo ""
echo "→ Checking brand drift in staged files..."

DRIFT_PATTERNS=(
  "NotoSansOsage"
  "TANNimbus"
)

for pattern in "${DRIFT_PATTERNS[@]}"; do
  NEW_REFS=$(git diff --cached -- ':!.claude-brain' ':!docs/archive' 2>/dev/null | grep "^+" | grep -v "^+++" | grep "$pattern" || true)
  if [ ! -z "$NEW_REFS" ]; then
    echo -e "${RED}✗ BLOCKED:${NC} Staged changes ADD reference to deprecated '$pattern'"
    echo "    Use BeVietnamPro-Bold or Sentient-Medium instead (see context/04-brand.md)"
    FAILED=1
  fi
done

COLOR_PATTERNS=(
  "#2563EB"
  "#2B51E3"
)

for pattern in "${COLOR_PATTERNS[@]}"; do
  NEW_REFS=$(git diff --cached -- ':!.claude-brain' ':!docs/archive' 2>/dev/null | grep "^+" | grep -v "^+++" | grep "$pattern" || true)
  if [ ! -z "$NEW_REFS" ]; then
    echo -e "${YELLOW}⚠ WARN:${NC} Staged changes add deprecated color '$pattern'"
    echo "    Use #2D79BF instead (see context/04-brand.md)"
    WARNED=1
  fi
done

if [ "$FAILED" -eq 0 ]; then
  echo -e "${GREEN}✓ No brand drift introduced${NC}"
fi

# ============================================================================
# 4. No hardcoded secrets
# ============================================================================
echo ""
echo "→ Checking for hardcoded secrets..."

SECRET_PATTERNS=(
  "sk_live_"
  "sk_test_"
  "AKIA[0-9A-Z]{16}"
  "-----BEGIN.*PRIVATE KEY-----"
  "ghp_[A-Za-z0-9]{36}"
  "xoxb-[0-9]{11,13}-[0-9]{11,13}-"
)

for pattern in "${SECRET_PATTERNS[@]}"; do
  FOUND=$(echo "$STAGED_APP" | xargs grep -l -E "$pattern" 2>/dev/null || true)
  if [ ! -z "$FOUND" ]; then
    echo -e "${RED}✗ BLOCKED:${NC} Possible secret matching '$pattern' in:"
    echo "$FOUND" | sed 's/^/    /'
    echo "    Move secrets to environment variables."
    FAILED=1
  fi
done

if [ "$FAILED" -eq 0 ]; then
  echo -e "${GREEN}✓ No hardcoded secrets detected${NC}"
fi

# ============================================================================
# 5. R2 object key leak check
# ============================================================================
echo ""
echo "→ Checking for R2 object key leaks..."

# Check if API routes return r2_object_key in responses
ROUTES_WITH_LEAKS=$(echo "$STAGED" | grep "apps/api/src/routes/" | xargs grep -l "r2_object_key\|r2ObjectKey" 2>/dev/null || true)

if [ ! -z "$ROUTES_WITH_LEAKS" ]; then
  echo -e "${YELLOW}⚠ WARN:${NC} API route files reference r2_object_key:"
  echo "$ROUTES_WITH_LEAKS" | sed 's/^/    /'
  echo "    Verify these are NOT returned in response bodies."
  WARNED=1
else
  echo -e "${GREEN}✓ No R2 key leak risk in routes${NC}"
fi

# ============================================================================
# 6. New dependencies check
# ============================================================================
echo ""
echo "→ Checking for new dependencies..."

# Check if package.json files are staged
PACKAGE_JSONS=$(echo "$STAGED" | grep "package.json$" || true)

if [ ! -z "$PACKAGE_JSONS" ]; then
  NEW_DEPS=$(git diff --cached -- '**/package.json' 2>/dev/null | grep "^+" | grep -v "^+++" | grep '".*":' | grep -v '"version"' || true)
  if [ ! -z "$NEW_DEPS" ]; then
    echo -e "${YELLOW}⚠ NEW DEPENDENCIES DETECTED:${NC}"
    echo "$NEW_DEPS" | sed 's/^/    /'
    echo ""
    echo "    Did you discuss this with the team? (Y/n)"
    read -r confirm
    if [ "$confirm" != "Y" ] && [ "$confirm" != "y" ] && [ "$confirm" != "" ]; then
      echo -e "${RED}✗ BLOCKED:${NC} New dependencies require explicit approval."
      FAILED=1
    fi
  fi
else
  echo -e "${GREEN}✓ No package.json changes${NC}"
fi

# ============================================================================
# 7. TypeScript typecheck
# ============================================================================
echo ""
echo "→ Running TypeScript typecheck..."

if command -v pnpm &> /dev/null; then
  # Run typecheck and capture actual exit code (can't pipe — pipe masks exit code)
  TYPECHECK_OUTPUT=$(pnpm turbo typecheck --cache-dir=.turbo 2>&1)
  TYPECHECK_EXIT=$?
  if [ $TYPECHECK_EXIT -eq 0 ]; then
    echo -e "${GREEN}✓ Typecheck passed${NC}"
  else
    echo "$TYPECHECK_OUTPUT" | tail -20
    echo -e "${RED}✗ BLOCKED:${NC} TypeScript errors must be fixed before commit."
    FAILED=1
  fi
else
  echo -e "${YELLOW}⚠ pnpm not found — skipping typecheck${NC}"
fi

# ============================================================================
# 7.5. Canonical doc sync check
# ============================================================================
echo ""
echo "→ Checking canonical doc sync (FINAL_DECISION.md ↔ 00-north-star.md)..."

SYNC_SCRIPT="$(git rev-parse --show-toplevel)/.claude-brain/scripts/check-sync.sh"
if [ -x "$SYNC_SCRIPT" ]; then
  if "$SYNC_SCRIPT" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Canonical docs in sync${NC}"
  else
    echo -e "${YELLOW}⚠ WARN:${NC} FINAL_DECISION.md and context/00-north-star.md may have drifted."
    echo "   Run: ./.claude-brain/scripts/check-sync.sh"
    WARNED=1
  fi
else
  echo -e "${YELLOW}⚠${NC} check-sync.sh not executable — skipping"
fi

# ============================================================================
# 8. Console.log check
# ============================================================================
echo ""
echo "→ Checking for console.log in staged code..."

CONSOLE_LOGS=$(git diff --cached -- ':!.claude-brain' ':!docs/archive' 2>/dev/null | grep "^+" | grep -v "^+++" | grep -E "console\.(log|debug)" | grep -v "console.error\|console.warn" || true)

if [ ! -z "$CONSOLE_LOGS" ]; then
  echo -e "${YELLOW}⚠ WARN:${NC} console.log/debug found in staged changes."
  echo "    Consider removing before commit:"
  echo "$CONSOLE_LOGS" | head -5 | sed 's/^/    /'
  WARNED=1
else
  echo -e "${GREEN}✓ No debug console statements${NC}"
fi

# ============================================================================
# Summary
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$FAILED" -eq 1 ]; then
  echo -e "${RED}✗ COMMIT BLOCKED${NC} — Fix issues above before committing."
  echo ""
  echo "  To bypass (not recommended): git commit --no-verify"
  echo "  To fix: address each error above and re-stage."
  exit 1
fi

if [ "$WARNED" -eq 1 ]; then
  echo -e "${YELLOW}⚠ Commit will proceed with warnings.${NC}"
  echo "  Review warnings above. Consider fixing before push."
else
  echo -e "${GREEN}✓ All checks passed. Proceeding with commit.${NC}"
fi

echo ""
exit 0
