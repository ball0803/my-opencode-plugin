# My-OpenCode-Plugin

A modular OpenCode plugin with 17 lifecycle hooks for enhanced functionality, background task management, agent orchestration, and MCP (Model Context Protocol) support.

## Features

### Core Features

- **17 Lifecycle Hooks**: Extend and customize OpenCode behavior
- **Background Task Management**: Create, monitor, and manage long-running tasks with polling
- **Agent Orchestration**: Call specialized agents with optional background execution
- **MCP Support**: Model Context Protocol integration with built-in servers
- **Configuration System**: JSONC support with multiple scopes
- **Type Safety**: Zod validation for all configurations
- **Error Recovery**: Automatic recovery from operation failures

### Lifecycle Hooks (17 Total)

#### Directory Hooks
- `directory-agents-injector` - Auto-injects AGENTS.md content into task context
- `directory-readme-injector` - Auto-injects README.md content into task context

#### Task Management Hooks
- `ralph-loop` - Self-referential development loops for iterative tasks
- `empty-task-response-detector` - Detects when tasks complete without output
- `tool-output-truncator` - Truncates long tool outputs to prevent context overflow

#### Error Handling Hooks
- `edit-error-recovery` - Recovers from edit operation failures
- `empty-message-sanitizer` - Removes empty messages from session history

#### Context Hooks
- `compaction-context-injector` - Preserves context during session compaction
- `keyword-detector` - Detects keywords in outputs and triggers actions
- `rules-injector` - Injects rules into prompts for consistent behavior

#### Notification Hooks
- `session-notification` - Notifies about session lifecycle events
- `background-notification` - Handles background task completion notifications

#### Prompt Hooks
- `auto-slash-command` - Auto-detects and handles slash commands
- `thinking-mode` - Adds thinking prefixes to prompts for better context

#### Session Hooks
- `interactive-bash-session` - Handles interactive bash session commands
- `comment-checker` - Prevents excessive comments in code edits

## Installation

### Quick Install

Run the simple installation script:

```bash
./install-plugin-simple.sh
```

This will:
1. Build the plugin if needed
2. Copy the built files to `~/.config/opencode/plugin/my-opencode-plugin/`
3. Create a `package.json` for dependencies

### Manual Install

1. **Build the plugin**:
   ```bash
   cd my-opencode-plugin
   bun install
   npx tsc
   ```

2. **Copy to OpenCode plugin directory**:
   ```bash
   mkdir -p ~/.config/opencode/plugin/my-opencode-plugin
   cp -r dist/* ~/.config/opencode/plugin/my-opencode-plugin/
   ```

3. **Install dependencies**:
   ```bash
   cd ~/.config/opencode
   bun install
   ```

4. **Verify installation**:
   ```bash
   ls -la ~/.config/opencode/plugin/my-opencode-plugin/
   ```

## Usage

### Plugin Configuration

The plugin supports configuration through `.mcp.json` files. Create a file in your project root:

```json
{
  "mcpServers": {
    "websearch_exa": {
      "type": "remote",
      "url": "https://api.exa.ai/mcp"
    },
    "grep_app": {
      "type": "remote",
      "url": "https://api.grep.app/mcp"
    }
  }
}
```

### MCP Tool Usage

```typescript
// Call a tool
mcp(mcp_name="websearch_exa", tool_name="web_search_exa", arguments='{"query": "search"}')

// Read a resource
mcp(mcp_name="grep_app", resource_name="file://path/to/file")

// Get a prompt
mcp(mcp_name="context7", prompt_name="summarize", arguments='{"text": "..."}')
```

### Background Task Usage

```typescript
// Run a task in background
background_task(
  name="data-analysis",
  command="python analyze.py",
  poll_interval=5,
  timeout=300
)

// Call an agent in background
call_agent(
  agent="data-scientist",
  prompt="Analyze this dataset",
  background=true
)
```

## Hooks Overview

All hooks are enabled by default and can be configured through the plugin's configuration system. Each hook follows the same pattern:

1. **Import**: Import the hook factory from `./hooks`
2. **Initialize**: Create an instance with `createXXXHook(ctx, config)`
3. **Register**: Add to the plugin's event handlers

## Documentation

- **AGENTS.md**: High-level overview and quick reference
- **INSTALLATION_COMPLETE.md**: Detailed installation guide
- **OpenCode Docs**: https://opencode.ai/docs/
- **Plugin SDK**: https://opencode.ai/docs/plugins/

## Commands

```bash
# Build
bun run build          # TypeScript compilation

# Test
bun run test          # Run Jest tests
bun run test:watch    # Watch mode

# Type check
bun run typecheck     # TypeScript validation

# Clean build
bun run clean         # Remove dist/
```

## License

MIT

## Development

### Prerequisites

- **Bun**: https://bun.sh/ (required)
- **TypeScript**: 5+

### Setup

```bash
cd my-opencode-plugin
bun install
```

### Commands

- **Build**: `bun run build`
- **Test**: `bun run test`
- **Type Check**: `bun run typecheck`
- **Watch**: `bun run watch`

## Contributing

To contribute to the plugin:

1. Clone the repository
2. Navigate to `my-opencode-plugin/`
3. Install dependencies: `bun install`
4. Make your changes
5. Build: `npx tsc`
6. Test your changes
7. Submit a pull request

All new hooks should follow the same pattern:
- Create a folder in `src/hooks/`
- Add an `index.ts` file with the hook implementation
- Export the hook from `src/hooks/index.ts`
- Import and register the hook in `src/plugin.ts`
- Add TypeScript types for configuration options

## Uninstall

To remove the plugin:

```bash
rm -rf ~/.config/opencode/plugin/my-opencode-plugin/
```

## Support

For issues or questions:
- Open an issue on GitHub
- Join the OpenCode Discord community
- Check the OpenCode documentation at https://opencode.ai/docs/
