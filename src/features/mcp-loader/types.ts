import type { McpServerConfig, McpConfig } from "../../mcp/types";

export interface LoadedMcpServer {
  name: string;
  config: McpServerConfig;
}

export interface McpLoadResult {
  servers: Record<string, McpServerConfig>;
  loadedServers: LoadedMcpServer[];
}
