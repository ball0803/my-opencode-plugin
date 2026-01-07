import type { PluginInput } from "@opencode-ai/plugin"

export function createAutoSlashCommandHook(_ctx: PluginInput) {
  return {
    "tool.execute.before": async (input: { tool: string; sessionID: string }) => {
      if (input.tool === "call-agent" || input.tool === "subagent") {
        const args = input.tool === "call-agent" 
          ? (input as any).arguments 
          : (input as any).prompt
        
        if (typeof args === "string" && args.startsWith("/")) {
          const command = args.split(" ")[0]
          const rest = args.slice(command.length).trim()
          
          if (command === "/help") {
            return {
              arguments: "/help",
            }
          }
        }
      }
    },
  }
}
