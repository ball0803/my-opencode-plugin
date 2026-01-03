const { ConfigLoader } = require('./dist/config/index.js');

const loader = new ConfigLoader();
loader.mergeConfig({
  agents: { agent1: { model: 'gpt-4' } }
});

console.log('After first merge:', loader.getAvailableAgents());
console.log('Config:', JSON.stringify(loader.getConfig(), null, 2));

loader.mergeConfig({
  agents: { agent2: { model: 'gpt-4' } }
});

console.log('After second merge:', loader.getAvailableAgents());
console.log('Config:', JSON.stringify(loader.getConfig(), null, 2));
