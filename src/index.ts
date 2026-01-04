import { BackgroundManager } from './background-agent/manager';
import { createBackgroundTaskTools } from './tools/background-task';
import { createCallAgentTools } from './tools/call-agent';
import { createSubagentTools } from './tools/subagent';
import { createAgentDiscoveryTools } from './tools/agent-discovery';
import { createMcpTool } from './tools/mcp';
import { ConfigLoader } from './config';
import { createConfigHandler } from './plugin-handlers/config-handler';
import { McpManager } from './features/mcp-manager';
import { loadMcpConfigs } from './features/mcp-loader';
import { createBuiltinMcps } from './mcp';
import type { PluginConfig } from './config/schema';
import type { AgentSession } from './background-agent/types';
import type { BackgroundManagerOptions } from './core/types';

export interface PluginOptions {
  configPath?: string;
  backgroundManagerOptions?: ConstructorParameters<typeof BackgroundManager>[0];
}

export class MyOpenCodePlugin {
  private backgroundManager: BackgroundManager;
  private mcpManager: McpManager;
  private configLoader: ConfigLoader;
  private config: PluginConfig;
  private session: AgentSession | null = null;
  private mcpServers: Record<string, any> = {};

  constructor(options: PluginOptions = {}) {
    this.configLoader = new ConfigLoader();
    this.config = this.configLoader.loadConfig(options.configPath);

    this.backgroundManager = new BackgroundManager({
      taskTTL: this.config.background?.taskTTL,
      pollInterval: this.config.background?.pollInterval,
      ...options.backgroundManagerOptions,
    });
    
    this.mcpManager = new McpManager();
    
    // Attach config loader to manager for agent discovery
    (this.backgroundManager as any).configLoader = this.configLoader;
  }

  async initialize(session: AgentSession): Promise<void> {
    this.session = session;
    await this.backgroundManager.initialize(session);
    
    // Load MCP configurations
    await this.loadMcpConfigurations();
  }

  getTools() {
    return {
      ...createBackgroundTaskTools(this.backgroundManager),
      ...createCallAgentTools(this.backgroundManager),
      ...createSubagentTools(this.backgroundManager),
      ...createAgentDiscoveryTools(this.backgroundManager),
      ...createMcpTool({
        manager: this.mcpManager,
        getSessionID: () => this.session?.id || "",
        getMcpServers: () => this.mcpServers,
      }),
    };
  }

  getConfigHandlers() {
    return [
      createConfigHandler(this.configLoader),
    ];
  }

  async cleanup(): Promise<void> {
    await this.backgroundManager.cleanup();
    await this.mcpManager.disconnectAll();
  }

  getConfig(): PluginConfig {
    return this.config;
  }

  updateConfig(newConfig: Partial<PluginConfig>): void {
    this.configLoader.mergeConfig(newConfig);
    this.config = this.configLoader.getConfig();
  }

  private async loadMcpConfigurations(): Promise<void> {
    try {
      // Load user-defined MCP configs
      const userResult = await loadMcpConfigs();
      
      // Load built-in MCP servers
      const builtinMcps = createBuiltinMcps(this.config.disabled_mcps || []);
      
      // Merge configurations (user configs take precedence over built-in)
      this.mcpServers = {
        ...builtinMcps,
        ...userResult.servers,
      };
      
      console.log(`[my-opencode-plugin] Loaded ${Object.keys(this.mcpServers).length} MCP servers`);
    } catch (error) {
      console.error('[my-opencode-plugin] Failed to load MCP configurations:', error);
    }
  }
}