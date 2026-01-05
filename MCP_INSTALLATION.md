# MCP Installation Guide

This guide provides detailed instructions for installing and configuring MCP servers for your OpenCode setup.

## Overview

This project now supports the following MCP servers with your specific configuration:

- **SearXNG** - Private metasearch engine (local)
- **Context7** - Documentation search (local, requires API key)
- **Grep by Vercel** - GitHub code search (remote)
- **Octocode** - GitHub repository exploration (local, requires GitHub token)

## Installation

### Prerequisites

- Node.js 18+
- npm/npx
- jq (for configuration management)

```bash
# Install jq if not already installed
sudo apt-get install jq  # Debian/Ubuntu
brew install jq          # macOS
```

### Install MCP Servers

Use the installation script to add MCP servers to your OpenCode configuration:

```bash
# Install individual servers
bash scripts/verify/mcp-install.sh install searxng
bash scripts/verify/mcp-install.sh install context7
bash scripts/verify/mcp-install.sh install gh_grep
bash scripts/verify/mcp-install.sh install octocode

# Install all servers
bash scripts/verify/mcp-install.sh install all
```

### Using the /mcp Command

The plugin includes a `/mcp` command for managing MCP servers:

```bash
/mcp --add searxng      # Add SearXNG
/mcp --add context7     # Add Context7
/mcp --add gh_grep      # Add Grep by Vercel
/mcp --add octocode     # Add Octocode
/mcp --list            # List configured servers
/mcp --remove <name>   # Remove a server
/mcp --status          # Show installation status
/mcp --verify          # Verify installation
```

## Configuration Details

### SearXNG

**Type:** Local (stdio)

```json
{
  "type": "local",
  "command": ["npx", "-y", "mcp-searxng"],
  "enabled": true,
  "environment": {
    "SEARXNG_URL": "http://searxng.internal"
  }
}
```

**Usage:**

```
Search for React documentation. use searxng
```

### Context7

**Type:** Local (stdio)

```json
{
  "type": "local",
  "command": ["npx", "-y", "@upstash/context7-mcp"],
  "enabled": true,
  "environment": {
    "CONTEXT_TOKEN_KEY": "{env:CONTEXT_TOKEN_KEY}"
  }
}
```

**Environment Variable:** `CONTEXT_TOKEN_KEY`

**Usage:**

```
How to implement authentication in Next.js? use context7
```

### Grep by Vercel

**Type:** Remote (HTTP)

```json
{
  "type": "remote",
  "url": "https://mcp.grep.app"
}
```

**Usage:**

```
Show me examples of custom hooks in React. use gh_grep
```

### Octocode

**Type:** Local (stdio)

```json
{
  "type": "local",
  "command": ["npx", "-y", "octocode-mcp@latest"],
  "enabled": true,
  "environment": {
    "GITHUB_TOKEN": "{env:GITHUB_TOKEN_KEY}"
  }
}
```

**Environment Variable:** `GITHUB_TOKEN_KEY`

**Usage:**

```
Find examples of authentication in Next.js. use octocode
```

## Configuration File

MCP servers are configured in:

```
~/.config/opencode/opencode.jsonc
```

Example configuration:

```json
{
  "mcpServers": {
    "context7": {
      "type": "local",
      "command": ["npx", "-y", "@upstash/context7-mcp"],
      "enabled": true,
      "environment": {
        "CONTEXT_TOKEN_KEY": "{env:CONTEXT_TOKEN_KEY}"
      }
    },
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app"
    },
    "searxng": {
      "type": "local",
      "command": ["npx", "-y", "mcp-searxng"],
      "enabled": true,
      "environment": {
        "SEARXNG_URL": "http://searxng.internal"
      }
    },
    "octocode-mcp": {
      "type": "local",
      "command": ["npx", "-y", "octocode-mcp@latest"],
      "enabled": true,
      "environment": {
        "GITHUB_TOKEN": "{env:GITHUB_TOKEN_KEY}"
      }
    }
  }
}
```

## Environment Variables

Set these environment variables for authentication:

```bash
# For Context7
export CONTEXT_TOKEN_KEY="your_context7_api_key"

# For Octocode
export GITHUB_TOKEN_KEY="your_github_token"
```

## Troubleshooting

### Server not found

```bash
/mcp --list
cat ~/.config/opencode/opencode.jsonc
```

### Authentication issues

```bash
env | grep MCP
env | grep CONTEXT_TOKEN
env | grep GITHUB_TOKEN
```

### Verify installation

```bash
bash scripts/verify/mcp-install.sh verify
bash scripts/verify/mcp-install.sh status
```

### Check configuration

```bash
bash scripts/verify/mcp-helper.sh validate
bash scripts/verify/mcp-helper.sh list
```

## Helper Scripts

### mcp-helper.sh

Location: `scripts/verify/mcp-helper.sh`

Commands:

- `add <name> <config>` - Add MCP server
- `remove <name>` - Remove MCP server
- `list` - List all MCP servers
- `get <name>` - Get MCP server configuration
- `validate` - Validate MCP configuration
- `backup` - Backup configuration

### mcp-install.sh

Location: `scripts/verify/mcp-install.sh`

Commands:

- `install <server>` - Install MCP server
- `uninstall <server>` - Uninstall MCP server
- `verify` - Verify MCP installation
- `status` - Show MCP server status

## Usage Examples

### Search Documentation

```
Search for React useEffect documentation. use context7
```

### Find Code Examples

```
Show me examples of custom hooks in React. use gh_grep
```

### Search GitHub Repositories

```
Find examples of authentication in Next.js. use octocode
```

### Web Search

```
Search for latest React best practices. use searxng
```

## Notes

- All MCP servers are installed via npm packages
- Configuration supports both local (stdio) and remote (http) servers
- Environment variables are used for sensitive data
- Configuration file supports JSONC (JSON with comments)
- Use `/mcp --list` to check configured servers
- Use `/mcp --status` to check installation status

## Support

For issues with MCP installation:

1. Check the configuration file: `~/.config/opencode/opencode.jsonc`
2. Verify environment variables are set
3. Run verification: `bash scripts/verify/mcp-install.sh verify`
4. Check logs for errors

## License

MIT
