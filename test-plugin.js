const { MyOpenCodePlugin } = require('./dist/index.js');

async function testPlugin() {
  try {
    console.log('Testing plugin...');

    // Create plugin instance
    const plugin = new MyOpenCodePlugin();
    console.log('✓ Plugin instantiated');

    // Get tools
    const tools = plugin.getTools();
    console.log('✓ Tools retrieved');

    // Debug: log all keys
    console.log('\nAll keys in tools object:');
    console.log(JSON.stringify(Object.keys(tools), null, 2));

    // Debug: check if mcp is a property
    console.log('\nIs mcp a property?', 'mcp' in tools);

    // Debug: check tools.mcp directly
    console.log('\ntools.mcp:', tools.mcp);

    process.exit(0);
  } catch (error) {
    console.error('Plugin test failed:', error);
    process.exit(1);
  }
}

testPlugin();
