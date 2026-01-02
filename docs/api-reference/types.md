# Type Definitions

This document provides the type definitions used throughout the My-OpenCode-Plugin.

## Background Task Types

### BackgroundTaskStatus

```typescript
type BackgroundTaskStatus = 'running' | 'completed' | 'error' | 'cancelled';
```

**Values:**
- `'running'`: Task is currently running
- `'completed'`: Task completed successfully
- `'error'`: Task failed with an error
- `'cancelled'`: Task was cancelled

**Example:**

```typescript
function handleTaskStatus(status: BackgroundTaskStatus) {
  switch (status) {
    case 'running':
      console.log('Task is running');
      break;
    case 'completed':
      console.log('Task completed');
      break;
    case 'error':
      console.log('Task failed');
      break;
    case 'cancelled':
      console.log('Task cancelled');
      break;
  }
}
```

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
- `id` (`string`): Unique task identifier
- `status` (`BackgroundTaskStatus`): Current task status
- `createdAt` (`number`): Timestamp when task was created (milliseconds since epoch)
- `updatedAt` (`number`): Timestamp when task was last updated (milliseconds since epoch)
- `options` (`any`): Task options and parameters
- `sessionId` (`string`, optional): Associated session ID
- `result` (`any`, optional): Task result (present if completed)
- `error` (`string`, optional): Error message (present if failed)
- `output` (`string`, optional): Task output

**Example:**

```typescript
const task: BackgroundTask = {
  id: 'task-123',
  status: 'running',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  options: {
    agent: 'default',
    prompt: 'Do something'
  },
  sessionId: 'session-456'
};
```

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

**Constraints:**
- `pollInterval`: 1000-30000 (1s-30s)
- `taskTTL`: 60000-86400000 (1min-24hr)

**Example:**

```typescript
const options: BackgroundManagerOptions = {
  pollInterval: 3000,
  taskTTL: 7200000
};
```

### CreateBackgroundTaskOptions

```typescript
interface CreateBackgroundTaskOptions {
  id?: string;
  sessionId?: string;
  options: any;
}
```

**Properties:**
- `id` (`string`, optional): Custom task ID (auto-generated if not provided)
- `sessionId` (`string`, optional): Session ID for the task
- `options` (`any`): Task-specific options

**Example:**

```typescript
const taskOptions: CreateBackgroundTaskOptions = {
  id: 'custom-task-id',
  sessionId: 'session-789',
  options: {
    agent: 'default',
    prompt: 'Analyze this code'
  }
};
```

## Output Types

### GetBackgroundOutputOptions

```typescript
interface GetBackgroundOutputOptions {
  taskId: string;
  wait?: boolean;
  timeout?: number;
  [key: string]: any;
}
```

**Properties:**
- `taskId` (`string`): Task ID to get output from
- `wait` (`boolean`, optional): Whether to wait for task completion (default: false)
- `timeout` (`number`, optional): Timeout in milliseconds for waiting
- `[key: string]`: Additional custom options

**Example:**

```typescript
const outputOptions: GetBackgroundOutputOptions = {
  taskId: 'task-123',
  wait: true,
  timeout: 30000
};
```

### GetBackgroundOutputResult

```typescript
interface GetBackgroundOutputResult {
  status: BackgroundTaskStatus;
  taskId: string;
  output?: string;
  result?: any;
  error?: string;
}
```

**Properties:**
- `status` (`BackgroundTaskStatus`): Current task status
- `taskId` (`string`): Task ID
- `output` (`string`, optional): Task output (if available)
- `result` (`any`, optional): Task result (if completed)
- `error` (`string`, optional): Error message (if failed)

**Example:**

```typescript
const outputResult: GetBackgroundOutputResult = {
  status: 'completed',
  taskId: 'task-123',
  output: 'Task output',
  result: { data: 'Task result' }
};
```

## Cancellation Types

### CancelOptions

```typescript
interface CancelOptions {
  taskId?: string;
  all?: boolean;
  force?: boolean;
}
```

**Properties:**
- `taskId` (`string`, optional): Specific task ID to cancel
- `all` (`boolean`, optional): Whether to cancel all running tasks
- `force` (`boolean`, optional): Whether to force cancellation

**Note:** Either `taskId` or `all` must be provided.

**Example:**

```typescript
// Cancel specific task
const cancelOptions1: CancelOptions = {
  taskId: 'task-123',
  force: true
};

// Cancel all tasks
const cancelOptions2: CancelOptions = {
  all: true
};
```

## Agent Types

### AgentSession

```typescript
interface AgentSession {
  id: string;
  getStatus(): Promise<string>;
  sendMessage(message: any): Promise<void>;
}
```

**Properties:**
- `id` (`string`): Session identifier
- `getStatus()` (`() => Promise<string>`): Get current session status
- `sendMessage(message)` (`(message: any) => Promise<void>`): Send message to session

