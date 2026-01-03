#!/usr/bin/env bash

# Uninstallation script for /init-deep command

set -e

echo "🗑️  Uninstalling /init-deep command..."
echo ""

TARGET_DIR="$HOME/.config/opencode/command"
COMMAND_FILE="$TARGET_DIR/init-deep.md"

# Check if command exists
if [ -f "$COMMAND_FILE" ]; then
    rm "$COMMAND_FILE"
    echo "✓ Removed: $COMMAND_FILE"
    
    # Remove empty directories
    if [ -d "$TARGET_DIR" ]; then
        if [ -z "$(ls -A "$TARGET_DIR")" ]; then
            rmdir "$TARGET_DIR" 2>/dev/null || true
            echo "✓ Removed empty directory: $TARGET_DIR"
        fi
    fi
    
    echo ""
    echo "✨ Uninstallation complete!"
else
    echo "✗ Command not found: $COMMAND_FILE"
    echo "  The command may not be installed."
    exit 1
fi
