import type { PluginInput } from "@opencode-ai/plugin"

export function createInteractiveBashSessionHook(_ctx: PluginInput) {
  return {
    "tool.execute.before": async (
      input: { tool: string; sessionID: string; arguments?: string }
    ) => {
      if (input.tool === "bash" && typeof input.arguments === "string") {
        if (input.arguments.startsWith("!") || input.arguments.startsWith("!!")) {
          return {
            arguments: input.arguments,
          }
        }
      }
    },
  }
}
