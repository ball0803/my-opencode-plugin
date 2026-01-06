#!/bin/bash

# Installation script for ast-grep custom tools
# This script installs ast-grep tools in ~/.config/opencode/tool/ directory

set -e

echo "🚀 Installing ast-grep custom tools for OpenCode..."

# Create tools directory if it doesn't exist
mkdir -p ~/.config/opencode/tool
echo "✓ Created tools directory at ~/.config/opencode/tool/"

# Check if ast-grep is installed
if ! command -v ast-grep &> /dev/null; then
    echo "⚠️  ast-grep is not installed. Installing now..."
    npm install -g ast-grep
    echo "✓ Installed ast-grep globally"
else
    echo "✓ ast-grep is already installed"
fi

# Install @opencode-ai/plugin dependency if needed
if [ ! -f ~/.config/opencode/package.json ]; then
    echo "✓ Creating package.json for custom tools..."
    cat > ~/.config/opencode/package.json << 'EOP'
{
  "name": "opencode-custom-tools",
  "version": "1.0.0",
  "dependencies": {
    "@opencode-ai/plugin": "latest"
  }
}
EOP
    npm install --prefix ~/.config/opencode
    echo "✓ Installed @opencode-ai/plugin dependency"
else
    echo "✓ package.json already exists"
fi

# Create ast-grep.ts tool
cat > ~/.config/opencode/tool/ast-grep.ts << 'TOOLEOF'
import { tool } from '@opencode-ai/plugin';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const search = tool({
  description: 'Search and analyze code using ast-grep pattern matching',
  args: {
    pattern: tool.schema.string().describe('The ast-grep pattern to search for'),
    file: tool.schema.string().describe('File path to search in').optional(),
    dir: tool.schema.string().describe('Directory to search in').optional(),
    language: tool.schema.string().describe('Programming language').optional(),
    include: tool.schema.string().describe('Include files matching pattern').optional(),
    exclude: tool.schema.string().describe('Exclude files matching pattern').optional(),
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
TOOLEOF
echo "✓ Created ast-grep.ts tool"

# Create ast-grep-pattern.ts tool
cat > ~/.config/opencode/tool/ast-grep-pattern.ts << 'PATTERNEOF'
import { tool } from '@opencode-ai/plugin';

export const ast_grep_pattern = tool({
  description: 'Create and test ast-grep patterns for code analysis',
  args: {
    pattern_type: tool.schema
      .enum(['regex', 'semantic', 'struct'])
      .describe('Type of pattern (regex, semantic, struct)')
      .default('regex'),
    target: tool.schema.string().describe('What to match (e.g., function, class, variable)').optional(),
    language: tool.schema.string().describe('Programming language').optional(),
    example_code: tool.schema.string().describe('Example code to test the pattern against').optional(),
  },
  async execute(args) {
    let patternInfo = '';

    switch (args.pattern_type) {
      case 'regex':
        patternInfo = createRegexPattern(args.target);
        break;
      case 'semantic':
        patternInfo = createSemanticPattern(args.target, args.language);
        break;
      case 'struct':
        patternInfo = createStructPattern(args.target, args.language);
        break;
    }

    if (args.example_code) {
      patternInfo += '\\n\\n---\\n\\nTesting pattern against example code:\\n\\n```\\n' + args.example_code + '\\n```';
    }

    return patternInfo;
  },
});

function createRegexPattern(target?: string): string {
  if (target) {
    return `### Regex Pattern for "${target}"\\n\\n\`\`\`\\n${target}\\n\`\`\`\\n\\n**Usage:**\\n\`\`\`bash\\nast-grep -n '${target}' your_file.ts\\n\`\`\`\\n\\n**Description:** Simple regex pattern matching any occurrence of "${target}"`;
  }
  return '### Regex Pattern\\n\\nRegex patterns use standard regular expressions for matching code.';
}

function createSemanticPattern(target?: string, language?: string): string {
  const langInfo = language ? ` for ${language}` : '';
  const targetInfo = target ? ` for "${target}"` : '';

  return `### Semantic Pattern${langInfo}${targetInfo}\\n\\n\`\`\`\\n${target || 'your_pattern'}\\n\`\`\`\\n\\n**Usage:**\\n\`\`\`bash\\nast-grep -n --lang ${language || 'typescript'} '${target || 'your_pattern'}' your_file.ts\\n\`\`\`\\n\\n**Description:** Semantic patterns understand the AST structure and can match based on syntax rules.`;
}

function createStructPattern(target?: string, language?: string): string {
  const langInfo = language ? ` for ${language}` : '';

  return `### Struct Pattern${langInfo}\\n\\n\`\`\`\\n${target || 'your_struct_pattern'}\\n\`\`\`\\n\\n**Usage:**\\n\`\`\`bash\\nast-grep -n --lang ${language || 'typescript'} '${target || 'your_struct_pattern'}' your_file.ts\\n\`\`\`\\n\\n**Description:** Struct patterns allow matching specific AST node structures with placeholders.`;
}
PATTERNEOF
echo "✓ Created ast-grep-pattern.ts tool"

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Tools installed:"
echo "   - ast-grep-search: Search code using ast-grep patterns"
echo "   - ast-grep_pattern: Create and test ast-grep patterns"
echo ""
echo "💡 Usage examples:"
echo "   - Search for 'useState' in a file: use ast-grep-search with pattern 'useState' and file 'src/index.ts'"
echo "   - Create a regex pattern: use ast-grep_pattern with pattern_type 'regex' and target 'useState'"
echo ""
echo "🔄 Restart OpenCode to use the new tools."
