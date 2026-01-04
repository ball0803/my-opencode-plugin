# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-04
**Commit:** e83df8e
**Branch:** master

## OVERVIEW

Background agent orchestration system for OpenCode plugins with MCP (Model Context Protocol) support. Provides async task management, agent discovery, tool integration, and remote MCP server connectivity.

## STRUCTURE

```
my-opencode-plugin/
├── src/
│   ├── background-agent/  # Task lifecycle and orchestration
│   ├── core/              # Types, utilities
│   ├── tools/             # Custom tools (MCP, background task, agent tools)
│   │   └── mcp/           # MCP tool implementation
│   ├── features/          # Feature modules
│   │   ├── mcp-loader/    # MCP configuration loader
│   │   ├── mcp-manager/   # MCP client manager
│   ├── mcp/              # Built-in MCP servers
│   │   ├── context7.ts    # Context7 MCP server
│   │   ├── websearch-exa.ts # Exa web search MCP server
│   │   ├── grep-app.ts    # grep.app MCP server
│   │   └── index.ts       # MCP server management
│   ├── config/            # Configuration system
│   └── plugin-handlers/   # Plugin configuration handlers
├── commands/              # CLI commands
├── docs/                  # Documentation
└── scripts/               # Build scripts
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| **Add task type** | `src/background-agent/types.ts` | Define new task types |
| **Add tool** | `src/tools/` | Create tool directory |
| **Add MCP server** | `src/mcp/` | Add new built-in server |
| **Add MCP config** | `src/features/mcp-loader/` | Update loader |
| **Add handler** | `src/plugin-handlers/` | Create handler file |
| **Add config** | `src/config/` | Update schema |
| **Add docs** | `docs/` | Follow documentation structure |
| **MCP tool** | `src/tools/mcp/` | `mcp` tool implementation |
| **MCP manager** | `src/features/mcp-manager/` | Client connections |
| **MCP loader** | `src/features/mcp-loader/` | Config loading |

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

### Built-in Servers
- **Context7**: AI-powered context-aware search
- **Exa Web Search**: Web search capabilities
- **grep.app**: Code search and navigation

### Configuration
Create `.mcp.json` in your project:
```json
{
  "mcpServers": {
    "my-server": {
      "type": "remote",
      "url": "https://example.com/mcp"
    }
  }
}
```

### Usage
```typescript
// Call an MCP tool
mcp(mcp_name="websearch_exa", tool_name="web_search_exa", arguments='{"query": "search"}')

// Read a resource
mcp(mcp_name="grep_app", resource_name="file://path/to/file")

// Get a prompt
mcp(mcp_name="context7", prompt_name="summarize", arguments='{"text": "..."}')
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
- **MCP_*.md**: MCP-specific documentation

For detailed documentation, see the `docs/` folder in this directory.
