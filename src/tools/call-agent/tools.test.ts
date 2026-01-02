import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { createCallAgentTools } from './index';
import { BackgroundManager } from '../../background-agent/manager';

describe('Call Agent Tools', () => {
  let manager: BackgroundManager;
  let tools: any;

  beforeEach(() => {
    manager = new BackgroundManager();
    const mockSession = {
      id: 'test-session',
      getStatus: jest.fn().mockResolvedValue('running'),
      sendMessage: jest.fn().mockResolvedValue(undefined),
    };
    manager.initialize(mockSession);
    tools = createCallAgentTools(manager);
  });

  describe('call_agent tool', () => {
    it('should call agent in foreground', async () => {
      // given
       const mockCallAgent = jest.fn().mockResolvedValue('agent response');
       manager.callAgent = mockCallAgent as any;

      const options = {
        agent: 'test-agent',
        prompt: 'test prompt',
        background: false
      };

      // when
      const result = await tools.call_agent.execute(options);

      // then
      expect(mockCallAgent).toHaveBeenCalledWith('test-agent', 'test prompt', undefined);
      expect(result.status).toBe('completed');
      expect(result.result).toBe('agent response');
    });

    it('should call agent in background', async () => {
      // given
      const options = {
        agent: 'test-agent',
        prompt: 'test prompt',
        background: true
      };

      // when
      const result = await tools.call_agent.execute(options);

      // then
      expect(result.status).toBe('running');
      expect(result.taskId).toBeDefined();
    });

    it('should handle agent errors', async () => {
      // given
       const mockCallAgent = jest.fn().mockRejectedValue(new Error('Agent error'));
       manager.callAgent = mockCallAgent as any;

      const options = {
        agent: 'test-agent',
        prompt: 'test prompt',
        background: false
      };

      // when
      const result = await tools.call_agent.execute(options);

      // then
      expect(result.status).toBe('error');
      expect(result.error).toBe('Agent error');
    });
  });
});