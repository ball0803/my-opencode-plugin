import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { BackgroundManager } from './manager';

describe('BackgroundManager', () => {
  let manager: BackgroundManager;
  let mockSession: any;

  beforeEach(() => {
    mockSession = {
      id: 'test-session',
      getStatus: jest.fn().mockResolvedValue('running'),
      sendMessage: jest.fn().mockResolvedValue(undefined),
    };
    manager = new BackgroundManager({ pollInterval: 100, taskTTL: 1000 });
    manager.initialize(mockSession);
  });

  afterEach(async () => {
    await manager.cleanup();
  });

  describe('createTask', () => {
    it('should create a task with auto-generated ID', async () => {
      // given
      const options = { options: { agent: 'test-agent', prompt: 'test' } };

      // when
      const task = await manager.createTask(options);

      // then
      expect(task.id).toBeDefined();
      expect(task.status).toBe('running');
      expect(task.createdAt).toBeDefined();
      expect(task.options).toEqual(options.options);
    });

    it('should create a task with custom ID', async () => {
      // given
      const customId = 'custom-task-id';
      const options = { id: customId, options: { agent: 'test-agent' } };

      // when
      const task = await manager.createTask(options);

      // then
      expect(task.id).toBe(customId);
    });
  });

  describe('task lifecycle', () => {
    it('should transition task to completed', async () => {
      // given
      const task = await manager.createTask({ options: { agent: 'test' } });

      // when
      const completedTask = await manager.completeTask(task.id, { result: 'done' });

      // then
      expect(completedTask.status).toBe('completed');
      expect(completedTask.result).toEqual({ result: 'done' });
    });

    it('should transition task to error state', async () => {
      // given
      const task = await manager.createTask({ options: { agent: 'test' } });
      const error = new Error('Test error');

      // when
      const failedTask = await manager.failTask(task.id, error);

      // then
      expect(failedTask.status).toBe('error');
      expect(failedTask.error).toBe('Test error');
    });

    it('should cancel a running task', async () => {
      // given
      const task = await manager.createTask({ options: { agent: 'test' } });

      // when
      const cancelledTask = await manager.cancelTask(task.id);

      // then
      expect(cancelledTask.status).toBe('cancelled');
    });
  });

  describe('task polling', () => {
    it('should detect completed session', async () => {
      // given
      const task = await manager.createTask({ options: { agent: 'test' } });
      mockSession.getStatus.mockResolvedValueOnce('completed');

      // when
      await manager.pollTasks();

      // then
      const updatedTask = await manager.getTask(task.id);
      expect(updatedTask?.status).toBe('completed');
    });
  });

  describe('task cleanup', () => {
    it('should fail tasks that exceed TTL', async () => {
      // given
      jest.useFakeTimers();
      const task = await manager.createTask({ options: { agent: 'test' } });

      // when
      jest.advanceTimersByTime(1001); // Advance past TTL
      await manager.cleanupStaleTasks();

      // then
      const updatedTask = await manager.getTask(task.id);
      expect(updatedTask?.status).toBe('error');
      expect(updatedTask?.error).toContain('timed out');
      jest.useRealTimers();
    });
  });
});