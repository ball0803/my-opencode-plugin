import type { AgentSession } from "../../../types.d";
import { BackgroundManager } from "../../features/background-agent/manager.ts";
import { runDiscoveryPhase } from "./discovery.ts";
import { runScoringPhase } from "./scoring.ts";
import { generatePhase } from "./generation.ts";
import { reviewPhase } from "./review.ts";
import { TODO_WRITE_IDS } from "./constants.ts";
import type { FinalReport } from "./types.ts";

export async function handleInitDeepCommand(
  session: AgentSession,
  args: Record<string, any>
): Promise<string> {
  const manager = new BackgroundManager();
  await manager.initialize(session);

  // Initialize TodoWrite
  await session.todoWrite({
    todos: [
      {
        id: TODO_WRITE_IDS.PHASE_1,
        content: "Fire explore agents + bash analysis + read existing",
        status: "pending",
        priority: "high"
      },
      {
        id: TODO_WRITE_IDS.PHASE_2,
        content: "Score directories, determine locations",
        status: "pending",
        priority: "high"
      },
      {
        id: TODO_WRITE_IDS.PHASE_3,
        content: "Generate AGENTS.md files (root + subdirs)",
        status: "pending",
        priority: "high"
      },
      {
        id: TODO_WRITE_IDS.PHASE_4,
        content: "Deduplicate, validate, trim",
        status: "pending",
        priority: "medium"
      }
    ]
  });

  // Phase 1: Discovery
  await session.todoWrite({
    todos: [{ id: TODO_WRITE_IDS.PHASE_1, status: "in_progress" }]
  });
  const discoveryResult = await runDiscoveryPhase(session, manager, args);
  await session.todoWrite({
    todos: [{ id: TODO_WRITE_IDS.PHASE_1, status: "completed" }]
  });

  // Phase 2: Scoring
  await session.todoWrite({
    todos: [{ id: TODO_WRITE_IDS.PHASE_2, status: "in_progress" }]
  });
  const scoringResult = await runScoringPhase(discoveryResult);
  await session.todoWrite({
    todos: [{ id: TODO_WRITE_IDS.PHASE_2, status: "completed" }]
  });

  // Phase 3: Generation
  await session.todoWrite({
    todos: [{ id: TODO_WRITE_IDS.PHASE_3, status: "in_progress" }]
  });
  const generationResult = await generatePhase(
    discoveryResult,
    scoringResult,
    {
      updateTodo: session.todoWrite
    } as any,
    {
      glob: session.glob
    } as any,
    {
      readFile: session.read
    } as any,
    {
      writeFile: session.write
    } as any,
    manager
  );
  await session.todoWrite({
    todos: [{ id: TODO_WRITE_IDS.PHASE_3, status: "completed" }]
  });

  // Phase 4: Review
  await session.todoWrite({
    todos: [{ id: TODO_WRITE_IDS.PHASE_4, status: "in_progress" }]
  });
  const reviewResult = await reviewPhase(
    discoveryResult,
    scoringResult,
    {
      updateTodo: session.todoWrite
    } as any,
    {
      glob: session.glob
    } as any,
    {
      readFile: session.read
    } as any,
    {
      writeFile: session.write
    } as any,
    manager
  );
  await session.todoWrite({
    todos: [{ id: TODO_WRITE_IDS.PHASE_4, status: "completed" }]
  });

  return generateFinalReport(reviewResult, args);
}

function generateFinalReport(
  result: { filesCreated: number; filesValidated: number; validationResults: any[] },
  args: Record<string, any>
): string {
  const mode = args["--create-new"] ? "create-new" : "update";

  return `=== init-deep Complete ===

Mode: ${mode}

Files:
  ✓ ./AGENTS.md (root, ${result.filesCreated} lines)

Dirs Analyzed: ${result.filesValidated}
AGENTS.md Created: ${result.filesCreated}
AGENTS.md Updated: 0

Hierarchy:
  ./AGENTS.md`;
}