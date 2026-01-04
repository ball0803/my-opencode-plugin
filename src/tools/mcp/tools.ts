import type { McpArgs } from "./types";
import type { McpManager, McpClientInfo, McpServerContext } from "../../features/mcp-manager";
import type { McpServerConfig } from "../../mcp/types";

interface McpToolOptions {
  manager: McpManager;
  getSessionID: () => string;
  getMcpServers: () => Record<string, McpServerConfig>;
}

type OperationType = { type: "tool" | "resource" | "prompt"; name: string };

function validateOperationParams(args: McpArgs): OperationType {
  const operations: OperationType[] = [];
  if (args.tool_name) operations.push({ type: "tool", name: args.tool_name });
  if (args.resource_name) operations.push({ type: "resource", name: args.resource_name });
  if (args.prompt_name) operations.push({ type: "prompt", name: args.prompt_name });

  if (operations.length === 0) {
    throw new Error(
      `Missing operation. Exactly one of tool_name, resource_name, or prompt_name must be specified.\n\n` +
      `Examples:\n` +
      `  mcp(mcp_name="websearch_exa", tool_name="web_search_exa", arguments='{"query": "search term"}')\n` +
      `  mcp(mcp_name="grep_app", resource_name="file://path/to/file")\n` +
      `  mcp(mcp_name="context7", prompt_name="summarize", arguments='{"text": "..."}')`
    );
  }

  if (operations.length > 1) {
    const provided = [
      args.tool_name && `tool_name="${args.tool_name}"`,
      args.resource_name && `resource_name="${args.resource_name}"`,
      args.prompt_name && `prompt_name="${args.prompt_name}"`,
    ]
      .filter(Boolean)
      .join(", ");

    throw new Error(
      `Multiple operations specified. Exactly one of tool_name, resource_name, or prompt_name must be provided.\n\n` +
      `Received: ${provided}\n\n` +
      `Use separate calls for each operation.`
    );
  }

  return operations[0];
}

function findMcpServer(
  mcpName: string,
  servers: Record<string, McpServerConfig>
): McpServerConfig | null {
  return servers[mcpName] || null;
}

function formatAvailableMcps(servers: Record<string, McpServerConfig>): string {
  const mcps: string[] = [];
  for (const serverName of Object.keys(servers)) {
    mcps.push(`  - "${serverName}"`);
  }
  return mcps.length > 0 ? mcps.join("\n") : "  (none found)";
}

function parseArguments(argsJson: string | undefined): Record<string, unknown> {
  if (!argsJson) return {};
  try {
    const parsed = JSON.parse(argsJson);
    if (typeof parsed !== "object" || parsed === null) {
      throw new Error("Arguments must be a JSON object");
    }
    return parsed as Record<string, unknown>;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Invalid arguments JSON: ${errorMessage}\n\n` +
      `Expected a valid JSON object, e.g.: '{"key": "value"}'\n` +
      `Received: ${argsJson}`
    );
  }
}

export function applyGrepFilter(output: string, pattern: string | undefined): string {
  if (!pattern) return output;
  try {
    const regex = new RegExp(pattern, "i");
    const lines = output.split("\n");
    const filtered = lines.filter((line) => regex.test(line));
    return filtered.length > 0
      ? filtered.join("\n")
      : `[grep] No lines matched pattern: ${pattern}`;
  } catch {
    return output;
  }
}

export function createMcpTool(options: McpToolOptions) {
  const { manager, getSessionID, getMcpServers } = options;

  return {
    name: "mcp",
    description: `Invoke MCP server operations. Requires mcp_name plus exactly one of: tool_name, resource_name, or prompt_name.`,
    parameters: {
      type: "object",
      properties: {
        mcp_name: {
          type: "string",
          description: "Name of the MCP server",
        },
        tool_name: {
          type: "string",
          description: "MCP tool to call",
        },
        resource_name: {
          type: "string",
          description: "MCP resource URI to read",
        },
        prompt_name: {
          type: "string",
          description: "MCP prompt to get",
        },
        arguments: {
          type: "string",
          description: "JSON string of arguments",
        },
        grep: {
          type: "string",
          description: "Regex pattern to filter output lines (only matching lines returned)",
        },
      },
      required: ["mcp_name"],
    },
    async execute(args: McpArgs) {
      const operation = validateOperationParams(args);
      const servers = getMcpServers();
      const config = findMcpServer(args.mcp_name, servers);

      if (!config) {
        throw new Error(
          `MCP server "${args.mcp_name}" not found.\n\n` +
          `Available MCP servers:\n` +
          formatAvailableMcps(servers) + "\n\n" +
          `Hint: Configure MCP servers in .mcp.json file.`
        );
      }

      const info: McpClientInfo = {
        serverName: args.mcp_name,
        sessionID: getSessionID(),
      };

      const context: McpServerContext = {
        config,
      };

      const parsedArgs = parseArguments(args.arguments);

      let output: string;
      switch (operation.type) {
        case "tool": {
          const result = await manager.callTool(info, context, operation.name, parsedArgs);
          output = JSON.stringify(result, null, 2);
          break;
        }
        case "resource": {
          const result = await manager.readResource(info, context, operation.name);
          output = JSON.stringify(result, null, 2);
          break;
        }
        case "prompt": {
          const stringArgs: Record<string, string> = {};
          for (const [key, value] of Object.entries(parsedArgs)) {
            stringArgs[key] = String(value);
          }
          const result = await manager.getPrompt(info, context, operation.name, stringArgs);
          output = JSON.stringify(result, null, 2);
          break;
        }
      }
      return applyGrepFilter(output, args.grep);
    },
  };
}
