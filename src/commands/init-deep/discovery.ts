import type { AgentSession } from "../../../types.d";
import type { DiscoveryResult, ExistingAgent, ScaleMetrics } from "./types.ts";
import { BackgroundManager } from "../../background-agent/manager.ts";
import { GetBackgroundOutputResult, BackgroundTask } from "../../background-agent/types.ts";
import { EXPLORE_PROMPTS, DEFAULT_MAX_DEPTH } from "./constants.ts";

export async function runDiscoveryPhase(
  session: AgentSession,
  manager: BackgroundManager,
  args: Record<string, any>
): Promise<DiscoveryResult> {
  const createNew = args["--create-new"] || false;
  const maxDepth = args["--max-depth"] || DEFAULT_MAX_DEPTH;
  const projectName = args["--project-name"] || "Unknown Project";

  // Fire background explore agents
  const taskIds: string[] = [];
  for (const prompt of EXPLORE_PROMPTS) {
    const task = await manager.launch({
      description: "Explore project structure",
      prompt,
      agent: "explore",
      parentSessionID: session.id,
      parentMessageID: "0"
    });
    taskIds.push(task.id);
  }

  // Concurrent bash analysis
  const structure = await analyzeProjectStructure(maxDepth, session);
  const existingAgents = await findExistingAgents(session, createNew);

  // Dynamic agent spawning
  const scaleMetrics = await measureProjectScale(session);
  const additionalAgents = calculateAdditionalAgents(scaleMetrics);
  for (let i = 0; i < additionalAgents; i++) {
    await manager.launch({
      description: `Additional analysis task ${i + 1}`,
      prompt: `Perform deep analysis of project complexity hotspots`,
      agent: "explore",
      parentSessionID: session.id,
      parentMessageID: "0"
    });
  }

  // Collect background results
  const backgroundResults: BackgroundTask[] = [];
  for (const taskId of taskIds) {
    const output = await manager.getOutput(taskId);
    if (output && output.status === 'completed') {
      backgroundResults.push({
        id: taskId,
        sessionID: session.id,
        parentSessionID: session.id,
        parentMessageID: "0",
        description: "Explore analysis",
        prompt: "Analysis complete",
        agent: "explore",
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        result: output.output || output.result
      });
    }
  }

  return {
    structure,
    existingAgents,
    backgroundResults,
    scaleMetrics,
    createNew,
    maxDepth,
    projectName
  };
}

async function analyzeProjectStructure(maxDepth: number, session: AgentSession): Promise<string[]> {
  // Get all directories
  const dirs = await session.glob({
    pattern: "**/*",
    include: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.py", "**/*.go", "**/*.rs"],
    exclude: ["**/node_modules/**", "**/.git/**", "**/venv/**", "**/dist/**", "**/build/**"],
    maxDepth
  });

  // Filter to unique directories
  const uniqueDirs = new Set<string>();
  for (const file of dirs) {
    const dir = file.split("/").slice(0, -1).join("/");
    uniqueDirs.add(dir);
  }

  return Array.from(uniqueDirs);
}

async function findExistingAgents(
  session: AgentSession,
  createNew: boolean
): Promise<ExistingAgent[]> {
  const agents: ExistingAgent[] = [];

  // Find existing AGENTS.md files
  const agentFiles = await session.glob({
    pattern: "**/AGENTS.md",
    exclude: ["**/node_modules/**", "**/.git/**"]
  });

  for (const file of agentFiles) {
    const content = await session.read({ filePath: file });
    
    const hasOverview = await session.grep({
      filePath: file,
      pattern: "^## OVERVIEW$"
    }).then((results: any) => results.length > 0);

    const hasConventions = await session.grep({
      filePath: file,
      pattern: "^## CONVENTIONS$"
    }).then((results: any) => results.length > 0);

    const hasAntiPatterns = await session.grep({
      filePath: file,
      pattern: "^## ANTI-PATTERNS$"
    }).then((results: any) => results.length > 0);

    agents.push({
      path: file,
      content,
      hasOverview,
      hasConventions,
      hasAntiPatterns
    });

    if (createNew) {
      // Remove existing file for --create-new mode
      await session.write({
        filePath: file,
        content: ""
      });
    }
  }

  return agents;
}

async function measureProjectScale(session: AgentSession): Promise<ScaleMetrics> {
  // Count total files
  const allFiles = await session.glob({
    pattern: "**/*",
    exclude: ["**/node_modules/**", "**/.git/**", "**/venv/**", "**/dist/**", "**/build/**"]
  });
  const totalFiles = allFiles.length;

  // Count total lines in code files
  let totalLines = 0;
  const codeFiles = await session.glob({
    pattern: "**/*.{ts,tsx,js,py,go,rs}",
    exclude: ["**/node_modules/**", "**/.git/**", "**/venv/**", "**/dist/**", "**/build/**"]
  });

  for (const file of codeFiles) {
    const content = await session.read({ filePath: file });
    totalLines += content.split("\n").length;
  }

  // Count large files (>500 lines)
  let largeFiles = 0;
  for (const file of codeFiles) {
    const content = await session.read({ filePath: file });
    const lines = content.split("\n").length;
    if (lines > 500) {
      largeFiles++;
    }
  }

  // Measure max depth
  let maxDepth = 0;
  for (const file of allFiles) {
    const depth = file.split("/").length;
    if (depth > maxDepth) {
      maxDepth = depth;
    }
  }

  return {
    totalFiles,
    totalLines,
    largeFiles,
    maxDepth
  };
}

function calculateAdditionalAgents(metrics: ScaleMetrics): number {
  let count = 0;

  // +1 per 100 files
  if (metrics.totalFiles > 100) {
    count += Math.floor(metrics.totalFiles / 100);
  }

  // +1 per 10k lines
  if (metrics.totalLines > 10000) {
    count += Math.floor(metrics.totalLines / 10000);
  }

  // +2 for depth >= 4
  if (metrics.maxDepth >= 4) {
    count += 2;
  }

  // +1 for >10 large files
  if (metrics.largeFiles > 10) {
    count += 1;
  }

  return count;
}