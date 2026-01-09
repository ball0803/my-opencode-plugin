import type { AgentCallOptions, AgentCallResult } from '../../features/background-agent/types';
import { BackgroundManager } from '../../features/background-agent/manager';

export function createCallAgentTool(manager: BackgroundManager) {
  return {
    name: 'call_agent',
    description: 'Call a specialized agent with optional background execution',
    parameters: {
      type: 'object',
      properties: {
        agent: {
          type: 'string',
          description: 'Name of the agent to call',
        },
        prompt: {
          type: 'string',
          description: 'Prompt to send to the agent',
        },
        background: {
          type: 'boolean',
          description: 'Whether to run in background',
        },
        options: {
          type: 'object',
          description: 'Additional agent call options',
          properties: {
            sessionId: {
              type: 'string',
              description: 'Optional session ID to use',
            },
            taskId: {
              type: 'string',
              description: 'Optional task ID to use',
            },
          },
        },
      },
      required: ['agent', 'prompt'],
    },
    async execute(options: AgentCallOptions): Promise<AgentCallResult> {
      if (options.background) {
        const taskOptions = {
          id: options.options?.taskId,
          sessionId: options.options?.sessionId,
          options: {
            agent: options.agent,
            prompt: options.prompt,
          },
        };

        const task = await manager.createTask(taskOptions);
        return {
          taskId: task.id,
          status: 'running',
        };
      }

      return this.callAgentDirectly(options);
    },

    async callAgentDirectly(options: AgentCallOptions): Promise<AgentCallResult> {
      try {
        // Validate agent before calling
        manager.validateAgent(options.agent);
        
        const result = await manager.callAgent(options.agent, options.prompt, options.options);
        return {
          result,
          status: 'completed',
        };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : String(error),
          status: 'error',
        };
      }
    },
  };
}