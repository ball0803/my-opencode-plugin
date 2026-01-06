import { tool } from "@opencode-ai/plugin"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export default tool({
  description: "Search and analyze code using ast-grep pattern matching",
  args: {
    pattern: tool.schema.string().describe("The ast-grep pattern to search for"),
    file: tool.schema.string().describe("File path to search in").optional(),
    dir: tool.schema.string().describe("Directory to search in").optional(),
    language: tool.schema.string().describe("Programming language").optional(),
    include: tool.schema.string().describe("Include files matching pattern").optional(),
    exclude: tool.schema.string().describe("Exclude files matching pattern").optional(),
    max_results: tool.schema.number().describe("Maximum results").default(50),
    json_output: tool.schema.boolean().describe("JSON output").default(true),
  },
  async execute(args) {
    try {
      // Check if ast-grep is installed
      await execAsync("ast-grep --version")
    } catch (error) {
      throw new Error("ast-grep is not installed. Please install it with: npm install -g ast-grep")
    }

    const commandArgs = []
    
    if (args.json_output) {
      commandArgs.push("--json")
    }
    
    if (args.language) {
      commandArgs.push("--lang", args.language)
    }
    
    if (args.include) {
      commandArgs.push("--include", args.include)
    }
    
    if (args.exclude) {
      commandArgs.push("--exclude", args.exclude)
    }
    
    const target = args.file || args.dir || "."
    commandArgs.push(target)
    commandArgs.push(args.pattern)
    
    const { stdout, stderr } = await execAsync(`ast-grep ${commandArgs.join(" ")}`)
    
    if (stderr && !stderr.includes("no files matched")) {
      throw new Error(`Error: ${stderr}`)
    }
    
    return stdout.trim() || "No matches found"
  },
})
