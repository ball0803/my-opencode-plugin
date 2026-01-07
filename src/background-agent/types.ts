export type BackgroundTaskStatus =
  | 'running'
  | 'completed'
  | 'error'
  | 'cancelled';

export interface BackgroundTask {
  id: string;
  sessionID: string;
  parentSessionID: string;
  parentMessageID: string;
  description: string;
  prompt: string;
  agent: string;
  status: BackgroundTaskStatus;
  startedAt: Date;
  completedAt?: Date;
  result?: string;
  error?: string;
  progress?: TaskProgress;
  parentModel?: { providerID: string; modelID: string };
  createdAt?: number;
  updatedAt?: number;
  options?: any;
  sessionId?: string;
  output?: string;
}

export interface BackgroundManagerOptions {
  pollInterval?: number;
  taskTTL?: number;
}

export interface CreateBackgroundTaskOptions {
  id?: string;
  sessionId?: string;
  options: any;
}

export type BackgroundTaskOptions = CreateBackgroundTaskOptions;

export interface GetBackgroundOutputOptions {
  taskId: string;
  wait?: boolean;
  timeout?: number;
  [key: string]: any;
}

export interface GetBackgroundOutputResult {
  status: BackgroundTaskStatus;
  taskId: string;
  output?: string;
  result?: any;
  error?: string;
}

export interface CancelOptions {
  taskId?: string;
  all?: boolean;
  force?: boolean;
}

export interface AgentSession {
  id: string;
  getStatus(): Promise<string>;
  sendMessage(message: any): Promise<void>;
  callAgent(agent: string, prompt: string, options?: any): Promise<any>;
  getTaskStatus(taskId: string): Promise<any>;
  getTaskOutput(taskId: string, options?: any): Promise<any>;
  cancelTask(taskId: string, options?: any): Promise<any>;
  notifyTaskComplete(taskId: string, result: any): Promise<void>;
  notifyTaskError(taskId: string, error: string): Promise<void>;
}

export interface TaskNotification {
  type: 'task_completion';
  taskId: string;
  status: BackgroundTaskStatus;
  timestamp: number;
}

export interface AgentCallOptions {
  agent: string;
  prompt: string;
  background?: boolean;
  options?: {
    sessionId?: string;
    taskId?: string;
    [key: string]: any;
  };
}

export interface AgentCallResult {
  status: 'running' | 'completed' | 'error';
  taskId?: string;
  result?: any;
  error?: string;
}

export interface LaunchInput {
  description: string;
  prompt: string;
  agent: string;
  parentSessionID: string;
  parentMessageID: string;
  parentModel?: { providerID: string; modelID: string };
}

export interface TaskProgress {
  toolCalls: number;
  lastTool?: string;
  lastUpdate: Date;
  lastMessage?: string;
  lastMessageAt?: Date;
}

export interface BackgroundTask {
  id: string;
  sessionID: string;
  parentSessionID: string;
  parentMessageID: string;
  description: string;
  prompt: string;
  agent: string;
  status: 'running' | 'completed' | 'error' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  result?: string;
  error?: string;
  progress?: TaskProgress;
  parentModel?: { providerID: string; modelID: string };
}
