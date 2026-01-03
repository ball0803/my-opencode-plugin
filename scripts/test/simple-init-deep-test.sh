#!/usr/bin/env bash
set -euo pipefail

# Simple test for init-deep command

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SCRIPT_PATH="$PROJECT_ROOT/init-deep.sh"

# Test directory
TEST_DIR="$(mktemp -d)"
ORIGINAL_DIR="$(pwd)"

# Cleanup function
cleanup() {
  cd "$ORIGINAL_DIR"
  rm -rf "$TEST_DIR"
}

# Trap cleanup on exit
trap cleanup EXIT

echo "Running basic functionality test..."
cd "$TEST_DIR"
mkdir -p "src/tools" "src/background-agent" "docs"

# Run the script with timeout
timeout 30 "$SCRIPT_PATH" > output.txt 2>&1 || {
  echo "Script execution timed out or failed"
  cat output.txt
  exit 1
}

# Check results
if [[ ! -f "AGENTS.md" ]]; then
  echo "FAIL: AGENTS.md not created"
  exit 1
fi

if ! grep -q "PROJECT KNOWLEDGE BASE" AGENTS.md; then
  echo "FAIL: AGENTS.md doesn't contain expected content"
  exit 1
fi

if ! grep -q "OVERVIEW" AGENTS.md; then
  echo "FAIL: AGENTS.md doesn't contain OVERVIEW section"
  exit 1
fi

if ! grep -q "TodoWrite" output.txt; then
  echo "FAIL: TodoWrite calls not found in output"
  exit 1
fi

if ! grep -q "=== init-deep Complete ===" output.txt; then
  echo "FAIL: Final report not found"
  exit 1
fi

echo "PASS: All basic checks passed"
echo ""
echo "Generated files:"
find . -name "AGENTS.md" -type f | sort
echo ""
echo "Output summary:"
echo "  Root AGENTS.md lines: $(wc -l < AGENTS.md)"
if [[ -f "src/tools/AGENTS.md" ]]; then
  echo "  src/tools/AGENTS.md lines: $(wc -l < src/tools/AGENTS.md)"
fi
