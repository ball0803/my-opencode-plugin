# SearXNG MCP Installation Summary

## What Was Done

I have successfully replaced the `websearch_exa` MCP server with `searxng` in the my-opencode-plugin project and configured your self-hosted SearXNG instance.

## Changes Made

### 1. Plugin Source Code Updates

**File: `src/config/schema.ts`**

- Replaced `"websearch_exa"` with `"searxng"` in the `McpNameSchema` enum
- This allows the plugin to recognize and manage the searxng MCP server

**File: `MCP_MIGRATION.md`**

- Added searxng to the list of MCP servers that can be added
- Added authentication example for searxng
- Added usage example showing how to search with searxng
- Added configuration example for searxng

**File: `AGENTS.md`**

- Added searxng to the MCP configuration examples
- Added searxng usage example
- Added dedicated section for searxng with installation and usage instructions

### 2. Plugin Installation

The plugin has been successfully installed to:

```
/home/camel/.config/opencode/plugin/my-opencode-plugin
```

### 3. OpenCode Configuration

**File: `/home/camel/.config/opencode/opencode.jsonc`**

- Replaced `websearch_exa` configuration with `searxng`
- Added plugin configuration for my-opencode-plugin
- Configured searxng to use your self-hosted instance: `http://searxng.internal`

## Current Configuration

```json
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp"
    },
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app"
    },
    "searxng": {
      "type": "remote",
      "url": "http://searxng.internal"
    },
    "github": {
      "type": "remote",
      "url": "https://mcp.github.com/mcp"
    }
  },
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

## How to Use SearXNG

### 1. Start OpenCode

```bash
opencode
```

### 2. Use SearXNG in Prompts

Simply mention the server name in your prompts:

```
Search for React documentation. use searxng
Find information about TypeScript. use searxng
Show me the latest news about AI. use searxng
```

### 3. Available Commands

The plugin provides the following commands:

- `/init-deep` - Generate hierarchical AGENTS.md files
- `/mcp` - Configure MCP servers (if available)

### 4. Available Tools

- `subagent` - Create async subagents
- `subagent_output` - Get subagent output
- `subagent_cancel` - Cancel subagent tasks

## Verification

To verify the installation:

1. Check that the plugin is installed:

   ```bash
   ls -la /home/camel/.config/opencode/plugin/my-opencode-plugin/
   ```

2. Check the configuration:

   ```bash
   cat /home/camel/.config/opencode/opencode.jsonc | grep -A 3 searxng
   ```

3. Start OpenCode and try using the searxng MCP server in your prompts

## Troubleshooting

If you encounter issues:

1. **Connection Errors**: Verify that your SearXNG instance is running and accessible at `http://searxng.internal`

2. **Plugin Not Loading**: Check the OpenCode logs for any error messages

3. **Configuration Issues**: Verify the `opencode.jsonc` file has valid JSON syntax

## Next Steps

1. Start OpenCode: `opencode`
2. Test the searxng MCP server by asking questions that require web search
3. Use the `/init-deep` command to generate documentation if needed
4. Explore the other MCP servers (context7, gh_grep, github) that are also configured

## References

- [SearXNG MCP Server GitHub](https://github.com/ihor-sokoliuk/mcp-searxng)
- [OpenCode Documentation](https://opencode.ai/docs)
- [My-OpenCode-Plugin Documentation](docs/README.md)
