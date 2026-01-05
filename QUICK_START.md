# MCP Quick Start Guide

## Install All MCP Servers

```bash
bash scripts/verify/mcp-install.sh install all
```

## Use MCP Servers

### In OpenCode

```
Search for React documentation. use searxng
How to implement authentication in Next.js? use context7
Show me examples of custom hooks in React. use gh_grep
Find examples of authentication in Next.js. use octocode
```

### Using /mcp Command

```bash
/mcp --add searxng      # Add SearXNG
/mcp --add context7     # Add Context7
/mcp --add gh_grep      # Add Grep by Vercel
/mcp --add octocode     # Add Octocode
/mcp --list            # List configured servers
/mcp --status          # Check installation status
```

## Environment Variables

```bash
export CONTEXT_TOKEN_KEY="your_context7_api_key"
export GITHUB_TOKEN_KEY="your_github_token"
```

## Configuration

All MCP servers are configured in:

```
~/.config/opencode/opencode.jsonc
```

## Supported Servers

✅ **SearXNG** - Private metasearch engine
✅ **Context7** - Documentation search
✅ **Grep by Vercel** - GitHub code search
✅ **Octocode** - GitHub repository exploration

## Quick Commands

```bash
# Check status
bash scripts/verify/mcp-install.sh status

# List configured servers
bash scripts/verify/mcp-helper.sh list

# Verify installation
bash scripts/verify/mcp-install.sh verify

# View configuration
cat ~/.config/opencode/opencode.jsonc
```

## Need Help?

See `MCP_INSTALLATION.md` for detailed documentation.
