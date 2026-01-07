import type { TodoWrite } from "../../../types.d"
import type { Glob } from "../../../types.d"
import type { Read } from "../../../types.d"
import type { Write } from "../../../types.d"
import type { BackgroundManager } from "../../../types.d"
import { DiscoveryResult, GenerationResult, ScoringResult, Phase3Result } from "./types.ts"
import { TODO_WRITE_IDS } from "./constants.ts"

export async function generatePhase(
  discoveryResult: DiscoveryResult,
  scoringResult: ScoringResult,
  todoWrite: TodoWrite,
  glob: Glob,
  read: Read,
  write: Write,
  backgroundManager: BackgroundManager
): Promise<GenerationResult> {
  const startTime = Date.now()
  const todoId = TODO_WRITE_IDS.PHASE_3
  
  try {
    todoWrite.updateTodo(todoId, {
      status: "in_progress",
      message: "Generating AGENTS.md files..."
    })
    
    // Group directories by score
    const highScoreDirs = scoringResult.directories.filter((d: any) => d.score >= 80)
    const mediumScoreDirs = scoringResult.directories.filter((d: any) => d.score >= 50 && d.score < 80)
    const lowScoreDirs = scoringResult.directories.filter((d: any) => d.score < 50)
    
    // Generate AGENTS.md for high-score directories
    const highScoreResults: Phase3Result[] = []
    for (const dir of highScoreDirs) {
      const result = await generateAgentsFile(
        dir.path,
        [dir.path],
        discoveryResult.projectName,
        todoWrite,
        glob,
        read,
        write,
        backgroundManager
      )
      highScoreResults.push(result)
    }
    
    // Generate AGENTS.md for medium-score directories
    const mediumScoreResults: Phase3Result[] = []
    for (const dir of mediumScoreDirs) {
      const result = await generateAgentsFile(
        dir.path,
        [dir.path],
        discoveryResult.projectName,
        todoWrite,
        glob,
        read,
        write,
        backgroundManager
      )
      mediumScoreResults.push(result)
    }
    
    // Generate AGENTS.md for low-score directories
    const lowScoreResults: Phase3Result[] = []
    for (const dir of lowScoreDirs) {
      const result = await generateAgentsFile(
        dir.path,
        [dir.path],
        discoveryResult.projectName,
        todoWrite,
        glob,
        read,
        write,
        backgroundManager
      )
      lowScoreResults.push(result)
    }
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    todoWrite.updateTodo(todoId, {
      status: "completed",
      message: `Generated AGENTS.md files in ${duration}ms`
    })
    
    return {
      success: true,
      duration,
      highScoreResults,
      mediumScoreResults,
      lowScoreResults,
      totalFilesGenerated: highScoreResults.length + mediumScoreResults.length + lowScoreResults.length
    }
  } catch (error) {
    todoWrite.updateTodo(todoId, {
      status: "failed",
      message: `Error generating AGENTS.md files: ${error instanceof Error ? error.message : String(error)}`
    })
  return {
    success: false,
    duration: Date.now() - startTime,
    error: error instanceof Error ? error.message : String(error),
    highScoreResults: [],
    mediumScoreResults: [],
    lowScoreResults: [],
    totalFilesGenerated: 0
  }
  }
}

async function generateAgentsFile(
  dirPath: string,
  files: string[],
  projectName: string,
  todoWrite: TodoWrite,
  glob: Glob,
  read: Read,
  write: Write,
  backgroundManager: BackgroundManager
): Promise<Phase3Result> {
  const agentsFilePath = `${dirPath}/AGENTS.md`
  
  try {
    // Read template or create content
    const content = generateAgentsContent(dirPath, files, projectName)
    
    // Write the file
    await write.writeFile({
      filePath: agentsFilePath,
      content
    })
    
    return {
      path: agentsFilePath,
      success: true,
      fileSize: content.length
    }
  } catch (error) {
    return {
      path: agentsFilePath,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

function generateAgentsContent(dirPath: string, files: string[], projectName: string): string {
  const relativePath = dirPath.replace("/home/camel/Desktop/Project/yaocp/my-opencode-plugin/", "")
  const fileExtensions = new Set<string>()
  const hasTests = files.some(f => f.includes(".test.") || f.includes(".spec."))
  const hasDocs = files.some(f => f.toLowerCase().includes("readme") || f.toLowerCase().includes("docs"))
  
  // Extract file extensions
  files.forEach(file => {
    const ext = file.split(".").pop()?.toLowerCase()
    if (ext && !ext.includes("test") && !ext.includes("spec") && !ext.includes("d")) {
      fileExtensions.add(ext)
    }
  })
  
  return `# AGENTS.md for ${relativePath}\n\n## Overview\n\n${relativePath} directory contains ${files.length} files.\n\n## Files\n\n${files.map(file => `- \`${file}\``).join("\n")}\n\n## Structure\n\n${Array.from(fileExtensions).length > 0 ? `**File types**: ${Array.from(fileExtensions).join(", ")}` : ""}\n\n${hasTests ? "**Testing**: Present" : "**Testing**: None detected"}\n\n${hasDocs ? "**Documentation**: Present" : "**Documentation**: None detected"}\n\n## Notes\n\n- Generated by init-deep command\n- Part of ${projectName} project\n- Use "/init-deep" to regenerate\n`
}