# TOOLS MODULE KNOWLEDGE BASE

## OVERVIEW
Tool implementations for agent discovery, background tasks, and agent calling.

## STRUCTURE

```
src/tools/
├── agent-discovery/    # Agent discovery utilities
├── background-task/    # Background task management
├── call-agent/         # Agent calling utilities
└── subagent/          # Subagent integration
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new tool | Create new directory in `src/tools/` | Follow existing pattern |
| Tool tests | `__tests__/tools.test.ts` | Jest test files |
| Tool types | `src/tools/index.ts` | Export tools from here |

## CONVENTIONS

- Each tool has `create*Tool` function
- Tools return object with `name`, `description`, `parameters`, `execute`
- Use BackgroundManager for agent operations
