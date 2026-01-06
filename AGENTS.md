# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-06
**Commit:** 5a183e6
**Branch:** master

## OVERVIEW

Background agent orchestration system for OpenCode plugins. Provides async task management, agent discovery, tool integration, and MCP server configuration support.

## STRUCTURE

```
my-opencode-plugin/
├── src/
│   ├── background-agent/  # Task lifecycle and orchestration
│   ├── core/              # Types, utilities
│   ├── tools/             # Custom tools (background task, agent tools)
│   ├── config/            # Configuration system
│   └── plugin-handlers/   # Plugin configuration handlers
├── commands/              # CLI commands
├── docs/                  # Documentation
└── scripts/               # Build and test scripts
    ├── test/              # Test scripts
    │   ├── init-deep.test.sh
    │   ├── jest.config.js
    │   └── run-all-tests.js
    └── verify/            # Verification scripts
        └── mcp-helper.sh  # MCP configuration helper
```

## WHERE TO LOOK

| Task                | Location                          | Notes                             |
| ------------------- | --------------------------------- | --------------------------------- |
| **Add task type**   | `src/background-agent/types.ts`   | Define new task types             |
| **Add tool**        | `src/tools/`                      | Create tool directory             |
| **Add MCP server**  | `src/mcp/`                        | Add new built-in server           |
| **Add MCP config**  | `src/features/mcp-loader/`        | Update loader                     |
| **Add handler**     | `src/plugin-handlers/`            | Create handler file               |
| **Add config**      | `src/config/`                     | Update schema                     |
| **Add docs**        | `docs/`                           | Follow documentation structure    |
| **Add test script** | `scripts/test/`                   | Place test scripts here           |
| **MCP tool**        | `scripts/verify/mcp-helper.sh`    | MCP configuration helper          |
| **MCP install**     | `scripts/verify/mcp-install.sh`   | MCP server installation           |
| **MCP manager**     | Uses OpenCode's native MCP system | No separate implementation needed |
| **MCP loader**      | Uses OpenCode's native MCP system | No separate implementation needed |

## CONVENTIONS

- **bun only**: `bun run`, `bun test`
- **TypeScript**: Strict mode
- **Testing**: Jest with 80% coverage
- **Error handling**: Always try/catch
- **MCP**: Use @modelcontextprotocol/sdk for connections

## ANTI-PATTERNS (THIS PROJECT)

- Direct API calls without validation
- No error handling
- Memory leaks in background tasks
- High complexity in tools
- MCP connections without cleanup

## CODE STYLE GUIDELINES

### Imports

- Always use absolute imports from `src/`
- Group imports in this order:
  1. Node.js built-in modules
  2. Third-party libraries
  3. Internal modules (relative paths)
- Avoid wildcard imports (`import * as ...`)

### Formatting

- Use 2 spaces for indentation
- Maximum line length: 80 characters
- Place opening braces on the same line
- Use semicolons at the end of statements
- Use single quotes for strings

### Types

- Use TypeScript strict mode
- Prefer interfaces over types for object shapes
- Use type aliases for unions and primitives
- Always type function parameters and return values
- Use `unknown` instead of `any`

### Naming Conventions

