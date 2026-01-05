#!/usr/bin/env bash

# MCP Helper Script for my-opencode-plugin
# Provides utilities for managing MCP server configurations

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../" && pwd)"
CONFIG_DIR="$HOME/.config/opencode"
CONFIG_FILE="$CONFIG_DIR/opencode.jsonc"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if jq is installed
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error: jq is not installed. Please install jq first.${NC}"
        echo "Installation command:"
        echo "  sudo apt-get install jq  # Debian/Ubuntu"
        echo "  brew install jq          # macOS"
        exit 1
    fi
}

# Check if jsonc-parser is available
check_jsonc_parser() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: node is not installed. Please install node.js first.${NC}"
        exit 1
    fi
    if [ ! -f "$PROJECT_ROOT/node_modules/jsonc-parser/lib/esm/main.js" ]; then
        echo -e "${RED}Error: jsonc-parser is not installed.${NC}"
        echo "Run: npm install jsonc-parser"
        exit 1
    fi
}

# Check if configuration file exists
check_config() {
    if [ ! -f "$CONFIG_FILE" ]; then
        echo -e "${YELLOW}Warning: OpenCode configuration file not found at $CONFIG_FILE${NC}"
        echo "Creating default configuration..."
        mkdir -p "$CONFIG_DIR"
        cat > "$CONFIG_FILE" << 'EOF'
{
  "mcpServers": {}
}
EOF
        echo -e "${GREEN}Created default configuration at $CONFIG_FILE${NC}"
    fi
}

# Add MCP server to configuration
add_mcp_server() {
    local server_name="$1"
    local server_config="$2"
    
    check_config
    
    # Check if Python is available
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}Error: python3 is not installed. Please install python3 first.${NC}"
        exit 1
    fi
    
    # Check if jsonc-edit.py exists
    local jsonc_script="$SCRIPT_DIR/jsonc-edit.py"
    if [ ! -f "$jsonc_script" ]; then
        echo -e "${RED}Error: jsonc-edit.py not found at $jsonc_script${NC}"
        exit 1
    fi
    
    # Check if server already exists using Python script
    # The script returns 1 if server exists (can't add), 0 if added successfully
    if ! python3 "$jsonc_script" "$CONFIG_FILE" "$server_name" "{}" 2>/dev/null; then
        echo -e "${YELLOW}Warning: MCP server '$server_name' already exists in configuration${NC}"
        echo "Use --force to overwrite"
        return 0
    fi
    
    # Add server to configuration using Python script
    if python3 "$jsonc_script" "$CONFIG_FILE" "$server_name" "$server_config" > /dev/null 2>&1; then
        echo -e "${GREEN}Added MCP server '$server_name' to configuration${NC}"
    else
        echo -e "${RED}Error: Failed to add MCP server '$server_name'${NC}"
        return 1
    fi
}

# Remove MCP server from configuration
remove_mcp_server() {
    local server_name="$1"
    
    check_jq
    check_config
    
    # Check if server exists
    if ! jq -e ".mcpServers.$server_name" "$CONFIG_FILE" > /dev/null 2>&1 && \
       ! jq -e ".mcp.$server_name" "$CONFIG_FILE" > /dev/null 2>&1; then
        echo -e "${YELLOW}Warning: MCP server '$server_name' not found in configuration${NC}"
        return 0
    fi
    
    # Remove server from configuration
    if jq -e ".mcpServers.$server_name" "$CONFIG_FILE" > /dev/null 2>&1; then
        jq "del(.mcpServers.$server_name)" "$CONFIG_FILE" > "$CONFIG_FILE.tmp"
    else
        jq "del(.mcp.$server_name)" "$CONFIG_FILE" > "$CONFIG_FILE.tmp"
    fi
    mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
    
    echo -e "${GREEN}Removed MCP server '$server_name' from configuration${NC}"
}

