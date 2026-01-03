import type { AgentCallOptions, AgentCallResult, AgentSession, BackgroundManagerOptions, BackgroundTask, BackgroundTaskStatus, CancelOptions, CreateBackgroundTaskOptions, GetBackgroundOutputOptions, GetBackgroundOutputResult, LaunchInput, TaskNotification } from './types';

export class BackgroundManager {
  private tasks: Map<string, BackgroundTask> = new Map();
  private session: AgentSession | null = null;
  private options: BackgroundManagerOptions;
  private isPolling: boolean = false;
  private pollingInterval: any = null;
  private notifications: Map<string, BackgroundTask[]> = new Map();
  private TASK_TTL_MS: number = 30 * 60 * 1000;

  constructor(options: BackgroundManagerOptions = {}) {
    this.options = {
      pollInterval: 2000,
      taskTTL: 30 * 60 * 1000,
      ...options,
    };
    this.TASK_TTL_MS = this.options.taskTTL || 30 * 60 * 1000;
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

    this.pruneStaleTasksAndNotifications();

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

    if (!this.hasRunningTasks()) {
      this.stopPolling();
    }
  }

  private cleanupStaleTasks(): void {
    const now = Date.now();
    for (const [id, task] of this.tasks) {
      if (task.status === 'running' && now - task.startedAt.getTime() > this.TASK_TTL_MS) {
        this.failTask(id, 'Task timed out');
      }
    }
  }

  markForNotification(task: BackgroundTask): void {
    const queue = this.notifications.get(task.parentSessionID) ?? [];
    queue.push(task);
    this.notifications.set(task.parentSessionID, queue);
  }

  getPendingNotifications(sessionID: string): BackgroundTask[] {
    return this.notifications.get(sessionID) ?? [];
  }

  clearNotifications(sessionID: string): void {
    this.notifications.delete(sessionID);
  }

  private clearNotificationsForTask(taskId: string): void {
    for (const [sessionID, tasks] of this.notifications.entries()) {
      const filtered = tasks.filter((t) => t.id !== taskId);
      if (filtered.length === 0) {
        this.notifications.delete(sessionID);
      } else {
        this.notifications.set(sessionID, filtered);
      }
    }
  }

