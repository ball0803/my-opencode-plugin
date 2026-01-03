import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { createBackgroundTaskTools } from './index';
import { BackgroundManager } from '../../background-agent/manager';

describe('Background Task Tools', () => {
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
    tools = createBackgroundTaskTools(manager);
  });

  describe('background_task tool', () => {
    it('should create a new background task', async () => {
      // given
      const options = {
        options: { agent: 'test-agent', prompt: 'test prompt' }
      };

      // when
      const result = await tools.background_task.execute(options);

      // then
      expect(result.id).toBeDefined();
      expect(result.status).toBe('running');
    });
  });

  describe('background_output tool', () => {
    it('should get output from running task', async () => {
      // given
      const task = await manager.createTask({
        options: { agent: 'test-agent', prompt: 'test' }
      });

      // when
      const output = await tools.background_output.execute({ taskId: task.id });

      // then
      expect(output.status).toBe('running');
      expect(output.taskId).toBe(task.id);
    });

    it('should get output from completed task', async () => {
      // given
      const task = await manager.createTask({
        options: { agent: 'test-agent', prompt: 'test' }
      });
      await manager.completeTask(task.id, { result: 'completed' });

      // when
      const output = await tools.background_output.execute({ taskId: task.id });

      // then
      expect(output.status).toBe('completed');
      expect(output.result).toEqual({ result: 'completed' });
    });
  });

  describe('background_cancel tool', () => {
    it('should cancel a specific task', async () => {
      // given
      const task = await manager.createTask({
        options: { agent: 'test-agent', prompt: 'test' }
      });

      // when
      const result = await tools.background_cancel.execute({ taskId: task.id });

      // then
      expect(result.status).toBe('cancelled');
    });

    it('should cancel all running tasks', async () => {
      // given
      await manager.createTask({ options: { agent: 'test-agent' } });
      await manager.createTask({ options: { agent: 'test-agent' } });

      // when
      const results = await tools.background_cancel.execute({ all: true });

      // then
      expect(results.length).toBe(2);
      expect(results.every((r: any) => r.status === 'cancelled')).toBe(true);
    });
  });
});