#!/bin/bash

# Skills Verification Script
# Tests that all skills are properly formatted and discoverable

set -e

echo "🔍 Verifying OpenCode Skills..."
echo ""

# Count total skills
echo "📊 Skill Count:"
echo "   Total directories: $(find skills -mindepth 1 -maxdepth 1 -type d | wc -l)"
echo "   Total files: $(find skills -name '*.md' | wc -l)"
echo ""

# Verify new skills
echo "✅ New Skills (with proper format):"
NEW_SKILLS=(
    "official-docs"
    "implementation-examples"
    "codebase-analysis"
    "web-content-extraction"
    "general-research"
    "package-research"
    "pr-analysis"
)

for skill in "${NEW_SKILLS[@]}"; do
    if [ -f "skills/$skill/SKILL.md" ]; then
        echo "   ✓ $skill/SKILL.md"
    else
        echo "   ✗ $skill/SKILL.md (missing)"
    fi
done
echo ""

# Verify README
echo "📖 Documentation:"
if [ -f "skills/README.md" ]; then
    echo "   ✓ skills/README.md exists"
    echo "   ✓ Documentation created"
else
    echo "   ✗ skills/README.md (missing)"
fi
echo ""

# Verify YAML frontmatter
echo "🔍 YAML Frontmatter Validation:"
for skill in "${NEW_SKILLS[@]}"; do
    if grep -q "^---" "skills/$skill/SKILL.md" && grep -q "^name:" "skills/$skill/SKILL.md" && grep -q "^description:" "skills/$skill/SKILL.md"; then
        echo "   ✓ $skill has valid YAML frontmatter"
    else
        echo "   ✗ $skill has invalid YAML frontmatter"
    fi
done
echo ""

# Verify MCP integration
echo "🔌 MCP Integration:"
for skill in "${NEW_SKILLS[@]}"; do
    if grep -q "mcp(mcp_name=" "skills/$skill/SKILL.md"; then
        echo "   ✓ $skill includes MCP tool examples"
    else
        echo "   ✗ $skill missing MCP tool examples"
    fi
done
echo ""

# Verify structure
echo "🏗️ Structure Validation:"
for skill in "${NEW_SKILLS[@]}"; do
    file="skills/$skill/SKILL.md"
    if grep -q "^## What I Do" "$file" && \
       grep -q "^## When to Use Me" "$file" && \
       grep -q "^## How I Work" "$file" && \
       grep -q "^## Best Practices" "$file" && \
       grep -q "^## Common Patterns" "$file" && \
       grep -q "^## Limitations" "$file" && \
       grep -q "^## Related Skills" "$file"; then
        echo "   ✓ $skill has complete structure"
    else
        echo "   ✗ $skill missing sections"
    fi
done
echo ""

# Summary
echo "📈 Summary:"
echo "   Total new skills: ${#NEW_SKILLS[@]}"
echo "   Skills with proper format: $(grep -l "^---" skills/*/SKILL.md 2>/dev/null | wc -l)"
echo "   Skills with MCP examples: $(grep -l "mcp(mcp_name=" skills/*/SKILL.md 2>/dev/null | wc -l)"
echo "   Skills with complete structure: $(grep -l "^## What I Do" skills/*/SKILL.md 2>/dev/null | wc -l)"
echo ""

echo "✨ Verification Complete!"
echo ""
echo "Next Steps:"
echo "   1. Test skill discovery with: skill()"
echo "   2. Load individual skills with: skill(name=\"official-docs\")"
echo "   3. Test MCP integration with actual tool calls"
echo "   4. Update legacy skills to new format"