- **Files**: kebab-case (e.g., `my-tool.ts`)
- **Classes**: PascalCase (e.g., `MyTool`)
- **Functions**: camelCase (e.g., `createTool()`)
- **Variables**: camelCase (e.g., `toolOptions`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Type names**: PascalCase with suffix (e.g., `ToolOptions`)
- **Private members**: Prefix with underscore (e.g., `_privateMethod()`)

### Error Handling

- Always wrap async operations in try/catch
- Throw specific error types when appropriate
- Include context in error messages
- Never swallow errors silently
- Use custom error classes for domain-specific errors

### Tool Implementation

- Follow the tool pattern from existing tools
- Each tool should have:
  - Clear name and description
  - Well-defined parameters with types
  - Async execute method
  - Proper error handling
- Use the `createTool` pattern for consistency

## COMMANDS

```bash
# Build
bun run build          # Build TypeScript

# Test
bun run test          # Run all Jest tests
bun run test:watch    # Watch mode
bun test <path>       # Run specific test file
bun test -- <pattern> # Run tests matching pattern

# Type check
bun run typecheck     # TypeScript validation

# Lint
bun run lint          # Run ESLint

# Clean
bun run clean         # Remove dist/

# MCP Installation
bash scripts/verify/mcp-install.sh install searxng   # Install SearXNG
bash scripts/verify/mcp-install.sh install context7  # Install Context7
bash scripts/verify/mcp-install.sh install gh_grep   # Install Grep by Vercel
bash scripts/verify/mcp-install.sh install octocode  # Install Octocode
bash scripts/verify/mcp-install.sh install puppeteer # Install Puppeteer
bash scripts/verify/mcp-install.sh install all       # Install all MCP servers
bash scripts/verify/mcp-install.sh uninstall <name>  # Uninstall MCP server
bash scripts/verify/mcp-install.sh verify            # Verify MCP installation
bash scripts/verify/mcp-install.sh status            # Show MCP server status
```

## MCP FEATURES

### Configuration

Use the `/mcp` command to configure MCP servers:

```bash
/mcp --add searxng   # Add SearXNG MCP server
/mcp --add context7  # Add Context7 MCP server
/mcp --add gh_grep   # Add Grep by Vercel MCP server
/mcp --add octocode  # Add Octocode MCP server
/mcp --add puppeteer # Add Puppeteer MCP server
/mcp --list          # List configured MCP servers
```

### Usage

MCP servers are automatically available as tools in OpenCode. Mention the server name in your prompts:

```
Search for React documentation. use searxng
Find code examples for useEffect. use gh_grep
```

### Examples

#### SearXNG

```bash
/mcp --add searxng
```

Then use in prompts:

```
Search for React documentation. use searxng
```

#### Context7

```bash
/mcp --add context7
```

Then use in prompts:

```
How to implement authentication in Next.js? use context7
```

#### Grep by Vercel

```bash
/mcp --add gh_grep
```

Then use in prompts:

```
Show me examples of custom hooks in React. use gh_grep
```

#### Octocode

```bash
/mcp --add octocode
```

Then use in prompts:

```
Find examples of authentication in Next.js. use octocode
```

#### Puppeteer

```bash
/mcp --add puppeteer
```

Then use in prompts:

```
Navigate to example.com and take a screenshot. use puppeteer
```

## SKILL DEVELOPMENT

### Overview

OpenCode supports custom skill development with MCP integration. Skills provide specialized knowledge and step-by-step guidance for specific tasks, enhanced with MCP server capabilities. The plugin includes 5 pre-built skills demonstrating comprehensive MCP integration.

### Available Skills

The following skills are included in the plugin:

1. **React Hooks Implementation Guide** (`skills/react-hooks-implementation.md`)
   - Comprehensive guide to React hooks with official documentation
   - Real-world implementation examples from Facebook React repository
   - Best practices and common pitfalls
   - MCP integration: Context7, gh_grep, octocode, searxng

2. **Next.js Authentication Patterns** (`skills/nextjs-authentication.md`)
   - Complete authentication guide using NextAuth.js
   - Implementation examples and security best practices
   - Comparison with other authentication libraries
   - MCP integration: Context7, octocode, searxng

3. **Web Scraping with Puppeteer** (`skills/web-scraping-puppeteer.md`)
   - Advanced web scraping techniques
   - Ethical scraping guidelines and legal considerations
   - Performance optimization and error handling
   - MCP integration: Context7, gh_grep, searxng, puppeteer

4. **GitHub Research Methodology** (`skills/github-research-methodology.md`)
   - Comprehensive GitHub research techniques
   - Repository exploration and code pattern discovery
   - Pull request analysis and comparison methods
   - MCP integration: octocode, gh_grep, searxng

5. **TypeScript Advanced Patterns** (`skills/typescript-advanced-patterns.md`)
   - Advanced TypeScript type manipulation
   - Utility types, conditional types, and mapped types
   - Performance considerations and best practices
   - MCP integration: Context7, gh_grep, searxng

### Skill File Structure

Skills are defined in markdown files with YAML frontmatter:

### Skill File Structure

Skills are defined in markdown files with YAML frontmatter:

```markdown
---
name: "skill-name"  # Required: unique identifier
description: "Brief description of what this skill does"  # Required
license: "MIT"  # Optional
compatibility: "opencode>=1.0"  # Optional
metadata:  # Optional key-value pairs
  author: "Your Name"
  version: "1.0.0"
mcp:  # Optional MCP server configuration
  context7:
    type: "remote"
    url: "https://context7.ai/mcp"
  gh_grep:
    type: "remote"
    url: "https://gh-grep.vercel.app/mcp"
---

# Skill Instruction

Detailed step-by-step instructions for performing the task.
```

### MCP Integration

OpenCode provides 5 built-in MCP servers that can be integrated into skills:

#### Context7 (Documentation Search)
- **Use case**: Official library/framework documentation
- **Best for**: Implementation details, API references, best practices
- **Example**:
  ```bash
  mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "react"}')
  mcp(mcp_name="context7", tool_name="get-library-docs", arguments='{"context7CompatibleLibraryID": "/facebook/react", "topic": "useEffect"}')
  ```

#### gh_grep (GitHub Code Search)
- **Use case**: Find code examples across GitHub repositories
- **Best for**: Implementation patterns, usage examples, reference code
- **Example**:
  ```bash
  mcp(mcp_name="gh_grep", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["useState"], "owner": "facebook", "repo": "react"}]}')
  ```

#### octocode (Repository Exploration)
- **Use case**: Deep repository exploration and research
- **Best for**: Architecture analysis, complex implementation research
- **Example**:
  ```bash
  mcp(mcp_name="octocode", tool_name="githubViewRepoStructure", arguments='{"queries": [{"owner": "vercel", "repo": "next.js", "path": "packages/next", "depth": 1}]}')
  ```

#### puppeteer (Web Scraping)
- **Use case**: Extract data from websites, automate browser tasks
- **Best for**: Design extraction, content scraping, web testing
- **Example**:
  ```bash
  mcp(mcp_name="puppeteer", tool_name="puppeteer_navigate", arguments='{"url": "https://example.com"}')
  ```

#### searxng (Web Search)
- **Use case**: General web search for information gathering
- **Best for**: Finding features, tutorials, news, general knowledge
- **Example**:
  ```bash
  mcp(mcp_name="searxng", tool_name="searxng_web_search", arguments='{"query": "React hooks best practices"}')
  ```

### Skill Discovery Priority

Skills are discovered in this order:
1. **opencode-project** (`.opencode/skills/`)
2. **project** (project root)
3. **opencode** (`~/.config/opencode/skills/`)
4. **user** (user-specific skills)

### Example Skills

#### React Hooks Best Practices

```markdown
---
name: "react-hooks-best-practices"
description: "Best practices for using React hooks with official documentation and examples"
license: "MIT"
mcp:
  context7:
    type: "remote"
    url: "https://context7.ai/mcp"
  gh_grep:
    type: "remote"
    url: "https://gh-grep.vercel.app/mcp"
  octocode:
    type: "remote"
    url: "https://octocode.com/mcp"
---

## React Hooks Best Practices

### 1. Understand the Rules of Hooks

React hooks must follow two essential rules:
- Only call hooks at the top level
- Only call hooks from React functions

### 2. Find Real Examples

Use the MCP tools to find real implementations:

```bash
# Search for useState examples in React repository
mcp(mcp_name="gh_grep", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["useState"], "owner": "facebook", "repo": "react", "path": "examples"}]}')

