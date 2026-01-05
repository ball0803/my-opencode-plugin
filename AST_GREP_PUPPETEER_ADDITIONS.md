# ast-grep Custom Tool and Puppeteer MCP Server

This document describes the additions made to the my-opencode-plugin:

## 1. ast-grep Custom Tool

### Overview

Added two new custom tools for code analysis using ast-grep:

- `ast_grep`: Search and analyze code using ast-grep pattern matching
- `ast_grep_pattern`: Create and test ast-grep patterns

### Files Created

- `src/tools/ast-grep/tools.ts` - Main tool implementation
- `src/tools/ast-grep/index.ts` - Export functions
- `src/tools/ast-grep/__tests__/tools.test.ts` - Unit tests

### Features

#### ast_grep Tool

- Search code using regex, semantic, or struct patterns
- Support for multiple languages (typescript, javascript, python, rust, etc.)
- Filter by file path, directory, include/exclude patterns
- JSON output for easy parsing
- Automatic detection if ast-grep is not installed

**Parameters:**

- `pattern` (required): The ast-grep pattern to search for
- `file`: File path to search in (supports glob patterns)
- `dir`: Directory to search in
- `language`: Programming language
- `include`: Include files matching this pattern
- `exclude`: Exclude files matching this pattern
- `max_results`: Maximum number of results to return (default: 50)
- `show_context`: Show context around matches (default: true)
- `json_output`: Return results in JSON format (default: true)

#### ast_grep_pattern Tool

- Create regex, semantic, or struct patterns
- Generate usage examples
- Test patterns against example code
- Get pattern descriptions and best practices

**Parameters:**

- `pattern_type` (required): Type of pattern (regex, semantic, struct)
- `target`: What to match (e.g., function, class, variable)
- `language`: Programming language
- `example_code`: Example code to test the pattern against

### Usage Examples

```javascript
// Search for function declarations in TypeScript files
ast_grep({
  pattern: 'function.*\{',
  dir: 'src',
  language: 'typescript',
});

// Create a regex pattern for useState
ast_grep_pattern({
  pattern_type: 'regex',
  target: 'useState',
});

// Search for specific class pattern
ast_grep({
  pattern: 'class.*extends.*Component',
  file: 'src/components/*.tsx',
  language: 'typescript',
});
```

## 2. Puppeteer MCP Server

### Overview

Added Puppeteer MCP server support for browser automation and web scraping.

### Installation

```bash
# Install Puppeteer MCP server
bash scripts/verify/mcp-install.sh install puppeteer

# Install all MCP servers (including Puppeteer)
bash scripts/verify/mcp-install.sh install all

# List installed servers
bash scripts/verify/mcp-install.sh status

# Remove Puppeteer MCP server
bash scripts/verify/mcp-install.sh uninstall puppeteer-mcp
```

### Configuration

The Puppeteer MCP server is configured with:

- **Type**: Local (stdio)
- **Command**: `npx -y puppeteer-mcp@latest`
- **Environment Variables**:
  - `PUPPETEER_HEADLESS`: `true` (run in headless mode)
  - `PUPPETEER_TIMEOUT`: `30000` (30 second timeout)

### Usage in OpenCode

```bash
/mcp --add puppeteer
```

Then use in prompts:

```
Scrape the latest news from a website. use puppeteer
Extract data from this URL. use puppeteer
Automate browser testing for my React app. use puppeteer
```

## 3. Files Modified

### Tool Integration

- `src/tools/index.ts` - Added ast-grep exports
- `src/index.ts` - Updated getTools() to include ast-grep tools

### MCP Server Installation

- `scripts/verify/mcp-install.sh` - Added Puppeteer installation function
- `commands/mcp.md` - Added Puppeteer documentation

## 4. Prerequisites

### For ast-grep Tool

- ast-grep must be installed globally or available via npx
- Install with: `npm install -g ast-grep` or use `npx ast-grep`

### For Puppeteer MCP Server

- Node.js and npm/npx required
- Puppeteer will be installed automatically via npx
- No additional configuration needed

## 5. Testing

The ast-grep tool has been tested and verified to work correctly:

- Tool structure and exports verified
- Pattern helper generates correct output
- Error handling for missing ast-grep installation
- Integration with plugin's tool system confirmed

## 6. Notes

- The ast-grep tool requires ast-grep to be installed separately
- Puppeteer MCP server runs in headless mode by default
- All MCP servers are configured in `~/.config/opencode/opencode.jsonc`
- Use `jq` for advanced configuration management
- Environment variables can be used for sensitive configuration

## 7. Troubleshooting

### ast-grep not found

```bash
npm install -g ast-grep
# or
npx ast-grep --version
```

### Puppeteer not working

```bash
# Ensure npx is available
npm install -g npx

# Check configuration
cat ~/.config/opencode/opencode.jsonc
```

### MCP server not listed

```bash
# Reinstall the server
bash scripts/verify/mcp-install.sh uninstall puppeteer-mcp
bash scripts/verify/mcp-install.sh install puppeteer

# Verify configuration
bash scripts/verify/mcp-helper.sh validate
```
