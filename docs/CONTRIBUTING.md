# Contributing to My-OpenCode-Plugin

Thank you for your interest in contributing to My-OpenCode-Plugin! This document provides guidelines for contributing to the project.

## How to Contribute

There are many ways to contribute to My-OpenCode-Plugin:

1. **Report Bugs** - Report issues you encounter
2. **Suggest Features** - Propose new features or improvements
3. **Write Documentation** - Improve or add documentation
4. **Fix Bugs** - Submit pull requests to fix issues
5. **Add Features** - Implement new features
6. **Review Code** - Review pull requests from others
7. **Improve Tests** - Add or improve test coverage

## Getting Started

### 1. Set Up Development Environment

Follow the [Development Setup Guide](development/setup.md) to set up your development environment.

### 2. Understand the Codebase

- Read the [Architecture Overview](architecture/overview.md)
- Review the [Code Structure](development/setup.md#code-structure)
- Understand the [Development Guidelines](development/guidelines.md)

### 3. Find an Issue to Work On

- Check the [TODO.md](../TODO.md) for planned work
- Look at [GitHub Issues](https://github.com/your-username/my-opencode-plugin/issues)
- Browse the [Codebase](https://github.com/your-username/my-opencode-plugin) for areas to improve

## Development Workflow

### 1. Fork the Repository

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/your-username/my-opencode-plugin.git
cd my-opencode-plugin

# Add upstream remote
git remote add upstream https://github.com/your-username/my-opencode-plugin.git
```

### 2. Create a Feature Branch

```bash
# Check out master branch
git checkout master

# Pull latest changes
git pull upstream master

# Create feature branch
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

- Follow the [Coding Guidelines](development/guidelines.md)
- Write tests for your changes
- Update documentation
- Keep commits focused and atomic

### 4. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add new feature

- Description of changes
- What problem it solves
- How it works"

# Push to your fork
git push origin feature/your-feature-name
```

### 5. Submit a Pull Request

1. Go to the [GitHub Repository](https://github.com/your-username/my-opencode-plugin)
2. Click "Pull Requests" then "New Pull Request"
3. Select your feature branch
4. Fill out the PR template
5. Submit the PR

## Code Review Process

All contributions go through code review:

1. **Automated Checks**: CI runs tests and type checking
2. **Code Review**: Maintainers review the code
3. **Testing**: Reviewer may request additional tests
4. **Documentation**: Reviewer may request documentation updates
5. **Approval**: Once approved, PR is merged

## Coding Guidelines

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

## Testing Requirements

- **Test Coverage**: Aim for 80%+ coverage (branches, functions, lines, statements)
- **Unit Tests**: Test individual components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test end-to-end workflows

## Documentation Requirements

- **API Documentation**: Update API reference for new public APIs
- **User Documentation**: Update user guides for new features
- **Examples**: Add usage examples for new functionality
- **Architecture**: Update architecture docs for structural changes

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes

**Examples:**

```
feat: add background task polling

- Implement polling mechanism
- Add configurable interval
- Handle task completion

BREAKING CHANGE: API changed from pollTasks() to startPolling()
```

```
fix: handle null session in BackgroundManager

- Add null check for session
- Throw meaningful error
- Update tests
```

## Branch Naming Conventions

- **Feature Branches**: `feature/your-feature-name`
- **Bug Fix Branches**: `fix/your-bug-description`
- **Documentation Branches**: `docs/your-documentation-topic`
- **Test Branches**: `test/your-test-description`

## Pull Request Template

When submitting a PR, please include:

1. **Description**: What the PR does and why
2. **Changes**: List of changes made
3. **Testing**: How the changes were tested
4. **Documentation**: Documentation updates included
5. **Breaking Changes**: Any breaking changes
6. **Related Issues**: Links to related issues

## Code of Conduct

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md) when interacting with the project community.

## Questions?

If you have questions or need help:

- Open a [GitHub Issue](https://github.com/your-username/my-opencode-plugin/issues)
- Join our [Discord Server](https://discord.gg/your-invite)
- Email us at [contact@example.com](mailto:contact@example.com)

## Thank You!

Thank you for contributing to My-OpenCode-Plugin! Your contributions help make the project better for everyone.
