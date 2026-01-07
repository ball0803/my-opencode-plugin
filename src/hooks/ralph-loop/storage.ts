import type { RalphLoopState } from './types.ts';

const activeLoops = new Map<string, RalphLoopState>();

export function getActiveLoop(sessionID: string): RalphLoopState | undefined {
  return activeLoops.get(sessionID);
}

export function setActiveLoop(state: RalphLoopState): void {
  activeLoops.set(state.sessionID, state);
}

export function deleteActiveLoop(sessionID: string): void {
  activeLoops.delete(sessionID);
}

export function clearAllLoops(): void {
  activeLoops.clear();
}

export function getAllActiveLoops(): RalphLoopState[] {
  return Array.from(activeLoops.values());
}
