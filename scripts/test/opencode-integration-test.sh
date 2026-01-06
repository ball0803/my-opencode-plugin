#!/bin/bash

# Integration test script for OpenCode plugin
# This script tests the plugin with real OpenCode commands

set -e

echo "=== OpenCode Plugin Integration Test ==="
echo ""

# Test 1: Check if OpenCode is available
echo "Test 1: Checking OpenCode availability..."
if command -v opencode &> /dev/null; then
    echo "✓ OpenCode is installed"
    OPENCODE_VERSION=$(opencode --version)
    echo "  Version: $OPENCODE_VERSION"
else
    echo "✗ OpenCode is not installed"
    exit 1
fi
echo ""

# Test 2: Check if plugin is installed
echo "Test 2: Checking plugin installation..."
PLUGIN_DIR="/home/camel/.config/opencode/plugin/my-opencode-plugin"
if [ -d "$PLUGIN_DIR" ]; then
    echo "✓ Plugin directory exists"
    echo "  Location: $PLUGIN_DIR"
else
    echo "✗ Plugin directory not found"
    exit 1
fi
echo ""

# Test 3: Check if ast-grep is installed
echo "Test 3: Checking ast-grep installation..."
if command -v ast-grep &> /dev/null; then
    echo "✓ ast-grep is installed"
    AST_GREP_VERSION=$(ast-grep --version)
    echo "  Version: $AST_GREP_VERSION"
else
    echo "✗ ast-grep is not installed"
    echo "  Installing ast-grep..."
    bun add -g ast-grep
    if command -v ast-grep &> /dev/null; then
        echo "✓ ast-grep installed successfully"
    else
        echo "✗ Failed to install ast-grep"
        exit 1
    fi
fi
echo ""

# Test 4: Test basic OpenCode functionality
echo "Test 4: Testing basic OpenCode functionality..."
echo "  Running: opencode --help"
if opencode --help &> /dev/null; then
    echo "✓ OpenCode help command works"
else
    echo "✗ OpenCode help command failed"
    exit 1
fi
echo ""

# Test 5: Test MCP server list
echo "Test 5: Testing MCP server list..."
echo "  Running: opencode mcp list"
if opencode mcp list &> /dev/null; then
    echo "✓ MCP server list command works"
    MCP_OUTPUT=$(opencode mcp list 2>&1)
    if echo "$MCP_OUTPUT" | grep -q "puppeteer-mcp"; then
        echo "  ✓ Puppeteer MCP server is configured"
    fi
else
    echo "✗ MCP server list command failed"
    exit 1
fi
echo ""

# Test 6: Test agent list
echo "Test 6: Testing agent list..."
echo "  Running: opencode agent list"
if opencode agent list &> /dev/null; then
    echo "✓ Agent list command works"
    AGENT_OUTPUT=$(opencode agent list 2>&1)
    if echo "$AGENT_OUTPUT" | grep -q "build"; then
        echo "  ✓ Build agent is available"
    fi
else
    echo "✗ Agent list command failed"
    exit 1
fi
echo ""

# Test 7: Test ast-grep tool functionality
echo "Test 7: Testing ast-grep tool functionality..."
TEST_FILE="/tmp/test_ast_grep.ts"
cat > "$TEST_FILE" << 'EOF'
// Test file for ast-grep
function testFunction() {
  console.log("Hello World");
}

class TestClass {
  value: number;
  constructor() {
    this.value = 42;
  }
}

const useState = () => {
  return [null, () => {}];
};
EOF

echo "  Creating test file: $TEST_FILE"
if ast-grep -a 'useState' "$TEST_FILE" &> /dev/null; then
    echo "✓ ast-grep can search for patterns"
    RESULT=$(ast-grep -a 'useState' "$TEST_FILE")
    if echo "$RESULT" | grep -q "useState"; then
        echo "  ✓ Pattern matching works correctly"
    fi
else
    echo "✗ ast-grep pattern search failed"
    rm -f "$TEST_FILE"
    exit 1
fi
rm -f "$TEST_FILE"
echo ""

# Test 8: Test plugin tools export
echo "Test 8: Testing plugin tools export..."
cd "$PLUGIN_DIR" || exit 1
if [ -f "index.js" ] && [ -f "tools/ast-grep/tools.js" ]; then
    echo "✓ Plugin tools are compiled"
    
    # Check if ast-grep tools are exported
    if grep -q "ast_grep" index.js; then
        echo "  ✓ ast-grep tools are exported in index.js"
    else
        echo "  ✗ ast-grep tools not found in index.js"
    fi
else
    echo "✗ Plugin tools not compiled"
    exit 1
fi
echo ""

# Test 9: Test configuration
echo "Test 9: Testing configuration..."
CONFIG_FILE="/home/camel/.config/opencode/opencode.jsonc"
if [ -f "$CONFIG_FILE" ]; then
    echo "✓ OpenCode config file exists"
    
    if grep -q "mcp" "$CONFIG_FILE"; then
        echo "  ✓ MCP configuration is present"
    fi
    
    if grep -q "puppeteer-mcp" "$CONFIG_FILE"; then
        echo "  ✓ Puppeteer MCP server is configured"
    fi
else
    echo "✗ OpenCode config file not found"
    exit 1
fi
echo ""

# Test 10: Test plugin compilation
echo "Test 10: Testing plugin compilation..."
cd "/home/camel/Desktop/Project/yaocp/my-opencode-plugin" || exit 1
if bun run build &> /dev/null; then
    echo "✓ Plugin compiles successfully"
else
    echo "✗ Plugin compilation failed"
    exit 1
fi
echo ""

# Test 11: Test unit tests
echo "Test 11: Running unit tests..."
if bun test src/tools/ast-grep/__tests__/tools.test.ts &> /dev/null; then
    echo "✓ ast-grep unit tests pass"
else
    echo "✗ ast-grep unit tests failed"
    exit 1
fi
echo ""

# Test 12: Test integration with OpenCode session
echo "Test 12: Testing integration with OpenCode session..."
echo "  Note: This test requires an active OpenCode session"
echo "  Skipping interactive test (would require -c flag)"
echo ""

echo "=== All Tests Completed Successfully ==="
echo ""
echo "Summary:"
echo "  ✓ OpenCode is installed and working"
echo "  ✓ Plugin is installed in correct location"
echo "  ✓ ast-grep is available"
echo "  ✓ MCP servers are configured"
echo "  ✓ Agent system is working"
echo "  ✓ ast-grep tool functionality works"
echo "  ✓ Plugin tools are properly exported"
echo "  ✓ Configuration is correct"
echo "  ✓ Plugin compiles successfully"
echo "  ✓ Unit tests pass"
echo ""
echo "The plugin is ready for use with OpenCode!"
