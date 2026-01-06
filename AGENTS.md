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
