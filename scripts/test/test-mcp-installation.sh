#!/usr/bin/env bash

# Test script for MCP installation functionality

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HELPER_SCRIPT="$PROJECT_ROOT/verify/mcp-helper.sh"
INSTALL_SCRIPT="$PROJECT_ROOT/verify/mcp-install.sh"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test counter
tests_passed=0
tests_failed=0

function test() {
    local name="$1"
    local command="$2"
    
    echo -e "${BLUE}Test: $name${NC}"
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓ PASSED${NC}"
        ((tests_passed++))
    else
        echo -e "  ${RED}✗ FAILED${NC}"
        ((tests_failed++))
    fi
    echo ""
}

function test_output() {
    local name="$1"
    local command="$2"
    
    echo -e "${BLUE}Test: $name${NC}"
    
    if output=$("$command" 2>&1); then
        echo -e "  ${GREEN}✓ PASSED${NC}"
        echo "  Output: $output"
        ((tests_passed++))
    else
        echo -e "  ${RED}✗ FAILED${NC}"
        echo "  Error: $output"
        ((tests_failed++))
    fi
    echo ""
}

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║           MCP Installation Test Suite                    ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Test 1: Helper script exists
test "Helper script exists" "[ -f \"$HELPER_SCRIPT\" ]"

# Test 2: Install script exists
test "Install script exists" "[ -f \"$INSTALL_SCRIPT\" ]"

# Test 3: Helper script is executable
test "Helper script is executable" "[ -x \"$HELPER_SCRIPT\" ]"

# Test 4: Install script is executable
test "Install script is executable" "[ -x \"$INSTALL_SCRIPT\" ]"

# Test 5: Helper script list command
test_output "Helper script list command" "$HELPER_SCRIPT list"

# Test 6: Install script status command
test_output "Install script status command" "$INSTALL_SCRIPT status"

# Test 7: Helper script validate command
test "Helper script validate command" "$HELPER_SCRIPT validate"

# Test 8: Install script verify command
test "Install script verify command" "$INSTALL_SCRIPT verify"

# Test 9: Try to add a server
test_output "Add SearXNG server" "$HELPER_SCRIPT add searxng '{"type":"stdio","command":"npx","args":["-y","@modelcontextprotocol/server-searxng@latest","--url","http://searxng.internal"],"disabled":false}'"

# Test 10: List servers after adding
test_output "List servers after adding" "$HELPER_SCRIPT list"

# Test 11: Remove server
test_output "Remove SearXNG server" "$HELPER_SCRIPT remove searxng"

# Test 12: List servers after removing
test_output "List servers after removing" "$HELPER_SCRIPT list"

# Test 13: Backup configuration
test "Backup configuration" "$HELPER_SCRIPT backup"

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                   Test Results                            ║"
echo "╠═══════════════════════════════════════════════════════════════╣"
echo "║  Passed: $tests_passed                                             ║"
echo "║  Failed: $tests_failed                                           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

if [ $tests_failed -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
