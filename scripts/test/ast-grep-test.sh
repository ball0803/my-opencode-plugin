#!/bin/bash

# Test script for ast-grep tool integration
# This script tests various ast-grep patterns and outputs

set -e

echo "=== Testing ast-grep Tool Integration ==="
echo ""

# Test 1: Check if ast-grep is installed
echo "Test 1: Checking ast-grep installation..."
if command -v ast-grep &> /dev/null; then
    echo "✓ ast-grep is installed"
    ast-grep --version
else
    echo "✗ ast-grep is not installed"
    echo "Please install it with: npm install -g ast-grep"
    exit 1
fi
echo ""

# Test 2: Test basic pattern matching
echo "Test 2: Testing basic pattern matching..."
PATTERN="export function"
FILE="src/tools/ast-grep/tools.ts"

if ast-grep -n "$PATTERN" "$FILE" &> /dev/null; then
    echo "✓ Basic pattern matching works"
    ast-grep -n "$PATTERN" "$FILE" | head -3
else
    echo "✗ Basic pattern matching failed"
fi
echo ""

# Test 3: Test JSON output
echo "Test 3: Testing JSON output..."
JSON_OUTPUT=$(ast-grep -n "$PATTERN" "$FILE" --json 2>&1)

if [[ -n "$JSON_OUTPUT" ]]; then
    echo "✓ JSON output is generated"
    echo "Sample output:"
    echo "$JSON_OUTPUT" | head -5
else
    echo "✗ JSON output is empty"
fi
echo ""

# Test 4: Test with different languages
echo "Test 4: Testing with TypeScript language specification..."
LANG_OUTPUT=$(ast-grep -n --lang typescript "createAstGrepTool" "$FILE" 2>&1)

if [[ -n "$LANG_OUTPUT" ]]; then
    echo "✓ Language-specific search works"
    echo "Sample output:"
    echo "$LANG_OUTPUT" | head -3
else
    echo "✗ Language-specific search failed or returned no matches"
fi
echo ""

# Test 5: Test with include/exclude patterns
echo "Test 5: Testing include/exclude patterns..."
INCLUDE_OUTPUT=$(ast-grep -n --include="*.ts" "export" "src" 2>&1)

if [[ -n "$INCLUDE_OUTPUT" ]]; then
    echo "✓ Include pattern works"
    echo "Found $(echo "$INCLUDE_OUTPUT" | wc -l) matches"
else
    echo "✗ Include pattern failed or returned no matches"
fi
echo ""

# Test 6: Test stream JSON output
echo "Test 6: Testing stream JSON output..."
STREAM_OUTPUT=$(ast-grep -n "export" "src" --json=stream 2>&1 | head -3)

if [[ -n "$STREAM_OUTPUT" ]]; then
    echo "✓ Stream JSON output works"
    echo "Sample output:"
    echo "$STREAM_OUTPUT"
else
    echo "✗ Stream JSON output failed or returned no matches"
fi
echo ""

# Test 7: Test semantic patterns (if supported)
echo "Test 7: Testing semantic pattern matching..."
SEMANTIC_OUTPUT=$(ast-grep -n 'function_declaration(name: "createAstGrepTool")' "$FILE" 2>&1)

if [[ -n "$SEMANTIC_OUTPUT" ]]; then
    echo "✓ Semantic pattern matching works"
    echo "Sample output:"
    echo "$SEMANTIC_OUTPUT" | head -3
else
    echo "✗ Semantic pattern matching failed or returned no matches"
    echo "(This is expected if semantic patterns are not supported in this version)"
fi
echo ""

# Test 8: Test error handling
echo "Test 8: Testing error handling for non-existent file..."
ERROR_OUTPUT=$(ast-grep -n "export" "nonexistent-file.ts" 2>&1)

if [[ "$ERROR_OUTPUT" == *"No matches found"* ]] || [[ "$ERROR_OUTPUT" == *"error"* ]]; then
    echo "✓ Error handling works correctly"
else
    echo "✗ Error handling may not be working as expected"
fi
echo ""

echo "=== Test Summary ==="
echo "All tests completed. Check the output above for any failures."
