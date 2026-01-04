#!/usr/bin/env node

const { MyOpenCodePlugin } = require('../../dist/index.js');

async function testPlugin() {
  console.log('=== Testing Plugin (MCP-Free Version) ===\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Plugin instantiation
  try {
    const plugin = new MyOpenCodePlugin();
    console.log('✓ Test 1: Plugin instantiation');
    passed++;
  } catch (error) {
    console.log('✗ Test 1: Plugin instantiation failed');
    console.error('  Error:', error.message);
    failed++;
  }

  // Test 2: Tools retrieval
  try {
    const plugin = new MyOpenCodePlugin();
    const tools = plugin.getTools();
    if (!tools || typeof tools !== 'object') {
      throw new Error('Tools is not an object');
    }
    console.log('✓ Test 2: Tools retrieval');
    passed++;
  } catch (error) {
    console.log('✗ Test 2: Tools retrieval failed');
    console.error('  Error:', error.message);
    failed++;
  }

  // Test 3: No MCP tool (should not exist)
  try {
    const plugin = new MyOpenCodePlugin();
    const tools = plugin.getTools();
    if (tools.mcp) {
      throw new Error('MCP tool should not exist');
    }
    console.log('✓ Test 3: MCP tool correctly removed');
    passed++;
  } catch (error) {
    console.log('✗ Test 3: MCP tool check failed');
    console.error('  Error:', error.message);
    failed++;
  }

  // Test 4: Required tools exist
  try {
    const plugin = new MyOpenCodePlugin();
    const tools = plugin.getTools();

    const requiredTools = [
      'background_task',
      'background_output',
      'background_cancel',
      'call_agent',
      'subagent',
      'subagent_output',
      'subagent_cancel',
      'list_agents',
      'get_agent_info',
    ];

    const missingTools = requiredTools.filter((tool) => !tools[tool]);
    if (missingTools.length > 0) {
      throw new Error(`Missing tools: ${missingTools.join(', ')}`);
    }

    console.log('✓ Test 4: All required tools exist');
    passed++;
  } catch (error) {
    console.log('✗ Test 4: Tools check failed');
    console.error('  Error:', error.message);
    failed++;
  }

  // Test 5: Config handlers
  try {
    const plugin = new MyOpenCodePlugin();
    const handlers = plugin.getConfigHandlers();
    if (!Array.isArray(handlers) || handlers.length === 0) {
      throw new Error('Config handlers not found');
    }
    console.log('✓ Test 5: Config handlers exist');
    passed++;
  } catch (error) {
    console.log('✗ Test 5: Config handlers check failed');
    console.error('  Error:', error.message);
    failed++;
  }

  // Summary
  console.log('\n=== Test Summary ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${passed + failed}`);

  if (failed === 0) {
    console.log(
      '\n✓ All tests passed! Plugin is working correctly without MCP.',
    );
    process.exit(0);
  } else {
    console.log('\n✗ Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

testPlugin();
