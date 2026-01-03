# Async Subagent Tasks Tutorial

## Overview

This tutorial demonstrates how to use the async subagent feature in my-opencode-plugin. Subagents allow you to run specialized tasks in the background while continuing to work on other tasks.

## Prerequisites

1. OpenCode installed
2. my-opencode-plugin installed (see install-plugin.sh)
3. Node.js 18+ and bun or npm

## Installation

```bash
# From the plugin directory
./install-plugin.sh
```

## Basic Usage

### 1. Create a Subagent

```bash
Use subagent with description='Analyze codebase', prompt='Analyze the codebase structure and complexity', agent='general'
```

**Parameters:**
- `description`: Short task description (shown in status)
- `prompt`: Full detailed prompt for the agent
- `agent`: Agent type to use (any registered agent)
- `run_in_background`: Run asynchronously (default: true)

### 2. Check Task Status

When the task completes, you'll receive a notification. To check the output:

```bash
Use subagent_output with task_id='TASK_ID'
```

**Parameters:**
- `task_id`: The task ID returned when creating the task
- `block`: Wait for completion (default: false)
- `timeout`: Timeout in milliseconds (default: 60000)

### 3. Cancel a Task

To cancel a running task:

```bash
Use subagent_cancel with taskId='TASK_ID'
```

Or cancel all running tasks:

```bash
Use subagent_cancel with all=true
```

## Advanced Examples

### Example 1: Multiple Concurrent Subagents

```bash
# Create multiple tasks
Use subagent with description='Analyze frontend', prompt='Analyze the frontend code', agent='general'
Use subagent with description='Analyze backend', prompt='Analyze the backend code', agent='general'
Use subagent with description='Check tests', prompt='Review test coverage', agent='general'

# Continue working while tasks run in background
# ... do other work ...

# Check results when notified
Use subagent_output with task_id='bg_12345678'
Use subagent_output with task_id='bg_87654321'
```

### Example 2: Conditional Task Creation

```bash
# Only create subagent if certain conditions are met
Use glob with pattern='**/*.ts'

# If TypeScript files found, analyze them
Use subagent with description='TypeScript analysis', prompt='Analyze TypeScript code quality', agent='general'
```

### Example 3: Background Code Generation

```bash
# Generate code in background while you work on other things
Use subagent with description='Generate API client', prompt='Generate a TypeScript API client for the REST endpoints', agent='general'

# Continue with documentation
Use edit with filePath='README.md' ...
```

## Best Practices

1. **Use descriptive descriptions**: Helps track multiple tasks
2. **Keep prompts focused**: Subagents work best with specific tasks
3. **Check results promptly**: Completed tasks stay in memory temporarily
4. **Use task IDs**: Store task IDs if you need to reference them later
5. **Monitor resources**: Don't create too many concurrent tasks

## Troubleshooting

### Task not found
**Error**: `Task not found: TASK_ID`
**Solution**: The task may have timed out or been cleaned up. Check if the task completed successfully.

### Task timed out
**Error**: `Task timed out after 30 minutes`
**Solution**: Increase the task TTL in your config or break the task into smaller parts.

### Agent not available
**Error**: `Agent not found`
**Solution**: Use a valid agent name. Check available agents with your configuration.

## Configuration

You can configure the background manager in your OpenCode config:

```json
{
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

**Options:**
- `maxConcurrentTasks`: Maximum tasks running simultaneously
- `taskTTL`: Task timeout in milliseconds (default: 30 minutes)
- `pollInterval`: How often to check task status (default: 2000ms)

## Technical Details

### How It Works

1. **Task Creation**: When you create a subagent, it's added to the background manager
2. **Async Execution**: The task runs in the background using the specified agent
3. **Status Polling**: The manager periodically checks task status
4. **Completion Notification**: When complete, you receive a notification with the task ID
5. **Result Retrieval**: Use `subagent_output` to get the results

### Task Lifecycle

```
[Running] → [Completed] or [Error] or [Cancelled]
```

- **Running**: Task is executing
- **Completed**: Task finished successfully
- **Error**: Task encountered an error
- **Cancelled**: Task was cancelled by user

## Tips

1. **Use for long-running tasks**: Perfect for code analysis, documentation generation, or complex searches
2. **Combine with other tools**: Use subagents alongside glob, grep, and edit for powerful workflows
3. **Create workflows**: Chain multiple subagents to build complex automation
4. **Monitor progress**: Check task status periodically with `subagent_output`

## Support

For issues or questions:
1. Check the plugin documentation
2. Review the code in `src/tools/subagent/`
3. Look at test cases in `src/tools/subagent/__tests__/`

## License

MIT
