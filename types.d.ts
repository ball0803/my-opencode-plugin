declare namespace NodeJS {
  type Timeout = any;
  type Interval = any;
}

declare module 'fs' {
  export function readFileSync(path: string, encoding: string): string;
  export function existsSync(path: string): boolean;
}

declare module 'js-yaml';

declare module '../builtin-skills/types' {
  export interface BuiltinSkill {
    name: string;
    description: string;
    execute: (input: any) => Promise<any>;
  }
}

declare module '../hooks/claude-code-hooks/types' {
  export type ClaudeHookEvent = string;
  export interface PluginConfig {
    disabledHooks?: boolean | string[];
  }
}

declare module '../../features/background-agent/manager' {
  export interface BackgroundManager {
    launch(options: any): Promise<any>;
    getTask(taskId: string): any;
    getTasksByParentSession(sessionID: string): any[];
    getAllDescendantTasks(sessionID: string): any[];
    findBySession(sessionID: string): any;
    handleEvent(event: any): void;
    getPendingNotifications(sessionID: string): any[];
    clearNotifications(sessionID: string): void;
    cleanup(): void;
  }
}

declare module '../../hooks/types' {
  export interface MessageWithParts {
    info: any;
    parts: any[];
  }
  export type MessagesTransformHook = {
    'experimental.chat.messages.transform'?: (
      input: Record<string, never>,
      output: { messages: MessageWithParts[] },
    ) => Promise<void>;
  };
}

export interface AgentSession {
  id: string;
  getStatus(): Promise<string>;
  sendMessage(message: any): Promise<void>;
  todoWrite(options: any): Promise<void>;
  glob(options: any): Promise<string[]>;
  grep(options: any): Promise<any[]>;
  read(options: any): Promise<string>;
  write(options: any): Promise<void>;
  callAgent(agent: string, prompt: string, options?: any): Promise<any>;
  getTaskStatus(taskId: string): Promise<any>;
  getTaskOutput(taskId: string, options?: any): Promise<any>;
  cancelTask(taskId: string, options?: any): Promise<any>;
  notifyTaskComplete(taskId: string, result: any): Promise<void>;
  notifyTaskError(taskId: string, error: string): Promise<void>;
}

export interface PluginConfig {
  [key: string]: any;
}

declare module 'opencode' {
  export interface ConfigHandler {
    name: string;
    description: string;
    handle(config: any): Promise<any>;
  }

  export interface AgentSession {
    id: string;
    getStatus(): Promise<string>;
    sendMessage(message: any): Promise<void>;
    todoWrite(options: any): Promise<void>;
    glob(options: any): Promise<string[]>;
    grep(options: any): Promise<any[]>;
    read(options: any): Promise<string>;
    write(options: any): Promise<void>;
    callAgent(agent: string, prompt: string, options?: any): Promise<any>;
    getTaskStatus(taskId: string): Promise<any>;
    getTaskOutput(taskId: string, options?: any): Promise<any>;
    cancelTask(taskId: string, options?: any): Promise<any>;
    notifyTaskComplete(taskId: string, result: any): Promise<void>;
    notifyTaskError(taskId: string, error: string): Promise<void>;
  }
}

export interface Tool {
  name: string;
  description: string;
  parameters: any;
  execute(options: any): Promise<any>;
}

export interface TodoWrite {
  updateTodo(id: string, options: any): Promise<void>;
}

export interface Glob {
  glob(options: any): Promise<string[]>;
}

export interface Read {
  readFile(options: any): Promise<string>;
}

export interface Write {
  writeFile(options: any): Promise<void>;
}

export interface BackgroundManager {
  launch(options: any): Promise<any>;
  getTask(taskId: string): any;
  getTasksByParentSession(sessionID: string): any[];
  getAllDescendantTasks(sessionID: string): any[];
  findBySession(sessionID: string): any;
  handleEvent(event: any): void;
  getPendingNotifications(sessionID: string): any[];
  clearNotifications(sessionID: string): void;
  cleanup(): void;
}
