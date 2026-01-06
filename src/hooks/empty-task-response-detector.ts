import type { PluginInput } from "@opencode-ai/plugin"

export function createEmptyTaskResponseDetectorHook(ctx: PluginInput) {
  return {
    "tool.execute.after": async (input: { tool: string; sessionID: string }, output: { result: string | undefined }) => {
      if (input.tool !== "task") return
      
      const result = output.result as string | undefined
      if (!result || result.trim() === "") {
        await ctx.client.session
          .message({
            path: { id: input.sessionID, messageID: crypto.randomUUID() },
            body: {
              parts: [
                {
                  type: "text",
                  text: `Task completed but produced no output. Please verify the task was successful or try a different approach.`,
                },
              ],
            },
          })
          .catch(() => {})
      }
    },
  }
}
