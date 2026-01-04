import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import type { Tool, Resource, Prompt } from "@modelcontextprotocol/sdk/types.js";
import type { McpServerConfig, McpRemoteConfig, McpLocalConfig } from "../../mcp/types";
import type { McpClientInfo, McpServerContext } from "./types";

interface ManagedClient {
  client: Client;
  transport: StdioClientTransport | SSEClientTransport;
  serverName: string;
}

export class McpManager {
  private clients: Map<string, ManagedClient> = new Map();

  private getClientKey(info: McpClientInfo): string {
    return `${info.sessionID}:${info.serverName}`;
  }

  async getOrCreateClient(
    info: McpClientInfo,
    config: McpServerConfig
  ): Promise<Client> {
    const key = this.getClientKey(info);
    const existing = this.clients.get(key);

    if (existing) {
      return existing.client;
    }

    const client = await this.createClient(info, config);
    return client;
  }

  private async createClient(
    info: McpClientInfo,
    config: McpServerConfig
  ): Promise<Client> {
    const key = this.getClientKey(info);

    if (config.type === "remote") {
      return this.createRemoteClient(info, config);
    } else {
      return this.createLocalClient(info, config);
    }
  }

  private async createRemoteClient(
    info: McpClientInfo,
    config: McpRemoteConfig
  ): Promise<Client> {
    const key = this.getClientKey(info);
    const client = new Client(
      { name: `mcp-${info.serverName}`, version: "1.0.0" },
      { capabilities: {} }
    );

    let transport: SSEClientTransport;

    transport = new SSEClientTransport(new URL(config.url));

    try {
      await client.connect(transport);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to connect to MCP server "${info.serverName}".\n\n` +
        `URL: ${config.url}\n` +
        `Reason: ${errorMessage}\n\n` +
        `Hints:\n` +
        `  - Check if the MCP server URL is correct\n` +
        `  - Verify network connectivity\n` +
        `  - Ensure the remote server is running`
      );
    }

    this.clients.set(key, { client, transport, serverName: info.serverName });
    return client;
  }

  private async createLocalClient(
    info: McpClientInfo,
    config: McpLocalConfig
  ): Promise<Client> {
    const key = this.getClientKey(info);
    if (config.command.length === 0) {
      throw new Error(
        `MCP server "${info.serverName}" is missing required 'command' field.\n\n` +
        `The MCP configuration must specify a command to execute.\n\n` +
        `Example:\n` +
        `  mcp:\n` +
        `    ${info.serverName}:\n` +
        `      type: local\n` +
        `      command: ["npx", "-y", "@some/mcp-server"]`
      );
    }

    const client = new Client(
      { name: `mcp-${info.serverName}`, version: "1.0.0" },
      { capabilities: {} }
    );

    const transport = new StdioClientTransport({
      command: config.command[0],
      args: config.command.slice(1),
      env: config.environment,
      stderr: "ignore",
    });

    try {
      await client.connect(transport);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to connect to MCP server "${info.serverName}".\n\n` +
        `Command: ${config.command.join(" ")}\n` +
        `Reason: ${errorMessage}\n\n` +
        `Hints:\n` +
        `  - Ensure the command is installed and available in PATH\n` +
        `  - Check if the MCP server package exists\n` +
        `  - Verify the args are correct for this server`
      );
    }

    this.clients.set(key, { client, transport, serverName: info.serverName });
    return client;
  }

  async disconnectSession(sessionID: string): Promise<void> {
    const keysToRemove: string[] = [];

    for (const [key, managed] of this.clients.entries()) {
      if (key.startsWith(`${sessionID}:`)) {
        keysToRemove.push(key);
        try {
          await managed.client.close();
        } catch {
          // Ignore close errors - process may already be terminated
        }
      }
    }

    for (const key of keysToRemove) {
      this.clients.delete(key);
    }
  }

  async disconnectAll(): Promise<void> {
    for (const [, managed] of this.clients.entries()) {
      try {
        await managed.client.close();
      } catch {
        // process may already be terminated
      }
    }
    this.clients.clear();
  }

  async listTools(
    info: McpClientInfo,
    context: McpServerContext
  ): Promise<Tool[]> {
    const client = await this.getOrCreateClientWithRetry(info, context.config);
    const result = await client.listTools();
    return result.tools;
  }

  async listResources(
    info: McpClientInfo,
    context: McpServerContext
  ): Promise<Resource[]> {
    const client = await this.getOrCreateClientWithRetry(info, context.config);
    const result = await client.listResources();
    return result.resources;
  }

  async listPrompts(
    info: McpClientInfo,
    context: McpServerContext
  ): Promise<Prompt[]> {
    const client = await this.getOrCreateClientWithRetry(info, context.config);
    const result = await client.listPrompts();
    return result.prompts;
  }

  async callTool(
    info: McpClientInfo,
    context: McpServerContext,
    name: string,
    args: Record<string, unknown>
  ): Promise<unknown> {
    const client = await this.getOrCreateClientWithRetry(info, context.config);
    const result = await client.callTool({ name, arguments: args });
    return result.content;
  }

  async readResource(
    info: McpClientInfo,
    context: McpServerContext,
    uri: string
  ): Promise<unknown> {
    const client = await this.getOrCreateClientWithRetry(info, context.config);
    const result = await client.readResource({ uri });
    return result.contents;
  }

  async getPrompt(
    info: McpClientInfo,
    context: McpServerContext,
    name: string,
    args: Record<string, string>
  ): Promise<unknown> {
    const client = await this.getOrCreateClientWithRetry(info, context.config);
    const result = await client.getPrompt({ name, arguments: args });
    return result.messages;
  }

  private async getOrCreateClientWithRetry(
    info: McpClientInfo,
    config: McpServerConfig
  ): Promise<Client> {
    try {
      return await this.getOrCreateClient(info, config);
    } catch (error) {
      const key = this.getClientKey(info);
      const existing = this.clients.get(key);
      if (existing) {
        try {
          await existing.client.close();
        } catch {
          // process may already be terminated
        }
        this.clients.delete(key);
        return await this.getOrCreateClient(info, config);
      }
      throw error;
    }
  }

  getConnectedServers(): string[] {
    return Array.from(this.clients.keys());
  }

  isConnected(info: McpClientInfo): boolean {
    return this.clients.has(this.getClientKey(info));
  }
}