  private formatDuration(start: Date, end?: Date): string {
    const duration = (end ?? new Date()).getTime() - start.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  private hasRunningTasks(): boolean {
    for (const task of this.tasks.values()) {
      if (task.status === 'running') return true;
    }
    return false;
  }

  private pruneStaleTasksAndNotifications(): void {
    const now = Date.now();

    for (const [taskId, task] of this.tasks.entries()) {
      const age = now - task.startedAt.getTime();
      if (age > this.TASK_TTL_MS) {
        console.log('[background-agent] Pruning stale task:', { taskId, age: Math.round(age / 1000) + 's' });
        task.status = 'error';
        task.error = 'Task timed out after 30 minutes';
        task.completedAt = new Date();
        this.clearNotificationsForTask(taskId);
        this.tasks.delete(taskId);
      }
    }

    for (const [sessionID, notifications] of this.notifications.entries()) {
      if (notifications.length === 0) {
        this.notifications.delete(sessionID);
        continue;
      }
      const validNotifications = notifications.filter((task) => {
        const age = now - task.startedAt.getTime();
        return age <= this.TASK_TTL_MS;
      });
      if (validNotifications.length === 0) {
        this.notifications.delete(sessionID);
      } else if (validNotifications.length !== notifications.length) {
        this.notifications.set(sessionID, validNotifications);
      }
    }
  }

  async launch(input: LaunchInput): Promise<BackgroundTask> {
    if (!input.agent || input.agent.trim() === '') {
      throw new Error('Agent parameter is required');
    }

    if (!this.session) {
      throw new Error('BackgroundManager not initialized');
    }

    const task: BackgroundTask = {
      id: `bg_${crypto.randomUUID().slice(0, 8)}`,
      sessionID: input.parentSessionID,
      parentSessionID: input.parentSessionID,
      parentMessageID: input.parentMessageID,
      description: input.description,
      prompt: input.prompt,
      agent: input.agent,
      status: 'running',
      startedAt: new Date(),
      progress: {
        toolCalls: 0,
        lastUpdate: new Date(),
      },
      parentModel: input.parentModel,
    };

    this.tasks.set(task.id, task);
    this.startPolling();

    console.log(`[background-agent] Launching task:`, { taskId: task.id, sessionID: task.sessionID, agent: input.agent });

    await this.executeTask(task);

    return task;
  }

  private async executeTask(task: BackgroundTask): Promise<void> {
    if (!this.session) return;

    try {
      const result = await this.callAgent(task.agent, task.prompt, {
        sessionId: task.sessionID,
      });

      task.status = 'completed';
      task.result = result;
      task.completedAt = new Date();
      task.updatedAt = Date.now();

      this.tasks.set(task.id, task);
      this.markForNotification(task);
      this.notifyParentSession(task);
    } catch (error) {
      task.status = 'error';
      task.error = error instanceof Error ? error.message : String(error);
      task.completedAt = new Date();
      task.updatedAt = Date.now();

      this.tasks.set(task.id, task);
      this.markForNotification(task);
      this.notifyParentSession(task);
    }
  }

  async createTask(options: CreateBackgroundTaskOptions): Promise<BackgroundTask> {
    if (!this.session) {
      throw new Error('BackgroundManager not initialized');
    }

    const task: BackgroundTask = {
      id: options.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionID: options.sessionId || this.session.id,
      parentSessionID: options.sessionId || this.session.id,
      parentMessageID: '0',
      description: 'Legacy task',
      prompt: '',
      agent: 'default',
      status: 'running',
      startedAt: new Date(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      options: options.options || {},
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

  getTask(taskId: string): BackgroundTask | undefined {
    return this.tasks.get(taskId);
  }

  getTasksByParentSession(sessionID: string): BackgroundTask[] {
    const result: BackgroundTask[] = [];
    for (const task of this.tasks.values()) {
      if (task.parentSessionID === sessionID) {
        result.push(task);
      }
    }
    return result;
  }

  getAllDescendantTasks(sessionID: string): BackgroundTask[] {
    const result: BackgroundTask[] = [];
    const directChildren = this.getTasksByParentSession(sessionID);

    for (const child of directChildren) {
      result.push(child);
      const descendants = this.getAllDescendantTasks(child.sessionID);
      result.push(...descendants);
    }

    return result;
  }

  findBySession(sessionID: string): BackgroundTask | undefined {
    for (const task of this.tasks.values()) {
      if (task.sessionID === sessionID) {
        return task;
      }
    }
    return undefined;
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

  async getOutput(taskId: string, options: GetBackgroundOutputOptions = { taskId }): Promise<GetBackgroundOutputResult> {
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

  private notifyParentSession(task: BackgroundTask): void {
    const duration = this.formatDuration(task.startedAt, task.completedAt);

    console.log('[background-agent] notifyParentSession called for task:', task.id);

    const message = `[BACKGROUND TASK COMPLETED] Task "${task.description}" finished in ${duration}. Use background_output with task_id="${task.id}" to get results.`;

    console.log('[background-agent] Sending notification to parent session:', { parentSessionID: task.parentSessionID });

    const taskId = task.id;
    setTimeout(async () => {
      try {
        await this.session?.sendMessage({
          type: 'task_completion',
          taskId: task.id,
          status: task.status,
          timestamp: Date.now(),
          message: message,
        });
        console.log('[background-agent] Successfully sent notification to parent session:', { parentSessionID: task.parentSessionID });
      } catch (error) {
        console.error('[background-agent] Failed to send notification:', String(error));
      } finally {
        this.clearNotificationsForTask(taskId);
        this.tasks.delete(taskId);
        console.log('[background-agent] Removed completed task from memory:', taskId);
      }
    }, 200);
  }

  async cleanup(): Promise<void> {
    this.stopPolling();
    this.tasks.clear();
    this.notifications.clear();
  }

  // Mock method for testing - in real implementation this would call an agent
  async callAgent(agent: string, prompt: string, options?: any): Promise<any> {
    // This is a mock implementation for testing
    // In a real implementation, this would call an actual agent
    return `Response from ${agent} for prompt: ${prompt}`;
  }
}
