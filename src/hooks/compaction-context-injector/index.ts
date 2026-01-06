import type { PluginInput } from "@opencode-ai/plugin"

export function createCompactionContextInjector() {
  return {
    onSummarize: async (input: { sessionID: string; context: string }) => {
      return {
        context: input.context,
      }
    },
  }
}
