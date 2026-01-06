# ast-grep Custom Tools Installation Complete ✅

## Installation Summary

The ast-grep custom tools have been successfully installed in OpenCode.

### Tools Available:

1. **ast-grep-search** - Search and analyze code using ast-grep pattern matching
2. **ast-grep-pattern_ast_grep_pattern** - Create and test ast-grep patterns

### Installation Details:

**Location:** `~/.config/opencode/tool/`

**Files Installed:**

- `ast-grep.ts` - Main search tool
- `ast-grep-pattern.ts` - Pattern creation tool

### Dependencies Installed:

- `ast-grep` (global)
- `@opencode-ai/plugin` (for custom tools)

### Verification:

✅ Tools are recognized by OpenCode
✅ ast-grep-search successfully finds code patterns
✅ ast-grep-pattern creates pattern templates

### Usage Examples:

```bash
# Search for a function in a file
opencode run "use ast-grep-search to find 'createBackgroundTaskTool' in src/tools/background-task/tools.ts"

# Create a regex pattern
opencode run "use ast-grep-pattern_ast_grep_pattern to create a regex pattern for 'useEffect'"
```

### Installation Script:

Run this command to reinstall or share with others:

```bash
bash /home/camel/Desktop/Project/yaocp/my-opencode-plugin/scripts/install-ast-grep-tools.sh
```

### Notes:

- The tools use the global ast-grep installation
- Both regex and semantic pattern types are supported
- Pattern creation provides usage examples and descriptions
- Tools work with any programming language supported by ast-grep
