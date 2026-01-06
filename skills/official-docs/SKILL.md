---
name: official-docs
description: Find authoritative documentation, API references, and best practices for libraries and frameworks
license: MIT
compatibility: opencode>=1.0
metadata:
  audience: developers
  workflow: research
---

## What I do

- Retrieve official documentation from Context7
- Find API references and implementation guidelines
- Identify best practices and recommended patterns
- Locate library-specific tutorials and guides
- Handle version-specific documentation requests

## When to use me

Use this skill when you need:

- Official documentation for a library/framework
- API reference details
- Best practices and recommended usage patterns
- Authoritative implementation guidance
- Version-specific documentation or features

Ask clarifying questions if:

- The library name is ambiguous (multiple possible matches)
- Multiple versions exist and you need a specific one
- You're unsure which tool or framework to use
- The documentation might be in an unusual location

## How I work

### Step 1: Resolve Library Identifier

First, I identify the correct library using Context7's library resolution:

```bash
mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "react"}')
```

This returns multiple matches with metadata including:

- Context7-compatible library ID
- Description
- Number of code snippets available
- Source reputation (High/Medium/Low)
- Available versions

### Step 2: Retrieve Documentation

Once I have the correct library ID, I fetch the documentation:

```bash
mcp(mcp_name="context7", tool_name="get-library-docs", arguments='{"libraryId": "/facebook/react", "query": "useEffect cleanup"}')
```

I can optionally:

- Filter by specific topic
- Limit response size with tokens parameter
- Specify a particular version

### Step 3: Cross-Reference with Examples (Optional)

For implementation patterns, I combine with GitHub research:

```bash
# Get official docs
mcp(mcp_name="context7", tool_name="get-library-docs", arguments='{"libraryId": "/vercel/next.js", "query": "data fetching"}')

# Find real implementations
mcp(mcp_name="gh_grep", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["getServerSideProps"], "owner": "vercel", "repo": "next.js", "path": "examples"}]}')
```

### Step 4: Handle Version-Specific Requests

When version-specific documentation is needed:

```bash
# Check available versions
mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "next.js"}')

# Query specific version
mcp(mcp_name="context7", tool_name="get-library-docs", arguments='{"libraryId": "/vercel/next.js/v14.0.0", "query": "app router"}')
```

## Best Practices

1. **Start with official sources** - Always begin with Context7 for authoritative information
2. **Specify versions explicitly** - When working with specific versions, include the version number
3. **Combine with examples** - Use Context7 for theory and gh_grep/octocode for practical implementations
4. **Check multiple sources** - Cross-reference documentation with real implementations when possible
5. **Handle ambiguity proactively** - When library names are unclear, ask for clarification before proceeding
6. **Use topic filtering** - Narrow down documentation with specific query parameters
7. **Respect token limits** - Use the tokens parameter to control response size for large topics

## Common Patterns

### Finding API Documentation

```bash
# Resolve library and get docs
mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "express"}')
mcp(mcp_name="context7", tool_name="get-library-docs", arguments='{"libraryId": "/expressjs/express", "query": "router methods"}')
```

### Best Practices Lookup

```bash
# Get official best practices
mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "react"}')
mcp(mcp_name="context7", tool_name="get-library-docs", arguments='{"libraryId": "/facebook/react", "query": "performance optimization"}')
```

### Version-Specific Documentation

```bash
# Check available versions first
mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "typescript"}')

# Query specific version
mcp(mcp_name="context7", tool_name="get-library-docs", arguments='{"libraryId": "/microsoft/TypeScript/v5.0", "query": "template literal types"}')
```

### Migration Guides

```bash
# Find migration documentation
mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "next.js"}')
mcp(mcp_name="context7", tool_name="get-library-docs", arguments='{"libraryId": "/vercel/next.js", "query": "migrating from pages to app router"}')
```

## Limitations

- **New or niche libraries** - Context7 may not have documentation for very new or obscure libraries
- **Multiple documentation sources** - Some libraries have multiple official documentation sources
- **Version availability** - Not all versions may have documentation available
- **Documentation quality** - Quality varies by library maintainer and completeness
- **Code examples** - Documentation may have examples but not always production-ready implementations
- **Private libraries** - Cannot retrieve documentation for private or unpublished libraries

## Related Skills

- **implementation-examples**: For finding real-world code implementations
- **codebase-analysis**: For exploring repository structure and patterns
- **general-research**: For finding tutorials and general information
