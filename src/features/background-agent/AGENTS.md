# BACKGROUND AGENT KNOWLEDGE BASE

## OVERVIEW

Background task management system for my-opencode-plugin.

## STRUCTURE

```
background-agent/
├── manager.ts          # Background manager implementation
├── types.ts            # Type definitions
└── index.ts            # Exports
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add task type | `types.ts` | Define new task types |
| Extend manager | `manager.ts` | Add new methods |

## CONVENTIONS

- Async task execution
- Error handling
- Task lifecycle management

## ANTI-PATTERNS

- Synchronous tasks
- No error handling
- Memory leaks
