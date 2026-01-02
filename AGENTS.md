# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-03
**Repository:** my-opencode-plugin

## OVERVIEW

A modular OpenCode plugin for background task management and agent calling. This plugin provides tools for creating, managing, and monitoring background tasks, as well as calling specialized agents with optional background execution.

## STRUCTURE

```
my-opencode-plugin/
├── src/
│   ├── background-agent/   # Background task manager
│   │   ├── types.ts        # Type definitions
│   │   ├── manager.ts      # BackgroundManager class
│   │   └── index.ts        # Exports
│   ├── tools/             # Tool implementations
│   │   ├── background-task/ # Background task tools
│   │   │   ├── tools.ts
│   │   │   └── index.ts
│   │   ├── call-agent/     # Agent calling tools
│   │   │   ├── tools.ts
│   │   │   └── index.ts
│   │   └── index.ts        # Tool exports
│   ├── config/            # Configuration system
│   │   ├── schema.ts       # Zod validation schema
│   │   └── index.ts        # ConfigLoader class
│   ├── plugin-handlers/   # Plugin handlers
│   │   ├── config-handler.ts
│   │   └── index.ts
│   └── index.ts           # Main plugin entry
├── package.json
├── tsconfig.json
└── AGENTS.md
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add background tool | `src/tools/background-task/` | Create tool function, add to index.ts |
| Add agent tool | `src/tools/call-agent/` | Create tool function, add to index.ts |
| Modify task types | `src/background-agent/types.ts` | Update type definitions |
| Update config schema | `src/config/schema.ts` | Add new config options |
| Modify manager | `src/background-agent/manager.ts` | Update task lifecycle logic |

## CONVENTIONS

### Build & Development
- **TypeScript**: v5.3.3+ with strict mode
- **Package Manager**: npm (not Bun)
- **Build**: `npm run build` (compiles to dist/)
- **Watch**: `npm run dev` (watches for changes)
- **Type Check**: `npx tsc --noEmit`

### Code Style
- **Imports**: Absolute paths from src/
- **Formatting**: 2-space indentation, no semicolons
- **Naming**: camelCase for variables/functions, PascalCase for classes/types
- **Types**: Strong typing with TypeScript, avoid `any`
- **Error Handling**: Try-catch blocks with meaningful error messages

### Testing
- **Test Files**: No dedicated test files yet (add .test.ts files)
- **Test Command**: `npm test` (placeholder, implement tests)
- **BDD Style**: Use `#given`, `#when`, `#then` comments

### Configuration
- **JSONC Support**: Config files support comments and trailing commas
- **Schema Validation**: Zod validation in `src/config/schema.ts`
- **Default Config**: Defined in `src/config/schema.ts`

## ANTI-PATTERNS

| Category | Forbidden |
|----------|-----------|
| Type Safety | `as any`, `@ts-ignore`, `@ts-expect-error` |
| Error Handling | Bare try-catch without error handling |
| Code Organization | Large files (>500 lines) |
| Naming | Non-descriptive names, abbreviations without explanation |
| Imports | Relative paths (use absolute from src/) |

## COMMANDS

```bash
npm run build          # Build TypeScript to dist/
npm run dev            # Watch mode with auto-rebuild
npx tsc --noEmit      # Type check without emitting
npm test              # Run tests (placeholder)
```

## CODE STYLE GUIDELINES

### Imports
```typescript
// Good: Absolute imports from src
import { BackgroundManager } from '../background-agent/manager';
import type { BackgroundTask } from '../background-agent/types';

// Avoid: Relative imports
import { BackgroundManager } from './background-agent/manager';
```

### Formatting
```typescript
// Good: 2-space indentation, no semicolons
function createTask(options: CreateBackgroundTaskOptions): BackgroundTask {
  const task: BackgroundTask = {
    id: options.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'running',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    options: options.options || {},
    sessionId: options.sessionId || this.session.id,
  };

  this.tasks.set(task.id, task);
  return task;
}

// Avoid: Tabs, semicolons, inconsistent spacing
```

### Types
```typescript
// Good: Strong typing with interfaces
interface BackgroundTask {
  id: string;
  status: 'running' | 'completed' | 'error' | 'cancelled';
  createdAt: number;
  updatedAt: number;
  options?: Record<string, any>;
  sessionId?: string;
  result?: any;
  error?: string;
  output?: string;
}

// Avoid: any type
interface BackgroundTask {
  id: string;
  status: string;
  createdAt: number;
  options: any;
}
```

### Error Handling
```typescript
// Good: Try-catch with meaningful error messages
async completeTask(taskId: string, result?: any): Promise<BackgroundTask> {
  const task = this.tasks.get(taskId);
  if (!task) {
    throw new Error(`Task ${taskId} not found`);
  }

  try {
    task.status = 'completed';
    task.result = result;
    task.updatedAt = Date.now();

    this.tasks.set(taskId, task);
    await this.notifyTaskCompletion(task);
    return task;
  } catch (error) {
    console.error(`Error completing task ${taskId}:`, error);
    throw error;
  }
}

// Avoid: Bare try-catch without error handling
async completeTask(taskId: string, result?: any): Promise<BackgroundTask> {
  try {
    const task = this.tasks.get(taskId);
    task.status = 'completed';
    task.result = result;
    this.tasks.set(taskId, task);
  } catch (error) {
    // Silent failure
  }
}
```

### Naming Conventions
```typescript
// Good: Descriptive names
class BackgroundManager {
  private tasks: Map<string, BackgroundTask>;
  private session: AgentSession | null;
  
  async createTask(options: CreateBackgroundTaskOptions): Promise<BackgroundTask>;
  async completeTask(taskId: string, result?: any): Promise<BackgroundTask>;
  async failTask(taskId: string, error: string | Error): Promise<BackgroundTask>;
  async cancelTask(taskId: string, options?: CancelOptions): Promise<BackgroundTask>;
}

// Avoid: Non-descriptive names
class TaskManager {
  private tasks: Map<string, any>;
  
  async create(options: any): Promise<any>;
  async done(id: string, result?: any): Promise<any>;
  async fail(id: string, err: any): Promise<any>;
}
```

## DEPLOYMENT

1. Build the plugin: `npm run build`
2. Test locally with OpenCode
3. Publish to npm: `npm publish`
4. Update OpenCode config to use the plugin

## COMPLEXITY HOTSPOTS

| File | Lines | Description |
|------|-------|-------------|
| `src/background-agent/manager.ts` | ~150 | BackgroundManager class with task lifecycle |
| `src/index.ts` | ~50 | Main plugin entry point |
| `src/config/schema.ts` | ~30 | Zod validation schema |

## NOTES

- **OpenCode**: Requires OpenCode >= 1.0.150
- **Config**: Plugin config in `opencode.json` under `my-opencode-plugin` key
- **JSONC**: Config files support comments and trailing commas
- **Type Safety**: Strict TypeScript with no `any` allowed
- **Error Handling**: All async operations should have try-catch blocks

## AGENT INSTRUCTIONS

When working on this repository:

1. **Always type check** before committing: `npx tsc --noEmit`
2. **Follow the conventions** above for imports, formatting, types, and naming
3. **Avoid anti-patterns** listed in the ANTI-PATTERNS section
4. **Use absolute imports** from src/ for better code organization
5. **Add tests** for new functionality in .test.ts files
6. **Update AGENTS.md** when adding new features or changing conventions
7. **Keep files small** (<500 lines) for better maintainability
8. **Document all public APIs** with JSDoc comments
