---
name: implementation-examples
description: Find real-world code examples, usage patterns, and implementation references from GitHub repositories
license: MIT
compatibility: opencode>=1.0
metadata:
  audience: developers
  workflow: research
---

## What I do

- Search GitHub repositories for specific code patterns
- Find real-world implementation examples
- Explore repository structure for context
- Analyze implementation patterns across projects
- Compare different approaches to similar problems

## When to use me

Use this skill when you need:
- Real-world code examples for a specific feature
- Usage patterns from production code
- Implementation references for APIs or frameworks
- Best practices demonstrated in actual projects
- Examples of how to solve specific problems

Ask clarifying questions if:
- The search query could be ambiguous
- You need examples from specific repositories
- You're looking for a particular coding style or pattern
- The examples should be from a specific time period

## How I work

### Step 1: Search for Code Patterns

Search GitHub repositories with specific queries:

```bash
# Find useState examples in React
mcp(mcp_name="gh_grep", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["useState"], "owner": "facebook", "repo": "react", "path": "examples"}]}')
```

Key parameters:
- **keywordsToSearch**: The code pattern to find
- **owner/repo**: Specific repository to search
- **path**: Directory path to limit search
- **match**: "file" or "path" (search within files or paths)

### Step 2: Explore Repository Structure

Get context by viewing repository structure:

```bash
mcp(mcp_name="octocode", tool_name="githubViewRepoStructure", arguments='{"queries": [{"owner": "vercel", "repo": "next.js", "path": "examples", "depth": 2}]}')
```

### Step 3: Analyze Implementation Patterns

Search for specific implementation patterns:

```bash
# Find authentication implementations
mcp(mcp_name="gh_grep", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["NextAuth"], "owner": "nextauthjs", "repo": "next-auth", "path": "examples"}]}')
```

### Step 4: Compare Multiple Implementations

Search across multiple repositories:

```bash
# Compare different state management approaches
mcp(mcp_name="gh_grep", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["useReducer"], "owner": "facebook", "repo": "react"}, {"keywordsToSearch": ["useReducer"], "owner": "reduxjs", "repo": "react-redux"}]}')
```

## Best Practices

1. **Be specific with queries** - Use precise keywords for better results
2. **Include repository context** - Specify owner/repo when you know where to look
3. **Limit search paths** - Use path parameter to narrow down search location
4. **Combine with official docs** - Use official-docs skill first, then find examples
5. **Verify examples** - Check if examples are up-to-date and maintained
6. **Look at multiple implementations** - Compare different approaches
7. **Respect repository size limits** - Large repositories may have search limitations

## Common Patterns

### Framework-Specific Implementations

```bash
# Find React hook examples
mcp(mcp_name="gh_grep", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["useEffect"], "owner": "facebook", "repo": "react", "path": "examples"}]}')
```

### API Usage Examples

```bash
# Find fetch API usage
mcp(mcp_name="gh_grep", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["fetch.*async"], "owner": "vercel", "repo": "next.js"}]}')
```

### Authentication Patterns

```bash
# Find JWT authentication examples
mcp(mcp_name="gh_grep", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["JWT"], "owner": "nextauthjs", "repo": "next-auth"}]}')
```

### State Management

```bash
# Find Context API usage
mcp(mcp_name="gh_grep", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["createContext"], "owner": "facebook", "repo": "react"}]}')
```

## Limitations

- **Private repositories** - Cannot search private or restricted repositories
- **Search quality** - Results depend on query specificity and repository size
- **Rate limits** - GitHub API has rate limits that may affect search
- **Archived repositories** - May not be searchable or may have outdated code
- **Search depth** - Very large repositories may have limited search depth
- **Code quality** - Examples may not always follow best practices

## Related Skills

- **official-docs**: For authoritative documentation and best practices
- **codebase-analysis**: For deep repository exploration and architecture
- **pr-analysis**: For understanding design decisions through pull requests
