import { Command } from 'commander';
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = process.cwd();

interface McpServer {
  name: string;
  type: string;
  command: string;
  args: string[];
  disabled?: boolean;
}

class McpCommand {
  private configPath: string;
  private helperScript: string;
  private installScript: string;

  constructor() {
    this.configPath = join(
      process.env.HOME || '',
      '.config',
      'opencode',
      'opencode.jsonc',
    );
    this.helperScript = join(
      __dirname,
      '..',
      '..',
      '..',
      'scripts',
      'verify',
      'mcp-helper.sh',
    );
    this.installScript = join(
      __dirname,
      '..',
      '..',
      '..',
      'scripts',
      'verify',
      'mcp-install.sh',
    );
  }

  setup() {
    const program = new Command();

    program
      .name('/mcp')
      .description('Configure MCP servers for OpenCode')
      .option('--add <name>', 'Add MCP server')
      .option('--remove <name>', 'Remove MCP server')
      .option('--list', 'List configured MCP servers')
      .option('--status', 'Show MCP server status')
      .option('--verify', 'Verify MCP installation')
      .option('--install <name>', 'Install MCP server')
      .option('--uninstall <name>', 'Uninstall MCP server')
      .action(async (options) => {
        try {
          if (options.add) {
            await this.addServer(options.add);
          } else if (options.remove) {
            await this.removeServer(options.remove);
          } else if (options.list) {
            await this.listServers();
          } else if (options.status) {
            await this.showStatus();
          } else if (options.verify) {
            await this.verifyInstallation();
          } else if (options.install) {
            await this.installServer(options.install);
          } else if (options.uninstall) {
            await this.uninstallServer(options.uninstall);
          } else {
            this.showHelp();
          }
        } catch (error) {
          console.error(
            'Error:',
            error instanceof Error ? error.message : String(error),
          );
          process.exit(1);
        }
      });

    return program;
  }

  private async addServer(name: string) {
    const servers: Record<string, any> = {
      searxng: {
        type: 'local',
        command: ['npx', '-y', 'mcp-searxng'],
        enabled: true,
        environment: {
          SEARXNG_URL: 'http://searxng.internal',
        },
      },
      context7: {
        type: 'local',
        command: ['npx', '-y', '@upstash/context7-mcp'],
        enabled: true,
        environment: {
          CONTEXT_TOKEN_KEY: '{env:CONTEXT_TOKEN_KEY}',
        },
      },
      gh_grep: {
        type: 'remote',
        url: 'https://mcp.grep.app',
      },
      octocode: {
        type: 'local',
        command: ['npx', '-y', 'octocode-mcp@latest'],
        enabled: true,
        environment: {
          GITHUB_TOKEN: '{env:GITHUB_TOKEN_KEY}',
        },
      },
    };

    if (!servers[name]) {
      console.error(`Error: Unknown MCP server '${name}'`);
      console.log('Available servers: searxng, context7, gh_grep, octocode');
      return;
    }

    const serverConfig = JSON.stringify(servers[name]);

    try {
      execSync(`"${this.helperScript}" add ${name} "${serverConfig}"`);
      console.log(`✓ MCP server '${name}' added successfully`);
    } catch (error) {
      console.error('Failed to add MCP server:', error);
      throw error;
    }
  }

  private async removeServer(name: string) {
    try {
      execSync(`"${this.helperScript}" remove ${name}`);
      console.log(`✓ MCP server '${name}' removed successfully`);
    } catch (error) {
      console.error('Failed to remove MCP server:', error);
      throw error;
    }
  }

  private async listServers() {
    try {
      const output = execSync(`"${this.helperScript}" list`).toString();
      console.log(output);
    } catch (error) {
      console.error('Failed to list MCP servers:', error);
      throw error;
    }
  }

  private async showStatus() {
    try {
      const output = execSync(`"${this.installScript}" status`).toString();
      console.log(output);
    } catch (error) {
      console.error('Failed to show status:', error);
      throw error;
    }
  }

  private async verifyInstallation() {
    try {
      const output = execSync(`"${this.installScript}" verify`).toString();
      console.log(output);
    } catch (error) {
      console.error('Failed to verify installation:', error);
      throw error;
    }
  }

  private async installServer(name: string) {
    try {
      execSync(`"${this.installScript}" install ${name}`);
      console.log(`✓ MCP server '${name}' installed successfully`);
    } catch (error) {
      console.error('Failed to install MCP server:', error);
      throw error;
    }
  }

  private async uninstallServer(name: string) {
    try {
      execSync(`"${this.installScript}" uninstall ${name}`);
      console.log(`✓ MCP server '${name}' uninstalled successfully`);
    } catch (error) {
      console.error('Failed to uninstall MCP server:', error);
      throw error;
    }
  }

  private showHelp() {
    console.log('Usage: /mcp [options]');
    console.log('');
    console.log('Options:');
    console.log('  --add <name>         Add MCP server');
    console.log('  --remove <name>      Remove MCP server');
    console.log('  --list               List configured MCP servers');
    console.log('  --status             Show MCP server status');
    console.log('  --verify             Verify MCP installation');
    console.log('  --install <name>     Install MCP server');
    console.log('  --uninstall <name>   Uninstall MCP server');
    console.log('');
    console.log('Available servers: searxng, context7, gh_grep, octocode');
  }
}

export function createMcpCommand() {
  return new McpCommand();
}
