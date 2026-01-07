import type { PluginInput } from '@opencode-ai/plugin';
import type { RalphLoopOptions } from './types.ts';
import {
  getActiveLoop,
  setActiveLoop,
  deleteActiveLoop,
  clearAllLoops,
} from './storage.ts';

export function createRalphLoopHook(
  ctx: PluginInput,
  options: RalphLoopOptions = {},
) {
  const { config } = options;

  function startLoop(
    sessionID: string,
    prompt: string,
    loopConfig: RalphLoopOptions['config'] = {},
  ) {
    const state = {
      sessionID,
      prompt,
      maxIterations: loopConfig.maxIterations,
      completionPromise: loopConfig.completionPromise,
      iterationCount: 0,
      startedAt: Date.now(),
    };
    setActiveLoop(state);
  }

  function cancelLoop(sessionID: string) {
    deleteActiveLoop(sessionID);
  }

  async function checkCompletion(
    sessionID: string,
    output: string,
  ): Promise<boolean> {
    const loop = getActiveLoop(sessionID);
    if (!loop) return false;

    if (loop.completionPromise) {
      try {
        const regex = new RegExp(loop.completionPromise);
        return regex.test(output);
      } catch {
        return false;
      }
    }

    return false;
  }

  return {
    startLoop,
    cancelLoop,
    event: async ({
      event,
    }: {
      event: { type: string; properties?: unknown };
    }) => {
      if (event.type === 'session.deleted') {
        const props = event.properties as
          | { info?: { id?: string } }
          | undefined;
        if (props?.info?.id) {
          deleteActiveLoop(props.info.id);
        }
      }
    },
    'tool.execute.after': async (
      input: { sessionID: string },
      output: { result: string | undefined },
    ) => {
      const loop = getActiveLoop(input.sessionID);
      if (!loop) return;

      const result = output.result as string | undefined;
      if (!result) return;

      loop.iterationCount++;

      const isComplete = await checkCompletion(input.sessionID, result);
      if (isComplete) {
        deleteActiveLoop(input.sessionID);
        return;
      }

      if (loop.maxIterations && loop.iterationCount >= loop.maxIterations) {
        deleteActiveLoop(input.sessionID);
        await ctx.client.session
          .message({
            path: { id: input.sessionID, messageID: crypto.randomUUID() },
            body: {
              parts: [
                {
                  type: 'text',
                  text: `Ralph Loop completed after ${loop.iterationCount} iterations.`,
                },
              ],
            },
          })
          .catch(() => {});
        return;
      }

      await ctx.client.session
        .prompt({
          path: { id: input.sessionID },
          body: {
            parts: [
              {
                type: 'text',
                text: `Continuing Ralph Loop (iteration ${loop.iterationCount}). Prompt: ${loop.prompt}`,
              },
            ],
          },
        })
        .catch(() => {});
    },
  };
}
