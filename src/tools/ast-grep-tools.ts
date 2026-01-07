import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function createAstGrepTool() {
  return {
    name: 'ast_grep',
    description:
      'Search and analyze code using ast-grep pattern matching. Requires ast-grep to be installed globally (npm install -g ast-grep).',
    parameters: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description:
            'The ast-grep pattern to search for (supports regex and semantic patterns)',
        },
        file: {
          type: 'string',
          description: 'File path to search in (supports glob patterns)',
        },
        dir: {
          type: 'string',
          description: 'Directory to search in (default: current directory)',
        },
        language: {
          type: 'string',
          description:
            'Programming language (e.g., typescript, javascript, python, rust)',
        },
        include: {
          type: 'string',
          description: 'Include files matching this pattern',
        },
        exclude: {
          type: 'string',
          description: 'Exclude files matching this pattern',
        },
        max_results: {
          type: 'number',
          description: 'Maximum number of results to return',
          default: 50,
        },
        show_context: {
          type: 'boolean',
          description: 'Show context around matches',
          default: true,
        },
        json_output: {
          type: 'boolean',
          description: 'Return results in JSON format',
          default: true,
        },
      },
      required: ['pattern'],
    },
    async execute(options: {
      pattern: string;
      file?: string;
      dir?: string;
      language?: string;
      include?: string;
      exclude?: string;
      max_results?: number;
      show_context?: boolean;
      json_output?: boolean;
    }): Promise<string> {
      try {
        // Check if ast-grep is installed
        try {
          await execAsync('ast-grep --version');
        } catch (error) {
          throw new Error(
            'ast-grep is not installed. Please install it globally with: npm install -g ast-grep',
          );
        }

        // Build the command
        const args = [];

        // Check if ast-grep supports advanced flags
        const versionOutput = await execAsync('ast-grep --version');
        const supportsJson =
          versionOutput.stdout.includes('0.2') ||
          versionOutput.stdout.includes('0.3');
        const isBasicVersion = versionOutput.stdout === '0.1.0';

        // Use -a flag for basic version
        if (isBasicVersion) {
          args.push('-a');
        }

        if (options.json_output && supportsJson) {
          args.push('--json');
        }

        if (options.language && supportsJson) {
          args.push('--lang', options.language);
        }

        if (options.include) {
          args.push('--include', options.include);
        }

        if (options.exclude) {
          args.push('--exclude', options.exclude);
        }

        if (options.file) {
          args.push(options.file);
        } else if (options.dir) {
          args.push(options.dir);
        } else {
          args.push('.');
        }

        args.push(options.pattern);

        const { stdout, stderr } = await execAsync(
          `ast-grep ${args.map((arg) => (arg.includes(' ') || arg.includes('(') || arg.includes(')') ? `'${arg}'` : arg)).join(' ')}`,
        );

        if (stderr && !stderr.includes('no files matched input pattern(s)')) {
          throw new Error(`Error executing ast-grep: ${stderr}`);
        }

        return stdout.trim() || 'No matches found';
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ast-grep is not installed')
        ) {
          throw error;
        }
        throw new Error(
          `Error executing ast-grep: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    },
  };
}

export function createAstGrepPatternTool() {
  return {
    name: 'ast_grep_pattern',
    description: 'Create and test ast-grep patterns for code analysis',
    parameters: {
      type: 'object',
      properties: {
        pattern_type: {
          type: 'string',
          description: 'Type of pattern (regex, semantic, struct)',
          enum: ['regex', 'semantic', 'struct'],
          default: 'regex',
        },
        target: {
          type: 'string',
          description: 'What to match (e.g., function, class, variable)',
        },
        language: {
          type: 'string',
          description: 'Programming language',
        },
        example_code: {
          type: 'string',
          description: 'Example code to test the pattern against',
        },
      },
      required: ['pattern_type'],
    },
    async execute(options: {
      pattern_type: 'regex' | 'semantic' | 'struct';
      target?: string;
      language?: string;
      example_code?: string;
    }): Promise<string> {
      try {
        let patternInfo = '';

        switch (options.pattern_type) {
          case 'regex':
            patternInfo = this.createRegexPattern(options.target);
            break;
          case 'semantic':
            patternInfo = this.createSemanticPattern(
              options.target,
              options.language,
            );
            break;
          case 'struct':
            patternInfo = this.createStructPattern(
              options.target,
              options.language,
            );
            break;
        }

        if (options.example_code) {
          patternInfo +=
            '\n\n---\n\nTesting pattern against example code:\n\n```\n' +
            options.example_code +
            '\n```';
        }

        return patternInfo;
      } catch (error) {
        return `Error creating pattern: ${error instanceof Error ? error.message : String(error)}`;
      }
    },

    createRegexPattern(target?: string): string {
      if (target) {
        return `### Regex Pattern for "${target}"\n\n\`\`\`\n${target}\n\`\`\`\n\n**Usage:**\n\`\`\`bash\nast-grep -n '${target}' your_file.ts\n\`\`\`\n\n**Description:** Simple regex pattern matching any occurrence of "${target}"`;
      }
      return '### Regex Pattern\n\nRegex patterns use standard regular expressions for matching code.';
    },

    createSemanticPattern(target?: string, language?: string): string {
      const langInfo = language ? ` for ${language}` : '';
      const targetInfo = target ? ` for "${target}"` : '';

      return `### Semantic Pattern${langInfo}${targetInfo}\n\n\`\`\`\n${target || 'your_pattern'}\n\`\`\`\n\n**Usage:**\n\`\`\`bash\nast-grep -n --lang ${language || 'typescript'} '${target || 'your_pattern'}' your_file.ts\n\`\`\`\n\n**Description:** Semantic patterns understand the AST structure and can match based on syntax rules.`;
    },

    createStructPattern(target?: string, language?: string): string {
      const langInfo = language ? ` for ${language}` : '';

      return `### Struct Pattern${langInfo}\n\n\`\`\`\n${target || 'your_struct_pattern'}\n\`\`\`\n\n**Usage:**\n\`\`\`bash\nast-grep -n --lang ${language || 'typescript'} '${target || 'your_struct_pattern'}' your_file.ts\n\`\`\`\n\n**Description:** Struct patterns allow matching specific AST node structures with placeholders.`;
    },
  };
}

export function createAstGrepTools() {
  return {
    ast_grep: createAstGrepTool(),
    ast_grep_pattern: createAstGrepPatternTool(),
  };
}
