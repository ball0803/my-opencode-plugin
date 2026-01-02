import { z } from 'zod';

export const PluginConfigSchema = z.object({
  agents: z.record(
    z.object({
      model: z.string().optional(),
      temperature: z.number().min(0).max(2).optional(),
      maxTokens: z.number().optional(),
      topP: z.number().min(0).max(1).optional(),
      frequencyPenalty: z.number().optional(),
      presencePenalty: z.number().optional(),
      stop: z.array(z.string()).optional(),
      stream: z.boolean().optional(),
    })
  ).optional(),
  permissions: z.record(z.array(z.string())).optional(),
  background: z.object({
    maxConcurrentTasks: z.number().min(1).max(100).default(10),
    taskTTL: z.number().min(60000).max(86400000).default(30 * 60 * 1000),
    pollInterval: z.number().min(1000).max(30000).default(2000),
  }).optional(),
});

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