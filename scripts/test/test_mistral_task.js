// Test script for Mistral background task with async subagent
const { MyOpenCodePlugin } = require('./dist/index.js');

async function testMistralTask() {
  console.log('Testing Mistral background task with async subagent...\n');
  
  // Create plugin instance with Mistral configuration
  const plugin = new MyOpenCodePlugin({
    configPath: './test-config.json'
  });
  
  // Mock session
  const session = {
    id: 'test-session-mistral',
    getStatus: async () => 'running',
    sendMessage: async (message) => {
      console.log('Session message:', message);
    }
  };
  
  // Initialize plugin
  await plugin.initialize(session);
  
  // Get tools
  const tools = plugin.getTools();
  
  console.log('1. Creating Mistral background task...');
  const task = await tools.background_task.execute({
    options: {
      agent: 'mistral (local)',
      prompt: 'Write a summary of this test using Mistral model'
    }
  });
  
  console.log('Task created with ID:', task.id);
  console.log('Task status:', task.status);
  
  console.log('\n2. Getting task output (non-blocking)...');
  const output = await tools.background_output.execute({
    taskId: task.id
  });
  
  console.log('Current status:', output.status);
  if (output.result) {
    console.log('Current result:', output.result);
  }
  
  console.log('\n3. Waiting for task completion (with timeout)...');
  const result = await tools.background_output.execute({
    taskId: task.id,
    wait: true,
    timeout: 30000  // 30 seconds
  });
  
  console.log('Final status:', result.status);
  if (result.status === 'completed') {
    console.log('Task result:', result.result);
  } else if (result.status === 'error') {
    console.error('Task failed:', result.error);
  }
  
  console.log('\n✓ Mistral background task test completed!');
}

testMistralTask().catch(console.error);