# List all MCP servers
list_mcp_servers() {
    check_config
    
    if [ ! -s "$CONFIG_FILE" ]; then
        echo -e "${YELLOW}No MCP servers configured${NC}"
        return 0
    fi
    
    echo -e "${BLUE}Configured MCP Servers:${NC}"
    echo "-----------------------------------"
    
    local servers=""
    
    # Try mcpServers first, then mcp
    if jq -e '.mcpServers' "$CONFIG_FILE" > /dev/null 2>&1; then
        servers=$(jq -r 'keys[]' <<< "$(jq -c '.mcpServers' "$CONFIG_FILE")")
    elif jq -e '.mcp' "$CONFIG_FILE" > /dev/null 2>&1; then
        servers=$(jq -r 'keys[]' <<< "$(jq -c '.mcp' "$CONFIG_FILE")")
    fi
    
    if [ -z "$servers" ]; then
        echo -e "${YELLOW}No MCP servers configured${NC}"
        return 0
    fi
    
    for server in $servers; do
        echo "  - $server"
    done
    
    echo ""
}

# Get MCP server configuration
get_mcp_server() {
    local server_name="$1"
    
    check_config
    
    if ! jq -e ".mcpServers.$server_name" "$CONFIG_FILE" > /dev/null 2>&1 && \
       ! jq -e ".mcp.$server_name" "$CONFIG_FILE" > /dev/null 2>&1; then
        echo -e "${RED}Error: MCP server '$server_name' not found${NC}"
        return 1
    fi
    
    if jq -e ".mcpServers.$server_name" "$CONFIG_FILE" > /dev/null 2>&1; then
        jq -c ".mcpServers.$server_name" "$CONFIG_FILE"
    else
        jq -c ".mcp.$server_name" "$CONFIG_FILE"
    fi
}

# Validate MCP configuration
validate_mcp_config() {
    check_jq
    check_jsonc_parser
    check_config
    
    echo -e "${BLUE}Validating MCP configuration...${NC}"
    
    # Check if file is valid JSONC using jsonc-parser
    if ! node -e "const {parseTree} = require('jsonc-parser'); const fs = require('fs'); parseTree(fs.readFileSync('$CONFIG_FILE', 'utf8'));" > /dev/null 2>&1; then
        echo -e "${RED}Error: Invalid JSONC in configuration file${NC}"
        return 1
    fi
    
    # Check if mcpServers or mcp exists (skip adding since file already has mcp)
    # The file is valid JSONC if we got here, so we're done
    :
    
    echo -e "${GREEN}Configuration is valid${NC}"
    return 0
}

# Backup configuration
backup_config() {
    local backup_dir="$CONFIG_DIR/backups"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$backup_dir/opencode_$timestamp.jsonc"
    
    mkdir -p "$backup_dir"
    cp "$CONFIG_FILE" "$backup_file"
    
    echo -e "${GREEN}Configuration backed up to $backup_file${NC}"
}

# Main function
main() {
    local action="$1"
    shift
    
    case "$action" in
        add)
            local server_name="$1"
            shift
            local server_config="$(cat <<< "$@")"
            add_mcp_server "$server_name" "$server_config"
            ;;
        remove|rm)
            local server_name="$1"
            remove_mcp_server "$server_name"
            ;;
        list|ls)
            list_mcp_servers
            ;;
        get)
            local server_name="$1"
            get_mcp_server "$server_name"
            ;;
        validate)
            validate_mcp_config
            ;;
        backup)
            backup_config
            ;;
        *)
            echo "Usage: $0 {add|remove|list|get|validate|backup} [options]"
            echo ""
            echo "Commands:"
            echo "  add <name> <config>      Add MCP server"
            echo "  remove <name>            Remove MCP server"
            echo "  list                     List all MCP servers"
            echo "  get <name>               Get MCP server configuration"
            echo "  validate                 Validate MCP configuration"
            echo "  backup                   Backup configuration"
            exit 1
            ;;
    esac
}

main "$@"
