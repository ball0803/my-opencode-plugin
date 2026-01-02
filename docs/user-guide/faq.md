# FAQ and Troubleshooting

This document provides answers to frequently asked questions and troubleshooting tips.

## General Questions

### What is My-OpenCode-Plugin?

My-OpenCode-Plugin is a modular OpenCode plugin for background task management and agent calling. It allows you to:

- Create and manage background tasks
- Call specialized agents with optional background execution
- Monitor task progress and results
- Configure task behavior and agent settings

### What are the system requirements?

- **OpenCode**: version 1.0.150 or higher
- **Node.js**: version 16 or higher
- **npm** or **yarn**: version 7 or higher

### How do I install the plugin?

See the [Installation Guide](installation.md) for detailed installation instructions.

### How do I configure the plugin?

See the [Configuration Guide](configuration.md) for configuration options and examples.

### How do I use the tools?

See the [Tools Guide](tools.md) for tool usage and examples.

## Installation Issues

### Plugin not loading

**Symptoms**: Plugin doesn't appear in OpenCode

**Solutions**:
1. Check OpenCode logs for error messages
2. Verify the plugin is properly installed (`npm list my-opencode-plugin`)
3. Check that OpenCode version is compatible (1.0.150+)
4. Restart OpenCode after installation

### Tools not available

**Symptoms**: Plugin loads but tools are not accessible

**Solutions**:
1. Verify plugin initialization (`plugin.initialize(session)`)
2. Check that tools are properly exported
3. Verify no errors in OpenCode logs
4. Check plugin configuration for permission issues

### Configuration errors

**Symptoms**: Plugin fails to start with configuration errors

**Solutions**:
1. Check configuration schema in [Configuration Guide](configuration.md)
2. Validate your configuration file
3. Use default configuration as starting point
4. Check for JSON syntax errors

## Usage Issues

### Tasks not completing

**Symptoms**: Tasks remain in "running" state indefinitely

**Solutions**:
1. Check agent session status
2. Verify agent is responding
3. Increase task TTL if needed
4. Check for network connectivity issues
5. Review agent configuration

### Tasks timing out

**Symptoms**: Tasks fail with "timed out" error

**Solutions**:
1. Increase task TTL in configuration
2. Check if task is taking longer than expected
3. Optimize agent prompts
4. Break large tasks into smaller ones

### Agent calls failing

**Symptoms**: Agent calls return error status

**Solutions**:
1. Check agent configuration
2. Verify agent model is available
3. Review prompt for errors
4. Check API credentials if using external agents
5. Review error message for specifics

### Output not available

**Symptoms**: `background_output` returns empty or incomplete output

**Solutions**:
1. Wait for task to complete before getting output
2. Check task status first
3. Use `wait: true` option to wait for completion
4. Set appropriate timeout
5. Verify agent is producing output

## Configuration Issues

### Invalid temperature value

**Error**: "Number must be less than or equal to 2"

**Solution**: Temperature must be between 0 and 2 (inclusive).

### Invalid taskTTL value

**Error**: "Number must be greater than or equal to 60000"

**Solution**: taskTTL must be between 60000 (1 minute) and 86400000 (24 hours).

### Invalid pollInterval value

**Error**: "Number must be greater than or equal to 1000"

**Solution**: pollInterval must be between 1000 (1 second) and 30000 (30 seconds).

### Invalid maxConcurrentTasks value

**Error**: "Number must be less than or equal to 100"

**Solution**: maxConcurrentTasks must be between 1 and 100.

## Development Issues

### TypeScript compilation errors

**Symptoms**: `npx tsc --noEmit` shows errors

**Solutions**:
1. Check TypeScript version (5.3.3+)
2. Review type definitions in `src/background-agent/types.ts`
3. Ensure all interfaces are properly typed
4. Avoid `any` type where possible
5. Use `unknown` instead of `any` for dynamic types

### Test failures

**Symptoms**: Tests fail or coverage is low

**Solutions**:
1. Run tests with verbose output (`npm test -- --verbose`)
2. Check test coverage (`npm test -- --coverage`)
3. Review failing tests for specific issues
4. Add missing test cases
5. Ensure all code paths are tested

### Build failures

**Symptoms**: `npm run build` fails

**Solutions**:
1. Check TypeScript compilation first
2. Verify all dependencies are installed
3. Check for syntax errors in source files
4. Review build output for specific errors
5. Clean and rebuild (`rm -rf dist/ && npm run build`)

## Performance Issues

### Slow task processing

**Symptoms**: Tasks take longer than expected

**Solutions**:
1. Check agent response time
2. Optimize prompts for efficiency
3. Increase maxConcurrentTasks if needed
4. Review agent configuration
5. Check system resources

### High memory usage

**Symptoms**: Memory usage increases over time

**Solutions**:
1. Check for memory leaks in agent code
2. Reduce maxConcurrentTasks
3. Increase task TTL for cleanup
4. Monitor task completion
5. Restart plugin periodically if needed

### CPU usage high

**Symptoms**: CPU usage remains high

**Solutions**:
1. Reduce maxConcurrentTasks
2. Increase pollInterval
3. Check for long-running tasks
4. Review agent configuration
5. Monitor task status

## Common Error Messages

### "Task not found"

**Cause**: Trying to access a task that doesn't exist

**Solution**: Verify task ID and ensure task was created successfully

### "BackgroundManager not initialized"

**Cause**: Trying to use tools before initializing the plugin

**Solution**: Call `plugin.initialize(session)` before using tools

### "Session error"

**Cause**: Agent session encountered an error

**Solution**: Check agent session status and logs

### "Task timed out"

**Cause**: Task exceeded its TTL without completing

**Solution**: Increase task TTL or optimize task duration

### "Agent not found"

**Cause**: Trying to use an agent that's not configured

**Solution**: Add agent configuration or use existing agent

## Best Practices

### Task Management

1. **Use descriptive task IDs** for easier debugging
2. **Set appropriate timeouts** based on expected duration
3. **Handle errors gracefully** and provide fallback behavior
4. **Clean up cancelled tasks** to free resources
5. **Monitor task status** to provide feedback to users

### Configuration

1. **Start with defaults** and customize as needed
2. **Validate configuration** before use
3. **Use JSONC** for comments in configuration
4. **Document configuration** changes
5. **Test configuration** changes thoroughly

### Performance

1. **Limit concurrent tasks** based on available resources
2. **Set reasonable TTL** for automatic cleanup
3. **Use appropriate polling intervals** for status updates
4. **Batch similar tasks** when possible
5. **Reuse agent sessions** for related tasks

## Need More Help?

If you can't find the answer to your question:

1. **Check the documentation** for related topics
2. **Search GitHub Issues** for similar problems
3. **Open a new Issue** with details about your problem
4. **Join the community** for discussion and support
5. **Review the code** for specific implementation details

## See Also

- [Installation Guide](installation.md) - Installation instructions
- [Configuration Guide](configuration.md) - Configuration options
- [Tools Guide](tools.md) - Tool usage
- [Examples](examples.md) - Usage examples
- [API Reference](../api-reference/) - API documentation
