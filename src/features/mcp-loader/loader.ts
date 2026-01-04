import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { parse as parseJsonc } from "jsonc-parser";
import type { McpConfig, McpServerConfig } from "../../mcp/types";
import type { LoadedMcpServer, McpLoadResult } from "./types";

const log = (message: string, error?: any) => {
  console.log(`[mcp-loader] ${message}`, error ? error : "");
};

interface McpConfigPath {
  path: string;
  scope: "user" | "project" | "local";
}

function getMcpConfigPaths(): McpConfigPath[] {
  const homeDir = require("os").homedir();
  const cwd = process.cwd();

  return [
    { path: join(homeDir, ".my-opencode", ".mcp.json"), scope: "user" },
    { path: join(cwd, ".mcp.json"), scope: "project" },
    { path: join(cwd, ".my-opencode", ".mcp.json"), scope: "local" },
  ];
}

async function loadMcpConfigFile(filePath: string): Promise<McpConfig | null> {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const content = readFileSync(filePath, "utf-8");
    return parseJsonc(content) as McpConfig;
  } catch (error) {
    log(`Failed to load MCP config from ${filePath}`, error);
    return null;
  }
}

export async function loadMcpConfigs(): Promise<McpLoadResult> {
  const servers: McpLoadResult["servers"] = {};
  const loadedServers: LoadedMcpServer[] = [];
  const paths = getMcpConfigPaths();

  for (const { path, scope } of paths) {
    const config = await loadMcpConfigFile(path);
    if (!config?.mcpServers) continue;

    for (const [name, serverConfig] of Object.entries(config.mcpServers)) {
      const typedConfig = serverConfig as McpServerConfig;
      if (typedConfig.enabled === false) {
        log(`Skipping disabled MCP server "${name}"`, { path });
        continue;
      }

      try {
        servers[name] = typedConfig;

        const existingIndex = loadedServers.findIndex((s) => s.name === name);
        if (existingIndex !== -1) {
          loadedServers.splice(existingIndex, 1);
        }

        loadedServers.push({ name, config: typedConfig });

        log(`Loaded MCP server "${name}" from ${scope}`, { path });
      } catch (error) {
        log(`Failed to load MCP server "${name}"`, error);
      }
    }
  }

  return { servers, loadedServers };
}
