# MyOpenCodePlugin API

This document provides the API reference for the `MyOpenCodePlugin` class.

## Overview

The `MyOpenCodePlugin` class is the main entry point for the plugin. It orchestrates all components and provides the public API.

## Class: MyOpenCodePlugin

```typescript
class MyOpenCodePlugin {
  constructor(options?: PluginOptions);
  
  initialize(session: AgentSession): Promise<void>;
  getTools(): Record<string, Tool>;
  getConfigHandlers(): ConfigHandler[];
  cleanup(): Promise<void>;
  getConfig(): PluginConfig;
  updateConfig(newConfig: Partial<PluginConfig>): void;
}
```

## Constructor

```typescript
constructor(options?: PluginOptions)
```

**Parameters:**
- `options` (`PluginOptions`, optional): Plugin configuration options
  - `configPath` (`string`, optional): Path to configuration file
  - `backgroundManagerOptions` (`BackgroundManagerOptions`, optional): Background manager options

**Example:**

```typescript
// Create plugin with default options
const plugin = new MyOpenCodePlugin();

// Create plugin with custom configuration
const plugin = new MyOpenCodePlugin({
  configPath: '/path/to/config.json',
  backgroundManagerOptions: {
    pollInterval: 3000,
    taskTTL: 3600000
  }
});
```

## Methods

### initialize

```typescript
initialize(session: AgentSession): Promise<void>
```

Initialize the plugin with an agent session.

**Parameters:**
- `session` (`AgentSession`): Agent session for communication

**Returns:** `Promise<void>`

**Example:**

```typescript
const session = {
  id: 'session-123',
  getStatus: async () => 'running',
  sendMessage: async (message) => { /* ... */ }
};

await plugin.initialize(session);
```

### getTools

```typescript
getTools(): Record<string, Tool>
```

Get all available tools provided by the plugin.

**Returns:** `Record<string, Tool>` - Object with tool names as keys and tool functions as values

**Example:**

```typescript
const tools = plugin.getTools();

// Access specific tools
const backgroundTaskTool = tools.background_task;
const callAgentTool = tools.call_agent;
```

### getConfigHandlers

```typescript
getConfigHandlers(): ConfigHandler[]
```

Get configuration handlers for the plugin.

**Returns:** `ConfigHandler[]` - Array of configuration handlers

**Example:**

```typescript
const configHandlers = plugin.getConfigHandlers();

// Use configuration handlers
configHandlers.forEach(handler => {
  // Handle configuration
});
```

### cleanup

```typescript
cleanup(): Promise<void>
```

Clean up plugin resources and stop background tasks.

**Returns:** `Promise<void>`

**Example:**

```typescript
// Clean up when shutting down
await plugin.cleanup();
```

### getConfig

```typescript
getConfig(): PluginConfig
```

Get the current plugin configuration.

**Returns:** `PluginConfig` - Current configuration

**Example:**

```typescript
const config = plugin.getConfig();

console.log('Max concurrent tasks:', config.background?.maxConcurrentTasks);
```

### updateConfig

```typescript
updateConfig(newConfig: Partial<PluginConfig>): void
```

Update the plugin configuration at runtime.

**Parameters:**
- `newConfig` (`Partial<PluginConfig>`): Partial configuration to merge with current configuration

**Example:**

```typescript
// Update background configuration
plugin.updateConfig({
  background: {
    maxConcurrentTasks: 20
  }
});

// Update agent configuration
plugin.updateConfig({
  agents: {
    default: {
      temperature: 0.9
    }
  }
});
```

## Interfaces

### PluginOptions

```typescript
interface PluginOptions {
  configPath?: string;
  backgroundManagerOptions?: BackgroundManagerOptions;
}
```

**Properties:**
- `configPath` (`string`, optional): Path to configuration file
- `backgroundManagerOptions` (`BackgroundManagerOptions`, optional): Background manager options

### PluginConfig

See [Configuration Schema](../user-guide/configuration.md#configuration-schema) for details.

## Examples

### Basic Usage

```typescript
// Create plugin
const plugin = new MyOpenCodePlugin();

// Initialize with session
const session = {
  id: 'session-123',
  getStatus: async () => 'running',
  sendMessage: async (message) => { /* ... */ }
};

await plugin.initialize(session);

// Get tools
const tools = plugin.getTools();

// Use tools
const task = await tools.background_task({
  options: {
    agent: 'default',
    prompt: 'Do something'
  }
});

// Clean up
await plugin.cleanup();
```

### Advanced Usage

```typescript
// Create plugin with custom configuration
const plugin = new MyOpenCodePlugin({
  configPath: '/path/to/custom-config.json',
  backgroundManagerOptions: {
    pollInterval: 3000,
    taskTTL: 7200000
  }
});

// Get current configuration
const config = plugin.getConfig();

// Update configuration
plugin.updateConfig({
  background: {
    maxConcurrentTasks: 15
  }
});

// Get updated configuration
const newConfig = plugin.getConfig();
```

## See Also

- [BackgroundManager API](manager.md) - BackgroundManager API
- [ConfigLoader API](config.md) - ConfigLoader API
- [Type Definitions](types.md) - Type definitions
- [User Guide](../user-guide/) - User documentation
- [Development Guide](../development/) - Development documentation
