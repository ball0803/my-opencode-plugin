---
name: codebase-analysis
description: Understand and analyze codebases, architectures, and design patterns through repository exploration
license: MIT
compatibility: opencode>=1.0
metadata:
  audience: developers
  workflow: research
---

## What I do

- Explore repository structure and organization
- Analyze architecture and design patterns
- Trace logic across multiple files
- Research migration patterns between versions
- Compare different implementations or approaches

## When to use me

Use this skill when you need:
- To understand a complex codebase structure
- To analyze architecture and design decisions
- To trace how features are implemented across files
- To research how a library or framework evolved
- To compare different implementations of similar functionality

Ask clarifying questions if:
- You need to focus on specific areas of the codebase
- You're looking for particular design patterns
- You need to understand the evolution of specific features
- You want to compare multiple repositories

## How I work

### Step 1: View Repository Structure

Start with a high-level overview:

```bash
# View root structure
mcp(mcp_name="octocode", tool_name="githubViewRepoStructure", arguments='{"queries": [{"owner": "vercel", "repo": "next.js", "path": "", "depth": 1}]}')
```

### Step 2: Drill Down into Specific Areas

Explore specific directories in detail:

```bash
# View packages directory
mcp(mcp_name="octocode", tool_name="githubViewRepoStructure", arguments='{"queries": [{"owner": "vercel", "repo": "next.js", "path": "packages/next", "depth": 2}]}')
```

### Step 3: Search for Specific Patterns

Find implementation details:

```bash
# Find app router implementation
mcp(mcp_name="octocode", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["app router"], "owner": "vercel", "repo": "next.js", "path": "packages/next"}]}')
```

### Step 4: Analyze Pull Requests

Understand design decisions:

```bash
# Find enhancement pull requests
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"owner": "vercel", "repo": "next.js", "label": "enhancement", "limit": 10}]}')
```

### Step 5: Compare Implementations

Analyze different approaches:

```bash
# Compare Next.js and Nuxt.js authentication
mcp(mcp_name="octocode", tool_name="githubViewRepoStructure", arguments='{"queries": [{"owner": "vercel", "repo": "next.js", "path": "examples/auth", "depth": 1}, {"owner": "nuxt", "repo": "nuxt.js", "path": "examples/auth", "depth": 1}]}')
```

## Best Practices

1. **Start broad, then narrow** - Begin with high-level structure, then drill down
2. **Follow the code** - Trace implementation paths systematically
3. **Read documentation** - Combine with official-docs for context
4. **Analyze history** - Look at pull requests for design rationale
5. **Compare approaches** - Analyze multiple implementations
6. **Document findings** - Keep notes on architecture decisions
7. **Respect repository size** - Large repositories may take time to analyze

## Common Patterns

### Architecture Analysis

```bash
# Analyze Next.js architecture
mcp(mcp_name="octocode", tool_name="githubViewRepoStructure", arguments='{"queries": [{"owner": "vercel", "repo": "next.js", "path": "", "depth": 1}]}')
mcp(mcp_name="octocode", tool_name="githubViewRepoStructure", arguments='{"queries": [{"owner": "vercel", "repo": "next.js", "path": "packages", "depth": 2}]}')
```

### Migration Research

```bash
# Research React hooks migration
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"owner": "facebook", "repo": "react", "query": "migration", "limit": 10}]}')
```

### Pattern Discovery

```bash
# Find state management patterns
mcp(mcp_name="octocode", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["useReducer"], "owner": "facebook", "repo": "react"}]}')
mcp(mcp_name="octocode", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["Context"], "owner": "facebook", "repo": "react"}]}')
```

### Dependency Analysis

```bash
# Analyze package dependencies
mcp(mcp_name="octocode", tool_name="packageSearch", arguments='{"queries": [{"name": "express", "ecosystem": "npm", "searchLimit": 1}]}')
mcp(mcp_name="octocode", tool_name="githubViewRepoStructure", arguments='{"queries": [{"owner": "expressjs", "repo": "express", "path": "", "depth": 2}]}')
```

## Limitations

- **Private repositories** - Cannot analyze private or restricted codebases
- **Repository size** - Very large repositories may be complex to navigate
- **Search depth** - Deep searches may have limitations
- **Historical data** - Old versions may not be fully available
- **Documentation** - Some architecture decisions may not be documented
- **Rate limits** - GitHub API has rate limits that may affect analysis

## Related Skills

- **official-docs**: For understanding official architecture documentation
- **implementation-examples**: For finding specific implementation patterns
- **pr-analysis**: For deep dive into design decisions and history
