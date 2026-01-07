import type { PluginInput } from "@opencode-ai/plugin"

export function createCommentCheckerHooks() {
  const MAX_COMMENT_LINES = 10
  const MAX_COMMENT_CHARS = 500

  return {
    "tool.execute.before": async (input: { tool: string }, output: { args: Record<string, unknown>; block: (params: { message: string }) => Promise<void> }) => {
      if (input.tool !== "edit") return
      
      const args = output.args as Record<string, unknown>
      const content = args.content as string | undefined
      
      if (!content) return
      
      const lines = content.split("\n")
      const commentLines = lines.filter(line => {
        return line.trim().startsWith("//") || 
               line.trim().startsWith("#") || 
               line.trim().startsWith("<!--") ||
               line.trim().startsWith("*/") ||
               line.trim().startsWith("/*")
      })
      
      const commentCount = commentLines.length
      const commentCharCount = commentLines.join("\n").length
      
      if (commentCount > MAX_COMMENT_LINES || commentCharCount > MAX_COMMENT_CHARS) {
        await output.block({
          message: `Too many comments (${commentCount} lines, ${commentCharCount} chars). Please reduce comments and focus on the code implementation.`,
        })
      }
    },
  }
}
