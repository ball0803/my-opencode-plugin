# BackgroundManager API

This document provides the API reference for the `BackgroundManager` class.

## Overview

The `BackgroundManager` class manages background tasks and their lifecycle.

## Class: BackgroundManager

```typescript
class BackgroundManager {
  constructor(options?: BackgroundManagerOptions);
  
  initialize(session: AgentSession): Promise<void>;
  createTask(options: CreateBackgroundTaskOptions): Promise<BackgroundTask>;
  completeTask(taskId: string, result?: unknown): Promise<BackgroundTask>;
  failTask(taskId: string, error: string | Error): Promise<BackgroundTask>;
  cancelTask(taskId: string, options?: CancelOptions): Promise<BackgroundTask>;
  getTask(taskId: string): Promise<BackgroundTask | null>;
  getAllTasks(status?: BackgroundTaskStatus): Promise<BackgroundTask[]>;
  cancelAllTasks(options?: CancelOptions): Promise<BackgroundTask[]>;
  getOutput(taskId: string, options?: GetBackgroundOutputOptions): Promise<GetBackgroundOutputResult>;
  cleanup(): Promise<void>;
  callAgent(agent: string, prompt: string, options?: any): Promise<any>;
}
```

## Constructor

```typescript
constructor(options?: BackgroundManagerOptions)
```

**Parameters:**
- `options` (`BackgroundManagerOptions`, optional): Background manager options
  - `pollInterval` (`number`, optional): Polling interval in milliseconds (default: 2000)
  - `taskTTL` (`number`, optional): Task time-to-live in milliseconds (default: 1800000 = 30min)

**Example:**

```typescript
// Create manager with default options
const manager = new BackgroundManager();

// Create manager with custom options
const manager = new BackgroundManager({
  pollInterval: 3000,
  taskTTL: 7200000
});
```

## Methods

### initialize

```typescript
initialize(session: AgentSession): Promise<void>
```

Initialize the manager with an agent session and start polling.

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

await manager.initialize(session);
```

### createTask

```typescript
createTask(options: CreateBackgroundTaskOptions): Promise<BackgroundTask>
```

Create a new background task.

**Parameters:**
- `options` (`CreateBackgroundTaskOptions`): Task creation options
  - `id` (`string`, optional): Task ID (auto-generated if not provided)
  - `sessionId` (`string`, optional): Session ID
  - `options` (`any`): Task options

**Returns:** `Promise<BackgroundTask>` - Created task

**Example:**

```typescript
// Create task with auto-generated ID
const task = await manager.createTask({
  options: {
    agent: 'default',
    prompt: 'Do something'
  }
});

// Create task with custom ID
const task = await manager.createTask({
  id: 'custom-task-id',
  options: {
    agent: 'default',
    prompt: 'Do something'
  }
});
```

### completeTask

```typescript
completeTask(taskId: string, result?: unknown): Promise<BackgroundTask>
```

Mark a task as completed.

**Parameters:**
- `taskId` (`string`): Task ID
- `result` (`unknown`, optional): Task result

**Returns:** `Promise<BackgroundTask>` - Updated task

**Throws:** `Error` if task not found

**Example:**

```typescript
const task = await manager.createTask({
  options: { agent: 'default', prompt: 'Do something' }
});

// Later, when task is done
await manager.completeTask(task.id, { result: 'Task completed' });
```

### failTask

```typescript
failTask(taskId: string, error: string | Error): Promise<BackgroundTask>
```

Mark a task as failed.

**Parameters:**
- `taskId` (`string`): Task ID
- `error` (`string | Error`): Error message or object

**Returns:** `Promise<BackgroundTask>` - Updated task

**Throws:** `Error` if task not found

**Example:**

```typescript
try {
  // Do something
} catch (error) {
  await manager.failTask(task.id, error);
}
```

### cancelTask

```typescript
cancelTask(taskId: string, options?: CancelOptions): Promise<BackgroundTask>
```

Cancel a task.

**Parameters:**
- `taskId` (`string`): Task ID
- `options` (`CancelOptions`, optional): Cancellation options
  - `force` (`boolean`, optional): Force cancellation

**Returns:** `Promise<BackgroundTask>` - Updated task

**Throws:** `Error` if task not found

**Example:**

```typescript
// Cancel a task
const cancelledTask = await manager.cancelTask(task.id);

// Force cancel a task
const cancelledTask = await manager.cancelTask(task.id, { force: true });
```

### getTask

```typescript
getTask(taskId: string): Promise<BackgroundTask | null>
```

Get a specific task by ID.

**Parameters:**
- `taskId` (`string`): Task ID

**Returns:** `Promise<BackgroundTask | null>` - Task or null if not found

**Example:**

```typescript
const task = await manager.getTask(task.id);

if (task) {
  console.log('Task status:', task.status);
} else {
  console.log('Task not found');
}
```

### getAllTasks

```typescript
getAllTasks(status?: BackgroundTaskStatus): Promise<BackgroundTask[]>
```

Get all tasks, optionally filtered by status.

**Parameters:**
- `status` (`BackgroundTaskStatus`, optional): Filter by status

**Returns:** `Promise<BackgroundTask[]>` - Array of tasks

**Example:**

```typescript
// Get all tasks
const allTasks = await manager.getAllTasks();

