#!/bin/bash
# .claude-brain/scripts/check-sync.sh
# Verifies FINAL_DECISION.md and context/00-north-star.md stay in agreement.
#
# They contain overlapping content (kill list, build list, one-sentence decision).
# This script checks that the critical anchors match between the two files.
# If they drift, one has been edited without updating the other — fix it.

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

BRAIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_ROOT="$(cd "$BRAIN_DIR/.." && pwd)"

FINAL_DECISION="$REPO_ROOT/FINAL_DECISION.md"
NORTH_STAR="$BRAIN_DIR/context/00-north-star.md"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Canonical doc sync check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

FAILED=0

# ============================================================================
# 1. Both files exist
# ============================================================================
if [ ! -f "$FINAL_DECISION" ]; then
  echo -e "${RED}✗${NC} FINAL_DECISION.md missing at repo root"
  FAILED=1
fi

if [ ! -f "$NORTH_STAR" ]; then
  echo -e "${RED}✗${NC} context/00-north-star.md missing"
  FAILED=1
fi

if [ $FAILED -eq 1 ]; then
  exit 1
fi

echo -e "${GREEN}✓${NC} Both canonical docs exist"

# ============================================================================
# 2. The one-sentence validation gate must match
# ============================================================================
# Both docs must reference the 30+ paid reservations threshold
GATE_IN_FINAL=$(grep -cE "30\+ paid reservations|30\+ strangers pay" "$FINAL_DECISION" || echo 0)
GATE_IN_NORTH=$(grep -cE "30\+ paid reservations|30\+ strangers pay" "$NORTH_STAR" || echo 0)

if [ "$GATE_IN_FINAL" -eq 0 ]; then
  echo -e "${RED}✗${NC} FINAL_DECISION.md is missing the validation gate anchor ('30+ paid reservations')"
  FAILED=1
else
  echo -e "${GREEN}✓${NC} FINAL_DECISION.md has validation gate anchor"
fi

if [ "$GATE_IN_NORTH" -eq 0 ]; then
  echo -e "${RED}✗${NC} 00-north-star.md is missing the validation gate anchor"
  FAILED=1
else
  echo -e "${GREEN}✓${NC} 00-north-star.md has validation gate anchor"
fi

# ============================================================================
# 3. Kill list size check
# ============================================================================
# The kill list in FINAL_DECISION.md Section 3 should have N entries.
# The north star should reference at least N items. Count matching headings.

KILL_COUNT_FINAL=$(grep -cE "^### 3\.[0-9]+ KILLED:" "$FINAL_DECISION" || echo 0)
KILL_ITEMS_NORTH=$(grep -cE "^[0-9]+\. [A-Z]" "$NORTH_STAR" || echo 0)

echo ""
echo "  Kill list entries in FINAL_DECISION.md: $KILL_COUNT_FINAL"
echo "  Numbered items in 00-north-star.md:     $KILL_ITEMS_NORTH (includes kill list + other lists)"

if [ "$KILL_COUNT_FINAL" -lt 19 ]; then
  echo -e "${YELLOW}⚠${NC}  FINAL_DECISION.md kill list has $KILL_COUNT_FINAL items. Baseline is 19."
  echo "   If items were intentionally merged or added, update this check."
fi

# ============================================================================
# 4. Last-modified sanity check
# ============================================================================
# If one was edited significantly more recently than the other, warn.
FINAL_MTIME=$(stat -c %Y "$FINAL_DECISION" 2>/dev/null || stat -f %m "$FINAL_DECISION" 2>/dev/null)
NORTH_MTIME=$(stat -c %Y "$NORTH_STAR" 2>/dev/null || stat -f %m "$NORTH_STAR" 2>/dev/null)

if [ -n "$FINAL_MTIME" ] && [ -n "$NORTH_MTIME" ]; then
  DIFF=$((FINAL_MTIME - NORTH_MTIME))
  DIFF_ABS=${DIFF#-}
  # Warn if difference > 1 hour (3600 seconds)
  if [ $DIFF_ABS -gt 3600 ]; then
    NEWER=$([ $DIFF -gt 0 ] && echo "FINAL_DECISION.md" || echo "00-north-star.md")
    OLDER=$([ $DIFF -gt 0 ] && echo "00-north-star.md" || echo "FINAL_DECISION.md")
    echo ""
    echo -e "${YELLOW}⚠${NC}  $NEWER was modified $(($DIFF_ABS / 60)) min more recently than $OLDER"
    echo "   If you updated one, update the other. They are supposed to stay in sync."
  fi
fi

# ============================================================================
# 5. Tenant-only revenue anchor
# ============================================================================
TENANT_ONLY_FINAL=$(grep -c "Landlord.*₱0\|landlord side.*free\|LANDLORD.*FREE" "$FINAL_DECISION" || echo 0)
TENANT_ONLY_NORTH=$(grep -c "Landlord.*₱0\|landlord side.*free\|LANDLORD.*FREE" "$NORTH_STAR" || echo 0)

echo ""
if [ "$TENANT_ONLY_FINAL" -gt 0 ] && [ "$TENANT_ONLY_NORTH" -gt 0 ]; then
  echo -e "${GREEN}✓${NC} Both docs assert landlord-free revenue model"
else
  echo -e "${RED}✗${NC} Landlord-free revenue model not present in both docs"
  echo "   FINAL_DECISION.md: $TENANT_ONLY_FINAL mentions"
  echo "   00-north-star.md:  $TENANT_ONLY_NORTH mentions"
  FAILED=1
fi

# ============================================================================
# Summary
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 1 ]; then
  echo -e "${RED}✗ SYNC CHECK FAILED${NC}"
  echo ""
  echo "  The canonical docs (FINAL_DECISION.md and context/00-north-star.md) have drifted."
  echo "  Reconcile them manually. They should agree on:"
  echo "    - The validation gate ('30+ paid reservations in 14 days')"
  echo "    - The kill list (all 19 items)"
  echo "    - The revenue model (tenant pays ₱499 Verified Placement, landlord pays ₱0 forever)"
  echo ""
  exit 1
fi

echo -e "${GREEN}✓ Canonical docs in sync${NC}"
exit 0
