const fs = require('fs');
const path = require('path');

function loadConfig(configPath) {
  const defaultConfig = {
    scoring: {
      depthWeight: 0.3,
      fileCountWeight: 0.4,
      complexityWeight: 0.3,
      minScore: 0.5
    }
  };
  
  if (!configPath) {
    return defaultConfig;
  }
  
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const customConfig = JSON.parse(configContent);
    return { ...defaultConfig, ...customConfig };
  } catch (error) {
    console.warn(`Warning: Could not load config from ${configPath}, using defaults`);
    return defaultConfig;
  }
}

function saveConfig(config, configPath) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

module.exports = { loadConfig, saveConfig };
