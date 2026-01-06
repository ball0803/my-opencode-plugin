# Installation Fix for Custom Tools

## Problem Analysis

The current plugin implementation uses OpenCode's plugin system, but custom tools need to be installed in a specific location for OpenCode to recognize them. According to the OpenCode documentation, custom tools should be placed in:

1. **Local**: `.opencode/tool/` directory of your project
2. **Global**: `~/.config/opencode/tool/` directory

The plugin system exports tools through `getTools()`, but OpenCode doesn't automatically recognize these tools unless they're in the `.opencode/tool/` directory.

## Solution Plan

### Option 1: Convert to Custom Tools Format (Recommended)

Convert the plugin tools to OpenCode's custom tools format using the `@opencode-ai/plugin` package.

### Option 2: Hybrid Approach

Keep the plugin system for background tasks and MCP management, but also create custom tool wrappers in `.opencode/tool/` directory.

### Option 3: Documentation Fix

Update the installation documentation to explain that tools must be manually registered or placed in the correct directory.

## Implementation Steps

### Step 1: Create Custom Tools Directory

```bash
mkdir -p ~/.config/opencode/tool
mkdir -p .opencode/tool
```

### Step 2: Convert ast-grep Tool to Custom Format

Create `.opencode/tool/ast-grep.ts`:

```typescript
import { tool } from '@opencode-ai/plugin';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const search = tool({
  description: 'Search and analyze code using ast-grep pattern matching',
  args: {
    pattern: tool.schema
      .string()
      .describe('The ast-grep pattern to search for'),
    file: tool.schema.string().describe('File path to search in').optional(),
    dir: tool.schema.string().describe('Directory to search in').optional(),
    language: tool.schema.string().describe('Programming language').optional(),
    include: tool.schema
      .string()
      .describe('Include files matching pattern')
      .optional(),
    exclude: tool.schema
      .string()
      .describe('Exclude files matching pattern')
      .optional(),
    max_results: tool.schema.number().describe('Maximum results').default(50),
    json_output: tool.schema.boolean().describe('JSON output').default(true),
  },
  async execute(args) {
    try {
      // Check if ast-grep is installed
      await execAsync('ast-grep --version');
    } catch (error) {
      throw new Error(
        'ast-grep is not installed. Please install it with: npm install -g ast-grep',
      );
    }

    const commandArgs = [];

    if (args.json_output) {
      commandArgs.push('--json');
    }

    if (args.language) {
      commandArgs.push('--lang', args.language);
    }

    if (args.include) {
      commandArgs.push('--include', args.include);
    }

    if (args.exclude) {
      commandArgs.push('--exclude', args.exclude);
    }

    const target = args.file || args.dir || '.';
    commandArgs.push(target);
    commandArgs.push(args.pattern);

    const { stdout, stderr } = await execAsync(
      `ast-grep ${commandArgs.join(' ')}`,
    );

    if (stderr && !stderr.includes('no files matched')) {
      throw new Error(`Error: ${stderr}`);
    }

    return stdout.trim() || 'No matches found';
  },
});

export const pattern = tool({
  description: 'Create and test ast-grep patterns',
  args: {
    pattern_type: tool.schema
      .enum(['regex', 'semantic', 'struct'])
      .describe('Pattern type'),
    target: tool.schema.string().describe('What to match').optional(),
    language: tool.schema.string().describe('Programming language').optional(),
  },
  async execute(args) {
    let result = '';

    switch (args.pattern_type) {
      case 'regex':
        result = `### Regex Pattern${args.target ? ` for "${args.target}"` : ''}
\`\`\`
${args.target || 'your_pattern'}
\`\`\`
**Usage:** ast-grep -n '${args.target || 'your_pattern'}' file.ts`;
        break;
      case 'semantic':
        result = `### Semantic Pattern${args.language ? ` for ${args.language}` : ''}
\`\`\`
${args.target || 'your_pattern'}
\`\`\`
**Usage:** ast-grep -n --lang ${args.language || 'typescript'} '${args.target || 'your_pattern'}' file.ts`;
        break;
      case 'struct':
        result = `### Struct Pattern${args.language ? ` for ${args.language}` : ''}
\`\`\`
${args.target || 'your_struct_pattern'}
\`\`\`
**Usage:** ast-grep -n --lang ${args.language || 'typescript'} '${args.target || 'your_struct_pattern'}' file.ts`;
        break;
    }

    return result;
  },
});
```

### Step 3: Update Installation Documentation

Add instructions to the README:

````markdown
## Installation

### Option 1: Plugin Installation (Recommended)

1. Install the plugin:
   ```bash
   npm install my-opencode-plugin
   ```
````

2. Add to your OpenCode config:
   ```json
   {
     "plugins": ["my-opencode-plugin"]
   }
   ```

### Option 2: Custom Tools Installation

For direct tool access in OpenCode:

1. Create the tools directory:

   ```bash
   mkdir -p ~/.config/opencode/tool
   ```

2. Install ast-grep:

   ```bash
   npm install -g ast-grep
   ```

3. Create custom tool files:
   ```bash
   cp node_modules/my-opencode-plugin/tools/ast-grep.ts ~/.config/opencode/tool/
   ```

### Option 3: Hybrid Installation

Use both plugin and custom tools:

1. Install the plugin
2. Create custom tool wrappers
3. Both approaches will work simultaneously

````

### Step 4: Create Installation Script

Create `scripts/install-custom-tools.sh`:

```bash
#!/bin/bash

