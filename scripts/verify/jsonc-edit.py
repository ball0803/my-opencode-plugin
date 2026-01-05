#!/usr/bin/env python3

import json
import sys
import json5


def parse_jsonc(file_path):
    """Parse JSONC file using json5."""
    try:
        with open(file_path, "r") as f:
            content = f.read()
        return json5.loads(content)
    except Exception as e:
        print(f"Error parsing JSONC: {e}", file=sys.stderr)
        return None


def write_jsonc(file_path, data):
    """Write data to JSONC file."""
    try:
        with open(file_path, "w") as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"Error writing JSONC: {e}", file=sys.stderr)
        return False


def add_mcp_server(config_file, server_name, server_config):
    """Add MCP server to configuration."""
    # If server_config is empty, just check if server exists
    if not server_config:
        config = parse_jsonc(config_file)
        if config is None:
            return False
        # Check if server already exists
        if "mcpServers" in config and server_name in config["mcpServers"]:
            return False
        if "mcp" in config and server_name in config["mcp"]:
            return False
        # Server doesn't exist, so we can add it
        return True

    # Parse existing config
    config = parse_jsonc(config_file)
    if config is None:
        return False

    # Check if server already exists
    if "mcpServers" in config and server_name in config["mcpServers"]:
        return False
    if "mcp" in config and server_name in config["mcp"]:
        return False

    # Add server to mcpServers if it exists, otherwise to mcp
    if "mcpServers" in config:
        config["mcpServers"][server_name] = server_config
    else:
        if "mcp" not in config:
            config["mcp"] = {}
        config["mcp"][server_name] = server_config

    # Write back
    return write_jsonc(config_file, config)


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(
            "Usage: jsonc-edit.py <config_file> <server_name> <server_config_json>",
            file=sys.stderr,
        )
        sys.exit(1)

    config_file = sys.argv[1]
    server_name = sys.argv[2]
    server_config = json.loads(sys.argv[3])

    success = add_mcp_server(config_file, server_name, server_config)
    sys.exit(0 if success else 1)
