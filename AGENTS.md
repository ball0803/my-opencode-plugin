# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-04
**Commit:** e83df8e
**Branch:** master

## OVERVIEW

Background agent orchestration system for OpenCode plugins. Provides async task management, agent discovery, and tool integration.

## STRUCTURE



## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add task type | `src/background-agent/types.ts` | Define new task types |
| Add tool | `src/tools/` | Create tool directory |
| Add handler | `src/plugin-handlers/` | Create handler file |
| Add config | `src/config/` | Update schema |
| Add docs | `docs/` | Follow documentation structure |

## CONVENTIONS

- **bun only**: `bun run`, `bun test`
- **TypeScript**: Strict mode
- **Testing**: Jest with 80% coverage
- **Error handling**: Always try/catch

## ANTI-PATTERNS (THIS PROJECT)

- Direct API calls without validation
- No error handling
- Memory leaks in background tasks
- High complexity in tools

## COMMANDS

error TS6231: Could not resolve the path '#' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
  The file is in the program because:
    Root file specified for compilation
error TS6231: Could not resolve the path 'Build' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
  The file is in the program because:
    Root file specified for compilation
error TS6231: Could not resolve the path 'Jest' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
  The file is in the program because:
    Root file specified for compilation
error TS6231: Could not resolve the path 'Run' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
  The file is in the program because:
    Root file specified for compilation
error TS6231: Could not resolve the path 'TypeScript' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
  The file is in the program because:
    Root file specified for compilation
error TS6231: Could not resolve the path 'Watch' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
  The file is in the program because:
    Root file specified for compilation
error TS6231: Could not resolve the path 'bun' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
  The file is in the program because:
    Root file specified for compilation
error TS6231: Could not resolve the path 'mode' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
  The file is in the program because:
    Root file specified for compilation
error TS6231: Could not resolve the path 'run' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
  The file is in the program because:
    Root file specified for compilation
error TS6231: Could not resolve the path 'test' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
  The file is in the program because:
    Root file specified for compilation
error TS6231: Could not resolve the path 'test:watch' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
  The file is in the program because:
    Root file specified for compilation
error TS6231: Could not resolve the path 'tests' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
  The file is in the program because:
    Root file specified for compilation
error TS6231: Could not resolve the path 'with' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
  The file is in the program because:
    Root file specified for compilation

## NOTES

- **Coverage**: 80% minimum
- **Types**: Strict mode enforced
- **Tools**: Follow tool pattern