// Get only running tasks
const runningTasks = await manager.getAllTasks('running');
```

### cancelAllTasks

```typescript
cancelAllTasks(options?: CancelOptions): Promise<BackgroundTask[]>
```

Cancel all running tasks.

**Parameters:**
- `options` (`CancelOptions`, optional): Cancellation options

**Returns:** `Promise<BackgroundTask[]>` - Array of cancelled tasks

**Example:**

```typescript
// Cancel all running tasks
const cancelledTasks = await manager.cancelAllTasks();

console.log(`Cancelled ${cancelledTasks.length} tasks`);
```

### getOutput

```typescript
getOutput(taskId: string, options?: GetBackgroundOutputOptions): Promise<GetBackgroundOutputResult>
```

Get output from a task.

**Parameters:**
- `taskId` (`string`): Task ID
- `options` (`GetBackgroundOutputOptions`, optional): Output options
  - `wait` (`boolean`, optional): Wait for completion
  - `timeout` (`number`, optional): Timeout in milliseconds

**Returns:** `Promise<GetBackgroundOutputResult>` - Task output result

**Throws:** `Error` if task not found

**Example:**

```typescript
// Get current output
const output = await manager.getOutput(task.id);

// Wait for completion
const result = await manager.getOutput(task.id, {
  wait: true,
  timeout: 30000
});
```

### cleanup

```typescript
cleanup(): Promise<void>
```

Clean up resources and stop polling.

**Returns:** `Promise<void>`

**Example:**

```typescript
// Clean up when shutting down
await manager.cleanup();
```

### callAgent

```typescript
callAgent(agent: string, prompt: string, options?: any): Promise<any>
```

Call an agent (mock implementation).

**Parameters:**
- `agent` (`string`): Agent name
- `prompt` (`string`): Prompt to send
- `options` (`any`, optional): Additional options

**Returns:** `Promise<any>` - Agent response

**Example:**

```typescript
const response = await manager.callAgent('default', 'Write a summary');
console.log('Response:', response);
```

## Interfaces

### BackgroundManagerOptions

```typescript
interface BackgroundManagerOptions {
  pollInterval?: number;
  taskTTL?: number;
}
```

**Properties:**
- `pollInterval` (`number`, optional): Polling interval in milliseconds (default: 2000)
- `taskTTL` (`number`, optional): Task time-to-live in milliseconds (default: 1800000 = 30min)

### CreateBackgroundTaskOptions

```typescript
interface CreateBackgroundTaskOptions {
  id?: string;
  sessionId?: string;
  options: any;
}
```

**Properties:**
- `id` (`string`, optional): Task ID (auto-generated if not provided)
- `sessionId` (`string`, optional): Session ID
- `options` (`any`): Task options

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

**Properties:**
- `id` (`string`): Task ID
- `status` (`BackgroundTaskStatus`): Task status
- `createdAt` (`number`): Creation timestamp
- `updatedAt` (`number`): Last update timestamp
- `options` (`any`): Task options
- `sessionId` (`string`, optional): Session ID
- `result` (`any`, optional): Task result (if completed)
- `error` (`string`, optional): Error message (if failed)
- `output` (`string`, optional): Task output

### BackgroundTaskStatus

```typescript
type BackgroundTaskStatus = 'running' | 'completed' | 'error' | 'cancelled';
```

**Values:**
- `'running'`: Task is running
- `'completed'`: Task completed successfully
- `'error'`: Task failed with error
- `'cancelled'`: Task was cancelled

## Examples

### Basic Task Management

```typescript
// Create manager
const manager = new BackgroundManager({
  pollInterval: 3000,
  taskTTL: 7200000
});

// Initialize with session
const session = {
  id: 'session-123',
  getStatus: async () => 'running',
  sendMessage: async (message) => { /* ... */ }
};

await manager.initialize(session);

// Create a task
const task = await manager.createTask({
  options: {
    agent: 'default',
    prompt: 'Do something'
  }
});

// Get task status
const currentTask = await manager.getTask(task.id);
console.log('Status:', currentTask?.status);

// Complete the task
await manager.completeTask(task.id, { result: 'Done' });

// Clean up
await manager.cleanup();
```

### Task Lifecycle Management

```typescript
// Create multiple tasks
const tasks = [];
for (let i = 0; i < 5; i++) {
  const task = await manager.createTask({
    options: {
      agent: 'default',
      prompt: `Task ${i}`
    }
  });
  tasks.push(task);
}

// Get all running tasks
const runningTasks = await manager.getAllTasks('running');
console.log('Running tasks:', runningTasks.length);

// Cancel all running tasks
const cancelledTasks = await manager.cancelAllTasks();
console.log('Cancelled tasks:', cancelledTasks.length);
```

## See Also

- [Plugin API](../api-reference/plugin.md) - MyOpenCodePlugin API
- [ConfigLoader API](config.md) - ConfigLoader API
- [Type Definitions](types.md) - Type definitions
- [User Guide](../user-guide/) - User documentation
- [Development Guide](../development/) - Development documentation
