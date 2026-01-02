# Component Breakdown

This document provides a detailed breakdown of the plugin's components and their interactions.

## Core Components

### 1. MyOpenCodePlugin

**Location:** `src/index.ts`

**Responsibilities:**
- Main plugin entry point
- Orchestrates all components
- Manages plugin lifecycle
- Provides public API
- Handles configuration
- Exposes tools to OpenCode

**Dependencies:**
- `BackgroundManager` - For task management
- `ConfigLoader` - For configuration
- `Tools` - For tool implementations

**Key Methods:**
- `initialize(session)` - Initialize plugin with agent session
- `getTools()` - Get available tools
- `getConfigHandlers()` - Get configuration handlers
- `cleanup()` - Clean up resources
- `getConfig()` - Get current configuration
- `updateConfig()` - Update configuration

### 2. BackgroundManager

**Location:** `src/background-agent/manager.ts`

**Responsibilities:**
- Create and manage background tasks
- Poll task status from agent session
- Handle task lifecycle (create, complete, fail, cancel)
- Clean up stale tasks
- Notify about task completion
- Manage task concurrency

**Dependencies:**
- `AgentSession` - For communication with OpenCode
- `BackgroundTask` - Task data structure

**Key Methods:**
- `initialize(session)` - Initialize with agent session
- `createTask(options)` - Create new task
- `completeTask(taskId, result)` - Mark task as completed
- `failTask(taskId, error)` - Mark task as failed
- `cancelTask(taskId, options)` - Cancel a task
- `getTask(taskId)` - Get specific task
- `getAllTasks(status)` - Get all tasks (optionally filtered)
- `cancelAllTasks(options)` - Cancel all running tasks
- `getOutput(taskId, options)` - Get task output
- `cleanup()` - Clean up resources
- `callAgent(agent, prompt, options)` - Call an agent

### 3. ConfigLoader

**Location:** `src/config/index.ts`

**Responsibilities:**
- Load configuration from file or defaults
- Validate configuration using Zod schema
- Merge configuration with defaults
- Provide access to agent-specific configuration
- Support JSONC (JSON with comments)

**Dependencies:**
- `zod` - For schema validation
- `jsonc-parser` - For JSONC support

**Key Methods:**
- `loadConfig(configPath)` - Load configuration
- `getConfig()` - Get current configuration
- `mergeConfig(newConfig)` - Merge new configuration
- `getAgentConfig(agentName)` - Get agent configuration

### 4. Tools

**Location:** `src/tools/`

**Responsibilities:**
- Provide tool implementations for OpenCode
- Handle user interactions
- Bridge between user and plugin functionality

**Sub-components:**

#### 4.1. Background Task Tools

**Location:** `src/tools/background-task/tools.ts`

**Tools:**
- `background_task` - Create background tasks
- `background_output` - Get output from background tasks
- `background_cancel` - Cancel background tasks

**Key Functions:**
- `createBackgroundTask(params)` - Create new task
- `getBackgroundOutput(params)` - Get task output
- `cancelBackgroundTask(params)` - Cancel task

#### 4.2. Call Agent Tools

**Location:** `src/tools/call-agent/tools.ts`

**Tools:**
- `call_agent` - Call agents with optional background execution

**Key Functions:**
- `callAgent(params)` - Call an agent

## Supporting Components

### 1. Configuration Schema

**Location:** `src/config/schema.ts`

**Responsibilities:**
- Define configuration schema using Zod
- Validate configuration structure
- Provide default values
- Enforce constraints (ranges, patterns, etc.)

**Key Schema Definitions:**
- `PluginConfigSchema` - Main configuration schema
- `AgentConfigSchema` - Agent configuration schema
- `BackgroundConfigSchema` - Background configuration schema
- `PermissionsConfigSchema` - Permissions configuration schema

### 2. Type Definitions

**Location:** `src/background-agent/types.ts`

**Responsibilities:**
- Define TypeScript interfaces and types
- Ensure type safety throughout the codebase
- Document data structures

**Key Type Definitions:**
- `BackgroundTaskStatus` - Task status enum
- `BackgroundTask` - Task data structure
- `BackgroundManagerOptions` - Manager configuration
- `CreateBackgroundTaskOptions` - Task creation options
- `GetBackgroundOutputOptions` - Output options
- `GetBackgroundOutputResult` - Output result
- `CancelOptions` - Cancellation options
- `AgentSession` - Agent session interface
- `TaskNotification` - Task notification interface
- `AgentCallOptions` - Agent call options
- `AgentCallResult` - Agent call result

### 3. Plugin Handlers

