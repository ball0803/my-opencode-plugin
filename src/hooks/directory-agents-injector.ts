import type { PluginInput } from "@opencode-ai/plugin"
import { readFile } from "fs/promises"
import { join, dirname } from "path"

export function createDirectoryAgentsInjectorHook(ctx: PluginInput) {
  const injectedPaths = new Set<string>()

  async function shouldInjectAgents(directory: string): Promise<boolean> {
    try {
      const agentsPath = join(directory, "AGENTS.md")
      await readFile(agentsPath, "utf-8")
      return true
    } catch {
      return false
    }
  }

  async function injectAgents(directory: string): Promise<string | null> {
    try {
      const agentsPath = join(directory, "AGENTS.md")
      const content = await readFile(agentsPath, "utf-8")
      return content
    } catch {
      return null
    }
  }

  return {
    "tool.execute.before": async (input: { tool: string }, output: { args: Record<string, unknown> }) => {
      if (input.tool !== "task") return
      
      const args = output.args as Record<string, unknown>
      const directory = args.directory as string | undefined
      
      if (!directory) return
      
      const normalizedPath = dirname(directory)
      if (injectedPaths.has(normalizedPath)) return
      
      const hasAgents = await shouldInjectAgents(normalizedPath)
      if (!hasAgents) return
      
      const agentsContent = await injectAgents(normalizedPath)
      if (!agentsContent) return
      
      injectedPaths.add(normalizedPath)
      
      const existingContext = args.context as string | undefined
      const newContext = existingContext
        ? `${existingContext}

---

<directory-agents>
${agentsContent}
</directory-agents>
`
        : `<directory-agents>
${agentsContent}
</directory-agents>`
      
      args.context = newContext
    },
    "tool.execute.after": async (input: { tool: string }, output: { args: Record<string, unknown> }) => {
      if (input.tool !== "task") return
      
      const args = output.args as Record<string, unknown>
      const directory = args.directory as string | undefined
      
      if (!directory) return
      
      const normalizedPath = dirname(directory)
      injectedPaths.add(normalizedPath)
    },
    event: async ({ event }: { event: { type: string; properties?: unknown } }) => {
      if (event.type === "session.deleted") {
        injectedPaths.clear()
      }
    },
  }
}
