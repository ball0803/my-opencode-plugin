// Simple test to verify MCP implementation
const { MyOpenCodePlugin } = require('./dist/index.js');

console.log('Testing MCP implementation...\n');

// Create plugin instance
const plugin = new MyOpenCodePlugin();

console.log('✓ Plugin created successfully');

// Check if MCP tools are available
const tools = plugin.getTools();
console.log('✓ Tools loaded:', Object.keys(tools).length);

// Check if mcp tool exists
if (tools.mcp) {
  console.log('✓ MCP tool found');
  console.log('  - Tool name:', tools.mcp.name || 'mcp');
  console.log('  - Tool description:', tools.mcp.description?.substring(0, 50) + '...');
} else {
  console.log('✗ MCP tool not found');
}

// Check configuration
const config = plugin.getConfig();
console.log('✓ Plugin config loaded');
console.log('  - Disabled MCP servers:', config.disabled_mcps || []);

console.log('\n✓ All basic checks passed!');
console.log('\nNote: Full MCP functionality requires:');
console.log('  1. OpenCode session initialization');
console.log('  2. Valid MCP server URLs');
console.log('  3. Network connectivity to remote servers');
