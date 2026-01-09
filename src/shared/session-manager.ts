// Session management utilities
export const subagentSessions = new Set<string>();

let mainSessionID: string | undefined;

export function getMainSessionID(): string | undefined {
  return mainSessionID;
}

export function setMainSession(sessionID: string | undefined): void {
  mainSessionID = sessionID;
}