# Explore React hooks implementation
mcp(mcp_name="octocode", tool_name="githubViewRepoStructure", arguments='{"queries": [{"owner": "facebook", "repo": "react", "path": "packages/react", "depth": 2}]}')
```

### 3. Official Documentation Lookup

For official documentation:
```bash
mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "react"}')
mcp(mcp_name="context7", tool_name="get-library-docs", arguments='{"context7CompatibleLibraryID": "/facebook/react", "topic": "useEffect cleanup"}')
```
```

#### Next.js Authentication

```markdown
---
name: "nextjs-authentication"
description: "Implement authentication in Next.js applications using NextAuth.js"
license: "MIT"
mcp:
  context7:
    type: "remote"
    url: "https://context7.ai/mcp"
  octocode:
    type: "remote"
    url: "https://octocode.com/mcp"
  searxng:
    type: "remote"
    url: "https://searxng.example.com/mcp"
---

## Next.js Authentication Implementation

### 1. Setup NextAuth.js

Install the required package:
```bash
npm install next-auth
```

### 2. Configure Providers

Create `pages/api/auth/[...nextauth].ts`:
```typescript
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
})
```

### 3. Find Implementation Examples

Search for real Next.js authentication implementations:
```bash
mcp(mcp_name="octocode", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["NextAuth"], "owner": "vercel", "repo": "next.js", "path": "examples"}]}')
```

### 4. Official Documentation

For detailed API reference:
```bash
mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "next-auth"}')
mcp(mcp_name="context7", tool_name="get-library-docs", arguments='{"context7CompatibleLibraryID": "/nextauthjs/next-auth", "topic": "session management"}')
```
```

