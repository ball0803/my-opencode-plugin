---
name: 'package-research'
description: 'Research package dependencies, find repositories, and explore package ecosystems'
license: 'MIT'
mcp:
  octocode:
    type: 'remote'
    url: 'https://octocode.com/mcp'
---

# Package Research Skill

## What I Do

I research package dependencies, find package repositories, and explore package ecosystems. I can:

- Find package repositories on GitHub
- Explore package structure and dependencies
- Search for alternative packages
- Analyze package popularity and usage
- Find package documentation and examples

## When to Use Me

Use me when you need to:

- Find the repository for a package
- Research package alternatives
- Explore package structure and code
- Understand package dependencies
- Find package documentation
- Analyze package popularity

## How I Work

I use Octocode MCP tools to search for packages and explore repositories:

### Find Package Repository

```bash
# Search for NPM package
mcp(mcp_name="octocode", tool_name="packageSearch", arguments='{"queries": [{"mainResearchGoal": "Find React package", "researchGoal": "Locate React repository", "reasoning": "Need to explore React source code", "name": "react", "ecosystem": "npm"}]}')

# Search for Python package
mcp(mcp_name="octocode", tool_name="packageSearch", arguments='{"queries": [{"mainResearchGoal": "Find requests package", "researchGoal": "Locate requests repository", "reasoning": "Need to understand requests implementation", "name": "requests", "ecosystem": "python"}]}')
```

### Explore Package Structure

```bash
# View repository structure
mcp(mcp_name="octocode", tool_name="githubViewRepoStructure", arguments='{"queries": [{"mainResearchGoal": "Explore React structure", "researchGoal": "Understand React codebase", "reasoning": "Need to find React implementation details", "owner": "facebook", "repo": "react", "branch": "main", "path": "", "depth": 1}]}')

# Drill into specific directory
mcp(mcp_name="octocode", tool_name="githubViewRepoStructure", arguments='{"queries": [{"mainResearchGoal": "Explore React packages", "researchGoal": "Find React implementation", "reasoning": "Need to understand React internals", "owner": "facebook", "repo": "react", "branch": "main", "path": "packages", "depth": 2}]}')
```

### Search Package Code

```bash
# Search for specific code patterns
mcp(mcp_name="octocode", tool_name="githubSearchCode", arguments='{"queries": [{"mainResearchGoal": "Find useState implementation", "researchGoal": "Understand useState code", "reasoning": "Need to see how useState works internally", "keywordsToSearch": ["useState"], "owner": "facebook", "repo": "react", "path": "packages/react", "match": "file"}]}')

# Search with multiple keywords
mcp(mcp_name="octocode", tool_name="githubSearchCode", arguments='{"queries": [{"mainResearchGoal": "Find hook implementations", "researchGoal": "Explore React hooks", "reasoning": "Need to understand hook patterns", "keywordsToSearch": ["useEffect", "useState", "useReducer"], "owner": "facebook", "repo": "react", "path": "packages/react-hooks", "match": "file"}]}')
```

### Read Package Files

```bash
# Read specific file
mcp(mcp_name="octocode", tool_name="githubGetFileContent", arguments='{"queries": [{"mainResearchGoal": "Read useState source", "researchGoal": "Understand useState implementation", "reasoning": "Need to see useState code", "owner": "facebook", "repo": "react", "path": "packages/react/src/ReactHooks.js", "branch": "main", "fullContent": true}]}')

# Read specific lines
mcp(mcp_name="octocode", tool_name="githubGetFileContent", arguments='{"queries": [{"mainResearchGoal": "Read useState function", "researchGoal": "Understand useState signature", "reasoning": "Need to see useState definition", "owner": "facebook", "repo": "react", "path": "packages/react/src/ReactHooks.js", "branch": "main", "startLine": 100, "endLine": 150}]}')
```

## Best Practices

1. **Start with package search**: Always find the package repository first
2. **Explore structure**: Understand the codebase layout before diving in
3. **Search broadly**: Use multiple keywords to find relevant code
4. **Read documentation**: Check README and docs before exploring code
5. **Look at tests**: Tests often show usage patterns
6. **Check recent changes**: Look at recent commits for active development
7. **Compare alternatives**: Research multiple packages for comparison

## Common Patterns

### Research Package Implementation

```bash
# Find package repository
mcp(mcp_name="octocode", tool_name="packageSearch", arguments='{"queries": [{"mainResearchGoal": "Find lodash package", "researchGoal": "Locate lodash repo", "reasoning": "Need to understand lodash internals", "name": "lodash", "ecosystem": "npm"}]}')

# Explore structure
mcp(mcp_name="octocode", tool_name="githubViewRepoStructure", arguments='{"queries": [{"mainResearchGoal": "Explore lodash structure", "researchGoal": "Understand lodash codebase", "reasoning": "Need to find lodash implementation", "owner": "lodash", "repo": "lodash", "branch": "master", "path": "", "depth": 1}]}')

# Search for specific function
mcp(mcp_name="octocode", tool_name="githubSearchCode", arguments='{"queries": [{"mainResearchGoal": "Find debounce implementation", "researchGoal": "Understand debounce code", "reasoning": "Need to see debounce logic", "keywordsToSearch": ["debounce"], "owner": "lodash", "repo": "lodash", "path": "lodash", "match": "file"}]}')
```

### Compare Package Alternatives

```bash
# Search for alternative packages
mcp(mcp_name="octocode", tool_name="githubSearchRepositories", arguments='{"queries": [{"mainResearchGoal": "Find date library alternatives", "researchGoal": "Compare date libraries", "reasoning": "Need to choose best date library", "keywordsToSearch": ["date", "library"], "topicsToSearch": ["javascript", "date"], "stars": ">1000"}]}')

# Explore each alternative
mcp(mcp_name="octocode", tool_name="githubViewRepoStructure", arguments='{"queries": [{"mainResearchGoal": "Explore date-fns", "researchGoal": "Understand date-fns structure", "reasoning": "Evaluating date-fns as alternative", "owner": "date-fns", "repo": "date-fns", "branch": "main", "path": "", "depth": 1}]}')
```

### Find Package Dependencies

```bash
# View package.json
mcp(mcp_name="octocode", tool_name="githubGetFileContent", arguments='{"queries": [{"mainResearchGoal": "Read Next.js dependencies", "researchGoal": "Understand Next.js deps", "reasoning": "Need to see what Next.js uses", "owner": "vercel", "repo": "next.js", "path": "package.json", "branch": "main", "fullContent": true}]}')

# Search for dependency usage
mcp(mcp_name="octocode", tool_name="githubSearchCode", arguments='{"queries": [{"mainResearchGoal": "Find react-dom usage", "researchGoal": "See how react-dom is used", "reasoning": "Need to understand integration", "keywordsToSearch": ["react-dom"], "owner": "vercel", "repo": "next.js", "path": "packages", "match": "file"}]}')
```

## Limitations

1. **Private packages**: Cannot access private repositories
2. **Rate limits**: GitHub API has rate limits
3. **Large repositories**: Very large codebases may be slow to explore
4. **Complex queries**: Complex search queries may return too many results
5. **Access restrictions**: Some repositories may have access restrictions
6. **Archived projects**: Archived repositories may not be maintained
7. **Monorepos**: Large monorepos can be difficult to navigate

## Related Skills

- **official-docs**: For official package documentation
- **implementation-examples**: For code examples using packages
- **codebase-analysis**: For deep repository exploration
- **general-research**: For finding package reviews and comparisons
