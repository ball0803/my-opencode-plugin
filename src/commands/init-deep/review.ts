import type { TodoWrite } from "../../../types.d"
import type { Glob } from "../../../types.d"
import type { Read } from "../../../types.d"
import type { Write } from "../../../types.d"
import type { BackgroundManager } from "../../../types.d"
import { DiscoveryResult, ReviewResult, ScoringResult, Phase4Result } from "./types"
import { TODO_WRITE_IDS } from "./constants"

export async function reviewPhase(
  discoveryResult: DiscoveryResult,
  scoringResult: ScoringResult,
  todoWrite: TodoWrite,
  glob: Glob,
  read: Read,
  write: Write,
  backgroundManager: BackgroundManager
): Promise<ReviewResult> {
  const startTime = Date.now()
  const todoId = TODO_WRITE_IDS.PHASE_4
  
  try {
    todoWrite.updateTodo(todoId, {
      status: "in_progress",
      message: "Reviewing generated AGENTS.md files..."
    })
    
    // Find all AGENTS.md files that were generated
    const agentsFiles = await glob.glob({
      pattern: "**/AGENTS.md"
    })
    
    const reviewResults: Phase4Result[] = []
    
    for (const filePath of agentsFiles) {
      const result = await reviewAgentsFile(
        filePath,
        todoWrite,
        glob,
        read,
        write,
        backgroundManager
      )
      reviewResults.push(result)
    }
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    todoWrite.updateTodo(todoId, {
      status: "completed",
      message: `Reviewed ${reviewResults.length} AGENTS.md files in ${duration}ms`
    })
    
  return {
    success: true,
    duration,
    results: reviewResults,
    totalFilesReviewed: reviewResults.length,
    validFiles: reviewResults.filter(r => r.valid).length,
    invalidFiles: reviewResults.filter(r => !r.valid).length,
    filesCreated: reviewResults.length,
    filesValidated: reviewResults.length,
    validationResults: reviewResults.map(r => ({
      filePath: r.path,
      lines: r.fileSize,
      warnings: r.issues
    }))
  }
  } catch (error) {
    todoWrite.updateTodo(todoId, {
      status: "failed",
      message: `Error reviewing AGENTS.md files: ${error instanceof Error ? error.message : String(error)}`
    })
  return {
    success: false,
    duration: Date.now() - startTime,
    error: error instanceof Error ? error.message : String(error),
    results: [],
    totalFilesReviewed: 0,
    validFiles: 0,
    invalidFiles: 0,
    filesCreated: 0,
    filesValidated: 0,
    validationResults: []
  }
  }
}

async function reviewAgentsFile(
  filePath: string,
  todoWrite: TodoWrite,
  glob: Glob,
  read: Read,
  write: Write,
  backgroundManager: BackgroundManager
): Promise<Phase4Result> {
  try {
    // Read the AGENTS.md file
    const content = await read.readFile({
      filePath
    })
    
    // Validate the file
    const validation = validateAgentsFile(filePath, content)
    
    return {
      path: filePath,
      valid: validation.valid,
      issues: validation.issues,
      fileSize: content.length
    }
  } catch (error) {
    return {
      path: filePath,
      valid: false,
      issues: [error instanceof Error ? error.message : String(error)],
      fileSize: 0
    }
  }
}

function validateAgentsFile(filePath: string, content: string): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  
  // Check if file has basic structure
  if (!content.includes("# AGENTS.md")) {
    issues.push("Missing header (# AGENTS.md)")
  }
  
  if (!content.includes("## Overview")) {
    issues.push("Missing Overview section")
  }
  
  if (!content.includes("## Files")) {
    issues.push("Missing Files section")
  }
  
  if (!content.includes("## Structure")) {
    issues.push("Missing Structure section")
  }
  
  if (!content.includes("## Notes")) {
    issues.push("Missing Notes section")
  }
  
  // Check if file is not empty
  if (content.trim().length === 0) {
    issues.push("File is empty")
  }
  
  // Check if file has reasonable content
  if (content.split("\n").length < 5) {
    issues.push("File has insufficient content")
  }
  
  return {
    valid: issues.length === 0,
    issues
  }
}