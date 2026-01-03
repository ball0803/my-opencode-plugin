# PROJECT KNOWLEDGE BASE - my-opencode-plugin

**Generated:** 2026-01-03
**Commit:** N/A
**Branch:** N/A

## OVERVIEW

Background agent orchestration system for OpenCode plugins. Provides async task management, agent discovery, and tool integration.

## STRUCTURE

```
/
├── src/                # Core implementation
│   ├── background-agent/  # Task lifecycle management
│   ├── config/            # Configuration handling
│   ├── core/              # Core types and utilities
│   ├── plugin-handlers/   # Plugin handler implementations
│   └── tools/             # Tool implementations
├── docs/               # Documentation
├── scripts/            # Utility scripts
└── AGENTS.md           # Knowledge base
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

## ANTI-PATTERNS

- Direct API calls without validation
- No error handling
- Memory leaks in background tasks
- High complexity in tools

## COMMANDS

```bash
bun run build      # Build with TypeScript
bun run test       # Run Jest tests
bun run test:watch # Watch mode
```

## NOTES

- **Coverage**: 80% minimum
- **Types**: Strict mode enforced
- **Tools**: Follow tool pattern

## Build, Lint, and Test Commands

### Build Commands

```bash
bun run build      # Build the project using TypeScript compiler
bun run dev        # Build in watch mode (auto-rebuild on changes)
```

### Test Commands

```bash
bun run test       # Run all tests using Jest
bun run test:watch # Run tests in watch mode
bun run test:coverage # Run tests with coverage report
bun run test:single # Run a specific test (use with -t flag)
```

### Running a Single Test

To run a specific test file or test case:

```bash
# Run a specific test file
bun run jest src/tools/agent-discovery/__tests__/tools.test.ts

# Run a specific test by name
bun run jest -t "list_agents tool"

# Run tests matching a pattern
bun run jest -t "Agent Discovery"
```

### Test Commands

```bash
bun run test       # Run all tests using Jest
bun run test:watch # Run tests in watch mode
bun run test:coverage # Run tests with coverage report
bun run test:single # Run a specific test (use with -t flag)
```

### Running a Single Test

To run a specific test file or test case:

```bash
# Run a specific test file
bun run jest src/tools/agent-discovery/__tests__/tools.test.ts

# Run a specific test by name
bun run jest -t "list_agents tool"

# Run tests matching a pattern
bun run jest -t "Agent Discovery"
```

### Test Configuration

The project uses Jest with the following configuration:
- Test files: `**/*.test.ts`
- Test timeout: 10 seconds
- Coverage threshold: 80% for branches, functions, lines, and statements
- Coverage reporters: text, lcov, and html

## Code Style Guidelines

### TypeScript Configuration

The project uses TypeScript with strict mode enabled. Key compiler options:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "Node16",
    "moduleResolution": "node16",
    "declaration": true,
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  }
}
```

### Imports

- Use absolute imports from the `src` directory
- Group imports in this order:
  1. External libraries
  2. Internal modules (relative imports)
  3. Type imports

```typescript
import { BackgroundManager } from '../../background-agent/manager';
import type { BackgroundTask } from '../../background-agent/types';
```

### Formatting

- Use 2 spaces for indentation
- Place opening braces on the same line
- Use semicolons at the end of statements
- Keep lines under 80 characters when possible
- Add a newline at the end of files

### Types and Interfaces

- Use TypeScript interfaces for public APIs
- Use types for internal implementations
- Prefer interface inheritance over type intersection for public APIs
- Use utility types (Partial, Pick, Omit) for derived types

```typescript
export interface AgentCallOptions {
  background?: boolean;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
```

### Naming Conventions

- **Files**: Use kebab-case for files (e.g., `agent-discovery.ts`)
- **Classes**: Use PascalCase (e.g., `BackgroundManager`)
- **Interfaces**: Use PascalCase with "I" prefix (e.g., `IBackgroundTask`)
- **Functions**: Use camelCase (e.g., `createListAgentsTool`)
- **Variables**: Use camelCase (e.g., `agentName`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `DEFAULT_AGENT_DESCRIPTIONS`)
- **Type Parameters**: Use single letters (e.g., `T`, `K`, `V`)

### Error Handling

- Use try-catch blocks for asynchronous operations
- Throw specific error types when appropriate
- Include context in error messages
- Handle errors gracefully in tool implementations

```typescript
async execute(options: { agent_name: string }): Promise<string> {
  try {
    const agentName = options.agent_name.trim();
    
    if (!manager.isAgentAvailable(agentName)) {
      const availableAgents = manager.getAvailableAgents().join(', ');
      return `Agent \`${agentName}\` not found. Available agents: ${availableAgents}`;
    }
    
    // ... rest of implementation
  } catch (error) {
    return `Error getting agent info: ${error.message}`;
  }
}
```

### Tool Implementation

- Each tool should have a clear name and description
- Define parameters with proper types
- Include required parameters when necessary
- Return meaningful output or error messages

```typescript
export function createListAgentsTool(manager: BackgroundManager) {
  return {
    name: 'list_agents',
    description: 'List all available agents and their descriptions',
    parameters: {
      type: 'object',
      properties: {
        include_descriptions: {
          type: 'boolean',
          description: 'Include agent descriptions in the output',
          default: true,
        },
      },
    },
    async execute(options: { include_descriptions?: boolean }): Promise<string> {
      // Implementation
    },
  };
}
```

### Documentation

- Add JSDoc comments for public APIs
- Document parameters, return types, and examples
- Keep documentation in sync with code changes
- Use consistent formatting for documentation

```typescript
/**
 * Creates a tool for listing available agents
 * 
 * @param manager - The background manager instance
 * @returns A tool object with execute method
 */
