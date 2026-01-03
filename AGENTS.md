# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-04
**Commit:** e83df8e
**Branch:** master

## OVERVIEW

Background agent orchestration system for OpenCode plugins. Provides async task management, agent discovery, and tool integration.

## STRUCTURE

```
my-opencode-plugin/
├── src/
│   ├── background-agent/  # Task lifecycle
│   ├── core/              # Types, utilities
│   ├── tools/             # Custom tools
├── commands/              # CLI commands
├── docs/                  # Documentation
└── scripts/               # Build scripts
```

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

```bash
npm run build          # Build TypeScript
npm test               # Run Jest tests
npm run test:watch     # Watch mode
```

## NOTES

- **Coverage**: 80% minimum
- **Types**: Strict mode enforced
- **Tools**: Follow tool pattern
