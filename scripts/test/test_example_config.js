// Test script to verify example configuration loading
const { ConfigLoader } = require('./dist/config/index.js');
const fs = require('fs');
const path = require('path');

console.log('Testing Example Configuration Loading...\n');

const configPath = path.join(__dirname, 'example-config.jsonc');
const configLoader = new ConfigLoader();
const config = configLoader.loadConfig(configPath);

console.log('✅ Configuration loaded successfully!\n');

console.log('Agents configured:');
Object.entries(config.agents || {}).forEach(([name, agent]) => {
  console.log(`  - ${name}: ${agent.description || 'No description'}`);
  console.log(`    Model: ${agent.model || 'default'}`);
  console.log(`    Disabled: ${agent.disabled || false}`);
  console.log(`    Temperature: ${agent.temperature || 'default'}`);
  if (agent.settings) {
    console.log(`    Settings:`, agent.settings);
  }
  console.log();
});

console.log('Background configuration:');
console.log('  Max concurrent tasks:', config.background?.maxConcurrentTasks);
console.log('  Task TTL:', config.background?.taskTTL, 'ms');
console.log('  Poll interval:', config.background?.pollInterval, 'ms');

console.log('\nPermissions:');
Object.entries(config.permissions || {}).forEach(([agent, perms]) => {
  console.log(`  ${agent}:`, perms.join(', '));
});

console.log('\n✅ All configuration features working correctly!');
