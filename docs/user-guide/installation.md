# Installation Guide

This guide will help you install and set up the My-OpenCode-Plugin.

## Prerequisites

Before installing the plugin, ensure you have:

1. **OpenCode** installed and running (version 1.0.150 or higher)
2. **Node.js** (version 16 or higher)
3. **npm** or **yarn** (for package management)

## Installation

### Method 1: Install from npm (Recommended)

```bash
# Install the plugin
npm install my-opencode-plugin

# Or with yarn
# yarn add my-opencode-plugin
```

### Method 2: Install from GitHub

```bash
# Install from GitHub repository
npm install github:your-username/my-opencode-plugin
```

### Method 3: Local Development Installation

```bash
# Clone the repository
git clone https://github.com/your-username/my-opencode-plugin.git
cd my-opencode-plugin

# Install dependencies
npm install

# Build the plugin
npm run build

# Link the plugin globally
npm link

# In your OpenCode project, link the plugin
npm link my-opencode-plugin
```

## Configuration

After installation, you need to configure the plugin in your OpenCode configuration file.

### Basic Configuration

Create or update your `opencode.json` file:

```json
{
  "plugins": {
    "my-opencode-plugin": {
      "agents": {
        "default": {
          "model": "gpt-4",
          "temperature": 0.7,
          "maxTokens": 4000
        }
      },
      "background": {
        "maxConcurrentTasks": 10,
        "taskTTL": 1800000,  // 30 minutes
        "pollInterval": 2000  // 2 seconds
      }
    }
  }
}
```

### Advanced Configuration

See the [Configuration Guide](configuration.md) for detailed configuration options.

## Verification

To verify the plugin is installed correctly:

1. **Check OpenCode Logs**: Look for plugin initialization messages
2. **List Available Tools**: Run `opencode tools` to see the plugin's tools
3. **Test a Simple Command**: Try calling one of the plugin's tools

### Example Verification

```bash
# List all available tools
opencode tools

# You should see the plugin's tools:
# - background_task
# - background_output
# - background_cancel
# - call_agent
```

## Troubleshooting

If you encounter issues during installation:

1. **Plugin not loading**: Check OpenCode logs for error messages
2. **Tools not available**: Verify the plugin is properly linked/registered
3. **Configuration errors**: Check the configuration schema and fix any validation errors

See the [FAQ](faq.md) for common issues and solutions.

## Next Steps

After successful installation:

1. [Configure the plugin](configuration.md) for your specific needs
2. [Learn about the tools](tools.md) available
3. [Try some examples](examples.md) to get started

## Need Help?

- Check the [FAQ](faq.md) for common questions
- Review the [Troubleshooting Guide](faq.md#troubleshooting)
- Open an issue on GitHub for support
