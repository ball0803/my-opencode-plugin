declare namespace NodeJS {
  type Timeout = any;
  type Interval = any;
}

declare module 'fs' {
  export function readFileSync(path: string, encoding: string): string;
  export function existsSync(path: string): boolean;
}

declare module 'path' {
  export function join(...paths: string[]): string;
}

declare module 'jsonc-parser' {
  export function parse(text: string, options?: any): any;
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
}

export interface PluginConfig {
  [key: string]: any;
}

export interface ConfigHandler {
  name: string;
  description: string;
  handle(config: any): Promise<any>;
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
  initialize(session: any): Promise<void>;
  launch(options: any): Promise<any>;
  getOutput(taskId: string): Promise<any>;
  cleanup(): Promise<void>;
}