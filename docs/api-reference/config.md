# ConfigLoader API

This document provides the API reference for the `ConfigLoader` class.

## Overview

The `ConfigLoader` class handles configuration loading and validation.

## Class: ConfigLoader

```typescript
class ConfigLoader {
  constructor();
  
  loadConfig(configPath?: string): PluginConfig;
  getConfig(): PluginConfig;
  mergeConfig(newConfig: Partial<PluginConfig>): void;
  getAgentConfig(agentName: string): any;
}
```

## Constructor

```typescript
constructor()
```

**Example:**

```typescript
// Create config loader
const configLoader = new ConfigLoader();
```

## Methods

### loadConfig

```typescript
loadConfig(configPath?: string): PluginConfig
```

Load configuration from file or use defaults.

**Parameters:**
- `configPath` (`string`, optional): Path to configuration file

**Returns:** `PluginConfig` - Loaded and validated configuration

**Example:**

```typescript
// Load with default path
const config = configLoader.loadConfig();

// Load from custom path
const config = configLoader.loadConfig('/path/to/config.json');
```

### getConfig

```typescript
getConfig(): PluginConfig
```

Get the current configuration.

**Returns:** `PluginConfig` - Current configuration

**Example:**

```typescript
const config = configLoader.getConfig();
console.log('Max concurrent tasks:', config.background?.maxConcurrentTasks);
```

### mergeConfig

```typescript
mergeConfig(newConfig: Partial<PluginConfig>): void
```

Merge new configuration with current configuration.

**Parameters:**
- `newConfig` (`Partial<PluginConfig>`): Partial configuration to merge

**Example:**

```typescript
// Update background configuration
configLoader.mergeConfig({
  background: {
    maxConcurrentTasks: 20
  }
});

// Update agent configuration
configLoader.mergeConfig({
  agents: {
    default: {
      temperature: 0.9
    }
  }
});
```

### getAgentConfig

```typescript
getAgentConfig(agentName: string): any
```

Get configuration for a specific agent.

**Parameters:**
- `agentName` (`string`): Agent name

**Returns:** `any` - Agent configuration or undefined if not found

**Example:**

```typescript
// Get default agent config
const defaultConfig = configLoader.getAgentConfig('default');

// Get fast agent config
const fastConfig = configLoader.getAgentConfig('fast');

if (defaultConfig) {
  console.log('Model:', defaultConfig.model);
  console.log('Temperature:', defaultConfig.temperature);
}
```

## Interfaces

### PluginConfig

```typescript
interface PluginConfig {
  agents?: {
    [agentName: string]: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      topP?: number;
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
    maxConcurrentTasks?: number;
    taskTTL?: number;
    pollInterval?: number;
  };
}
```

**Properties:**
- `agents` (`Record<string, AgentConfig>`, optional): Agent configurations
- `permissions` (`Record<string, string[]>`, optional): Permission configurations
- `background` (`BackgroundConfig`, optional): Background task configuration

### AgentConfig

```typescript
interface AgentConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  stream?: boolean;
}
```

**Properties:**
- `model` (`string`, optional): Agent model
- `temperature` (`number`, optional): Temperature (0-2)
- `maxTokens` (`number`, optional): Maximum tokens
- `topP` (`number`, optional): Top P (0-1)
- `frequencyPenalty` (`number`, optional): Frequency penalty
- `presencePenalty` (`number`, optional): Presence penalty
- `stop` (`string[]`, optional): Stop sequences
- `stream` (`boolean`, optional): Stream response

### BackgroundConfig

```typescript
interface BackgroundConfig {
  maxConcurrentTasks?: number;
  taskTTL?: number;
  pollInterval?: number;
}
```

**Properties:**
- `maxConcurrentTasks` (`number`, optional): Max concurrent tasks (1-100, default: 10)
- `taskTTL` (`number`, optional): Task TTL in ms (60000-86400000, default: 1800000)
- `pollInterval` (`number`, optional): Poll interval in ms (1000-30000, default: 2000)

## Default Configuration

```typescript
const DEFAULT_CONFIG = {
  agents: {},
  permissions: {},
  background: {
    maxConcurrentTasks: 10,
    taskTTL: 1800000,
    pollInterval: 2000
  }
};
```

## Examples

### Basic Configuration Loading

```typescript
// Create config loader
const configLoader = new ConfigLoader();

// Load configuration
const config = configLoader.loadConfig();

// Get current configuration
const currentConfig = configLoader.getConfig();

// Update configuration
configLoader.mergeConfig({
  background: {
    maxConcurrentTasks: 15
  }
});

// Get updated configuration
const updatedConfig = configLoader.getConfig();
```

### Agent Configuration

```typescript
// Load configuration with agent settings
const config = configLoader.loadConfig();

// Add new agent
configLoader.mergeConfig({
  agents: {
    'fast': {
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
      maxTokens: 1000
    }
  }
});

// Get agent configuration
const fastConfig = configLoader.getAgentConfig('fast');

if (fastConfig) {
  console.log('Fast agent model:', fastConfig.model);
  console.log('Fast agent temperature:', fastConfig.temperature);
}
```

### Configuration Validation

```typescript
// Try to load invalid configuration
try {
  const config = configLoader.loadConfig('/path/to/invalid-config.json');
} catch (error) {
  console.error('Configuration error:', error);
  // Handle validation error
}

// Load valid configuration
const config = configLoader.loadConfig('/path/to/valid-config.json');
console.log('Configuration loaded successfully');
```

### Runtime Configuration Updates

```typescript
// Get initial configuration
const initialConfig = configLoader.getConfig();

// Update configuration at runtime
configLoader.mergeConfig({
  background: {
    maxConcurrentTasks: 20,
    taskTTL: 7200000,
    pollInterval: 3000
  },
  agents: {
    'default': {
      temperature: 0.7,
      maxTokens: 4000
    }
  }
});

// Get updated configuration
const updatedConfig = configLoader.getConfig();

// Verify changes
console.log('Max concurrent tasks:', updatedConfig.background?.maxConcurrentTasks);
console.log('Default temperature:', updatedConfig.agents?.default?.temperature);
```

## See Also

- [Plugin API](plugin.md) - MyOpenCodePlugin API
- [BackgroundManager API](manager.md) - BackgroundManager API
- [Type Definitions](types.md) - Type definitions
- [Configuration Guide](../user-guide/configuration.md) - Configuration documentation
- [Development Guide](../development/) - Development documentation
