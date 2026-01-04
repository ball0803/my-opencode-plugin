// Test to see what tools are available
const { MyOpenCodePlugin } = require('./dist/index.js');

console.log('Testing MCP implementation...\n');

// Create plugin instance
const plugin = new MyOpenCodePlugin();

// Check all tools
const tools = plugin.getTools();
console.log('Available tools:');
Object.keys(tools).forEach(toolName => {
  const tool = tools[toolName];
  console.log(`  - ${toolName}: ${tool.description ? tool.description.substring(0, 60) : 'No description'}`);
});
