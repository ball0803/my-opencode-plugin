import type { BackgroundTask, BackgroundTaskOptions, CancelOptions, CreateBackgroundTaskOptions, GetBackgroundOutputOptions, GetBackgroundOutputResult } from '../../features/background-agent/types';
import { BackgroundManager } from '../../features/background-agent/manager';

export function createBackgroundTaskTool(manager: BackgroundManager) {
  return {
    name: 'background_task',
    description: 'Create a new background task',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Optional task ID. If not provided, one will be generated.',
        },
        sessionId: {
          type: 'string',
          description: 'Optional session ID to use for this task.',
        },
        options: {
          type: 'object',
          description: 'Task options',
          properties: {
            agent: {
              type: 'string',
              description: 'Agent to use for this task',
            },
            prompt: {
              type: 'string',
              description: 'Prompt to send to the agent',
            },
            background: {
              type: 'boolean',
              description: 'Whether to run in background',
            },
          },
          required: ['agent', 'prompt'],
        },
      },
      required: ['options'],
    },
    async execute(options: CreateBackgroundTaskOptions): Promise<BackgroundTask> {
      return manager.createTask(options);
    },
  };
}

export function getBackgroundOutputTool(manager: BackgroundManager) {
  return {
    name: 'background_output',
    description: 'Get output from a background task',
    parameters: {
      type: 'object',
      properties: {
        taskId: {
          type: 'string',
          description: 'ID of the task to get output from',
        },
        wait: {
          type: 'boolean',
          description: 'Whether to wait for task completion',
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds to wait for task completion',
        },
      },
      required: ['taskId'],
    },
    async execute(options: GetBackgroundOutputOptions): Promise<GetBackgroundOutputResult> {
      return manager.getOutput(options.taskId, { taskId: options.taskId });
    },
  };
}

export function cancelBackgroundTaskTool(manager: BackgroundManager) {
  return {
    name: 'background_cancel',
    description: 'Cancel a background task',
    parameters: {
      type: 'object',
      properties: {
        taskId: {
          type: 'string',
          description: 'ID of the task to cancel',
        },
        all: {
          type: 'boolean',
          description: 'Whether to cancel all running tasks',
        },
        force: {
          type: 'boolean',
          description: 'Whether to force cancel the task',
        },
      },
    },
    async execute(options: CancelOptions): Promise<BackgroundTask | BackgroundTask[]> {
      if (options.all) {
        return manager.cancelAllTasks(options);
      }
      if (options.taskId) {
        return manager.cancelTask(options.taskId, {});
      }
      throw new Error('Either taskId or all must be provided');
    },
  };
}