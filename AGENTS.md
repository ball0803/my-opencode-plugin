# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-04
**Commit:** e83df8e
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
| **MCP tool**        | `scripts/mcp-helper.sh`           | MCP configuration helper          |
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

## COMMANDS

```bash
# Build
bun run build          # Build TypeScript

# Test
bun run test          # Run Jest tests
bun run test:watch    # Watch mode

# Type check
bun run typecheck     # TypeScript validation

# Clean
bun run clean         # Remove dist/
```

## MCP FEATURES

### Configuration

Use the `/mcp` command to configure MCP servers:

```bash
/mcp --add context7  # Add Context7 MCP server
/mcp --add grep      # Add Grep by Vercel MCP server
/mcp --add sentry    # Add Sentry MCP server
/mcp --list          # List configured MCP servers
```

### Usage

MCP servers are automatically available as tools in OpenCode. Mention the server name in your prompts:

```
Search for React documentation. use context7
Find code examples for useEffect. use gh_grep
```

### Examples

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
/mcp --add grep
```

Then use in prompts:

```
Show me examples of custom hooks in React. use gh_grep
```

#### Sentry

```bash
/mcp --add sentry
/mcp --auth sentry  # Authenticate with OAuth
```

Then use in prompts:

```
Show me recent errors in my project. use sentry
```

## NOTES

- **Coverage**: 80% minimum
- **Types**: Strict mode enforced
- **Tools**: Follow tool pattern
- **MCP**: Supports both local (stdio) and remote (http/sse) servers
- **Configuration**: JSONC support with multiple scopes (user, project, local)
- **Documentation**: Long-form documentation belongs in `docs/` folder

## DOCUMENTATION CONVENTIONS

- **AGENTS.md**: High-level overview and quick reference
- **docs/ folder**: Detailed documentation, guides, and references
- **README.md**: Installation and quick start
- **MCP\_\*.md**: MCP-specific documentation

For detailed documentation, see the `docs/` folder in this directory.
