// Agent discovery tools index

import { BackgroundManager } from '../../background-agent/manager';
import { createListAgentsTool, createGetAgentInfoTool } from "./tools.ts";

export function createAgentDiscoveryTools(manager: BackgroundManager) {
  return {
    list_agents: createListAgentsTool(manager),
    get_agent_info: createGetAgentInfoTool(manager),
  };
}

export type { BackgroundManager } from '../../background-agent/manager';
