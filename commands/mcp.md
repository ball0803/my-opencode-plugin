---
description: Configure MCP servers for OpenCode
argument-hint: '[--add <name>] [--remove <name>] [--list] [--status] [--verify] [--install <name>] [--uninstall <name>]'
---

# /mcp

Configure MCP servers for OpenCode

## Usage

```bash
/mcp --add searxng   # Add SearXNG MCP server
/mcp --add context7  # Add Context7 MCP server
/mcp --add gh_grep   # Add Grep by Vercel MCP server
/mcp --add octocode  # Add Octocode MCP server
/mcp --remove <name> # Remove MCP server
/mcp --list          # List configured MCP servers
/mcp --status        # Show MCP server status
/mcp --verify        # Verify MCP installation
/mcp --install <name> # Install MCP server (searxng, context7, gh_grep, octocode, all)
/mcp --uninstall <name> # Uninstall MCP server
```

## Supported MCP Servers

### SearXNG

Private, self-hosted metasearch engine. Use for web searches with privacy.

```bash
/mcp --add searxng
```

Then use in prompts:

```
Search for React documentation. use searxng
```

### Context7

Documentation search for programming libraries and frameworks.

```bash
/mcp --add context7
```

Then use in prompts:

```
How to implement authentication in Next.js? use context7
```

### Grep by Vercel

GitHub code search. Use for finding code examples and repository patterns.

```bash
/mcp --add grep
```

Then use in prompts:

```
Show me examples of custom hooks in React. use gh_grep
```

### Octocode

GitHub repository exploration and code search.

```bash
/mcp --add octocode
```

Then use in prompts:

```
Find examples of authentication in Next.js. use octocode
```

### Puppeteer

Browser automation and web scraping. Use for extracting data from websites, testing web applications, and automating browser tasks.

```bash
/mcp --add puppeteer-mcp
```

Then use in prompts:

```
Scrape the latest news from a website. use puppeteer-mcp
Extract data from this URL. use puppeteer-mcp
Automate browser testing for my React app. use puppeteer-mcp
```

### Puppeteer

Browser automation and web scraping. Use for extracting data from websites, testing web applications, and automating browser tasks.

```bash
/mcp --add puppeteer-mcp
```

Then use in prompts:

```
Scrape the latest news from a website. use puppeteer-mcp
Extract data from this URL. use puppeteer-mcp
Automate browser testing for my React app. use puppeteer-mcp
```

## Installation Commands

### Install MCP Servers

```bash
# Install individual servers
bash scripts/verify/mcp-install.sh install searxng
bash scripts/verify/mcp-install.sh install context7
bash scripts/verify/mcp-install.sh install gh_grep
bash scripts/verify/mcp-install.sh install octocode
bash scripts/verify/mcp-install.sh install puppeteer

# Install all servers
bash scripts/verify/mcp-install.sh install all
```

### Uninstall MCP Servers

```bash
bash scripts/verify/mcp-install.sh uninstall <server-name>
```

### Verify Installation

```bash
bash scripts/verify/mcp-install.sh verify
bash scripts/verify/mcp-install.sh status
```

## Configuration

MCP servers are configured in your OpenCode configuration file:

```bash
~/.config/opencode/opencode.jsonc
```

The configuration supports:

- **Local servers** (stdio): Run locally via npm packages
- **Remote servers** (http/sse): Connect to remote MCP endpoints
- **Authentication**: OAuth and API key support
- **Environment variables**: For sensitive configuration

## Examples

### Add Multiple Servers

```bash
/mcp --add searxng
/mcp --add context7
/mcp --add grep
/mcp --add puppeteer
```

### List Configured Servers

```bash
/mcp --list
```

### Remove Server

```bash
/mcp --remove grep
```

### Check Status

```bash
/mcp --status
```

## Notes

- MCP servers require Node.js and npm/npx
- Some servers require environment variables (e.g., CONTEXT_TOKEN_KEY, GITHUB_TOKEN_KEY)
- Configuration is stored in `~/.config/opencode/opencode.jsonc`
- Use `jq` for advanced configuration management
- Environment variables can be used for sensitive data

## Custom Tools

### ast-grep

Code search and analysis using ast-grep patterns. Requires ast-grep to be installed globally.

#### Installation

```bash
# Install ast-grep globally
npm install -g ast-grep

# Or using yarn
 yarn global add ast-grep
```

#### Usage

The ast-grep tool provides two functions:

1. **ast_grep**: Search code using ast-grep patterns
2. **ast_grep_pattern**: Create and test ast-grep patterns

#### Examples

```bash
# Search for function definitions in TypeScript files
ast_grep --language typescript --pattern "function.*{" --include "*.ts"

# Create a semantic pattern for React hooks
ast_grep_pattern --type semantic --language typescript --pattern "useState.*hook"

# Search for struct patterns (specific code structures)
ast_grep_pattern --type struct --language python --pattern "def.*:.*return"
```

#### Pattern Types

- **regex**: Standard regular expressions
- **semantic**: Syntax-aware patterns (e.g., `function.*{`)
- **struct**: Structural patterns (e.g., `if.*then.*else`)

#### Supported Languages

- TypeScript
- JavaScript
- Python
- Rust
- Go
- Java
- C/C++
- And more...

#### File Filtering

```bash
# Include specific files
--include "*.ts" --include "*.tsx"

# Exclude files
--exclude "*.test.ts" --exclude "*.spec.ts"
```

#### Output Format

Results are returned in JSON format for easy parsing.

## Troubleshooting

### jq not installed

```bash
# Install jq
sudo apt-get install jq  # Debian/Ubuntu
brew install jq          # macOS
```

### npx not available

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Server not found

```bash
# Verify server name
/mcp --list

# Check configuration file
cat ~/.config/opencode/opencode.jsonc
```

### Authentication issues

```bash
# Authenticate with server
/mcp --auth <server-name>

# Check environment variables
env | grep MCP
```
