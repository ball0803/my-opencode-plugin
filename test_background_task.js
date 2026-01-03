// Test script for background task functionality
const { MyOpenCodePlugin } = require('./dist/index.js');

async function testBackgroundTask() {
  console.log('Testing background task functionality...\n');
  
  // Create plugin instance
  const plugin = new MyOpenCodePlugin();
  
  // Mock session
  const session = {
    id: 'test-session-123',
    getStatus: async () => 'running',
    sendMessage: async (message) => {
      console.log('Session message:', message);
    }
  };
  
  // Initialize plugin
  await plugin.initialize(session);
  
  // Get tools
  const tools = plugin.getTools();
  
  console.log('1. Creating background task...');
  const task = await tools.background_task.execute({
    options: {
      agent: 'default',
      prompt: 'Write a summary of this test'
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
    timeout: 10000  // 10 seconds
  });
  
  console.log('Final status:', result.status);
  if (result.status === 'completed') {
    console.log('Task result:', result.result);
  } else if (result.status === 'error') {
    console.error('Task failed:', result.error);
  }
  
  console.log('\n✓ Background task test completed!');
}

testBackgroundTask().catch(console.error);