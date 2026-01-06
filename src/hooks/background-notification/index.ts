import type { BackgroundManager } from "../../background-agent/manager"

interface Event {
  type: string
  properties?: Record<string, unknown>
}

interface EventInput {
  event: Event
}

export function createBackgroundNotificationHook(manager: BackgroundManager) {
  const eventHandler = async ({ event }: EventInput) => {
    manager.handleEvent(event)
  }

  return {
    event: eventHandler,
  }
}
