import { BackgroundManager } from '../../background-agent/manager';
import { createListAgentsTool, createGetAgentInfoTool } from './tools';

export function createAgentDiscoveryTools(manager: BackgroundManager) {
  return {
    list_agents: createListAgentsTool(manager),
    get_agent_info: createGetAgentInfoTool(manager),
  };
}