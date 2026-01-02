# Tools Guide

This guide explains the tools provided by the My-OpenCode-Plugin.

## Available Tools

The plugin provides 4 tools for OpenCode:

1. [background_task](#background_task) - Create background tasks
2. [background_output](#background_output) - Get output from background tasks
3. [background_cancel](#background_cancel) - Cancel background tasks
4. [call_agent](#call_agent) - Call agents with optional background execution

## 1. background_task

Create a new background task.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | No | Optional task ID. If not provided, one will be generated. |
| sessionId | string | No | Optional session ID to use for this task. |
| options | object | Yes | Task options |
| options.agent | string | Yes | Agent to use for this task |
| options.prompt | string | Yes | Prompt to send to the agent |
| options.background | boolean | No | Whether to run in background (default: true) |

### Returns

`BackgroundTask` object with:
- `id`: Task ID
- `status`: Task status ('running', 'completed', 'error', 'cancelled')
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `options`: Task options
- `sessionId`: Session ID

### Examples

#### Create a background task

```typescript
// Create a task with auto-generated ID
const task = await background_task({
  options: {
    agent: 'default',
    prompt: 'Write a summary of the meeting'
  }
});

// Create a task with custom ID
const task = await background_task({
  id: 'meeting-summary-123',
  options: {
    agent: 'default',
    prompt: 'Write a summary of the meeting'
  }
});
```

### Error Handling

- Throws error if BackgroundManager is not initialized
- Throws error if required parameters are missing

## 2. background_output

Get output from a background task.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| taskId | string | Yes | ID of the task to get output from |
| wait | boolean | No | Whether to wait for task completion (default: false) |
| timeout | number | No | Timeout in milliseconds to wait for task completion |

### Returns

`GetBackgroundOutputResult` object with:
- `status`: Task status
- `taskId`: Task ID
- `output`: Task output (if available)
- `result`: Task result (if completed)
- `error`: Error message (if failed)

### Examples

#### Get task output

```typescript
// Get current output (non-blocking)
const output = await background_output({
  taskId: 'meeting-summary-123'
});

// Wait for task completion
const result = await background_output({
  taskId: 'meeting-summary-123',
  wait: true,
  timeout: 30000  // 30 seconds
});

// Check if task completed
if (result.status === 'completed') {
  console.log('Task result:', result.result);
} else if (result.status === 'error') {
  console.error('Task failed:', result.error);
}
```

### Error Handling

- Throws error if task not found
- Throws error if timeout exceeded while waiting

## 3. background_cancel

Cancel a background task or all running tasks.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| taskId | string | No | ID of the task to cancel |
| all | boolean | No | Whether to cancel all running tasks |
| force | boolean | No | Whether to force cancel the task |

### Returns

- If `all` is true: Array of cancelled tasks
- If `taskId` is provided: Cancelled task

### Examples

#### Cancel a specific task

```typescript
// Cancel a specific task
const cancelledTask = await background_cancel({
  taskId: 'meeting-summary-123'
});

// Force cancel a task
const cancelledTask = await background_cancel({
  taskId: 'meeting-summary-123',
  force: true
});
```

#### Cancel all running tasks

```typescript
// Cancel all running tasks
const cancelledTasks = await background_cancel({
  all: true
});

console.log(`Cancelled ${cancelledTasks.length} tasks`);
```

### Error Handling

- Throws error if neither taskId nor all is provided
- Throws error if task not found

## 4. call_agent

Call a specialized agent with optional background execution.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| agent | string | Yes | Name of the agent to call |
| prompt | string | Yes | Prompt to send to the agent |
| background | boolean | No | Whether to run in background (default: false) |
| options | object | No | Additional agent call options |
| options.sessionId | string | No | Optional session ID to use |
| options.taskId | string | No | Optional task ID to use |

### Returns

`AgentCallResult` object with:
- `status`: Call status ('running', 'completed', 'error')
- `taskId`: Task ID (if running in background)
- `result`: Agent response (if completed)
- `error`: Error message (if failed)

### Examples

#### Call agent synchronously

```typescript
// Call agent and wait for response
const result = await call_agent({
  agent: 'default',
  prompt: 'Write a summary of the meeting'
});

console.log('Response:', result.result);
```

#### Call agent in background

```typescript
// Call agent in background
const result = await call_agent({
  agent: 'default',
  prompt: 'Write a summary of the meeting',
  background: true
});

console.log('Task ID:', result.taskId);

// Later, get the result
const output = await background_output({
  taskId: result.taskId,
  wait: true
});
```

#### Call agent with custom session

```typescript
// Call agent with custom session
const result = await call_agent({
  agent: 'default',
  prompt: 'Write a summary of the meeting',
  options: {
    sessionId: 'custom-session-123'
  }
});
```

### Error Handling

- Throws error if agent not found
- Throws error if required parameters are missing
- Returns error in result if agent call fails

## Tool Composition

You can compose tools together to create more complex workflows:

```typescript
// Create a background task
const task = await background_task({
  options: {
    agent: 'default',
    prompt: 'Analyze this codebase'
  }
});

// Wait for completion
const result = await background_output({
  taskId: task.id,
  wait: true,
  timeout: 60000
});

// Process the result
if (result.status === 'completed') {
  // Do something with the result
  const analysis = result.result;
  
  // Call another agent to summarize
  const summary = await call_agent({
    agent: 'fast',
    prompt: `Summarize this analysis: ${analysis}`
  });
  
  console.log('Summary:', summary.result);
}
```

## Best Practices

1. **Use background tasks for long-running operations**
2. **Set appropriate timeouts** for waiting on tasks
3. **Handle errors gracefully**
4. **Clean up cancelled tasks**
5. **Use descriptive task IDs** for easier debugging
6. **Monitor task status** to provide feedback to users

## See Also

- [Examples](examples.md) - See practical usage examples
- [Configuration Guide](configuration.md) - Configure the plugin
- [API Reference](../api-reference/) - API documentation
