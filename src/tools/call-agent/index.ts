import { createCallAgentTool } from "./tools.ts";
import type { BackgroundManager } from '../../features/background-agent/manager';
import type { AgentCallOptions, AgentCallResult } from '../../features/background-agent/types';

export function createCallAgentTools(manager: BackgroundManager) {
  return {
    call_agent: createCallAgentTool(manager),
  };
}

export type { AgentCallOptions, AgentCallResult } from '../../background-agent/types';
export type { BackgroundManager } from '../../background-agent/manager';