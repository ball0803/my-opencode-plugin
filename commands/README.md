# Commands

This directory contains OpenCode commands that extend the functionality of my-opencode-plugin.

## Available Commands

### `/init-deep`

Generate hierarchical AGENTS.md files with complexity scoring.

**Description**: Create root and subdirectory AGENTS.md files based on directory complexity scoring.

**Usage**:
```bash
/init-deep                      # Update mode: modify existing + create new
/init-deep --create-new         # Delete all existing → regenerate from scratch
/init-deep --max-depth=2        # Limit directory depth (default: 3)
```

**Features**:
- Four-phase workflow (Discovery → Scoring → Generation → Review)
- Dynamic agent spawning based on project scale
- Bash structural analysis
- Background task support
- TodoWrite progress tracking

**Installation**:
```bash
npm run install:commands
```

**Uninstallation**:
```bash
npm run uninstall:commands
```

## Installation

To install all commands:
```bash
npm run install:commands
```

This will copy the command files to `~/.config/opencode/command/` where OpenCode can discover them.

## Uninstallation

To uninstall all commands:
```bash
npm run uninstall:commands
```

## Manual Installation

If you prefer to install manually:

1. Copy the command file:
```bash
cp commands/init-deep.md ~/.config/opencode/command/
```

2. Ensure the directory exists:
```bash
mkdir -p ~/.config/opencode/command
```

## Command Discovery

OpenCode automatically discovers commands in the following locations (in priority order):

1. `.opencode/command/` (project-specific)
2. `~/.config/opencode/command/` (user-specific)
3. Plugin-provided commands (via this plugin)

## Development

To add a new command:

1. Create a new markdown file in the `commands/` directory
2. Add YAML frontmatter with at least:
   ```yaml
   ---
   description: Your command description
   argument-hint: [optional arguments]
   ---
   ```
3. Add the command to `package.json` under `opencode.commands`
4. Update this README

## Testing

Run the validation script to ensure commands are properly formatted:
```bash
node ../../test-init-deep.js
```
