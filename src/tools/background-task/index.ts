import { createBackgroundTaskTool, getBackgroundOutputTool, cancelBackgroundTaskTool } from './tools';
import type { BackgroundManager } from '../../background-agent/manager';

export function createBackgroundTaskTools(manager: BackgroundManager) {
  return {
    background_task: createBackgroundTaskTool(manager),
    background_output: getBackgroundOutputTool(manager),
    background_cancel: cancelBackgroundTaskTool(manager),
  };
}

export type { BackgroundTask, BackgroundTaskOptions, CancelOptions, CreateBackgroundTaskOptions, GetBackgroundOutputOptions, GetBackgroundOutputResult } from '../../background-agent/types';
export type { BackgroundManager } from '../../background-agent/manager';