# Create tools directory if it doesn't exist
mkdir -p ~/.config/opencode/tool

# Check if ast-grep is installed
if ! command -v ast-grep &> /dev/null; then
    echo "Installing ast-grep..."
    npm install -g ast-grep
fi

# Copy tool files
cp -r src/tools/ast-grep/*.ts ~/.config/opencode/tool/ || true

# Install dependencies if needed
if [ ! -f ~/.config/opencode/package.json ]; then
    echo "Creating package.json for custom tools..."
    cat > ~/.config/opencode/package.json << 'EOF'
{
  "name": "opencode-custom-tools",
  "version": "1.0.0",
  "dependencies": {
    "@opencode-ai/plugin": "latest"
  }
}
EOF
    npm install --prefix ~/.config/opencode
fi

echo "Custom tools installed successfully!"
echo "Restart OpenCode to use the new tools."
````

### Step 5: Update Package.json

Add installation scripts:

```json
"scripts": {
  "build": "bun run tsc",
  "install:tools": "bash scripts/install-custom-tools.sh",
  "install:plugin": "bash scripts/install-plugin.sh",
  "install:all": "npm install && bun run install:tools && bun run install:plugin"
}
```

### Step 6: Create Plugin Installation Script

Update `scripts/install-plugin.sh`:

```bash
#!/bin/bash

# Install to OpenCode plugins directory
PLUGIN_DIR="/home/camel/.config/opencode/plugin/my-opencode-plugin"

# Build the plugin
bun run build

# Copy to plugin directory
mkdir -p "$PLUGIN_DIR"
cp -r dist/* "$PLUGIN_DIR/"

# Create symlink for tools if needed
ln -sf "$PLUGIN_DIR/tools" "~/.config/opencode/tool/plugin-tools" 2>/dev/null || true

echo "Plugin installed to: $PLUGIN_DIR"
echo "Tools are available through the plugin system."
```

## Testing the Fix

### Test 1: Custom Tools

```bash
# Create test file
cat > /tmp/test.ts << 'EOF'
const useState = () => [null, () => {}]
EOF

# Test with OpenCode
opencode -m "mistral (local)/mistralai/Devstral-Small-2-24B-Instruct-2512" run "use ast-grep-search to find 'useState' in /tmp/test.ts"
```

### Test 2: Plugin Tools

```bash
# Test background tasks
opencode -m "mistral (local)/mistralai/Devstral-Small-2-24B-Instruct-2512" run "create a background task that echoes hello"
```

### Test 3: Hybrid

```bash
# Test both approaches work
opencode -m "mistral (local)/mistralai/Devstral-Small-2-24B-Instruct-2512" run "use ast-grep-search and create-background-task"
```

## Troubleshooting

### Issue: Tools not recognized

**Solution**: Check the tools directory:

```bash
ls -la ~/.config/opencode/tool/
```

Ensure files have `.ts` or `.js` extension and are valid TypeScript/JavaScript.

### Issue: ast-grep not found

**Solution**: Install ast-grep globally:

```bash
npm install -g ast-grep
```

### Issue: Plugin not loading

**Solution**: Check OpenCode logs:

```bash
opencode --print-logs
```

### Issue: Type errors

**Solution**: Install dependencies:

```bash
npm install --prefix ~/.config/opencode @opencode-ai/plugin
```

## Migration Guide

### For Existing Users

1. Backup current configuration:

   ```bash
   cp ~/.config/opencode/opencode.jsonc ~/.config/opencode/opencode.jsonc.backup
   ```

2. Install custom tools:

   ```bash
   bun run install:tools
   ```

3. Restart OpenCode

4. Verify tools work:
   ```bash
   opencode -m "mistral (local)/mistralai/Devstral-Small-2-24B-Instruct-2512" run "list available tools"
   ```

### For New Users

1. Install the package:

   ```bash
   npm install my-opencode-plugin
   ```

2. Choose installation method:
   - Plugin only: `bun run install:plugin`
   - Custom tools only: `bun run install:tools`
   - Both: `bun run install:all`

3. Start OpenCode

## Future Improvements

1. **Auto-discovery**: Create a script that automatically discovers and registers plugin tools as custom tools
2. **Configuration**: Add config option to choose between plugin and custom tools installation
3. **Documentation**: Create detailed guides for each installation method
4. **Testing**: Add integration tests for custom tools
5. **Error handling**: Better error messages when tools fail to load
