import { createConfigHandler, ConfigHandler } from './config-handler';

export function createPluginHandlers(configLoader: any): ConfigHandler[] {
  return [
    createConfigHandler(configLoader),
  ];
}

export type { ConfigHandler } from './config-handler';