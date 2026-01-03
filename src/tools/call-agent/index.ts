import { createCallAgentTool } from './tools';
import type { BackgroundManager } from '../../background-agent/manager';
import type { AgentCallOptions, AgentCallResult } from '../../background-agent/types';

export function createCallAgentTools(manager: BackgroundManager) {
  return {
    call_agent: createCallAgentTool(manager),
  };
}

export type { AgentCallOptions, AgentCallResult } from '../../background-agent/types';
export type { BackgroundManager } from '../../background-agent/manager';