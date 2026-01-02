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

declare module 'opencode' {
  export interface AgentSession {
    id: string;
    getStatus(): Promise<string>;
    sendMessage(message: any): Promise<void>;
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
}