### Best Practices

1. **Be specific**: Skills should solve narrow, well-defined problems
2. **Use MCP strategically**: Only integrate MCP servers that add value
3. **Provide examples**: Show how to use MCP tools in the skill
4. **Document dependencies**: List required MCP servers
5. **Keep it concise**: Focus on actionable steps, not theory
6. **Include error handling**: Show how to handle common issues
7. **Combine MCP tools**: Use multiple tools together for comprehensive research
8. **Start with official docs**: Always begin with Context7 for authoritative information
9. **Find real examples**: Use gh_grep and octocode for implementation patterns
10. **Add context**: Use searxng for tutorials, articles, and background information

### Skill Tool Usage

Once skills are created, they can be used via the `skill` tool:

```bash
# List available skills
skill()

# Load a specific skill
skill(name="react-hooks-implementation")

# Use MCP tools from the skill
mcp(mcp_name="context7", tool_name="query-docs", arguments='{"libraryId": "/facebook/react", "query": "useEffect"}')
```

### Skill Discovery and Testing

To test skill discovery and MCP integration:

```bash
# Test skill discovery
skill()

# Verify MCP integration in each skill
skill(name="react-hooks-implementation")
skill(name="nextjs-authentication")
skill(name="web-scraping-puppeteer")
skill(name="github-research-methodology")
skill(name="typescript-advanced-patterns")

# Test MCP tool calls from skills
mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "react"}')
mcp(mcp_name="gh_grep", tool_name="githubSearchCode", arguments='{"queries": [{"keywordsToSearch": ["useState"], "owner": "facebook", "repo": "react"}]}')
mcp(mcp_name="octocode", tool_name="githubViewRepoStructure", arguments='{"queries": [{"owner": "facebook", "repo": "react", "path": "packages/react", "depth": 1}]}')
```

### Skill MCP Tool Usage

For direct MCP access from skills:

```bash
# Call a tool from a skill's MCP server
skill_mcp(mcp_name="context7", tool_name="query-docs", arguments='{"libraryId": "/nextauthjs/next-auth", "query": "session"}')

# Read a resource
skill_mcp(mcp_name="octocode", resource_name="github://vercel/next.js/examples/auth")

# Get a prompt
skill_mcp(mcp_name="context7", prompt_name="summarize", arguments='{"text": "..."}')
```

## NOTES

- **Coverage**: 80% minimum
- **Types**: Strict mode enforced
- **Tools**: Follow tool pattern
- **MCP**: Supports both local (stdio) and remote (http/sse) servers
- **Configuration**: JSONC support with multiple scopes (user, project, local)
- **Documentation**: Long-form documentation belongs in `docs/` folder
- **MCP Installation**: Use `scripts/verify/mcp-install.sh` for server management
- **Debugging**: When debugging OpenCode, use the `-m` flag to specify the model:
  ```bash
  opencode -m "mistral (local)/mistralai/Devstral-Small-2-24B-Instruct-2512"
  ```
- **Testing**: Always use the `-c` flag to continue the last session when testing:
  ```bash
  opencode -c
  ```
  NEVER kill the OpenCode process. Always use the `-c` flag to continue the last session.
- **Command Execution**: Always use the `-m` flag when running OpenCode commands. If you forget, always run `opencode --help` first to check available options.

## DOCUMENTATION CONVENTIONS

- **AGENTS.md**: High-level overview and quick reference
- **docs/ folder**: Detailed documentation, guides, and references
- **README.md**: Installation and quick start
- **MCP\_\*.md**: MCP-specific documentation

For detailed documentation, see the `docs/` folder in this directory.
