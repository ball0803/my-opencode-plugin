// Test file for subagent tools
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { BackgroundManager } from '../../../background-agent/manager';
import { createSubagentTools } from '../tools';

describe('Subagent Tools', () => {
  let manager: BackgroundManager;
  let mockCallAgent: jest.Mock;
  let mockValidateAgent: jest.Mock;

  beforeEach(() => {
    mockCallAgent = jest.fn().mockResolvedValue('test result');
    mockValidateAgent = jest.fn();
    manager = new BackgroundManager();
    manager.callAgent = mockCallAgent;
    manager.validateAgent = mockValidateAgent;
  });

  describe('subagent tool', () => {
    it('should call agent with provided parameters', async () => {
      const tools = createSubagentTools(manager);
      const tool = tools.subagent;

      const result = await tool.execute({
        description: 'Test task',
        prompt: 'Test prompt',
        agent: 'test-agent',
        run_in_background: false,
      });

      expect(mockValidateAgent).toHaveBeenCalledWith('test-agent');
      expect(mockCallAgent).toHaveBeenCalledWith(
        'test-agent',
        'Test prompt',
        {}
      );
      expect(result).toContain('test result');
    });

    it('should validate agent before calling', async () => {
      const tools = createSubagentTools(manager);
      const tool = tools.subagent;

      await tool.execute({
        description: 'Test task',
        prompt: 'Test prompt',
        agent: 'test-agent',
        run_in_background: false,
      });

      expect(mockValidateAgent).toHaveBeenCalledWith('test-agent');
    });

    it('should use default agent if not specified', async () => {
      const tools = createSubagentTools(manager);
      const tool = tools.subagent;

      await tool.execute({
        description: 'Test task',
        prompt: 'Test prompt',
        agent: 'default',
        run_in_background: false,
      });

      expect(mockValidateAgent).toHaveBeenCalledWith('default');
      expect(mockCallAgent).toHaveBeenCalledWith(
        'default',
        'Test prompt',
        {}
      );
    });
  });
});
