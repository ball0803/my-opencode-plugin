import type { PluginInput } from "@opencode-ai/plugin"

interface RulesInjectorConfig {
  rules?: string[]
  position?: "start" | "end"
}

export function createRulesInjectorHook(
  ctx: PluginInput,
  config: RulesInjectorConfig = {}
) {
  const { rules = [], position = "start" } = config

  return {
    "tool.execute.before": async (
      input: { tool: string; sessionID: string; arguments?: string }
    ) => {
      if (input.tool !== "call-agent" && input.tool !== "subagent") return
      if (!rules.length) return

      const rulesText = rules.join("\n")
      const instruction = `
---
Rules:
${rulesText}
---
`

      if (typeof input.arguments === "string") {
        if (position === "start") {
          input.arguments = instruction + input.arguments
        } else {
          input.arguments = input.arguments + instruction
        }
      }
    },
  }
}
