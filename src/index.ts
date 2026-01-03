import { BackgroundManager } from './background-agent/manager';
import { createBackgroundTaskTools } from './tools/background-task';
import { createCallAgentTools } from './tools/call-agent';
import { createSubagentTools } from './tools/subagent';
import { createAgentDiscoveryTools } from './tools/agent-discovery';
import { ConfigLoader } from './config';
import { createConfigHandler } from './plugin-handlers/config-handler';
import type { PluginConfig } from './config/schema';
import type { AgentSession } from './background-agent/types';
import type { BackgroundManagerOptions } from './core/types';

export interface PluginOptions {
  configPath?: string;
  backgroundManagerOptions?: ConstructorParameters<typeof BackgroundManager>[0];
}

export class MyOpenCodePlugin {
  private backgroundManager: BackgroundManager;
  private configLoader: ConfigLoader;
  private config: PluginConfig;
  private session: AgentSession | null = null;

  constructor(options: PluginOptions = {}) {
    this.configLoader = new ConfigLoader();
    this.config = this.configLoader.loadConfig(options.configPath);

    this.backgroundManager = new BackgroundManager({
      taskTTL: this.config.background?.taskTTL,
      pollInterval: this.config.background?.pollInterval,
      ...options.backgroundManagerOptions,
    });
    
    // Attach config loader to manager for agent discovery
    (this.backgroundManager as any).configLoader = this.configLoader;
  }

  async initialize(session: AgentSession): Promise<void> {
    this.session = session;
    await this.backgroundManager.initialize(session);
  }

  getTools() {
    return {
      ...createBackgroundTaskTools(this.backgroundManager),
      ...createCallAgentTools(this.backgroundManager),
      ...createSubagentTools(this.backgroundManager),
      ...createAgentDiscoveryTools(this.backgroundManager),
    };
  }

  getConfigHandlers() {
    return [
      createConfigHandler(this.configLoader),
    ];
  }

  async cleanup(): Promise<void> {
    await this.backgroundManager.cleanup();
  }

  getConfig(): PluginConfig {
    return this.config;
  }

  updateConfig(newConfig: Partial<PluginConfig>): void {
    this.configLoader.mergeConfig(newConfig);
    this.config = this.configLoader.getConfig();
  }
}