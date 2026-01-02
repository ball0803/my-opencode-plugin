# Development Setup

This guide will help you set up your development environment for contributing to My-OpenCode-Plugin.

## Prerequisites

Before setting up the development environment, ensure you have:

1. **Node.js** (version 16 or higher)
2. **npm** or **yarn** (version 7 or higher)
3. **Git** (for version control)
4. **TypeScript** (version 5.3.3 or higher)

## Installation

### Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/my-opencode-plugin.git
cd my-opencode-plugin

# Or use SSH
git clone git@github.com:your-username/my-opencode-plugin.git
cd my-opencode-plugin
```

### Install Dependencies

```bash
# Install dependencies
npm install

# Or with yarn
# yarn install
```

### Set Up Development Environment

```bash
# Install TypeScript globally (if not already installed)
npm install -g typescript

# Install Jest globally (if not already installed)
npm install -g jest

# Install ts-jest globally (if not already installed)
npm install -g ts-jest
```

## Development Workflow

### Build the Project

```bash
# Build the project once
npm run build

# Build in watch mode (auto-rebuild on changes)
npm run dev
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run a specific test file
npm test -- src/path/to/file.test.ts

# Run a specific test
npm test -- -t "test name"
```

### Type Checking

```bash
# Check TypeScript types without emitting files
npx tsc --noEmit

# Check types in watch mode
npx tsc --noEmit --watch
```

## Code Structure

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

## Development Tools

### TypeScript

- **Version**: 5.3.3+
- **Configuration**: `tsconfig.json`
- **Strict Mode**: Enabled
- **ES Modules**: ESNext
- **Module Resolution**: Node16

### Jest

- **Version**: 29.7.0+
- **Test Match**: `**/*.test.ts`
- **Coverage**: Enabled (80% threshold)
- **Test Environment**: Node

### Zod

- **Version**: 3.22.4+
- **Purpose**: Configuration validation
- **Location**: `src/config/schema.ts`

## Development Guidelines

### Code Style

- **Imports**: Absolute paths from `src/`
- **Formatting**: 2 spaces, no semicolons
- **Naming**: camelCase for variables/functions, PascalCase for classes/types
- **Types**: Strong typing, avoid `any`
- **Error Handling**: Try-catch with meaningful error messages

### Testing

- **File Naming**: `*.test.ts` suffix
- **BDD Style**: Use `#given`, `#when`, `#then` comments
- **Mocks**: Use Jest's `jest.fn()` for mocking
- **Async**: Always use `async/await` with proper error handling
- **Cleanup**: Use `afterEach` for cleanup

### Documentation

- **AGENTS.md**: Development guidelines for agents
- **JSDoc**: Add comments for public APIs
- **Examples**: Include usage examples in documentation
- **Keep Updated**: Update documentation with code changes

## Common Development Tasks

### Add a New Tool

1. Create a new tool file in `src/tools/`
2. Define the tool function
3. Export the tool
4. Add to the tools index
5. Write tests for the tool
6. Update documentation

### Extend BackgroundManager

1. Add new methods to `src/background-agent/manager.ts`
2. Update type definitions in `src/background-agent/types.ts`
3. Write tests for new functionality
4. Update documentation

### Update Configuration

1. Update the schema in `src/config/schema.ts`
2. Update default configuration
3. Update documentation
4. Write tests for new configuration options

## Debugging

### Debugging Tests

```bash
# Run tests with verbose output
npm test -- --verbose

# Debug a specific test
npm test -- -t "test name" --verbose
```

### Debugging TypeScript

```bash
# Show detailed TypeScript errors
npx tsc --noEmit --pretty false

# Show TypeScript errors in watch mode
npx tsc --noEmit --watch --pretty false
```

### Debugging Runtime

```bash
# Add console.log statements
console.log('Debug message', variable);

# Use debugger statements
debugger;

# Inspect variables
console.dir(variable, { depth: null });
```

## Best Practices

1. **Write Tests First**: Follow TDD approach
2. **Keep Types Strong**: Avoid `any` and `as any`
3. **Document Public APIs**: Add JSDoc comments
4. **Update Documentation**: With every code change
5. **Review Code**: Before submitting PRs
6. **Check Coverage**: Ensure tests cover new code
7. **Follow Conventions**: Use existing patterns

## See Also

- [Coding Guidelines](guidelines.md) - Coding standards
- [Testing Guide](testing.md) - Testing approach
- [Adding Tools](adding-tools.md) - How to add new tools
- [Extending Plugin](extending.md) - Extend plugin functionality
- [API Reference](../api-reference/) - API documentation
