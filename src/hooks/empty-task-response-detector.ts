import type { PluginInput } from '@opencode-ai/plugin';

export function createEmptyTaskResponseDetectorHook(ctx: PluginInput) {
  return {
    'tool.execute.after': async (
      input: { tool: string; sessionID: string; callID: string },
      output: { title: string; output: string; metadata: any },
    ) => {
      if (input.tool !== 'task') return;

      const result = output.output as string | undefined;
      if (!result || result.trim() === '') {
        await ctx.client.session
          .prompt({
            path: { id: input.sessionID },
            body: {
              parts: [
                {
                  type: 'text',
                  text: `Task completed but produced no output. Please verify the task was successful or try a different approach.`,
                },
              ],
            },
          })
          .catch(() => {});
      }
    },
  };
}
