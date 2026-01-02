import { createConfigHandler } from './config-handler';
import type { ConfigHandler } from 'opencode';

export function createPluginHandlers(configLoader: any): ConfigHandler[] {
  return [
    createConfigHandler(configLoader),
  ];
}

export type { ConfigHandler } from 'opencode';