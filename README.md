# My-OpenCode-Plugin

A modular OpenCode plugin for background task management and agent calling.

## Features

- **Background Task Management**: Create, monitor, and manage long-running tasks
- **Agent Calling**: Call specialized agents with optional background execution
- **Configurable**: Customize behavior through configuration files
- **Type-Safe**: Strong TypeScript typing throughout
- **Tested**: Comprehensive test coverage with Jest

## Installation

```bash
npm install my-opencode-plugin
```

## Usage

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

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- **User Guide**: Getting started and usage examples
- **API Reference**: Detailed API documentation
- **Architecture**: System architecture and design
- **Development**: Development setup and guidelines
- **Contributing**: How to contribute to the project

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
