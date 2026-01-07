import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse as parseJsonc } from 'jsonc-parser';
import { MyOpenCodePluginConfigSchema, DEFAULT_CONFIG } from './schema.ts';
import type { MyOpenCodePluginConfig } from './schema.ts';

// Import types from types.ts
import type {
  AgentOverrideConfig,
  AgentOverrides,
  AgentName,
  HookName,
  BuiltinCommandName,
  BuiltinSkillName,
  SisyphusAgentConfig,
  CommentCheckerConfig,
  ExperimentalConfig,
  DynamicContextPruningConfig,
  RalphLoopConfig,
  BackgroundTaskConfig,
  NotificationConfig,
  SkillsConfig,
  SkillDefinition,
  ClaudeCodeConfig,
} from './types.ts';

// Re-export all schemas from types.ts
export * from './types.ts';

// Re-export main config schema from schema.ts
export {
  MyOpenCodePluginConfigSchema,
  type MyOpenCodePluginConfig,
} from './schema.ts';

// Re-export MCP types
export {
  AnyMcpNameSchema,
  type AnyMcpName,
  McpNameSchema,
  type McpName,
} from '../mcp/types.ts';

// Re-export types for backward compatibility
export type {
  AgentOverrideConfig,
  AgentOverrides,
  AgentName,
  HookName,
  BuiltinCommandName,
  BuiltinSkillName,
  SisyphusAgentConfig,
  CommentCheckerConfig,
  ExperimentalConfig,
  DynamicContextPruningConfig,
  RalphLoopConfig,
  BackgroundTaskConfig,
  NotificationConfig,
  SkillsConfig,
  SkillDefinition,
  ClaudeCodeConfig,
} from './types.ts';

export class ConfigLoader {
  private config: MyOpenCodePluginConfig;

  constructor() {
    this.config = { ...DEFAULT_CONFIG };
  }

  loadConfig(configPath?: string): MyOpenCodePluginConfig {
    try {
      if (configPath && existsSync(configPath)) {
        const fileContent = readFileSync(configPath, 'utf-8' as any);
        const parsed = parseJsonc(fileContent);
        const validated = MyOpenCodePluginConfigSchema.parse(parsed);
        this.config = { ...DEFAULT_CONFIG, ...validated };
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }

    return this.config;
  }

  getConfig(): MyOpenCodePluginConfig {
    return this.config;
  }

  getAgentConfig(agentName: string): AgentOverrideConfig | undefined {
    return this.config.agents?.[agentName as keyof AgentOverrides];
  }

  getAvailableAgents(): string[] {
    return Object.keys(this.config.agents || {});
  }

  isAgentAvailable(agentName: string): boolean {
    const agents = this.getAvailableAgents();
    return agents.includes(agentName);
  }

  getSkillConfig(skillName: string): SkillDefinition | boolean | undefined {
    return this.config.skills?.[skillName as keyof SkillsConfig];
  }

  getAvailableSkills(): string[] {
    return Object.keys(this.config.skills || {});
  }

  isSkillAvailable(skillName: string): boolean {
    return this.getAvailableSkills().includes(skillName);
  }

  getPermission(permissionName: string): string[] | undefined {
    return this.config.permissions?.[permissionName];
  }

  getAllPermissions(): Record<string, string[]> {
    return this.config.permissions || {};
  }

  hasPermission(permissionName: string, action: string): boolean {
    const permission = this.getPermission(permissionName);
    return permission ? permission.includes(action) : false;
  }

  getBackgroundConfig(): BackgroundTaskConfig {
    return this.config.background_task || {};
  }

  getNotificationConfig(): NotificationConfig {
    return this.config.notification || {};
  }

  getRalphLoopConfig(): RalphLoopConfig {
    return this.config.ralph_loop || {};
  }

  getExperimentalConfig(): ExperimentalConfig {
    return this.config.experimental || {};
  }

  getSkillsConfig(): SkillsConfig {
    return this.config.skills || {};
  }

  getClaudeCodeConfig(): ClaudeCodeConfig {
    return this.config.claude_code || {};
  }

  getSisyphusAgentConfig(): SisyphusAgentConfig {
    return this.config.sisyphus_agent || {};
  }

  getCommentCheckerConfig(): CommentCheckerConfig {
    return this.config.comment_checker || {};
  }

  getDisabledAgents(): string[] {
    return this.config.disabled_agents || [];
  }

  getDisabledSkills(): string[] {
    return this.config.disabled_skills || [];
  }

  getDisabledHooks(): string[] {
    return this.config.disabled_hooks || [];
  }

  getDisabledCommands(): string[] {
    return this.config.disabled_commands || [];
  }

  getDisabledMcps(): string[] {
    return this.config.disabled_mcps || [];
  }

  getAutoUpdate(): boolean {
    return this.config.auto_update || false;
  }

  getGoogleAuth(): boolean {
    return this.config.google_auth || false;
  }
}
