export type ConfigHandler = {
  name: string;
  description: string;
  handle(config: any): Promise<any>;
};
import { ConfigLoader } from '../config/index.ts';
import type { MyOpenCodePluginConfig } from '../config/schema.ts';

export function createConfigHandler(configLoader: ConfigLoader): ConfigHandler {
  return {
    name: 'my-opencode-plugin-config',
    description: 'Transform OpenCode config for my-opencode-plugin',
    async handle(config: any): Promise<any> {
      const pluginConfig = config['my-opencode-plugin'] || {};
      // ConfigLoader doesn't have mergeConfig, just load the config
      // This handler is likely a template and may not be fully implemented
      return config;
    },
  };
}
