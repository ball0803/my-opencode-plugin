# My-OpenCode-Plugin

A modular OpenCode plugin for background task management, agent calling, and skill-based MCP integration.

## Features

- **Background Task Management**: Create, monitor, and manage long-running tasks
- **Agent Calling**: Call specialized agents with optional background execution
- **Skill System**: 7 pre-built skills for MCP integration (official docs, code examples, repository analysis, web scraping, research, package research, PR analysis)
- **Configurable**: Customize behavior through configuration files
- **Type-Safe**: Strong TypeScript typing throughout
- **Tested**: Comprehensive test coverage with Jest

## Installation

### Plugin Installation

```bash
npm install my-opencode-plugin
```

### Skill Installation

The plugin includes 7 pre-built skills. To install them:

```bash
# Install skills to OpenCode
mkdir -p ~/.config/opencode/skills/my-opencode-plugin
cp -r node_modules/my-opencode-plugin/skills/* ~/.config/opencode/skills/my-opencode-plugin/
```

This follows the OpenCode skill discovery pattern where skills are organized by plugin name in subdirectories.

## Usage

### Plugin Configuration

Add the plugin to your `opencode.json` configuration:

```json
{
  "plugins": [
    {
      "name": "my-opencode-plugin",
      "config": {
        "background": {
          "maxConcurrentTasks": 10,
          "taskTTL": 1800000,
          "pollInterval": 2000
        }
      }
    }
  ]
}
```

### Skill Usage

Once skills are installed, use them in OpenCode:

```bash
# List available skills
skill()

# Load a specific skill
skill(name="official-docs")

# Use MCP tools from skills
mcp(mcp_name="context7", tool_name="resolve-library-id", arguments='{"libraryName": "react"}')
```

### Available Skills

1. **official-docs**: Official documentation lookup
2. **implementation-examples**: Real-world code examples from GitHub
3. **codebase-analysis**: Repository exploration and structure analysis
4. **web-content-extraction**: Web scraping with Puppeteer
5. **general-research**: Tutorials and articles via web search
6. **package-research**: Package dependency research
7. **pr-analysis**: Pull request analysis and implementation history

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- **User Guide**: Getting started and usage examples
- **API Reference**: Detailed API documentation
- **Architecture**: System architecture and design
- **Development**: Development setup and guidelines
- **Contributing**: How to contribute to the project
- **Skills Guide**: Skill system documentation in `/skills/README.md`

## Commands

This plugin includes OpenCode commands that extend functionality:

### `/init-deep`

Generate hierarchical AGENTS.md files with complexity scoring.

**Installation**:

```bash
npm run install:commands
```

**Usage**:

```bash
/init-deep                      # Update mode
/init-deep --create-new         # Regenerate from scratch
/init-deep --max-depth=2        # Limit depth
```

See `commands/README.md` for more details.

## License

MIT

## Development

### Prerequisites

- Node.js 18+
- npm 9+
- TypeScript 5+

### Setup

```bash
npm install
```

### Commands

- **Build**: `npm run build`
- **Test**: `npm test`
- **Type Check**: `npm run typecheck`
- **Watch**: `npm run watch`

## License

MIT
