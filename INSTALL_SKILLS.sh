#!/bin/bash

# Install OpenCode Skills from my-opencode-plugin
# Follows OpenCode skill discovery pattern

set -e

echo "🔧 Installing OpenCode Skills..."
echo ""

# Create skills directory
SKILLS_DIR="~/.config/opencode/skills/my-opencode-plugin"
mkdir -p "$SKILLS_DIR"

# Copy skills
echo "📁 Copying skills to $SKILLS_DIR"
cp -r skills/* "$SKILLS_DIR/"

echo ""
echo "✅ Skills installed successfully!"
echo ""
echo "Available skills:"
echo "  - official-docs"
echo "  - implementation-examples"
echo "  - codebase-analysis"
echo "  - web-content-extraction"
echo "  - general-research"
echo "  - package-research"
echo "  - pr-analysis"
echo ""
echo "To use a skill, run:"
echo "  skill(name=\"official-docs\")"
echo ""
