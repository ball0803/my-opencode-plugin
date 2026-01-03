// Test file for agent discovery tools
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { BackgroundManager } from '../../../background-agent/manager';
import { createListAgentsTool, createGetAgentInfoTool } from '../tools';

// Mock BackgroundManager
describe('Agent Discovery Tools', () => {
  let manager: BackgroundManager;
  let mockGetAvailableAgents: jest.Mock;
  let mockIsAgentAvailable: jest.Mock;

  beforeEach(() => {
    mockGetAvailableAgents = jest.fn(() => ['agent1', 'agent2', 'agent3']);
    mockIsAgentAvailable = jest.fn((agentName) => ['agent1', 'agent2', 'agent3'].includes(agentName));

    manager = new BackgroundManager();
    manager.getAvailableAgents = mockGetAvailableAgents;
    manager.isAgentAvailable = mockIsAgentAvailable;
  });

  describe('list_agents tool', () => {
    it('should list all available agents', async () => {
      const tool = createListAgentsTool(manager);
      const result = await tool.execute({});

      expect(result).toContain('Available Agents');
      expect(result).toContain('agent1');
      expect(result).toContain('agent2');
      expect(result).toContain('agent3');
    });

    it('should handle no agents available', async () => {
      mockGetAvailableAgents.mockReturnValue([]);
      const tool = createListAgentsTool(manager);
      const result = await tool.execute({});

      expect(result).toContain('No agents available');
    });

    it('should respect include_descriptions option', async () => {
      const tool = createListAgentsTool(manager);
      const resultWithDesc = await tool.execute({ include_descriptions: true });
      const resultWithoutDesc = await tool.execute({ include_descriptions: false });

      expect(resultWithDesc).toContain('Description');
      expect(resultWithoutDesc).toContain('No description available');
    });
  });

  describe('get_agent_info tool', () => {
    it('should return agent information for available agent', async () => {
      const tool = createGetAgentInfoTool(manager);
      const result = await tool.execute({ agent_name: 'agent1' });

      expect(result).toContain('Agent Information');
      expect(result).toContain('agent1');
    });

    it('should return error for unavailable agent', async () => {
      const tool = createGetAgentInfoTool(manager);
      const result = await tool.execute({ agent_name: 'nonexistent' });

      expect(result).toContain('not found');
      expect(result).toContain('Available agents');
    });

    it('should trim agent name', async () => {
      const tool = createGetAgentInfoTool(manager);
      const result = await tool.execute({ agent_name: '  agent1  ' });

      expect(result).toContain('agent1');
    });
  });
});
