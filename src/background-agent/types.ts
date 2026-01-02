export type BackgroundTaskStatus = 'running' | 'completed' | 'error' | 'cancelled';

export interface BackgroundTask {
  id: string;
  status: BackgroundTaskStatus;
  createdAt: number;
  updatedAt: number;
  options: any;
  sessionId?: string;
  result?: any;
  error?: string;
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
