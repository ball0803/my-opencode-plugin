import type { McpServerConfig } from "../../mcp/types";

export interface McpClientInfo {
  serverName: string;
  sessionID: string;
}

export interface McpServerContext {
  config: McpServerConfig;
}
