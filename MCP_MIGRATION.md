# MCP Migration Summary

## What Changed

The plugin has been updated to use OpenCode's **native MCP system** instead of maintaining a separate MCP implementation.

### Before

- Plugin had its own MCP tool implementation
- Managed MCP servers separately from OpenCode
- Required custom configuration files

### After

- Removed all MCP-related code from the plugin
- Now uses OpenCode's built-in MCP support
- MCP servers configured in `opencode.jsonc`

## How to Use MCP Now

### 1. Add MCP Servers

Use the `/mcp` command in OpenCode:

```bash
/mcp --add searxng   # Add SearXNG MCP server
/mcp --add context7  # Add Context7 MCP server
/mcp --add grep      # Add Grep by Vercel MCP server
/mcp --add sentry    # Add Sentry MCP server
```

### 2. Authenticate (if needed)

Some servers require authentication:

```bash
/mcp --auth searxng  # If your SearXNG instance requires authentication
/mcp --auth context7
```

Or use the CLI:

```bash
opencode mcp auth searxng
opencode mcp auth context7
```

### 3. Use MCP Servers in Prompts

MCP servers are automatically available as tools:

```
Search for React documentation. use searxng
Find code examples for useEffect. use gh_grep
Show me recent errors. use sentry
```

## Benefits

1. **Native Integration**: Uses OpenCode's built-in MCP system
2. **Simpler Configuration**: Single configuration file (`opencode.jsonc`)
3. **Better Performance**: No duplicate MCP management
4. **Standard Workflow**: Follows OpenCode's official MCP documentation

## Configuration Examples

### SearXNG

```json
{
  "mcp": {
    "searxng": {
      "type": "remote",
      "url": "http://searxng.internal"
    }
  }
}
```

### Context7

```json
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

### Grep by Vercel

```json
{
  "mcp": {
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app"
    }
  }
}
```

### Sentry

```json
{
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    }
  }
}
```

## Troubleshooting

### "Unable to connect" Error

This error occurs when:

1. The MCP server URL is incorrect
2. The server requires authentication but isn't authenticated
3. The server is down or unreachable

**Solution**:

- Verify the URL is correct
- Authenticate with `opencode mcp auth <server>`
- Check network connectivity

### MCP tools not available

**Solution**:

- Ensure the server is enabled in `opencode.jsonc`
- Restart OpenCode after adding new servers
- Check for errors in the OpenCode console

## Migration Guide

If you were using the old MCP implementation:

1. **Remove old configuration**: Delete any `.mcp.json` files
2. **Add new servers**: Use `/mcp --add <server>` command
3. **Re-authenticate**: Run `opencode mcp auth <server>` for OAuth servers
4. **Update prompts**: Continue using MCP servers the same way

## References

- [OpenCode MCP Documentation](https://opencode.ai/docs/mcp-servers/)
- [OpenCode CLI Reference](https://opencode.ai/docs/cli/)
