---
name: general-research
description: Find tutorials, guides, comparisons, and general information through web search
license: MIT
compatibility: opencode>=1.0
metadata:
  audience: developers
  workflow: research
---

## What I do

- Perform web searches for tutorials and guides
- Find comparisons and reviews of technologies
- Discover blog posts and articles
- Gather general information about new features
- Read content from specific URLs
- Cross-reference with official documentation

## When to use me

Use this skill when you need:
- Tutorials and learning resources
- Comparisons between technologies or frameworks
- Blog posts and articles about specific topics
- General information about new features or trends
- Background research on a technology
- Reviews and opinions from the community

Ask clarifying questions if:
- You need information from a specific time period
- You prefer certain types of sources (official, blog, forum, etc.)
- You need technical depth vs. overview information
- You want to focus on specific aspects of a topic

## How I work

### Step 1: Perform Web Search

```bash
# Search for tutorials
mcp(mcp_name="searxng", tool_name="searxng_web_search", arguments='{"query": "React hooks best practices tutorial", "time_range": "month"}')
```

Key parameters:
- **query**: Your search terms
- **time_range**: "day", "month", or "year" for recent results
- **language**: Language code (e.g., "en", "fr")
- **safesearch**: "0" (none), "1" (moderate), "2" (strict)

### Step 2: Read Specific Content

```bash
mcp(mcp_name="searxng", tool_name="web_url_read", arguments='{"url": "https://react.dev/learn"}')
```

Optional parameters:
- **startChar**: Starting character position
- **maxLength**: Maximum characters to return
- **section**: Extract content under specific heading
- **paragraphRange**: Specific paragraph ranges (e.g., "1-5")
- **readHeadings**: Return only headings

### Step 3: Cross-Reference with Official Docs

```bash
# Search for information
mcp(mcp_name="searxng", tool_name="searxng_web_search", arguments='{"query": "Next.js data fetching patterns"}')

# Verify with official documentation
mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "next.js"}')
mcp(mcp_name="context7", tool_name="get-library-docs", arguments='{"libraryId": "/vercel/next.js", "query": "data fetching"}')
```

### Step 4: Find Implementation Examples

```bash
# Search for tutorials
mcp(mcp_name="searxng", tool_name="searxng_web_search", arguments='{"query": "React useEffect examples"}')

# Find real implementations
mcp(mcp_name="gh_grep", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["useEffect"], "owner": "facebook", "repo": "react"}]}')
```

## Best Practices

1. **Use specific queries** - The more specific your search terms, the better the results
2. **Combine with official sources** - Verify information from tutorials with official documentation
3. **Check multiple sources** - Cross-reference information from different websites
4. **Use time filtering** - For recent information, use time_range parameter
5. **Cite sources** - Always note where information comes from
6. **Verify quality** - Check author credibility and publication date
7. **Respect copyright** - Don't republish content without permission

## Common Patterns

### Tutorial Discovery

```bash
# Find React tutorials
mcp(mcp_name="searxng", tool_name="searxng_web_search", arguments='{"query": "React hooks tutorial for beginners", "time_range": "year"}')
```

### Technology Comparisons

```bash
# Compare Next.js and Nuxt.js
mcp(mcp_name="searxng", tool_name="searxng_web_search", arguments='{"query": "Next.js vs Nuxt.js comparison 2024"}')
```

### Feature Research

```bash
# Research new React features
mcp(mcp_name="searxng", tool_name="searxng_web_search", arguments='{"query": "React 19 new features", "time_range": "month"}')

# Cross-reference with official docs
mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "react"}')
mcp(mcp_name="context7", tool_name="get-library-docs", arguments='{"libraryId": "/facebook/react", "query": "new features"}')
```

### Blog Post Research

```bash
# Find technical blog posts
mcp(mcp_name="searxng", tool_name="searxng_web_search", arguments='{"query": "TypeScript advanced patterns blog", "time_range": "year"}')

# Read specific post
mcp(mcp_name="searxng", tool_name="web_url_read", arguments='{"url": "https://blog.example.com/typescript-patterns"}')
```

## Limitations

- **Source quality** - Web search results vary in quality
- **Bias** - Some sources may have biases or opinions
- **Outdated information** - Tutorials may be outdated
- **Paywalls** - Some content may be behind paywalls
- **Accuracy** - Information may need verification from official sources
- **Copyright** - Content may be copyrighted and not freely usable
- **Privacy** - Some websites may track search activity

## Related Skills

- **official-docs**: For authoritative, up-to-date documentation
- **implementation-examples**: For real-world code implementations
- **codebase-analysis**: For deep repository exploration
