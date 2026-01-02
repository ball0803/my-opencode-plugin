import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse as parseJsonc } from 'jsonc-parser';
import { PluginConfigSchema, DEFAULT_CONFIG } from './schema';
import type { PluginConfig } from './schema';

export class ConfigLoader {
  private config: PluginConfig;

  constructor() {
    this.config = { ...DEFAULT_CONFIG };
  }

  loadConfig(configPath?: string): PluginConfig {
    try {
      if (configPath && existsSync(configPath)) {
         const fileContent = readFileSync(configPath, 'utf-8' as any);
        const parsed = parseJsonc(fileContent);
        const validated = PluginConfigSchema.parse(parsed);
        this.config = { ...DEFAULT_CONFIG, ...validated };
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }

    return this.config;
  }

  getConfig(): PluginConfig {
    return this.config;
  }

  getAgentConfig(agentName: string): any {
    return this.config.agents?.[agentName];
  }

  hasPermission(agentName: string, permission: string): boolean {
    return this.config.permissions?.[agentName]?.includes(permission) ?? true;
  }

  mergeConfig(newConfig: Partial<PluginConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}