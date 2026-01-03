import { z } from 'zod';

export const AgentConfigSchema = z.object({
  description: z.string().optional(),
  disabled: z.boolean().default(false),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().optional(),
  topP: z.number().min(0).max(1).optional(),
  frequencyPenalty: z.number().optional(),
  presencePenalty: z.number().optional(),
  stop: z.array(z.string()).optional(),
  stream: z.boolean().optional(),
  settings: z.record(z.unknown()).optional(),
});

export const BackgroundConfigSchema = z.object({
  maxConcurrentTasks: z.number().min(1).max(100).default(10),
  taskTTL: z.number().min(60000).max(86400000).default(30 * 60 * 1000),
  pollInterval: z.number().min(1000).max(30000).default(2000),
});

export const PluginConfigSchema = z.object({
  agents: z.record(AgentConfigSchema).default({}),
  permissions: z.record(z.array(z.string())).optional(),
  background: BackgroundConfigSchema.optional(),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;
export type BackgroundConfig = z.infer<typeof BackgroundConfigSchema>;
export type PluginConfig = z.infer<typeof PluginConfigSchema>;

export const DEFAULT_CONFIG: PluginConfig = {
  agents: {},
  permissions: {},
  background: {
    maxConcurrentTasks: 10,
    taskTTL: 30 * 60 * 1000,
    pollInterval: 2000,
  },
};