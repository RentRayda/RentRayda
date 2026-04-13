#!/bin/bash
# .claude-brain/scripts/install-hooks.sh
# One-time setup: installs git pre-commit hook and makes scripts executable.

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

BRAIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_ROOT="$(cd "$BRAIN_DIR/.." && pwd)"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Installing .claude-brain git hooks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ============================================================================
# 1. Verify we're in a git repo
# ============================================================================
if [ ! -d "$REPO_ROOT/.git" ]; then
  echo -e "${RED}✗ Not a git repo.${NC} Run 'git init' first."
  exit 1
fi

echo -e "${GREEN}✓${NC} Git repo detected at $REPO_ROOT"

# ============================================================================
# 2. Make all scripts executable
# ============================================================================
echo ""
echo "→ Making scripts executable..."

chmod +x "$BRAIN_DIR/scripts/"*.sh
echo -e "${GREEN}✓${NC} chmod +x applied to .claude-brain/scripts/*.sh"

# ============================================================================
# 3. Install pre-commit hook
# ============================================================================
echo ""
echo "→ Installing pre-commit hook..."

HOOK_FILE="$REPO_ROOT/.git/hooks/pre-commit"

if [ -f "$HOOK_FILE" ] && [ ! -L "$HOOK_FILE" ]; then
  echo -e "${YELLOW}⚠${NC} Existing pre-commit hook found at $HOOK_FILE"
  echo "   Backing up to $HOOK_FILE.backup"
  mv "$HOOK_FILE" "$HOOK_FILE.backup"
fi

cat > "$HOOK_FILE" << 'EOF'
#!/bin/bash
# Git pre-commit hook — delegates to .claude-brain/scripts/verify.sh
# Installed by .claude-brain/scripts/install-hooks.sh

VERIFY_SCRIPT="$(git rev-parse --show-toplevel)/.claude-brain/scripts/verify.sh"

if [ -x "$VERIFY_SCRIPT" ]; then
  "$VERIFY_SCRIPT"
  exit $?
else
  echo "⚠ verify.sh not found or not executable at $VERIFY_SCRIPT"
  echo "  Run ./.claude-brain/scripts/install-hooks.sh to fix."
  exit 1
fi
EOF

chmod +x "$HOOK_FILE"
echo -e "${GREEN}✓${NC} Pre-commit hook installed at $HOOK_FILE"

# ============================================================================
# 4. Run initial repo status refresh
# ============================================================================
echo ""
echo "→ Running initial repo status refresh..."

if [ -x "$BRAIN_DIR/scripts/refresh-repo-status.sh" ]; then
  "$BRAIN_DIR/scripts/refresh-repo-status.sh"
else
  echo -e "${YELLOW}⚠${NC} refresh-repo-status.sh not executable. Skipping."
fi

# ============================================================================
# 5. Create initial journal entry if none exists
# ============================================================================
echo ""
echo "→ Checking for initial journal entry..."

JOURNAL_DIR="$BRAIN_DIR/journal"
JOURNAL_COUNT=$(ls -1 "$JOURNAL_DIR" 2>/dev/null | grep -v "^\." | wc -l || echo 0)

if [ "$JOURNAL_COUNT" -eq 0 ]; then
  TODAY=$(date '+%Y-%m-%d')
  INITIAL_ENTRY="$JOURNAL_DIR/${TODAY}-brain-installed.md"
  cat > "$INITIAL_ENTRY" << EOF
# Brain installed — $TODAY

## Goal
Install .claude-brain/ structure and set up Claude Code guardrails.

## What got done
- Created .claude-brain/ directory structure
- Installed git pre-commit hook pointing to verify.sh
- Populated context/ with: north-star, research, repo-status, architecture, brand, business-rules, validation-state, facebook-policy
- Populated decisions/ with: validate-before-build, facebook-page-only, kill-scraping, tenant-only-revenue
- Populated prompts/ with: session-kickoff, pre-commit-check, session-wrap, debug-protocol, claude-reset
- Made all scripts in scripts/ executable
- Ran initial refresh-repo-status.sh

## What's blocked
Nothing blocked. Ready for validation landing page work.

## Next step
Build /fast landing page on rentrayda.com for 14-day validation test.

## Time spent
~30 minutes setup

## Notes
The brain is the canonical memory for this project going forward. Every Claude Code session starts by reading .claude-brain/CLAUDE.md. Every commit is verified by .claude-brain/scripts/verify.sh. If Claude goes off the rails, paste contents of .claude-brain/prompts/claude-reset.md.
EOF
  echo -e "${GREEN}✓${NC} Created initial journal entry at $INITIAL_ENTRY"
else
  echo -e "${GREEN}✓${NC} Journal already has $JOURNAL_COUNT entries"
fi

# ============================================================================
# 6. Create empty scratchpad
# ============================================================================
SCRATCH_FILE="$BRAIN_DIR/scratch/current-session.md"
if [ ! -f "$SCRATCH_FILE" ]; then
  cat > "$SCRATCH_FILE" << 'EOF'
# Current session scratchpad

_Claude Code writes here during the session. Gets archived at session end._

## Goal
(Set at session start)

## Done
- (Nothing yet)

## Next
(Update as you work)
EOF
  echo -e "${GREEN}✓${NC} Created empty scratchpad at $SCRATCH_FILE"
fi

# ============================================================================
# Summary
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Installation complete${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "What you get:"
echo ""
echo "  📁 .claude-brain/              — canonical project memory"
echo "  🔒 .git/hooks/pre-commit       — blocks killed concepts, brand drift, secrets"
echo "  🧠 CLAUDE.md boot protocol     — read first every Claude Code session"
echo ""
echo "Next steps:"
echo ""
echo "  1. Copy FINAL_DECISION.md to your repo root"
echo "  2. Start a Claude Code session"
echo "  3. Paste the contents of .claude-brain/prompts/session-kickoff.md"
echo ""
echo "If Claude goes off the rails mid-session, paste:"
echo "  .claude-brain/prompts/claude-reset.md"
echo ""
echo "To refresh repo status anytime:"
echo "  ./.claude-brain/scripts/refresh-repo-status.sh"
echo ""
echo "To bypass pre-commit hook (not recommended):"
echo "  git commit --no-verify"
echo ""
