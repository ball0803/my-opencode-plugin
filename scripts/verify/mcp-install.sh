#!/usr/bin/env bash

# MCP Installation Script for my-opencode-plugin
# Installs and configures MCP servers for OpenCode

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
HELPER_SCRIPT="$SCRIPT_DIR/mcp-helper.sh"
CONFIG_DIR="$HOME/.config/opencode"
CONFIG_FILE="$CONFIG_DIR/opencode.jsonc"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if helper script exists
check_helper() {
    if [ ! -f "$HELPER_SCRIPT" ]; then
        echo -e "${RED}Error: MCP helper script not found at $HELPER_SCRIPT${NC}"
        echo "Please run this script from the project root or ensure mcp-helper.sh exists"
        exit 1
    fi
    chmod +x "$HELPER_SCRIPT"
}

# Install SearXNG MCP server
install_searxng() {
    echo -e "${BLUE}Installing SearXNG MCP server...${NC}"
    
    local config="{
        \"type\": \"local\",
        \"command\": [\"npx\", \"-y\", \"mcp-searxng\"],
        \"enabled\": true,
        \"environment\": {
          \"SEARXNG_URL\": \"http://searxng.internal\"
        }
    }"
    
    if "$HELPER_SCRIPT" add searxng "$config"; then
        echo -e "${GREEN}SearXNG MCP server installed successfully${NC}"
    else
        echo -e "${RED}Failed to install SearXNG MCP server${NC}"
        return 1
    fi
}

# Install Context7 MCP server
install_context7() {
    echo -e "${BLUE}Installing Context7 MCP server...${NC}"
    
    local config="{
        \"type\": \"local\",
        \"command\": [\"npx\", \"-y\", \"@upstash/context7-mcp\"],
        \"enabled\": true,
        \"environment\": {
          \"CONTEXT_TOKEN_KEY\": \"{env:CONTEXT_TOKEN_KEY}\"
        }
    }"
    
    "$HELPER_SCRIPT" add context7 "$config"
    echo -e "${GREEN}Context7 MCP server installed successfully${NC}"
}

# Install Grep by Vercel MCP server
install_grep() {
    echo -e "${BLUE}Installing Grep by Vercel MCP server...${NC}"
    
    local config="{
        \"type\": \"remote\",
        \"url\": \"https://mcp.grep.app\"
    }"
    
    "$HELPER_SCRIPT" add gh_grep "$config"
    echo -e "${GREEN}Grep by Vercel MCP server installed successfully${NC}"
}

# Install Octocode MCP server
install_octocode() {
    echo -e "${BLUE}Installing Octocode MCP server...${NC}"
    
    local config="{
        \"type\": \"local\",
        \"command\": [\"npx\", \"-y\", \"octocode-mcp@latest\"],
        \"enabled\": true,
        \"environment\": {
          \"GITHUB_TOKEN\": \"{env:GITHUB_TOKEN_KEY}\"
        }
    }"
    
    "$HELPER_SCRIPT" add octocode-mcp "$config"
    echo -e "${GREEN}Octocode MCP server installed successfully${NC}"
}

# Install Puppeteer MCP server
install_puppeteer() {
    echo -e "${BLUE}Installing Puppeteer MCP server...${NC}"
    
    local config="{
        \"type\": \"local\",
        \"command\": [\"npx\", \"-y\", \"@modelcontextprotocol/server-puppeteer@latest\"],
        \"enabled\": true,
        \"environment\": {
          \"PUPPETEER_HEADLESS\": \"true\",
          \"PUPPETEER_TIMEOUT\": \"30000\"
        }
    }"
    
    "$HELPER_SCRIPT" add puppeteer-mcp "$config"
    echo -e "${GREEN}Puppeteer MCP server installed successfully${NC}"
}

# Install all MCP servers
install_all() {
    echo -e "${BLUE}Installing all MCP servers...${NC}"
    
    install_searxng
    install_context7
    install_grep
    install_octocode
    install_puppeteer
    
    echo -e "${GREEN}All MCP servers installed successfully${NC}"
}

# Uninstall MCP server
uninstall_mcp() {
    local server_name="$1"
    
    echo -e "${BLUE}Uninstalling $server_name MCP server...${NC}"
    
    "$HELPER_SCRIPT" remove "$server_name"
    echo -e "${GREEN}$server_name MCP server uninstalled successfully${NC}"
}

# Check if MCP server is installed
is_installed() {
    local server_name="$1"
    
    if "$HELPER_SCRIPT" get "$server_name" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Verify MCP installation
verify_installation() {
    echo -e "${BLUE}Verifying MCP installation...${NC}"
    
    local all_installed=true
    
    # Check if required tools are available
    if ! command -v npx &> /dev/null; then
        echo -e "${RED}Error: npx is not available. Please install Node.js and npm.${NC}"
        all_installed=false
    fi
    
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error: jq is not installed. Please install jq.${NC}"
        all_installed=false
    fi
    
    # Check configuration
    if [ ! -f "$CONFIG_FILE" ]; then
        echo -e "${RED}Error: OpenCode configuration file not found at $CONFIG_FILE${NC}"
        all_installed=false
    fi
    
    if ! "$HELPER_SCRIPT" validate; then
        all_installed=false
    fi
    
    if [ "$all_installed" = true ]; then
        echo -e "${GREEN}MCP installation verified successfully${NC}"
        return 0
    else
        echo -e "${RED}MCP installation verification failed${NC}"
        return 1
    fi
}

# Show installation status
show_status() {
    echo -e "${BLUE}MCP Server Status:${NC}"
    echo "-------------------"
    
    local servers=("searxng" "context7" "gh_grep" "octocode-mcp" "puppeteer-mcp")
    
    for server in "${servers[@]}"; do
        if is_installed "$server"; then
            echo -e "  ✓ $server"
        else
            echo -e "  ✗ $server"
        fi
    done
    
    echo ""
}

# Main function
main() {
    check_helper
    
    local action="$1"
    shift
    
    case "$action" in
        install)
            local server="$1"
            case "$server" in
                searxng)
                    install_searxng
                    ;;
                context7)
                    install_context7
                    ;;
                grep)
                    install_grep
                    ;;
                sentry)
                    install_sentry
                    ;;
                octocode)
                    install_octocode
                    ;;
                puppeteer)
                    install_puppeteer
                    ;;
                all)
                    install_all
                    ;;
                *)
                    echo -e "${RED}Error: Unknown MCP server '$server'${NC}"
                    echo "Available servers: searxng, context7, grep, sentry, octocode, puppeteer, all"
                    exit 1
                    ;;
            esac
            ;;
        uninstall|uninstall)
            local server="$1"
            uninstall_mcp "$server"
            ;;
        verify)
            verify_installation
            ;;
        status)
            show_status
            ;;
        *)
            echo "Usage: $0 {install|uninstall|verify|status} [server]"
            echo ""
            echo "Commands:"
            echo "  install <server>      Install MCP server (searxng, context7, grep, sentry, octocode, puppeteer, all)"
            echo "  uninstall <server>    Uninstall MCP server"
            echo "  verify                 Verify MCP installation"
            echo "  status                 Show MCP server status"
            exit 1
            ;;
    esac
}

main "$@"
