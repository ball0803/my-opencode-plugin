# Configuration Guide

This guide explains how to configure the My-OpenCode-Plugin.

## Configuration File

The plugin configuration is stored in your OpenCode configuration file (`opencode.json` or `opencode.jsonc`).

## Configuration Schema

```typescript
interface PluginConfig {
  agents?: {
    [agentName: string]: {
      model?: string;
      temperature?: number;  // 0-2
      maxTokens?: number;
      topP?: number;         // 0-1
      frequencyPenalty?: number;
      presencePenalty?: number;
      stop?: string[];
      stream?: boolean;
    }
  };
  permissions?: {
    [permissionName: string]: string[];
  };
  background?: {
    maxConcurrentTasks?: number;  // 1-100, default: 10
    taskTTL?: number;             // 60000-86400000 (1min-24hr), default: 1800000 (30min)
    pollInterval?: number;        // 1000-30000 (1s-30s), default: 2000 (2s)
  };
}
```

## Configuration Options

### 1. Agents Configuration

Configure different agents with their specific settings:

```json
"agents": {
  "default": {
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 4000
  },
  "fast": {
    "model": "gpt-3.5-turbo",
    "temperature": 0.3,
    "maxTokens": 1000
  },
  "creative": {
    "model": "gpt-4",
    "temperature": 0.9,
    "maxTokens": 8000
  }
}
```

**Options:**
- `model`: The model to use (e.g., "gpt-4", "gpt-3.5-turbo")
- `temperature`: Controls randomness (0 = deterministic, 2 = very random)
- `maxTokens`: Maximum number of tokens in response
- `topP`: Nucleus sampling parameter (0-1)
- `frequencyPenalty`: Penalize repeated tokens
- `presencePenalty`: Penalize new tokens
- `stop`: Stop sequences
- `stream`: Whether to stream the response

### 2. Permissions

Configure permissions for different operations:

```json
"permissions": {
  "background_tasks": ["user1", "user2"],
  "agent_calling": ["admin", "poweruser"]
}
```

### 3. Background Configuration

Configure background task behavior:

```json
"background": {
  "maxConcurrentTasks": 10,
  "taskTTL": 1800000,
  "pollInterval": 2000
}
```

**Options:**
- `maxConcurrentTasks`: Maximum number of concurrent background tasks (1-100, default: 10)
- `taskTTL`: Time-to-live for tasks in milliseconds (1min-24hr, default: 1800000 = 30min)
- `pollInterval`: Interval for polling task status in milliseconds (1s-30s, default: 2000 = 2s)

## Default Configuration

If no configuration is provided, the plugin uses these defaults:

```json
{
  "agents": {},
  "permissions": {},
  "background": {
    "maxConcurrentTasks": 10,
    "taskTTL": 1800000,
    "pollInterval": 2000
  }
}
```

## Example Configurations

### Basic Configuration

```json
{
  "plugins": {
    "my-opencode-plugin": {
      "background": {
        "maxConcurrentTasks": 5,
        "taskTTL": 3600000  // 1 hour
      }
    }
  }
}
```

### Advanced Configuration

```json
{
  "plugins": {
    "my-opencode-plugin": {
      "agents": {
        "default": {
          "model": "gpt-4",
          "temperature": 0.7,
          "maxTokens": 4000
        },
        "fast": {
          "model": "gpt-3.5-turbo",
          "temperature": 0.3,
          "maxTokens": 1000
        }
      },
      "background": {
        "maxConcurrentTasks": 15,
        "taskTTL": 7200000,  // 2 hours
        "pollInterval": 3000  // 3 seconds
      }
    }
  }
}
```

## Configuration Validation

The plugin uses Zod for configuration validation. If your configuration is invalid, you'll see an error message with details about what's wrong.

### Common Validation Errors

1. **Invalid temperature value**: Must be between 0 and 2
2. **Invalid taskTTL**: Must be between 60000 (1min) and 86400000 (24hr)
3. **Invalid pollInterval**: Must be between 1000 (1s) and 30000 (30s)
4. **Invalid maxConcurrentTasks**: Must be between 1 and 100

## Environment Variables

You can also configure the plugin using environment variables:

- `OPENCODE_PLUGIN_CONFIG_PATH`: Path to custom configuration file
- `OPENCODE_AGENT_MODEL`: Default agent model
- `OPENCODE_AGENT_TEMPERATURE`: Default agent temperature

## Configuration Priority

The plugin merges configuration in this order (later overrides earlier):

1. Default configuration
2. Environment variables
3. Configuration file
4. Runtime configuration updates

## Runtime Configuration Updates

You can update the configuration at runtime:

```typescript
const plugin = new MyOpenCodePlugin();

// Get current configuration
const config = plugin.getConfig();

// Update configuration
plugin.updateConfig({
  background: {
    maxConcurrentTasks: 20
  }
});

// Get updated configuration
const newConfig = plugin.getConfig();
```

## See Also

- [Installation Guide](installation.md) - Install the plugin
- [Tools Guide](tools.md) - Learn about the tools
- [Examples](examples.md) - See usage examples
- [API Reference](../api-reference/plugin.md) - Plugin API documentation
