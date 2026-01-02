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
├── jest.config.js
├── AGENTS.md
└── TODO.md
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add background tool | `src/tools/background-task/` | Create tool function, add to index.ts |
| Add agent tool | `src/tools/call-agent/` | Create tool function, add to index.ts |
| Modify task types | `src/background-agent/types.ts` | Update type definitions |
| Update config schema | `src/config/schema.ts` | Add new config options |
| Modify manager | `src/background-agent/manager.ts` | Update task lifecycle logic |
| Add tests | `src/**/*.test.ts` | Follow BDD pattern with #given/#when/#then |

## BUILD & DEVELOPMENT COMMANDS

### Core Commands
- **Type Check**: `npx tsc --noEmit` - Verify TypeScript types without emitting files
- **Build**: `tsc` - Compile TypeScript to dist/ directory
- **Test All**: `npm test` - Run all Jest tests with coverage
- **Test Single**: `npm test -- src/path/to/file.test.ts` - Run a specific test file
- **Test Watch**: `npm test -- --watch` - Watch mode for tests
- **Coverage**: `npm test -- --coverage` - Generate coverage report

### Development Workflow
- **Watch Mode**: `tsc --watch` - Watch for file changes and rebuild
- **Clean Build**: `rm -rf dist/ && tsc` - Clean and rebuild
- **Lint**: (No linter configured, use TypeScript checks)

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
- **Indentation**: 2 spaces (no tabs)
- **Semicolons**: Omit semicolons
- **Quotes**: Single quotes for strings, double quotes for JSX/JSON
- **Line Length**: Max 80 characters per line
- **Trailing Commas**: Use in multi-line objects/arrays

### Types
```typescript
// Good: Strong typing with interfaces
interface BackgroundTask {
  id: string;
  status: 'running' | 'completed' | 'error' | 'cancelled';
  createdAt: number;
  updatedAt: number;
  options?: Record<string, unknown>;
  sessionId?: string;
  result?: unknown;
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
async completeTask(taskId: string, result?: unknown): Promise<BackgroundTask> {
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
async completeTask(taskId: string, result?: unknown): Promise<BackgroundTask> {
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
  async completeTask(taskId: string, result?: unknown): Promise<BackgroundTask>;
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

### Testing
- **File Naming**: `*.test.ts` suffix
- **BDD Style**: Use `#given`, `#when`, `#then` comments
- **Mocks**: Use Jest's `jest.fn()` for mocking
- **Async**: Always use `async/await` with proper error handling
- **Cleanup**: Use `afterEach` for cleanup

```typescript
describe('BackgroundManager', () => {
  let manager: BackgroundManager;
  let mockSession: AgentSession;

  beforeEach(() => {
    mockSession = {
      id: 'test-session',
      getStatus: jest.fn().mockResolvedValue('running'),
      sendMessage: jest.fn().mockResolvedValue(undefined),
    };
    manager = new BackgroundManager({ pollInterval: 100, taskTTL: 1000 });
    manager.initialize(mockSession);
  });

  afterEach(async () => {
    await manager.cleanup();
  });

  describe('createTask', () => {
    it('should create a task with auto-generated ID', async () => {
      // given
      const options = { options: { agent: 'test-agent', prompt: 'test' } };

      // when
      const task = await manager.createTask(options);

      // then
      expect(task.id).toBeDefined();
      expect(task.status).toBe('running');
    });
  });
});
```

### Configuration
- **Schema**: Use Zod for validation in `src/config/schema.ts`
- **Defaults**: Define in schema with `.default()`
- **Validation**: Validate on load and merge
- **JSONC**: Support comments and trailing commas

```typescript
// Good: Zod schema with validation
const PluginConfigSchema = z.object({
  background: z.object({
    maxConcurrentTasks: z.number().min(1).max(100).default(10),
    taskTTL: z.number().min(60000).max(86400000).default(30 * 60 * 1000),
    pollInterval: z.number().min(1000).max(30000).default(2000),
  }).optional(),
});
```

## ANTI-PATTERNS

| Category | Forbidden | Reason |
|----------|-----------|--------|
| Type Safety | `as any`, `@ts-ignore`, `@ts-expect-error` | Bypasses type safety |
| Error Handling | Bare try-catch without error handling | Silent failures |
| Code Organization | Large files (>500 lines) | Hard to maintain |
| Naming | Non-descriptive names, abbreviations | Reduces readability |
| Imports | Relative paths (use absolute from src/) | Inconsistent imports |
| Testing | No tests for new features | Poor test coverage |
| Comments | Unnecessary comments | Code should be self-documenting |

## COMPLEXITY HOTSPOTS

| File | Lines | Description |
|------|-------|-------------|
| `src/background-agent/manager.ts` | ~225 | BackgroundManager class with task lifecycle |
| `src/index.ts` | ~61 | Main plugin entry point |
| `src/config/schema.ts` | ~34 | Zod validation schema |
| `src/tools/background-task/tools.ts` | ~106 | Background task tools |

## DEPLOYMENT

1. **Build**: `tsc` - Compile to dist/
2. **Test**: `npm test` - Ensure all tests pass
3. **Type Check**: `npx tsc --noEmit` - Verify types
4. **Publish**: `npm publish` - Publish to npm
5. **Update**: Update OpenCode config to use the plugin

## NOTES

- **OpenCode**: Requires OpenCode >= 1.0.150
- **Config**: Plugin config in `opencode.json` under `my-opencode-plugin` key
- **JSONC**: Config files support comments and trailing commas
- **Type Safety**: Strict TypeScript with no `any` allowed
- **Error Handling**: All async operations should have try-catch blocks
- **Testing**: Aim for 80%+ coverage (branches, functions, lines, statements)

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
9. **Run tests** before submitting changes
10. **Check coverage** to ensure new code is tested

## TESTING BEST PRACTICES

### Running Tests
- **Single Test**: `npm test -- src/path/to/file.test.ts`
- **Watch Mode**: `npm test -- --watch`
- **Coverage**: `npm test -- --coverage`
- **Verbose**: `npm test -- --verbose`

### Test Structure
- **Describe Blocks**: Group related tests
- **It Blocks**: Single assertion per test
- **Arrange-Act-Assert**: Use #given/#when/#then pattern
- **Mocks**: Use Jest mocks for dependencies
- **Async**: Always handle async operations properly

### Test Examples

**Basic Test**:
```typescript
it('should create a task with auto-generated ID', async () => {
  // given
  const options = { options: { agent: 'test-agent', prompt: 'test' } };

  // when
  const task = await manager.createTask(options);

  // then
  expect(task.id).toBeDefined();
  expect(task.status).toBe('running');
});
```

**Error Handling Test**:
```typescript
it('should throw error for non-existent task', async () => {
  // given
  const nonExistentId = 'non-existent-task-id';

  // when/then
  await expect(manager.completeTask(nonExistentId))
    .rejects
    .toThrow(`Task ${nonExistentId} not found`);
});
```

**Mocking Test**:
```typescript
it('should detect completed session', async () => {
  // given
  const task = await manager.createTask({ options: { agent: 'test' } });
  mockSession.getStatus.mockResolvedValueOnce('completed');

  // when
  const pollTasks = (manager as any).pollTasks.bind(manager);
  await pollTasks();

  // then
  const updatedTask = await manager.getTask(task.id);
  expect(updatedTask?.status).toBe('completed');
});
```
