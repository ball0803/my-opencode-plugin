#!/bin/bash

# Test Subagent Functionality
# This script tests the subagent tools

set -e

echo "Testing subagent functionality..."
echo

# Test 1: Check if plugin is loaded
echo "1. Checking if plugin is loaded..."
PLUGIN_DIR="$HOME/.config/opencode/plugin/my-opencode-plugin"
if [ -d "$PLUGIN_DIR" ]; then
    echo "   ✓ Plugin directory exists"
else
    echo "   ✗ Plugin not found"
    exit 1
fi

# Test 2: Check if tools are available
echo "2. Checking if tools are available..."
if [ -f "$PLUGIN_DIR/tools/subagent/tools.js" ]; then
    echo "   ✓ Subagent tools exist"
else
    echo "   ✗ Subagent tools not found"
    exit 1
fi

# Test 3: Check if plugin wrapper exists
echo "3. Checking if plugin wrapper exists..."
if [ -f "$PLUGIN_DIR/plugin.js" ]; then
    echo "   ✓ Plugin wrapper exists"
else
    echo "   ✗ Plugin wrapper not found"
    exit 1
fi

# Test 4: Check if dependencies are installed
echo "4. Checking if dependencies are installed..."
DEPS_DIR="$HOME/.config/opencode/node_modules"
if [ -d "$DEPS_DIR" ]; then
    echo "   ✓ Dependencies installed"
else
    echo "   ✗ Dependencies not found"
    exit 1
fi

echo
echo "All checks passed! The plugin is installed correctly."
echo
echo "To test the subagent functionality:"
echo "1. Start OpenCode: opencode"
echo "2. Type: Use subagent with description='Test task', prompt='This is a test', agent='general'"
echo "3. The task will run asynchronously"
echo "4. Use subagent_output to check the result"
