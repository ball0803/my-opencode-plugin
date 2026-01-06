# OpenCode Skills

This directory contains OpenCode skills - specialized knowledge and step-by-step guidance for specific tasks, enhanced with MCP server capabilities.

## Available Skills

### Core Skills (New Format)

1. **official-docs** - Official documentation lookup using Context7
2. **implementation-examples** - Real-world code examples from GitHub
3. **codebase-analysis** - Repository exploration and structure analysis
4. **web-content-extraction** - Web scraping and content extraction with Puppeteer
5. **general-research** - Tutorials, articles, and general information via web search
6. **package-research** - Package dependency research and ecosystem exploration
7. **pr-analysis** - Pull request analysis and implementation history

### Legacy Skills (Old Format)

These skills use the deprecated `<tool>` tag format and should be updated:

- `react-hooks-implementation.md`
- `nextjs-authentication.md`
- `web-scraping-puppeteer.md`
- `github-research-methodology.md`
- `typescript-advanced-patterns.md`

### New Format Skills (Incomplete)

These skills use proper YAML frontmatter but may need updates:

- `react-hooks-best-practices.md`
- `github-research-octocode.md`
- `web-search-integration.md`

## Skill Format

All new skills use YAML frontmatter with this structure:

```markdown
---
name: 'skill-name'
description: 'Brief description of what this skill does'
license: 'MIT'
compatibility: 'opencode>=1.0'
metadata:
  author: 'Your Name'
  version: '1.0.0'
mcp:
  mcp-server-name:
    type: 'remote'
    url: 'https://mcp-server.example.com/mcp'
---

# Skill Title

## What I Do

- Brief list of capabilities

## When to Use Me

- When to use this skill
- What problems it solves

## How I Work

- Step-by-step guide
- MCP tool usage examples
- Code examples with actual tool calls

## Best Practices

- List of best practices
- Tips and tricks

## Common Patterns

- Typical usage scenarios
- Real-world examples

## Limitations

- Known limitations
- Edge cases
- Restrictions

## Related Skills

- Links to related skills
```

## Using Skills

To use a skill, run:

```bash
# List available skills
skill()

# Load a specific skill
skill(name="official-docs")

# Use MCP tools from the skill
mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "react"}')
```

## MCP Integration

Skills integrate with these MCP servers:

- **context7**: Official documentation lookup
- **gh_grep**: GitHub code search
- **octocode**: Repository exploration
- **puppeteer**: Web scraping and browser automation
- **searxng**: Web search

## Creating New Skills

To create a new skill:

1. Create a directory with the skill name
2. Add a `SKILL.md` file with proper YAML frontmatter
3. Follow the format shown in existing skills
4. Include clear examples of MCP tool usage
5. Document best practices and limitations

## Testing Skills

To test skill discovery and MCP integration:

```bash
# Test skill discovery
skill()

# Verify MCP integration
skill(name="official-docs")
skill(name="implementation-examples")
skill(name="codebase-analysis")

# Test MCP tool calls
mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "react"}')
mcp(mcp_name="gh_grep", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["useState"], "owner": "facebook", "repo": "react"}]}')
```

## Skill Discovery Priority

Skills are discovered in this order:

1. **opencode-project** (`.opencode/skills/`)
2. **project** (project root)
3. **opencode** (`~/.config/opencode/skills/`)
4. **user** (user-specific skills)
