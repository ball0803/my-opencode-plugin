# Usage Examples

This document provides practical usage examples for the My-OpenCode-Plugin.

## Basic Examples

### Create a Background Task

```typescript
// Import the plugin
const { MyOpenCodePlugin } = require('my-opencode-plugin');

// Create plugin instance
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

// Create a background task
const task = await tools.background_task({
  options: {
    agent: 'default',
    prompt: 'Write a summary of the meeting'
  }
});

console.log('Task created:', task.id);
```

### Get Task Output

```typescript
// Get current output (non-blocking)
const output = await tools.background_output({
  taskId: task.id
});

console.log('Current status:', output.status);

// Wait for task completion
const result = await tools.background_output({
  taskId: task.id,
  wait: true,
  timeout: 30000  // 30 seconds
});

if (result.status === 'completed') {
  console.log('Task result:', result.result);
} else if (result.status === 'error') {
  console.error('Task failed:', result.error);
}
```

### Call an Agent

```typescript
// Call agent synchronously
const result = await tools.call_agent({
  agent: 'default',
  prompt: 'Write a summary of the meeting'
});

console.log('Response:', result.result);

// Call agent in background
const backgroundResult = await tools.call_agent({
  agent: 'default',
  prompt: 'Analyze this codebase',
  background: true
});

console.log('Task ID:', backgroundResult.taskId);
```

## Advanced Examples

### Task Composition

```typescript
// Step 1: Create analysis task
const analysisTask = await tools.background_task({
  options: {
    agent: 'default',
    prompt: 'Analyze this codebase'
  }
});

// Step 2: Wait for analysis to complete
const analysisResult = await tools.background_output({
  taskId: analysisTask.id,
  wait: true,
  timeout: 60000
});

// Step 3: Process the analysis
if (analysisResult.status === 'completed') {
  const analysis = analysisResult.result;
  
  // Step 4: Create summary task
  const summaryTask = await tools.background_task({
    options: {
      agent: 'fast',
      prompt: `Summarize this analysis: ${analysis}`
    }
  });
  
  // Step 5: Wait for summary
  const summaryResult = await tools.background_output({
    taskId: summaryTask.id,
    wait: true,
    timeout: 30000
  });
  
  if (summaryResult.status === 'completed') {
    console.log('Summary:', summaryResult.result);
  }
}
```

### Batch Processing

```typescript
// Process multiple files in parallel
const files = ['file1.txt', 'file2.txt', 'file3.txt'];
const tasks = [];

// Create tasks for each file
for (const file of files) {
  const task = await tools.background_task({
    options: {
      agent: 'default',
      prompt: `Process file: ${file}`
    }
  });
  tasks.push(task);
}

// Wait for all tasks to complete
const results = [];
for (const task of tasks) {
  const result = await tools.background_output({
    taskId: task.id,
    wait: true,
    timeout: 60000
  });
  
  if (result.status === 'completed') {
    results.push(result.result);
  }
}

console.log('Processed files:', results.length);
```

### Error Handling

```typescript
// Handle task errors gracefully
const task = await tools.background_task({
  options: {
    agent: 'default',
    prompt: 'This might fail'
  }
});

try {
  const result = await tools.background_output({
    taskId: task.id,
    wait: true,
    timeout: 30000
  });
  
  if (result.status === 'completed') {
    console.log('Success:', result.result);
  } else if (result.status === 'error') {
    console.error('Error:', result.error);
    
    // Retry the task
    const retryTask = await tools.background_task({
      options: {
        agent: 'default',
        prompt: 'Retry the operation'
      }
    });
  }
} catch (error) {
  console.error('Unexpected error:', error);
}
```

### Configuration Management

```typescript
// Get current configuration
const config = plugin.getConfig();

console.log('Current max concurrent tasks:', config.background?.maxConcurrentTasks);

// Update configuration
plugin.updateConfig({
  background: {
    maxConcurrentTasks: 20,
    taskTTL: 7200000  // 2 hours
  }
});

// Get updated configuration
const newConfig = plugin.getConfig();

console.log('Updated max concurrent tasks:', newConfig.background?.maxConcurrentTasks);
```

