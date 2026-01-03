#!/bin/bash

# Install OpenCode Plugin Helper Script
# This script helps install my-opencode-plugin to OpenCode

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}Error: Do not run this script as root.${NC}"
    exit 1
fi

# Check if opencode is installed
if ! command -v opencode &> /dev/null; then
    echo -e "${RED}Error: OpenCode is not installed.${NC}"
    echo -e "${YELLOW}Please install OpenCode first: https://opencode.ai${NC}"
    exit 1
fi

# Check if plugin directory exists
PLUGIN_DIR="$HOME/.config/opencode/plugin"
if [ ! -d "$PLUGIN_DIR" ]; then
    echo -e "${BLUE}Creating OpenCode plugin directory...${NC}"
    mkdir -p "$PLUGIN_DIR"
fi

# Check if plugin already installed
if [ -d "$PLUGIN_DIR/my-opencode-plugin" ]; then
    echo -e "${YELLOW}Plugin already installed at $PLUGIN_DIR/my-opencode-plugin${NC}"
    read -p "Do you want to reinstall? [y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}Plugin is already installed.${NC}"
        exit 0
    fi
    echo -e "${BLUE}Removing existing installation...${NC}"
    rm -rf "$PLUGIN_DIR/my-opencode-plugin"
fi

# Check if we're in the plugin directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: This script must be run from the plugin directory.${NC}"
    echo -e "${YELLOW}Please navigate to the my-opencode-plugin directory first.${NC}"
    exit 1
fi

# Build the plugin
echo -e "${BLUE}Building plugin...${NC}"
if command -v bun &> /dev/null; then
    bun run build
else
    npm run build
fi

# Install dependencies
echo -e "${BLUE}Installing plugin dependencies...${NC}"
if [ ! -f "$HOME/.config/opencode/package.json" ]; then
    cat > "$HOME/.config/opencode/package.json" << 'EOF'
{
  "dependencies": {
    "jsonc-parser": "^3.2.0",
    "zod": "^3.22.4"
  }
}
EOF
fi

if command -v bun &> /dev/null; then
    cd "$HOME/.config/opencode" || exit 1
    bun install
    cd - || exit 1
else
    cd "$HOME/.config/opencode" || exit 1
    npm install
    cd - || exit 1
fi

# Copy plugin files
echo -e "${BLUE}Installing plugin files...${NC}"
cp -r dist "$PLUGIN_DIR/my-opencode-plugin"

# Create plugin wrapper
echo -e "${BLUE}Creating plugin wrapper...${NC}"
cat > "$PLUGIN_DIR/my-opencode-plugin/plugin.js" << 'EOF'
import { MyOpenCodePlugin } from './index.js';

export const MyOpenCodePluginWrapper = async (ctx) => {
  const plugin = new MyOpenCodePlugin({
    configPath: './config.json',
    backgroundManagerOptions: {
      taskTTL: 1800000,
      pollInterval: 2000,
    }
  });
  
  await plugin.initialize({
    id: 'main',
    getStatus: async () => 'active',
    sendMessage: async (message) => {},
    todoWrite: async (options) => {},
    glob: async (options) => [],
    grep: async (options) => [],
    read: async (options) => '',
    write: async (options) => {}
  });
  
  const tools = plugin.getTools();
  
  return {
    tool: tools,
    event: async ({ event }) => {
      if (event.type === 'session.idle') {
        await plugin.cleanup();
      }
    }
  };
};
EOF

# Create command handler
echo -e "${BLUE}Creating command handler...${NC}"
cat > "$PLUGIN_DIR/my-opencode-plugin/command.js" << 'EOF'
import { handleInitDeepCommand } from './commands/init-deep/index.js';

export const InitDeepCommand = async (ctx) => {
  return {
    'tui.command.execute': async (input, output) => {
      if (input.command === '/init-deep') {
        const result = await handleInitDeepCommand(ctx, input.args);
        output.append(result);
      }
    }
  };
};
EOF

# Verify installation
echo -e "${BLUE}Verifying installation...${NC}"
if [ -d "$PLUGIN_DIR/my-opencode-plugin" ] && [ -f "$PLUGIN_DIR/my-opencode-plugin/plugin.js" ]; then
    echo -e "${GREEN}✓ Plugin installed successfully!${NC}"
    echo
    echo "${GREEN}Plugin Features Available:${NC}"
    echo "  • /init-deep command - Generate hierarchical AGENTS.md files"
    echo "  • subagent tool - Create async subagents"
    echo "  • subagent_output tool - Get subagent output"
    echo "  • subagent_cancel tool - Cancel subagent tasks"
    echo
    echo "${YELLOW}Usage:${NC}"
    echo "  1. Start OpenCode: opencode"
    echo "  2. Type '/init-deep' to use the command"
    echo "  3. Use 'Use subagent' in chat to create async tasks"
    echo
else
    echo -e "${RED}Error: Installation verification failed.${NC}"
    exit 1
fi

exit 0
