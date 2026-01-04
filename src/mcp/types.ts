import { z } from 'zod';

export const McpNameSchema = z.enum(["websearch_exa", "context7", "grep_app"]);

export type McpName = z.infer<typeof McpNameSchema>;

export interface McpLocalConfig {
  type: "local";
  command: string[];
  environment?: Record<string, string>;
  enabled?: boolean;
}

export interface McpRemoteConfig {
  type: "remote";
  url: string;
  headers?: Record<string, string>;
  enabled?: boolean;
}

export type McpServerConfig = McpLocalConfig | McpRemoteConfig;

export interface McpConfig {
  mcpServers?: Record<string, McpServerConfig>;
}