export function createListAgentsTool(manager: BackgroundManager) {
  // Implementation
}
```

## Development Best Practices

### Code Organization

- Follow the existing directory structure
- Place test files in `__tests__` directories
- Group related functionality together
- Use index files for module exports

### Testing

- Write unit tests for all public functions
- Test both success and error cases
- Use mocking for external dependencies
- Aim for 80%+ coverage

```typescript
describe('list_agents tool', () => {
  it('should list all available agents', async () => {
    const tool = createListAgentsTool(manager);
    const result = await tool.execute({});

    expect(result).toContain('Available Agents');
    expect(result).toContain('agent1');
  });

  it('should handle no agents available', async () => {
    mockGetAvailableAgents.mockReturnValue([]);
    const tool = createListAgentsTool(manager);
    const result = await tool.execute({});

    expect(result).toContain('No agents available');
  });
});
```

### Type Safety

- Use TypeScript's strict mode features
- Add proper type annotations
- Use type guards for union types
- Avoid any type when possible

```typescript
if (typeof value === 'string') {
  // value is now typed as string
  processString(value);
}
```

### Error Messages

- Be specific about what went wrong
- Include relevant context
- Suggest solutions when possible
- Use consistent error message format

```typescript
if (!manager.isAgentAvailable(agentName)) {
  const availableAgents = manager.getAvailableAgents().join(', ');
  throw new Error(`Agent "${agentName}" not found. Available agents: ${availableAgents}`);
}
```

### Configuration

- Use Zod for schema validation
- Define default values where appropriate
- Document configuration options
- Validate configuration on load

## Project Structure

```
src/
├── background-agent/  # Background task management
├── config/            # Configuration handling
├── core/              # Core types and utilities
├── plugin-handlers/   # Plugin handler implementations
└── tools/             # Tool implementations
    ├── agent-discovery/
    ├── background-task/
    ├── call-agent/
    └── subagent/
```

## Common Patterns

### Extending Classes

Use declaration merging to extend existing classes:

```typescript
// Add methods to BackgroundManager for agent discovery
declare module '../../background-agent/manager' {
  interface BackgroundManager {
    getAvailableAgents(): string[];
    isAgentAvailable(agentName: string): boolean;
    validateAgent(agentName: string): void;
  }
}

// Extend BackgroundManager with agent discovery methods
BackgroundManager.prototype.getAvailableAgents = function() {
  // Implementation
};
```

### Default Values

Use constants for default values:

```typescript
const DEFAULT_AGENT_DESCRIPTIONS: Record<string, string> = {
  'explore': 'Specialized agent for exploring codebases...',
  'default': 'General-purpose agent for handling various tasks.',
};
```

### Tool Parameters

Define parameters with proper types and descriptions:

```typescript
parameters: {
  type: 'object',
  properties: {
    agent_name: {
      type: 'string',
      description: 'Name of the agent to get information about',
    },
  },
  required: ['agent_name'],
}
```

## Resources

- [Documentation Style Guide](docs/STYLE-GUIDE.md)
- [Contribution Guidelines](docs/CONTRIBUTING.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
