declare module '../../background-agent/manager' {
  import { BackgroundManager } from '../../background-agent/manager';
  interface BackgroundManager {
    getAvailableAgents(): string[];
    isAgentAvailable(agentName: string): boolean;
    validateAgent(agentName: string): void;
  }
}

declare module '../../background-agent/types' {
  export type {
    BackgroundTask,
    BackgroundTaskOptions,
    CancelOptions,
    CreateBackgroundTaskOptions,
    GetBackgroundOutputOptions,
    GetBackgroundOutputResult,
    AgentCallOptions,
    AgentCallResult,
    AgentSession,
    BackgroundManagerOptions,
    BackgroundTaskStatus,
    LaunchInput,
    TaskNotification,
  } from '../../background-agent/types';
}
