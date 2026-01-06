import type { PluginInput } from "@opencode-ai/plugin"

interface SessionNotificationConfig {
  enabled?: boolean
  message?: string
}

export function createSessionNotificationHook(
  ctx: PluginInput,
  config: SessionNotificationConfig = {}
) {
  const { enabled = true, message = "Session event detected" } = config

  return {
    event: async (input: { event: { type: string; properties?: Record<string, unknown> } }) => {
      if (!enabled) return

      if (input.event.type === "session.created" || input.event.type === "session.ended") {
        await ctx.client.session
          .message({
            path: { id: input.event.properties?.sessionID as string, messageID: crypto.randomUUID() },
            body: {
              parts: [
                {
                  type: "text",
                  text: message,
                },
              ],
            },
          })
          .catch(() => {})
      }
    },
  }
}
