import type { PluginInput } from "@opencode-ai/plugin"

export function createEditErrorRecoveryHook(ctx: PluginInput) {
  return {
    "tool.execute.after": async (input: { tool: string; sessionID: string }, output: { result: { success: boolean; error?: string } | undefined }) => {
      if (input.tool !== "edit") return
      
      const result = output.result as { success: boolean; error?: string } | undefined
      if (!result || !result.success) {
        await ctx.client.session
          .message({
            path: { id: input.sessionID, messageID: crypto.randomUUID() },
            body: {
              parts: [
                {
                  type: "text",
                  text: `Edit failed: ${result?.error || "Unknown error"}. Please try again or use a different approach.`,
                },
              ],
            },
          })
          .catch(() => {})
      }
    },
  }
}
