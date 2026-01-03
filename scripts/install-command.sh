#!/usr/bin/env bash

# Installation script for /init-deep command

set -e

echo "🚀 Installing /init-deep command for my-opencode-plugin..."
echo ""

# Get the plugin directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
COMMAND_DIR="$PLUGIN_DIR/commands"
TARGET_DIR="$HOME/.config/opencode/command"

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"
echo "✓ Created target directory: $TARGET_DIR"

# Copy command file
COMMAND_FILE="$COMMAND_DIR/init-deep.md"
if [ -f "$COMMAND_FILE" ]; then
    cp "$COMMAND_FILE" "$TARGET_DIR/"
    echo "✓ Installed command: $TARGET_DIR/init-deep.md"
else
    echo "✗ Error: Command file not found: $COMMAND_FILE"
    exit 1
fi

# Verify installation
echo ""
echo "🔍 Verifying installation..."
if [ -f "$TARGET_DIR/init-deep.md" ]; then
    echo "✓ Command successfully installed!"
    echo ""
    echo "📋 Command Details:"
    echo "  Name: /init-deep"
    echo "  Description: Generate hierarchical AGENTS.md files"
    echo "  Location: $TARGET_DIR/init-deep.md"
    echo ""
    echo "🚀 Usage:"
    echo "  Type '/init-deep' in OpenCode to use the command"
    echo ""
    echo "✨ Installation complete!"
else
    echo "✗ Installation verification failed"
    exit 1
fi
