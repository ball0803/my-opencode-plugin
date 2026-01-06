import type { PluginInput } from "@opencode-ai/plugin"
import { readFile } from "fs/promises"
import { join, dirname } from "path"

export function createDirectoryReadmeInjectorHook(ctx: PluginInput) {
  const injectedPaths = new Set<string>()

  async function shouldInjectReadme(directory: string): Promise<boolean> {
    try {
      const readmePath = join(directory, "README.md")
      await readFile(readmePath, "utf-8")
      return true
    } catch {
      return false
    }
  }

  async function injectReadme(directory: string): Promise<string | null> {
    try {
      const readmePath = join(directory, "README.md")
      const content = await readFile(readmePath, "utf-8")
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
      
      const hasReadme = await shouldInjectReadme(normalizedPath)
      if (!hasReadme) return
      
      const readmeContent = await injectReadme(normalizedPath)
      if (!readmeContent) return
      
      injectedPaths.add(normalizedPath)
      
      const existingContext = args.context as string | undefined
      const newContext = existingContext
        ? `${existingContext}

---

<directory-readme>
${readmeContent}
</directory-readme>
`
        : `<directory-readme>
${readmeContent}
</directory-readme>`
      
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
