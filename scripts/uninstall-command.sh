#!/usr/bin/env bash

# Uninstallation script for /init-deep command

set -e

echo "🗑️  Uninstalling /init-deep command..."
echo ""

TARGET_DIR="$HOME/.config/opencode/command"
COMMAND_FILE="$TARGET_DIR/init-deep.md"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SCRIPTS_DIR="$PLUGIN_DIR/scripts"
SCRIPT_FILE="$SCRIPTS_DIR/init-deep.sh"

# Check if command exists
if [ -f "$COMMAND_FILE" ]; then
    rm "$COMMAND_FILE"
    echo "✓ Removed: $COMMAND_FILE"
fi

# Remove the implementation script
if [ -f "$SCRIPT_FILE" ]; then
    rm "$SCRIPT_FILE"
    echo "✓ Removed: $SCRIPT_FILE"
fi

# Remove empty directories
if [ -d "$TARGET_DIR" ]; then
    if [ -z "$(ls -A "$TARGET_DIR")" ]; then
        rmdir "$TARGET_DIR" 2>/dev/null || true
        echo "✓ Removed empty directory: $TARGET_DIR"
    fi
fi

echo ""
echo "✨ Uninstallation complete!"
