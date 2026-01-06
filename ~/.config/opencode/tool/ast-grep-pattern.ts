import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Create and test ast-grep patterns",
  args: {
    pattern_type: tool.schema.enum(["regex", "semantic", "struct"]).describe("Pattern type"),
    target: tool.schema.string().describe("What to match").optional(),
    language: tool.schema.string().describe("Programming language").optional(),
  },
  async execute(args) {
    let result = ""
    
    switch (args.pattern_type) {
      case "regex":
        result = `### Regex Pattern${args.target ? ` for "${args.target}"` : ""}
\`\`\`
${args.target || "your_pattern"}
\`\`\`
**Usage:** ast-grep -n '${args.target || "your_pattern"}' file.ts`
        break
      case "semantic":
        result = `### Semantic Pattern${args.language ? ` for ${args.language}` : ""}
\`\`\`
${args.target || "your_pattern"}
\`\`\`
**Usage:** ast-grep -n --lang ${args.language || "typescript"} '${args.target || "your_pattern"}' file.ts`
        break
      case "struct":
        result = `### Struct Pattern${args.language ? ` for ${args.language}` : ""}
\`\`\`
${args.target || "your_struct_pattern"}
\`\`\`
**Usage:** ast-grep -n --lang ${args.language || "typescript"} '${args.target || "your_struct_pattern"}' file.ts`
        break
    }
    
    return result
  },
})
