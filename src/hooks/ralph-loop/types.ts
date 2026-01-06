export interface RalphLoopOptions {
  config?: {
    maxIterations?: number
    completionPromise?: string
  }
}

export interface RalphLoopState {
  sessionID: string
  prompt: string
  maxIterations?: number
  completionPromise?: string
  iterationCount: number
  startedAt: number
}