### Agent Configuration

```typescript
// Configure different agents
plugin.updateConfig({
  agents: {
    'default': {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 4000
    },
    'fast': {
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
      maxTokens: 1000
    },
    'creative': {
      model: 'gpt-4',
      temperature: 0.9,
      maxTokens: 8000
    }
  }
});

// Use different agents
const defaultResult = await tools.call_agent({
  agent: 'default',
  prompt: 'Write a professional email'
});

const fastResult = await tools.call_agent({
  agent: 'fast',
  prompt: 'Generate a quick summary'
});

const creativeResult = await tools.call_agent({
  agent: 'creative',
  prompt: 'Write a creative story'
});
```

## Real-World Scenarios

### Meeting Assistant

```typescript
// Create a meeting assistant workflow
async function meetingAssistant(meetingNotes) {
  // Step 1: Summarize meeting
  const summaryTask = await tools.background_task({
    options: {
      agent: 'default',
      prompt: `Summarize this meeting: ${meetingNotes}`
    }
  });
  
  // Step 2: Extract action items
  const actionItemsTask = await tools.background_task({
    options: {
      agent: 'default',
      prompt: `Extract action items from this meeting: ${meetingNotes}`
    }
  });
  
  // Step 3: Generate follow-up email
  const summaryResult = await tools.background_output({
    taskId: summaryTask.id,
    wait: true,
    timeout: 30000
  });
  
  const actionItemsResult = await tools.background_output({
    taskId: actionItemsTask.id,
    wait: true,
    timeout: 30000
  });
  
  if (summaryResult.status === 'completed' && actionItemsResult.status === 'completed') {
    const followUpTask = await tools.background_task({
      options: {
        agent: 'default',
        prompt: `Generate a follow-up email with this summary: ${summaryResult.result} and these action items: ${actionItemsResult.result}`
      }
    });
    
    return followUpTask.id;
  }
  
  return null;
}
```

### Code Review Assistant

```typescript
// Create a code review assistant workflow
async function codeReviewAssistant(codeChanges) {
  // Step 1: Analyze code changes
  const analysisTask = await tools.background_task({
    options: {
      agent: 'default',
      prompt: `Analyze these code changes: ${codeChanges}`
    }
  });
  
  // Step 2: Check for security issues
  const securityTask = await tools.background_task({
    options: {
      agent: 'default',
      prompt: `Check for security issues in these code changes: ${codeChanges}`
    }
  });
  
  // Step 3: Generate review comments
  const analysisResult = await tools.background_output({
    taskId: analysisTask.id,
    wait: true,
    timeout: 60000
  });
  
  const securityResult = await tools.background_output({
    taskId: securityTask.id,
    wait: true,
    timeout: 60000
  });
  
  if (analysisResult.status === 'completed' && securityResult.status === 'completed') {
    const reviewTask = await tools.background_task({
      options: {
        agent: 'default',
        prompt: `Generate review comments based on this analysis: ${analysisResult.result} and security check: ${securityResult.result}`
      }
    });
    
    return reviewTask.id;
  }
  
  return null;
}
```

## Best Practices

### Task Management

1. **Use descriptive task IDs** for easier debugging
2. **Set appropriate timeouts** based on expected task duration
3. **Handle errors gracefully** and provide fallback behavior
4. **Clean up cancelled tasks** to free resources
5. **Monitor task status** to provide feedback to users

### Performance

1. **Limit concurrent tasks** based on available resources
2. **Set reasonable TTL** for automatic cleanup
3. **Use appropriate polling intervals** for status updates
4. **Batch similar tasks** when possible
5. **Reuse agent sessions** for related tasks

### Error Handling

1. **Validate inputs** before creating tasks
2. **Handle timeouts** appropriately
3. **Retry failed tasks** when appropriate
4. **Log errors** for debugging
5. **Notify users** of task failures

## See Also

- [Tools Guide](tools.md) - Tool usage guide
- [Configuration Guide](configuration.md) - Configuration options
- [API Reference](../api-reference/) - API documentation
