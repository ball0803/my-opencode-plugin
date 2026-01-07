import type { PluginInput } from "@opencode-ai/plugin"

interface ThinkingModeConfig {
  enabled?: boolean
  prefix?: string
  suffix?: string
}

export function createThinkingModeHook(
  _ctx: PluginInput,
  config: ThinkingModeConfig = {}
) {
  const { enabled = true, prefix = "Thinking:", suffix = "..." } = config

  return {
    "tool.execute.before": async (
      input: { tool: string; sessionID: string; arguments?: string }
    ) => {
      if (!enabled || input.tool !== "call-agent") return

      if (typeof input.arguments === "string") {
        input.arguments = `${prefix} ${input.arguments} ${suffix}`
      }
    },
  }
}
