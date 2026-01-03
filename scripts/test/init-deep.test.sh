#!/usr/bin/env bash
set -euo pipefail

# Test script for init-deep command

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SCRIPT_PATH="$PROJECT_ROOT/scripts/init-deep.sh"

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

# Test helper functions
assert_file_exists() {
  if [[ ! -f "$1" ]]; then
    echo "FAIL: File $1 does not exist"
    exit 1
  fi
}

assert_contains() {
  if ! grep -q "$2" "$1"; then
    echo "FAIL: $1 does not contain '$2'"
    exit 1
  fi
}

assert_not_contains() {
  if grep -q "$2" "$1"; then
    echo "FAIL: $1 contains '$2' (should not)"
    exit 1
  fi
}

# Test 1: Basic execution
echo "Running test: Basic execution"
cd "$TEST_DIR"
mkdir -p "src/tools" "src/background-agent" "docs"
"$SCRIPT_PATH" > output.txt 2>&1
assert_file_exists "AGENTS.md"
assert_contains "AGENTS.md" "PROJECT KNOWLEDGE BASE"
assert_contains "AGENTS.md" "OVERVIEW"
assert_contains "AGENTS.md" "STRUCTURE"
echo "PASS: Basic execution"

# Test 2: Create new flag
echo "Running test: Create new flag"
cd "$TEST_DIR"
mkdir -p "src/tools"
# Create existing AGENTS.md
echo "# Old AGENTS.md" > AGENTS.md
"$SCRIPT_PATH" --create-new > output.txt 2>&1
# Should have new content
assert_contains "AGENTS.md" "PROJECT KNOWLEDGE BASE"
echo "PASS: Create new flag"

# Test 3: Max depth flag
echo "Running test: Max depth flag"
cd "$TEST_DIR"
# Create deep directory structure
mkdir -p "src/tools/agent-discovery/__tests__"
"$SCRIPT_PATH" --max-depth=2 > output.txt 2>&1
# Should execute without error
assert_file_exists "AGENTS.md"
echo "PASS: Max depth flag"

# Test 4: TodoWrite calls
echo "Running test: TodoWrite calls"
cd "$TEST_DIR"
mkdir -p "src/tools"
"$SCRIPT_PATH" > output.txt 2>&1
assert_contains "output.txt" "TodoWrite"
assert_contains "output.txt" "\"discovery\""
assert_contains "output.txt" "\"scoring\""
assert_contains "output.txt" "\"generate\""
assert_contains "output.txt" "\"review\""
echo "PASS: TodoWrite calls"

# Test 5: Subdirectory AGENTS.md generation
echo "Running test: Subdirectory AGENTS.md generation"
cd "$TEST_DIR"
mkdir -p "src/tools"
"$SCRIPT_PATH" > output.txt 2>&1
assert_file_exists "src/tools/AGENTS.md"
assert_contains "src/tools/AGENTS.md" "TOOLS MODULE KNOWLEDGE BASE"
assert_contains "src/tools/AGENTS.md" "WHERE TO LOOK"
echo "PASS: Subdirectory AGENTS.md generation"

# Test 6: Quality gates
echo "Running test: Quality gates"
cd "$TEST_DIR"
mkdir -p "src/tools"
"$SCRIPT_PATH" > output.txt 2>&1
local root_lines=$(wc -l < AGENTS.md)

# Root should be between 50-150 lines
if [[ $root_lines -lt 50 ]] || [[ $root_lines -gt 150 ]]; then
  echo "FAIL: Root AGENTS.md has $root_lines lines (expected 50-150)"
  exit 1
fi

local sub_lines=$(wc -l < src/tools/AGENTS.md)

# Subdirectory should be between 30-80 lines
if [[ $sub_lines -lt 30 ]] || [[ $sub_lines -gt 80 ]]; then
  echo "FAIL: Subdirectory AGENTS.md has $sub_lines lines (expected 30-80)"
  exit 1
fi

echo "PASS: Quality gates"

# Test 7: Unknown argument handling
echo "Running test: Unknown argument handling"
cd "$TEST_DIR"
mkdir -p "src/tools"
if "$SCRIPT_PATH" --unknown-arg >/dev/null 2>&1; then
  echo "FAIL: Should have failed with unknown argument"
  exit 1
fi
echo "PASS: Unknown argument handling"

# Test 8: Final report
echo "Running test: Final report"
cd "$TEST_DIR"
mkdir -p "src/tools"
"$SCRIPT_PATH" > output.txt 2>&1
assert_contains "output.txt" "=== init-deep Complete ==="
assert_contains "output.txt" "Mode:"
assert_contains "output.txt" "Dirs Analyzed:"
assert_contains "output.txt" "AGENTS.md Created:"
assert_contains "output.txt" "Hierarchy:"
echo "PASS: Final report"

echo ""
echo "All tests passed!"
