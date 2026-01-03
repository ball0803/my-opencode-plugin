// Core types and interfaces for the plugin

export interface AgentSession {
  callAgent(agent: string, prompt: string, options?: any): Promise<any>;
  getTaskStatus(taskId: string): Promise<any>;
  getTaskOutput(taskId: string, options?: any): Promise<any>;
  cancelTask(taskId: string, options?: any): Promise<any>;
  notifyTaskComplete(taskId: string, result: any): Promise<void>;
  notifyTaskError(taskId: string, error: string): Promise<void>;
}

export interface TaskNotification {
  taskId: string;
  status: 'completed' | 'error' | 'cancelled';
  result?: any;
  error?: string;
}

export interface AgentCallOptions {
  background?: boolean;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  stream?: boolean;
}

export interface AgentCallResult {
  result: any;
  taskId?: string;
}

export interface CreateBackgroundTaskOptions {
  description: string;
  prompt: string;
  agent?: string;
  background?: boolean;
  runInBackground?: boolean;
  [key: string]: any;
}

export interface GetBackgroundOutputOptions {
  taskId: string;
  wait?: boolean;
  timeout?: number;
}

export interface GetBackgroundOutputResult {
  output: string;
  status: 'running' | 'completed' | 'error' | 'cancelled';
  result?: any;
  error?: string;
}

export interface CancelOptions {
  force?: boolean;
  reason?: string;
}

export interface BackgroundManagerOptions {
  taskTTL?: number;
  pollInterval?: number;
  maxConcurrentTasks?: number;
}
