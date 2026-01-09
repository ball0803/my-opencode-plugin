declare module '../../features/background-agent/manager' {
  import { BackgroundManager } from '../../features/background-agent/manager';
  interface BackgroundManager {
    getAvailableAgents(): string[];
    isAgentAvailable(agentName: string): boolean;
    validateAgent(agentName: string): void;
  }
}

declare module '../../features/background-agent/types' {
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
  } from '../../features/background-agent/types';
}
