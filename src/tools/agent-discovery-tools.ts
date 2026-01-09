import { BackgroundManager } from '../../features/background-agent/manager';

// Default agent descriptions that can be extended via configuration
const DEFAULT_AGENT_DESCRIPTIONS: Record<string, string> = {
  explore:
    'Specialized agent for exploring codebases, finding files, and analyzing code structure.',
  librarian:
    'Specialized agent for documentation tasks, reading files, and providing information.',
  build:
    'Specialized agent for build tasks, running commands, and managing project builds.',
  test: 'Specialized agent for testing tasks, running tests, and analyzing test results.',
  review:
    'Specialized agent for code review tasks, analyzing code quality, and providing feedback.',
  default: 'General-purpose agent for handling various tasks.',
};

export function createListAgentsTool(manager: BackgroundManager) {
  return {
    name: 'list_agents',
    description: 'List all available agents and their descriptions',
    parameters: {
      type: 'object',
      properties: {
        include_descriptions: {
          type: 'boolean',
          description: 'Include agent descriptions in the output',
          default: true,
        },
      },
    },
    async execute(options: {
      include_descriptions?: boolean;
    }): Promise<string> {
      const includeDescriptions = options.include_descriptions !== false;
      const agents = manager.getAvailableAgents();

      if (agents.length === 0) {
        return 'No agents available. Please check your configuration.';
      }

      let output = '# Available Agents\n\n';
      output += '| Agent Name | Description |\n';
      output += '|------------|-------------|\n';

      for (const agent of agents) {
        const description =
          includeDescriptions && DEFAULT_AGENT_DESCRIPTIONS[agent]
            ? DEFAULT_AGENT_DESCRIPTIONS[agent]
            : 'No description available';
        output += `| \`${agent}\` | ${description} |\n`;
      }

      output += '\n---\n';
      output +=
        'Use `get_agent_info` with an agent name to get more details about a specific agent.';

      return output;
    },
  };
}

export function createGetAgentInfoTool(manager: BackgroundManager) {
  return {
    name: 'get_agent_info',
    description: 'Get detailed information about a specific agent',
    parameters: {
      type: 'object',
      properties: {
        agent_name: {
          type: 'string',
          description: 'Name of the agent to get information about',
        },
      },
      required: ['agent_name'],
    },
    async execute(options: { agent_name: string }): Promise<string> {
      const agentName = options.agent_name.trim();

      if (!manager.isAgentAvailable(agentName)) {
        const availableAgents = manager.getAvailableAgents().join(', ');
        return `Agent \`${agentName}\` not found. Available agents: ${availableAgents}`;
      }

      const description =
        DEFAULT_AGENT_DESCRIPTIONS[agentName] || 'No description available';

      return `# Agent Information

 ## Agent Name
 \`${agentName}\`

 ## Description
 ${description}

 ## Capabilities
 - Can process prompts and execute tasks
 - Supports background execution
 - Can be called from other agents

 ## Usage Example

 \`\`\`javascript
 call_agent({
   agent: "${agentName}",
   prompt: "Your task description here",
   background: false
 })
 \`\`\`

 Or for background execution:

 \`\`\`javascript
 subagent({
   description: "Task description",
   prompt: "Your task description here",
   agent: "${agentName}",
   run_in_background: true
 })
 \`\`\``;
    },
  };
}

export function createAgentDiscoveryTools(manager: BackgroundManager) {
  return {
    list_agents: createListAgentsTool(manager),
    get_agent_info: createGetAgentInfoTool(manager),
  };
}

// Add methods to BackgroundManager for agent discovery
declare module '../../background-agent/manager' {
  interface BackgroundManager {
    getAvailableAgents(): string[];
    isAgentAvailable(agentName: string): boolean;
    validateAgent(agentName: string): void;
  }
}

// Extend BackgroundManager with agent discovery methods
BackgroundManager.prototype.getAvailableAgents = function () {
  // Check if config loader is available and use it
  if ((this as any).configLoader) {
    return (this as any).configLoader.getAvailableAgents();
  }

  // Fallback to default agents
  return Object.keys(DEFAULT_AGENT_DESCRIPTIONS);
};

BackgroundManager.prototype.isAgentAvailable = function (agentName: string) {
  const agents = this.getAvailableAgents();
  return agents.includes(agentName);
};

BackgroundManager.prototype.validateAgent = function (agentName: string) {
  if (!this.isAgentAvailable(agentName)) {
    const availableAgents = this.getAvailableAgents().join(', ');
    throw new Error(
      `Agent "${agentName}" not found. Available agents: ${availableAgents}`,
    );
  }
};
