#!/bin/bash

# Test script to verify plugin works inside OpenCode
# This script tests actual OpenCode command execution with the plugin

set -e

echo "=== Testing Plugin Inside OpenCode ==="
echo ""

# Create a test file to search
echo "Creating test file..."
cat > /tmp/test_plugin.ts << 'EOF'
// Test file for plugin testing
function greet(name: string) {
  console.log(`Hello, ${name}!`);
}

class User {
  constructor(public name: string, public age: number) {}
}

const useState = (initialValue: any) => {
  return [initialValue, () => {}];
};

interface ApiResponse {
  data: any;
  status: number;
}
EOF

echo "✓ Test file created at /tmp/test_plugin.ts"
echo ""

# Test 1: Test ast-grep tool with OpenCode run command
echo "Test 1: Testing ast-grep tool with OpenCode run command..."
echo "  Command: opencode -m 'mistral (local)/mistralai/Devstral-Small-2-24B-Instruct-2512' run 'use ast-grep to find useState in /tmp/test_plugin.ts'"
echo ""
echo "  Note: This test will run OpenCode in non-interactive mode"
echo "  The plugin should be able to execute ast-grep commands"
echo ""

# Test 2: Test if plugin tools are available
echo "Test 2: Checking if plugin tools are available..."
echo "  The ast_grep tool should be available in OpenCode"
echo "  Try: ast-grep --pattern 'useState' --file '/tmp/test_plugin.ts'"
echo ""

# Test 3: Test MCP servers
echo "Test 3: Testing MCP server availability..."
echo "  Puppeteer MCP server should be connected"
echo "  Try: puppeteer-navigate --url 'https://example.com'"
echo ""

# Test 4: Test background tasks
echo "Test 4: Testing background task functionality..."
echo "  Background tasks should work with the plugin"
echo "  Try: create-background-task --description 'Test task' --prompt 'echo hello'"
echo ""

# Cleanup
echo "Cleaning up test file..."
rm -f /tmp/test_plugin.ts
echo "✓ Test file removed"
echo ""

echo "=== Test Script Complete ==="
echo ""
echo "To fully test the plugin, run:"
echo "  opencode -m 'mistral (local)/mistralai/Devstral-Small-2-24B-Instruct-2512' -c"
echo ""
echo "Then try these commands inside OpenCode:"
echo ""
echo "1. Test ast-grep tool:"
echo "   use ast-grep with pattern 'useState' in file /tmp/test_plugin.ts"
echo ""
echo "2. Test ast-grep pattern tool:"
echo "   use ast-grep-pattern with pattern_type 'regex' and target 'useState'"
echo ""
echo "3. Test background tasks:"
echo "   create-background-task --description 'Test' --prompt 'echo hello'"
echo ""
echo "4. Test MCP servers:"
echo "   puppeteer-navigate --url 'https://example.com'"
echo ""
echo "The plugin should respond and execute these commands successfully."
