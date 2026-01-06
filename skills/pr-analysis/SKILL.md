---
name: 'pr-analysis'
description: 'Analyze pull requests, review changes, and understand implementation history'
license: 'MIT'
mcp:
  octocode:
    type: 'remote'
    url: 'https://octocode.com/mcp'
---

# Pull Request Analysis Skill

## What I Do

I analyze pull requests, review changes, and understand implementation history. I can:

- Find pull requests by various criteria
- Read PR descriptions and discussions
- View changes and diffs
- Analyze commit history
- Understand implementation decisions

## When to Use Me

Use me when you need to:

- Understand how a feature was implemented
- Review changes in a specific PR
- Find PRs related to a specific issue
- Analyze code review discussions
- Understand implementation history
- Find examples of good PR practices

## How I Work

I use Octocode MCP tools to search for and analyze pull requests:

### Find Pull Requests

```bash
# Search for open PRs
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "Find React PRs", "researchGoal": "Locate React pull requests", "reasoning": "Need to understand React development", "owner": "facebook", "repo": "react", "state": "open", "limit": 10}]}')

# Search for merged PRs
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "Find merged hooks PRs", "researchGoal": "Locate hooks implementation PRs", "reasoning": "Need to see hooks development", "owner": "facebook", "repo": "react", "state": "closed", "merged": true, "keywordsToSearch": ["hooks"], "limit": 5}]}')
```

### Get PR Metadata

```bash
# Get specific PR details
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "Get PR #123 details", "researchGoal": "Understand PR #123", "reasoning": "Need to see PR metadata", "owner": "facebook", "repo": "react", "prNumber": 123, "type": "metadata"}]}')

# Search with specific criteria
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "Find authentication PRs", "researchGoal": "Locate auth-related PRs", "reasoning": "Need to understand auth implementation", "owner": "vercel", "repo": "next.js", "state": "closed", "merged": true, "label": "enhancement", "limit": 5}]}')
```

### View PR Changes

```bash
# Get partial content with specific files
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "View PR changes", "researchGoal": "See what changed in PR", "reasoning": "Need to review implementation", "owner": "facebook", "repo": "react", "prNumber": 123, "type": "partialContent", "partialContentMetadata": [{"file": "packages/react/src/ReactHooks.js"}]}]}')

# Get full content (for small PRs)
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "View full PR content", "researchGoal": "See all changes", "reasoning": "Need complete diff", "owner": "facebook", "repo": "react", "prNumber": 123, "type": "fullContent"}]}')
```

### Analyze PR History

```bash
# Find PRs by author
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "Find PRs by author", "researchGoal": "See author contributions", "reasoning": "Need to understand author's work", "owner": "facebook", "repo": "react", "author": "gaearon", "limit": 10}]}')

# Find PRs by label
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "Find bug fix PRs", "researchGoal": "Locate bug fixes", "reasoning": "Need to see bug fix patterns", "owner": "facebook", "repo": "react", "label": "bug", "state": "closed", "merged": true, "limit": 10}]}')
```

## Best Practices

1. **Read descriptions**: Always read PR descriptions for context
2. **Review discussions**: Check comments for important context
3. **Look at changes**: Examine the actual code changes
4. **Check tests**: Look for test additions or modifications
5. **Review labels**: Labels often indicate PR type and importance
6. **Analyze commits**: Multiple commits may show iterative development
7. **Check reviewers**: Reviewers' feedback can be valuable

## Common Patterns

### Understand Feature Implementation

```bash
# Find PR that added a feature
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "Find useEffect PR", "researchGoal": "Locate useEffect implementation", "reasoning": "Need to understand useEffect history", "owner": "facebook", "repo": "react", "keywordsToSearch": ["useEffect"], "state": "closed", "merged": true, "limit": 5}]}')

# Get PR details
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "Get PR details", "researchGoal": "Understand implementation", "reasoning": "Need complete PR info", "owner": "facebook", "repo": "react", "prNumber": 12345, "type": "metadata"}]}')

# View changes
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "View changes", "researchGoal": "See implementation details", "reasoning": "Need to review code", "owner": "facebook", "repo": "react", "prNumber": 12345, "type": "partialContent", "partialContentMetadata": [{"file": "packages/react/src/ReactHooks.js"}]}]}')
```

### Review Bug Fixes

```bash
# Find bug fix PRs
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "Find React bug fixes", "researchGoal": "Locate bug fix PRs", "reasoning": "Need to understand bug fix patterns", "owner": "facebook", "repo": "react", "label": "bug", "state": "closed", "merged": true, "limit": 10}]}')

# Analyze specific bug fix
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "Get bug fix details", "researchGoal": "Understand bug fix", "reasoning": "Need to see fix implementation", "owner": "facebook", "repo": "react", "prNumber": 67890, "type": "fullContent"}]}')
```

### Analyze Performance Improvements

```bash
# Find performance PRs
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "Find performance PRs", "researchGoal": "Locate performance improvements", "reasoning": "Need to understand optimization patterns", "owner": "facebook", "repo": "react", "label": ["performance", "enhancement"], "state": "closed", "merged": true, "limit": 10}]}')

# View performance changes
mcp(mcp_name="octocode", tool_name="githubSearchPullRequests", arguments='{"queries": [{"mainResearchGoal": "View performance changes", "researchGoal": "See optimization details", "reasoning": "Need to understand performance improvements", "owner": "facebook", "repo": "react", "prNumber": 11111, "type": "partialContent", "partialContentMetadata": [{"file": "packages/react/src/ReactHooks.js"}]}]}')
```

## Limitations

1. **Large PRs**: Very large PRs may be difficult to analyze
2. **Complex changes**: Complex refactoring may be hard to understand
3. **Context missing**: Some context may be in external discussions
4. **Access restrictions**: Some PRs may be restricted
5. **Closed repositories**: Cannot access private repository PRs
6. **Rate limits**: GitHub API has rate limits
7. **Historical PRs**: Very old PRs may have different formats

## Related Skills

- **codebase-analysis**: For exploring the codebase structure
- **implementation-examples**: For finding code examples
- **official-docs**: For understanding the intended behavior
- **general-research**: For finding discussions and articles about PRs
