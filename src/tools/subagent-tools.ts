import type { BackgroundTask, LaunchInput } from '../../background-agent/types';
import { BackgroundManager } from '../../background-agent/manager';

export function createSubagentTool(manager: BackgroundManager) {
  return {
    name: 'subagent',
    description: 'Create and manage async subagents for specialized tasks',
    parameters: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Short task description (shown in status)',
        },
        prompt: {
          type: 'string',
          description: 'Full detailed prompt for the agent',
        },
        agent: {
          type: 'string',
          description: 'Agent type to use (any registered agent)',
        },
        run_in_background: {
          type: 'boolean',
          description: 'Run asynchronously (default: true)',
          default: true,
        },
      },
      required: ['description', 'prompt', 'agent'],
    },
    async execute(options: {
      description: string;
      prompt: string;
      agent: string;
      run_in_background?: boolean;
    }): Promise<string> {
      const shouldRunInBackground = options.run_in_background !== false;

      // Validate agent before launching
      manager.validateAgent(options.agent);

      if (!shouldRunInBackground) {
        const result = await manager.callAgent(
          options.agent,
          options.prompt,
          {},
        );
        return `Result: ${result}`;
      }

      const task = await manager.launch({
        description: options.description,
        prompt: options.prompt,
        agent: options.agent,
        parentSessionID: 'main',
        parentMessageID: '0',
      });

      return `Background subagent task launched successfully.

Task ID: ${task.id}
Description: ${task.description}
Agent: ${task.agent}
Status: ${task.status}

The system will notify you when the task completes.
Use \`background_output\` tool with task_id="${task.id}" to check progress.`;
    },
  };
}

export function createSubagentOutputTool(manager: BackgroundManager) {
  return {
    name: 'subagent_output',
    description: 'Get output from a subagent task',
    parameters: {
      type: 'object',
      properties: {
        task_id: {
          type: 'string',
          description: 'Task ID to get output from',
        },
        block: {
          type: 'boolean',
          description: 'Wait for completion (default: false)',
          default: false,
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds to wait for task completion',
          default: 60000,
        },
      },
      required: ['task_id'],
    },
    async execute(options: {
      task_id: string;
      block?: boolean;
      timeout?: number;
    }): Promise<string> {
      const task = manager.getTask(options.task_id);
      if (!task) {
        return `Task not found: ${options.task_id}`;
      }

      const shouldBlock = options.block === true;
      const timeoutMs = options.timeout || 60000;

      if (task.status === 'completed') {
        return this.formatTaskResult(task);
      }

      if (task.status === 'error' || task.status === 'cancelled') {
        return this.formatTaskStatus(task);
      }

      if (!shouldBlock) {
        return this.formatTaskStatus(task);
      }

      const startTime = Date.now();

      while (Date.now() - startTime < timeoutMs) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const currentTask = manager.getTask(options.task_id);
        if (!currentTask) {
          return `Task was deleted: ${options.task_id}`;
        }

        if (currentTask.status === 'completed') {
          return this.formatTaskResult(currentTask);
        }

        if (
          currentTask.status === 'error' ||
          currentTask.status === 'cancelled'
        ) {
          return this.formatTaskStatus(currentTask);
        }
      }

      const finalTask = manager.getTask(options.task_id);
      if (!finalTask) {
        return `Task was deleted: ${options.task_id}`;
      }
      return `Timeout exceeded (${timeoutMs}ms). Task still ${finalTask.status}.\n\n${this.formatTaskStatus(finalTask)}`;
    },

    formatTaskStatus(task: BackgroundTask): string {
      const duration = this.formatDuration(task.startedAt, task.completedAt);
      const promptPreview = this.truncateText(task.prompt, 500);

      let progressSection = '';
      if (task.progress?.lastTool) {
        progressSection = `\n| Last tool | ${task.progress.lastTool} |`;
      }

      let lastMessageSection = '';
      if (task.progress?.lastMessage) {
        const truncated = this.truncateText(task.progress.lastMessage, 500);
        const messageTime = task.progress.lastMessageAt
          ? task.progress.lastMessageAt.toISOString()
          : 'N/A';
        lastMessageSection = `

## Last Message (${messageTime})

\`\`\`
${truncated}
\`\`\``;
      }

      let statusNote = '';
      if (task.status === 'running') {
        statusNote = `

> **Note**: No need to wait explicitly - the system will notify you when this task completes.`;
      } else if (task.status === 'error') {
        statusNote = `

> **Failed**: The task encountered an error. Check the last message for details.`;
      }

      return `# Task Status

| Field | Value |
|-------|-------|
| Task ID | \`${task.id}\` |
| Description | ${task.description} |
| Agent | ${task.agent} |
| Status | **${task.status}** |
| Duration | ${duration} |
| Session ID | \`${task.sessionID}\` |${progressSection}
${statusNote}
## Original Prompt

\`\`\`
${promptPreview}
\`\`\`${lastMessageSection}`;
    },

    formatTaskResult(task: BackgroundTask): string {
      const duration = this.formatDuration(task.startedAt, task.completedAt);

      return `Task Result

Task ID: ${task.id}
Description: ${task.description}
Duration: ${duration}
Session ID: ${task.sessionID}

---

${task.result || '(No result available)'}`;
    },

    formatDuration(start: Date, end?: Date): string {
      const duration = (end ?? new Date()).getTime() - start.getTime();
      const seconds = Math.floor(duration / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
      } else {
        return `${seconds}s`;
      }
    },

    truncateText(text: string, maxLength: number): string {
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + '...';
    },
  };
}

export function createSubagentCancelTool(manager: BackgroundManager) {
  return {
    name: 'subagent_cancel',
    description: 'Cancel a subagent task',
    parameters: {
      type: 'object',
      properties: {
        taskId: {
          type: 'string',
          description: 'Task ID to cancel',
        },
        all: {
          type: 'boolean',
          description: 'Cancel all running subagent tasks',
          default: false,
        },
      },
    },
    async execute(options: {
      taskId?: string;
      all?: boolean;
    }): Promise<string> {
      const cancelAll = options.all === true;

      if (!cancelAll && !options.taskId) {
        return `❌ Invalid arguments: Either provide a taskId or set all=true to cancel all running tasks.`;
      }

      if (cancelAll) {
        const tasks = manager.getAllDescendantTasks('main');
        const runningTasks = tasks.filter(
          (t: { status: string }) => t.status === 'running',
        );

        if (runningTasks.length === 0) {
          return `✅ No running subagent tasks to cancel.`;
        }

        const results: string[] = [];
        for (const task of runningTasks) {
          await manager.cancelTask(task.id, {});
          results.push(`- ${task.id}: ${task.description}`);
        }

        return `✅ Cancelled ${runningTasks.length} subagent task(s):

${results.join('\n')}`;
      }

      const task = manager.getTask(options.taskId!);
      if (!task) {
        return `❌ Task not found: ${options.taskId}`;
      }

      if (task.status !== 'running') {
        return `❌ Cannot cancel task: current status is "${task.status}".
Only running tasks can be cancelled.`;
      }

      await manager.cancelTask(options.taskId!, {});

      return `✅ Subagent task cancelled successfully

Task ID: ${task.id}
Description: ${task.description}
Session ID: ${task.sessionID}
Status: cancelled`;
    },
  };
}

export function createSubagentTools(manager: BackgroundManager) {
  return {
    subagent: createSubagentTool(manager),
    subagent_output: createSubagentOutputTool(manager),
    subagent_cancel: createSubagentCancelTool(manager),
  };
}