**Example:**

```typescript
const session: AgentSession = {
  id: 'session-123',
  getStatus: async () => 'running',
  sendMessage: async (message) => {
    // Send message to agent
    console.log('Message sent:', message);
  }
};
```

### TaskNotification

```typescript
interface TaskNotification {
  type: 'task_completion';
  taskId: string;
  status: BackgroundTaskStatus;
  timestamp: number;
}
```

**Properties:**
- `type` (`'task_completion'`): Notification type (always 'task_completion')
- `taskId` (`string`): Task ID
- `status` (`BackgroundTaskStatus`): Task status
- `timestamp` (`number`): Notification timestamp

**Example:**

```typescript
const notification: TaskNotification = {
  type: 'task_completion',
  taskId: 'task-123',
  status: 'completed',
  timestamp: Date.now()
};
```

### AgentCallOptions

```typescript
interface AgentCallOptions {
  agent: string;
  prompt: string;
  background?: boolean;
  options?: {
    sessionId?: string;
    taskId?: string;
    [key: string]: any;
  };
}
```

**Properties:**
- `agent` (`string`): Agent name to call
- `prompt` (`string`): Prompt to send to agent
- `background` (`boolean`, optional): Whether to run in background (default: false)
- `options` (`object`, optional): Additional options
  - `sessionId` (`string`, optional): Session ID
  - `taskId` (`string`, optional): Task ID
  - `[key: string]`: Custom options

**Example:**

```typescript
const callOptions: AgentCallOptions = {
  agent: 'default',
  prompt: 'Write a summary',
  background: true,
  options: {
    sessionId: 'session-456',
    taskId: 'task-789'
  }
};
```

### AgentCallResult

```typescript
interface AgentCallResult {
  status: 'running' | 'completed' | 'error';
  taskId?: string;
  result?: any;
  error?: string;
}
```

**Properties:**
- `status` (`'running' | 'completed' | 'error'`): Call status
- `taskId` (`string`, optional): Task ID (if running in background)
- `result` (`any`, optional): Agent response (if completed)
- `error` (`string`, optional): Error message (if failed)

**Example:**

```typescript
const callResult: AgentCallResult = {
  status: 'completed',
  result: 'Agent response'
};
```

## Plugin Types

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

**Example:**

```typescript
const pluginOptions: PluginOptions = {
  configPath: '/path/to/config.json',
  backgroundManagerOptions: {
    pollInterval: 3000,
    taskTTL: 7200000
  }
};
```

### PluginConfig

See [ConfigLoader API](config.md) for complete definition.

## Usage Examples

### Type-Safe Task Creation

```typescript
async function createTaskSafely(options: CreateBackgroundTaskOptions): Promise<BackgroundTask> {
  // Validate options
  if (!options.options) {
    throw new Error('Options must be provided');
  }
  
  // Create task
  const task: BackgroundTask = {
    id: options.id || `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    status: 'running',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    options: options.options,
    sessionId: options.sessionId
  };
  
  return task;
}
```

### Task Status Handling

```typescript
function handleTaskStatus(status: BackgroundTaskStatus): string {
  switch (status) {
    case 'running':
      return 'Task is in progress';
    case 'completed':
      return 'Task completed successfully';
    case 'error':
      return 'Task failed';
    case 'cancelled':
      return 'Task was cancelled';
    default:
      return 'Unknown status';
  }
}
```

### Output Result Processing

```typescript
async function processTaskOutput(options: GetBackgroundOutputOptions): Promise<void> {
  const result: GetBackgroundOutputResult = await getOutput(options.taskId, options);
  
  switch (result.status) {
    case 'running':
      console.log('Task still running');
      break;
    case 'completed':
      console.log('Task completed:', result.result);
      break;
    case 'error':
      console.error('Task failed:', result.error);
      break;
    case 'cancelled':
      console.log('Task was cancelled');
      break;
  }
}
```

## Best Practices

### Type Safety

1. **Use specific types** instead of `any` where possible
2. **Leverage TypeScript's type system** for better code quality
3. **Add JSDoc comments** for better IDE support
4. **Use type guards** for runtime type checking
5. **Keep types simple and focused**

### Type Extensions

```typescript
// Extend existing types when needed
interface ExtendedBackgroundTask extends BackgroundTask {
  priority: 'low' | 'medium' | 'high';
  retries: number;
}

// Use the extended type
const extendedTask: ExtendedBackgroundTask = {
  id: 'task-123',
  status: 'running',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  options: {},
  priority: 'high',
  retries: 0
};
```

## See Also

- [Plugin API](plugin.md) - MyOpenCodePlugin API
- [BackgroundManager API](manager.md) - BackgroundManager API
- [ConfigLoader API](config.md) - ConfigLoader API
- [User Guide](../user-guide/) - User documentation
- [Development Guide](../development/) - Development documentation
