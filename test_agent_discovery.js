// Test script to verify agent discovery functionality
const { ConfigLoader } = require('./dist/config/index.js');

console.log('Testing Agent Discovery...\n');

// Test 1: Basic agent discovery
const configLoader = new ConfigLoader();
configLoader.mergeConfig({
  agents: {
    'general': { model: 'gpt-4', description: 'General purpose agent' },
    'explore': { model: 'gpt-4', description: 'Code exploration agent', disabled: true },
    'code-reviewer': { model: 'gpt-4', description: 'Code review agent' }
  }
});

console.log('Test 1: Get Available Agents');
const availableAgents = configLoader.getAvailableAgents();
console.log('Available agents:', availableAgents);
console.log('Expected: ["general", "explore", "code-reviewer"]');
console.log('Pass:', JSON.stringify(availableAgents) === JSON.stringify(['general', 'explore', 'code-reviewer']));

console.log('\nTest 2: Check Agent Availability');
console.log('Is "general" available?', configLoader.isAgentAvailable('general'));
console.log('Is "nonexistent" available?', configLoader.isAgentAvailable('nonexistent'));

console.log('\nTest 3: Check Agent Disabled Status');
console.log('Is "general" disabled?', configLoader.isAgentDisabled('general'));
console.log('Is "explore" disabled?', configLoader.isAgentDisabled('explore'));
console.log('Is "code-reviewer" disabled?', configLoader.isAgentDisabled('code-reviewer'));
console.log('Is "nonexistent" disabled?', configLoader.isAgentDisabled('nonexistent'));

console.log('\nTest 4: Get Agent Config');
const generalConfig = configLoader.getAgentConfig('general');
console.log('General agent config:', generalConfig);
console.log('Expected model: gpt-4');
console.log('Pass:', generalConfig?.model === 'gpt-4');

const exploreConfig = configLoader.getAgentConfig('explore');
console.log('Explore agent config:', exploreConfig);
console.log('Expected disabled: true');
console.log('Pass:', exploreConfig?.disabled === true);

console.log('\nTest 5: Get Config');
const fullConfig = configLoader.getConfig();
console.log('Full config agents count:', Object.keys(fullConfig.agents || {}).length);
console.log('Pass:', Object.keys(fullConfig.agents || {}).length === 3);

console.log('\n✅ All tests completed!');
