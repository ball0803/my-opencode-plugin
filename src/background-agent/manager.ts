import type { Agent, AgentCallOptions, AgentCallResult, AgentSession, AgentSessionStatus, AgentTask, AgentTaskStatus, BackgroundManagerOptions, BackgroundTask, BackgroundTaskOptions, BackgroundTaskResult, BackgroundTaskStatus, CancelOptions, CreateBackgroundTaskOptions, GetBackgroundOutputOptions, GetBackgroundOutputResult, TaskNotification } from './types';

export class BackgroundManager {
  private tasks: Map<string, BackgroundTask> = new Map();
  private session: AgentSession | null = null;
  private options: BackgroundManagerOptions;
  private isPolling: boolean = false;
  private pollingInterval: NodeJS.Timeout | null = null;

  constructor(options: BackgroundManagerOptions = {}) {
    this.options = {
      pollInterval: 2000,
      taskTTL: 30 * 60 * 1000,
      ...options,
    };
  }

  async initialize(session: AgentSession): Promise<void> {
    this.session = session;
    this.startPolling();
  }

  private startPolling(): void {
    if (this.isPolling || !this.session) return;

    this.isPolling = true;
    this.pollingInterval = setInterval(() => {
      this.pollTasks();
    }, this.options.pollInterval);
  }

  private stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
  }

  private async pollTasks(): Promise<void> {
    if (!this.session) return;

    const activeTasks = Array.from(this.tasks.values()).filter(
      (task) => task.status === 'running'
    );

    for (const task of activeTasks) {
      try {
        const sessionStatus = await this.session.getStatus();
        
        if (sessionStatus === 'completed') {
          await this.completeTask(task.id);
        } else if (sessionStatus === 'error') {
          await this.failTask(task.id, 'Session error');
        } else if (sessionStatus === 'cancelled') {
          await this.cancelTask(task.id);
        }
      } catch (error) {
        console.error(`Error polling task ${task.id}:`, error);
      }
    }

    this.cleanupStaleTasks();
  }

  private cleanupStaleTasks(): void {
    const now = Date.now();
    for (const [id, task] of this.tasks) {
      if (task.status === 'running' && now - task.createdAt > this.options.taskTTL) {
        this.failTask(id, 'Task timed out');
      }
    }
  }

  async createTask(options: CreateBackgroundTaskOptions): Promise<BackgroundTask> {
    if (!this.session) {
      throw new Error('BackgroundManager not initialized');
    }

    const task: BackgroundTask = {
      id: options.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'running',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      options: options.options || {},
      sessionId: options.sessionId || this.session.id,
    };

    this.tasks.set(task.id, task);
    return task;
  }

  async completeTask(taskId: string, result?: any): Promise<BackgroundTask> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    task.status = 'completed';
    task.result = result;
    task.updatedAt = Date.now();

    this.tasks.set(taskId, task);
    this.notifyTaskCompletion(task);
    return task;
  }

  async failTask(taskId: string, error: string | Error): Promise<BackgroundTask> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    task.status = 'error';
    task.error = error instanceof Error ? error.message : error;
    task.updatedAt = Date.now();

    this.tasks.set(taskId, task);
    this.notifyTaskCompletion(task);
    return task;
  }

  async cancelTask(taskId: string, options: CancelOptions = {}): Promise<BackgroundTask> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    task.status = 'cancelled';
    task.updatedAt = Date.now();

    this.tasks.set(taskId, task);
    this.notifyTaskCompletion(task);
    return task;
  }

  async getTask(taskId: string): Promise<BackgroundTask | null> {
    return this.tasks.get(taskId) || null;
  }

  async getAllTasks(status?: BackgroundTaskStatus): Promise<BackgroundTask[]> {
    if (status) {
      return Array.from(this.tasks.values()).filter((task) => task.status === status);
    }
    return Array.from(this.tasks.values());
  }

  async cancelAllTasks(options: CancelOptions = {}): Promise<BackgroundTask[]> {
    const tasks = Array.from(this.tasks.values()).filter(
      (task) => task.status === 'running'
    );

    const results = await Promise.all(
      tasks.map((task) => this.cancelTask(task.id, options))
    );

    return results;
  }

  async getOutput(taskId: string, options: GetBackgroundOutputOptions = {}): Promise<GetBackgroundOutputResult> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    if (task.status === 'running') {
      return {
        status: 'running',
        output: task.output || '',
        taskId,
      };
    }

    if (task.status === 'completed') {
      return {
        status: 'completed',
        output: task.output || '',
        result: task.result,
        taskId,
      };
    }

    if (task.status === 'error') {
      return {
        status: 'error',
        error: task.error,
        taskId,
      };
    }

    return {
      status: 'cancelled',
      taskId,
    };
  }

  private async notifyTaskCompletion(task: BackgroundTask): Promise<void> {
    if (!this.session) return;

    const notification: TaskNotification = {
      type: 'task_completion',
      taskId: task.id,
      status: task.status,
      timestamp: Date.now(),
    };

    try {
      await this.session.sendMessage(notification);
    } catch (error) {
      console.error('Failed to send task completion notification:', error);
    }
  }

  async cleanup(): Promise<void> {
    this.stopPolling();
    this.tasks.clear();
  }
}