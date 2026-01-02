import type { ConfigHandler } from 'opencode';
import { ConfigLoader } from '../config';
import type { PluginConfig } from '../config/schema';

export function createConfigHandler(configLoader: ConfigLoader): ConfigHandler {
  return {
    name: 'my-opencode-plugin-config',
    description: 'Transform OpenCode config for my-opencode-plugin',
    async handle(config: any): Promise<any> {
      const pluginConfig = config['my-opencode-plugin'] || {};
      configLoader.mergeConfig(pluginConfig);
      return config;
    },
  };
}