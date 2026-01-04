# MCP Implementation for my-opencode-plugin

## Overview

This document describes the Model Context Protocol (MCP) implementation in my-opencode-plugin, which provides support for remote MCP servers including Context7, Exa Web Search, and grep.app.

## Features

### 1. Built-in MCP Servers

Three remote MCP servers are included by default:

- **Context7** (`https://mcp.context7.com/mcp`)
  - AI-powered context-aware search and analysis

- **Exa Web Search** (`https://mcp.exa.ai/mcp?tools=web_search_exa`)
  - Web search capabilities via Exa's MCP server

- **grep.app** (`https://mcp.grep.app`)
  - Code search and navigation

### 2. Configuration

Users can configure MCP servers in `.mcp.json` files at multiple scopes:

- **User level**: `~/.my-opencode/.mcp.json`
- **Project level**: `./.mcp.json`
- **Local level**: `./.my-opencode/.mcp.json`

Example `.mcp.json`:
```json
{
  "mcpServers": {
    "my-custom-server": {
      "type": "remote",
      "url": "https://example.com/mcp",
      "headers": {
        "Authorization": "Bearer token"
      }
    },
    "local-server": {
      "type": "local",
      "command": ["npx", "-y", "@some/mcp-server"],
      "environment": {
        "API_KEY": "your-key-here"
      }
    }
  }
}
```

### 3. Plugin Configuration

The plugin configuration supports disabling built-in MCP servers:

```json
{
  "disabled_mcps": ["websearch_exa", "context7"]
}
```

## Usage

### Using the MCP Tool

The `mcp` tool allows invoking MCP server operations:

```typescript
// Call an MCP tool
mcp(mcp_name="websearch_exa", tool_name="web_search_exa", arguments='{"query": "search term"}')

// Read a resource
mcp(mcp_name="grep_app", resource_name="file://path/to/file")

// Get a prompt
mcp(mcp_name="context7", prompt_name="summarize", arguments='{"text": "..."}')

// Filter output with grep
mcp(mcp_name="websearch_exa", tool_name="web_search_exa", arguments='{"query": "test"}', grep="important")
```

## Architecture

### Components

1. **MCP Types** (`src/mcp/`)
   - Type definitions for MCP configurations
   - Built-in server definitions

2. **MCP Loader** (`src/features/mcp-loader/`)
   - Loads `.mcp.json` files from multiple scopes
   - Merges user and built-in configurations

3. **MCP Manager** (`src/features/mcp-manager/`)
   - Manages MCP client connections
   - Handles tool/resource/prompt operations
   - Connection lifecycle management

4. **MCP Tools** (`src/tools/mcp/`)
   - `mcp` tool for invoking MCP operations
   - Parameter validation and error handling

### Integration

The MCP system is integrated into the main plugin class:
- MCP manager is initialized with the plugin
- MCP configurations are loaded during plugin initialization
- MCP tool is exported via `getTools()`
- Connections are cleaned up during plugin cleanup

## Dependencies

- `@modelcontextprotocol/sdk@^1.25.1` - MCP client SDK
- `jsonc-parser` - JSONC configuration parsing

## Configuration Format

### MCP Server Types

#### Remote Server
```typescript
{
  type: "remote",
  url: string,
  headers?: Record<string, string>,
  enabled?: boolean
}
```

#### Local Server
```typescript
{
  type: "local",
  command: string[],
  environment?: Record<string, string>,
  enabled?: boolean
}
```

## Error Handling

The implementation provides detailed error messages for:
- Missing or invalid MCP server configurations
- Connection failures
- Invalid tool/resource/prompt names
- Invalid JSON arguments
- Network connectivity issues

## Testing

Unit tests are available in:
- `src/mcp/index.test.ts` - Built-in MCP server tests
- `src/tools/mcp/tools.test.ts` - MCP tool tests

## Future Enhancements

Potential improvements:
1. Support for SSE (Server-Sent Events) connections
2. Authentication providers for remote servers
3. MCP server health checks
4. Connection pooling and reuse
5. Metrics and logging for MCP operations

## Compatibility

This implementation follows the same patterns as oh-my-opencode's MCP system but is designed to work independently without skills support.