**Location:** `src/plugin-handlers/`

**Responsibilities:**
- Handle plugin-specific operations
- Manage configuration handlers
- Provide plugin-specific utilities

**Sub-components:**

#### 3.1. Config Handler

**Location:** `src/plugin-handlers/config-handler.ts`

**Responsibilities:**
- Handle configuration loading and validation
- Provide configuration handlers for OpenCode
- Manage configuration updates

**Key Functions:**
- `loadConfig()` - Load plugin configuration
- `validateConfig(config)` - Validate configuration
- `getConfigHandlers()` - Get configuration handlers

## Data Structures

### BackgroundTask

```typescript
interface BackgroundTask {
  id: string;
  status: BackgroundTaskStatus;
  createdAt: number;
  updatedAt: number;
  options: any;
  sessionId?: string;
  result?: any;
  error?: string;
  output?: string;
}
```

**Fields:**
- `id` - Unique task identifier
- `status` - Current task status (running, completed, error, cancelled)
- `createdAt` - Timestamp when task was created
- `updatedAt` - Timestamp when task was last updated
- `options` - Task-specific options
- `sessionId` - Associated session ID (optional)
- `result` - Task result (present if completed)
- `error` - Error message (present if failed)
- `output` - Task output (optional)

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

**Fields:**
- `agents` - Agent-specific configurations
- `permissions` - Permission configurations
- `background` - Background task configuration

## Component Interactions

### Initialization Flow

```
User → OpenCode → MyOpenCodePlugin.initialize() → 
  ConfigLoader.loadConfig() → 
  BackgroundManager.initialize() → 
  Tools initialization
```

### Task Creation Flow

```
User → call_agent tool → 
  BackgroundManager.createTask() → 
  Task created and stored → 
  Poll session status → 
  Task completion → notify user
```

### Configuration Flow

```
Plugin initialization → 
  ConfigLoader.loadConfig() → 
  Validate with Zod → 
  Merge with defaults → 
  Configuration ready
```

## Component Relationships

```
┌───────────────────────────────────────────────────────────────┐
│                    MyOpenCodePlugin                           │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐│
│  │  Background     │    │  ConfigLoader   │    │  Tools      ││
│  │  Manager        │    │                 │    │  (3 tools)  ││
│  └─────────────────┘    └─────────────────┘    └─────────────┘│
└───────────────────────────────────────────────────────────────┘
       ↓
┌───────────────────────────────────────────────────────────────┐
│                    BackgroundManager                          │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐│
│  │  Task Storage   │    │  Polling        │    │  Notifications││
│  │  (Map<string,   │    │  Mechanism      │    │  System      ││
│  │   BackgroundTask)│    │                 │    │             ││
│  └─────────────────┘    └─────────────────┘    └─────────────┘│
└───────────────────────────────────────────────────────────────┘
```

## Component Lifecycle

### MyOpenCodePlugin

1. **Construction** - Initialize with options
2. **Initialization** - Load config, initialize manager, setup tools
3. **Runtime** - Handle tool calls, manage configuration
4. **Cleanup** - Stop manager, clean up resources

### BackgroundManager

1. **Construction** - Initialize with options
2. **Initialization** - Set up session, start polling
3. **Runtime** - Create tasks, poll status, handle events
4. **Cleanup** - Stop polling, clean up tasks

### ConfigLoader

1. **Construction** - Initialize with defaults
2. **Loading** - Load config from file or use defaults
3. **Runtime** - Provide config access, merge updates
4. **Cleanup** - No cleanup needed

## Component Testing

Each component has its own test file:

- `src/index.test.ts` - MyOpenCodePlugin tests
- `src/background-agent/manager.test.ts` - BackgroundManager tests
- `src/config/index.test.ts` - ConfigLoader tests
- `src/tools/background-task/tools.test.ts` - Background task tools tests
- `src/tools/call-agent/tools.test.ts` - Call agent tools tests

## Component Extensibility

### Adding New Tools

1. Create new tool file in `src/tools/`
2. Define tool functions
3. Export tools
4. Add to tools index
5. Write tests
6. Update documentation

### Extending BackgroundManager

1. Add new methods to `manager.ts`
2. Update type definitions in `types.ts`
3. Write tests for new functionality
4. Update documentation

### Adding Configuration Options

1. Update schema in `schema.ts`
2. Update default configuration
3. Update documentation
4. Write tests for new options

## See Also

- [Architecture Overview](overview.md) - High-level architecture
- [Data Flow](data-flow.md) - Data flow diagrams
- [API Reference](../api-reference/) - API documentation
- [Development Guide](../development/) - Development documentation