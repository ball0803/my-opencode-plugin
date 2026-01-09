import { z } from 'zod';
import { AnyMcpNameSchema, McpNameSchema } from '../mcp/types.js';
import {
  BuiltinAgentNameSchema,
  BuiltinSkillNameSchema,
  HookNameSchema,
  BuiltinCommandNameSchema,
  AgentOverridesSchema,
  ClaudeCodeConfigSchema,
  SisyphusAgentConfigSchema,
  CommentCheckerConfigSchema,
  ExperimentalConfigSchema,
  SkillsConfigSchema,
  RalphLoopConfigSchema,
  BackgroundTaskConfigSchema,
  NotificationConfigSchema,
} from './types.ts';

export const MyOpenCodePluginConfigSchema = z.object({
  $schema: z.string().optional(),
  disabled_mcps: z.array(AnyMcpNameSchema).optional(),
  disabled_agents: z.array(BuiltinAgentNameSchema).optional(),
  disabled_skills: z.array(BuiltinSkillNameSchema).optional(),
  disabled_hooks: z.array(HookNameSchema).optional(),
  disabled_commands: z.array(BuiltinCommandNameSchema).optional(),
  agents: AgentOverridesSchema.optional(),
  claude_code: ClaudeCodeConfigSchema.optional(),
  google_auth: z.boolean().optional(),
  sisyphus_agent: SisyphusAgentConfigSchema.optional(),
  comment_checker: CommentCheckerConfigSchema.optional(),
  experimental: ExperimentalConfigSchema.optional(),
  auto_update: z.boolean().optional(),
  skills: SkillsConfigSchema.optional(),
  ralph_loop: RalphLoopConfigSchema.optional(),
  background_task: BackgroundTaskConfigSchema.optional(),
  notification: NotificationConfigSchema.optional(),
  permissions: z.record(z.array(z.string())).optional(),
});

export type MyOpenCodePluginConfig = z.infer<
  typeof MyOpenCodePluginConfigSchema
>;

export const DEFAULT_CONFIG: MyOpenCodePluginConfig = {
  agents: {},
  disabled_mcps: [],
  disabled_agents: [],
  disabled_skills: [],
  disabled_hooks: [],
  disabled_commands: [],
  permissions: {},
  claude_code: {},
  sisyphus_agent: {},
  comment_checker: {},
  experimental: {},
  auto_update: false,
  skills: {},
  ralph_loop: {},
  background_task: {},
  notification: {},
};
