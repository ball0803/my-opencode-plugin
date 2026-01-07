import type { PluginInput } from "@opencode-ai/plugin"

interface ToolOutputTruncatorConfig {
  maxLength?: number
  truncationMessage?: string
}

export function createToolOutputTruncatorHook(
  ctx: PluginInput,
  config: ToolOutputTruncatorConfig = {}
) {
  const { maxLength = 2000, truncationMessage = "[Output truncated...]" } = config

  return {
    "tool.execute.after": async (
      input: { tool: string; sessionID: string },
      output: { result: string | undefined }
    ) => {
      if (!output.result || typeof output.result !== "string") return

      if (output.result.length > maxLength) {
        const truncated = output.result.substring(0, maxLength) + truncationMessage
        output.result = truncated
      }
    },
  }
}
