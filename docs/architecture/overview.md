# Architecture Overview

This document provides a high-level overview of the My-OpenCode-Plugin architecture.

## High-Level Architecture

The plugin follows a modular architecture with clear separation of concerns:

```
┌───────────────────────────────────────────────────────────────┐
│                    MyOpenCodePlugin                           │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐│
│  │  Background     │    │  ConfigLoader   │    │  Tools      ││
│  │  Manager        │    │                 │    │  (3 tools)  ││
│  └─────────────────┘    └─────────────────┘    └─────────────┘│
└───────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. MyOpenCodePlugin (Main Class)

The entry point of the plugin that orchestrates all components:

- **Responsibilities**:
  - Initialize the plugin
  - Manage configuration
  - Provide access to tools
  - Handle lifecycle (initialize/cleanup)
  - Expose public API

- **Key Methods**:
  - `initialize(session: AgentSession)` - Initialize with agent session
  - `getTools()` - Get available tools
  - `getConfigHandlers()` - Get configuration handlers
  - `cleanup()` - Clean up resources
  - `getConfig()` - Get current configuration
  - `updateConfig()` - Update configuration

### 2. BackgroundManager

Manages background tasks and their lifecycle:

- **Responsibilities**:
  - Create, track, and manage background tasks
  - Poll task status from agent session
  - Handle task completion, errors, and cancellation
  - Clean up stale tasks
  - Notify about task completion

- **Key Features**:
  - Task polling with configurable interval
  - Task time-to-live (TTL) for automatic cleanup
  - Task status transitions (running → completed/error/cancelled)
  - Task output and result management

### 3. ConfigLoader

Handles configuration loading and validation:

- **Responsibilities**:
  - Load configuration from file or default
  - Validate configuration using Zod schema
  - Merge configuration with defaults
  - Provide access to agent-specific configuration
  - Support JSONC (JSON with comments)

### 4. Tools

The plugin provides 4 tools for OpenCode:

1. **background_task** - Create background tasks
2. **background_output** - Get output from background tasks
3. **background_cancel** - Cancel background tasks
4. **call_agent** - Call agents with optional background execution

## Data Flow

### Task Creation Flow

```
User → call_agent tool → BackgroundManager.createTask() → Task created
                                      ↓
                              Poll session status
                                      ↓
                              Task completion → notify user
```

### Configuration Flow

```
Plugin initialization → ConfigLoader.loadConfig() → Validate with Zod
                                      ↓
                              Merge with defaults
                                      ↓
                              Configuration ready
```

## Key Design Decisions

### 1. Modular Architecture

- Each component has a single responsibility
- Easy to extend and maintain
- Clear boundaries between components
- Components can be tested independently

### 2. Type Safety

- Strict TypeScript with no `any` allowed
- Zod validation for configuration
- Comprehensive type definitions
- Compile-time error checking

### 3. Background Task Management

- Polling mechanism for task status
- Configurable TTL for automatic cleanup
- Task lifecycle management
- Notification system for task completion

### 4. Configuration System

- Zod schema validation
- Default values for all options
- JSONC support (JSON with comments)
- Agent-specific configuration

## Integration with OpenCode

The plugin integrates with OpenCode through:

1. **AgentSession**: Provided by OpenCode for communication
2. **Tools**: Exposed to OpenCode for user interaction
3. **Configuration**: Loaded from OpenCode configuration

## Extensibility Points

The plugin is designed to be extended:

1. **Add New Tools**: Create new tool functions in `src/tools/`
2. **Extend BackgroundManager**: Add new methods for task management
3. **Custom Configuration**: Add new configuration options to schema
4. **Hooks**: Add lifecycle hooks for custom behavior

## Technology Stack

- **Language**: TypeScript 5.3.3+
- **Testing**: Jest 29.7.0+
- **Validation**: Zod 3.22.4+
- **Configuration**: JSONC (jsonc-parser 3.2.0+)
- **Build**: TypeScript compiler

## See Also

- [Components](components.md) - Detailed component breakdown
- [Data Flow](data-flow.md) - Data flow diagrams
- [API Reference](../api-reference/) - API documentation
