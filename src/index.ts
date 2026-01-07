import type { Plugin } from '@opencode-ai/plugin';
import type { HookName } from './config/schema.js';
import { getMainSessionID, setMainSession, log } from "./shared.js.ts";

import { BackgroundManager } from './background-agent/manager.js';
import type { BackgroundManagerOptions } from './core/types.js';

import { createBackgroundTaskTools } from './tools/background-task/index.js';
import { createCallAgentTools } from './tools/call-agent/index.js';
import { createSubagentTools } from './tools/subagent/index.js';
import { createAgentDiscoveryTools } from './tools/agent-discovery/index.js';
import { createAstGrepTools } from './tools/ast-grep/index.js';

import { createConfigHandler } from './plugin-handlers/config-handler.js';
import {
  createAutoSlashCommandHook,
  createBackgroundNotificationHook,
  createCommentCheckerHooks,
  createCompactionContextInjector,
  createDirectoryAgentsInjectorHook,
  createDirectoryReadmeInjectorHook,
  createEditErrorRecoveryHook,
  createEmptyMessageSanitizerHook,
  createEmptyTaskResponseDetectorHook,
  createInteractiveBashSessionHook,
  createKeywordDetectorHook,
  createRalphLoopHook,
  createRulesInjectorHook,
  createSessionNotificationHook,
  createThinkingModeHook,
  createToolOutputTruncatorHook,
} from './hooks/index.js';

import { loadPluginConfig } from "./plugin-config.js.ts";
import type { OhMyOpenCodeConfig } from './config/schema.js';
import type { AgentSession } from './background-agent/types.js';

const MyOpenCodePlugin: Plugin = async (ctx) => {
  const pluginConfig = loadPluginConfig(ctx.directory, ctx);
  const disabledHooks = new Set(pluginConfig.disabled_hooks ?? []);
  const isHookEnabled = (hookName: HookName) => !disabledHooks.has(hookName);

  const autoSlashCommandHook = isHookEnabled('auto-slash-command')
    ? createAutoSlashCommandHook(ctx)
    : null;
  const backgroundNotificationHook = isHookEnabled('background-notification')
    ? createBackgroundNotificationHook(ctx)
    : null;
  const commentCheckerHook = isHookEnabled('comment-checker')
    ? createCommentCheckerHooks(ctx)
    : null;
  const compactionContextInjectorHook = isHookEnabled(
    'compaction-context-injector',
  )
    ? createCompactionContextInjector(ctx)
    : null;
  const directoryAgentsInjectorHook = isHookEnabled('directory-agents-injector')
    ? createDirectoryAgentsInjectorHook(ctx)
    : null;
  const directoryReadmeInjectorHook = isHookEnabled('directory-readme-injector')
    ? createDirectoryReadmeInjectorHook(ctx)
    : null;
  const editErrorRecoveryHook = isHookEnabled('edit-error-recovery')
    ? createEditErrorRecoveryHook(ctx)
    : null;
  const emptyMessageSanitizerHook = isHookEnabled('empty-message-sanitizer')
    ? createEmptyMessageSanitizerHook(ctx)
    : null;
  const emptyTaskResponseDetectorHook = isHookEnabled(
    'empty-task-response-detector',
  )
    ? createEmptyTaskResponseDetectorHook(ctx)
    : null;
  const interactiveBashSessionHook = isHookEnabled('interactive-bash-session')
    ? createInteractiveBashSessionHook(ctx)
    : null;
  const keywordDetectorHook = isHookEnabled('keyword-detector')
    ? createKeywordDetectorHook(ctx)
    : null;
  const ralphLoopHook = isHookEnabled('ralph-loop')
    ? createRalphLoopHook(ctx)
    : null;
  const rulesInjectorHook = isHookEnabled('rules-injector')
    ? createRulesInjectorHook(ctx)
    : null;
  const sessionNotificationHook = isHookEnabled('session-notification')
    ? createSessionNotificationHook(ctx)
    : null;
  const thinkingModeHook = isHookEnabled('thinking-mode')
    ? createThinkingModeHook(ctx)
    : null;
  const toolOutputTruncatorHook = isHookEnabled('tool-output-truncator')
    ? createToolOutputTruncatorHook(ctx)
    : null;

  return {
    tool: {},
    event: async (input) => {
      await backgroundNotificationHook?.event(input);
      await sessionNotificationHook?.event(input);
      await directoryAgentsInjectorHook?.event(input);
      await directoryReadmeInjectorHook?.event(input);
      await rulesInjectorHook?.event(input);
      await thinkingModeHook?.event(input);
      await interactiveBashSessionHook?.event(input);
      await ralphLoopHook?.event(input);

      const { event } = input;
      const props = event.properties as Record<string, unknown> | undefined;

      if (event.type === 'session.created') {
        const sessionInfo = props?.info as
          | { id?: string; title?: string; parentID?: string }
          | undefined;
        if (!sessionInfo?.parentID) {
          setMainSession(sessionInfo?.id);
        }
      }

      if (event.type === 'session.deleted') {
        const sessionInfo = props?.info as { id?: string } | undefined;
        if (sessionInfo?.id === getMainSessionID()) {
          setMainSession(undefined);
        }
      }

      if (event.type === 'session.error') {
        const sessionID = props?.sessionID as string | undefined;
        const error = props?.error;

        if (sessionID && sessionID === getMainSessionID()) {
          await ctx.client.session
            .prompt({
              path: { id: sessionID },
              body: { parts: [{ type: 'text', text: 'continue' }] },
              query: { directory: ctx.directory },
            })
            .catch(() => {});
        }
      }
    },
    'chat.message': async (input, output) => {
      await keywordDetectorHook?.['chat.message']?.(input, output);
      await compactionContextInjectorHook?.['chat.message']?.(input, output);
      await autoSlashCommandHook?.['chat.message']?.(input, output);

      if (ralphLoopHook) {
        const parts = (
          output as { parts?: Array<{ type: string; text?: string }> }
        ).parts;
        const promptText =
          parts
            ?.filter((p) => p.type === 'text' && p.text)
            .map((p) => p.text)
            .join('\n')
            .trim() || '';

        const isRalphLoopTemplate =
          promptText.includes('You are starting a Ralph Loop') &&
          promptText.includes('<user-task>');
        const isCancelRalphTemplate = promptText.includes(
          'Cancel the currently active Ralph Loop',
        );

        if (isRalphLoopTemplate) {
          const taskMatch = promptText.match(
            /<user-task>\s*([\s\S]*?)\s*<\/user-task>/i,
          );
          const rawTask = taskMatch?.[1]?.trim() || '';

          const quotedMatch = rawTask.match(/^["](.+?)["]/);
          const prompt =
            quotedMatch?.[1] ||
            rawTask.split(/\s+--/)[0]?.trim() ||
            'Complete the task as instructed';

          const maxIterMatch = rawTask.match(/--max-iterations=(\d+)/i);
          const promiseMatch = rawTask.match(
            /--completion-promise=["]?([^"'\s]+)["]?/i,
          );

          log('[ralph-loop] Starting loop from chat.message', {
            sessionID: input.sessionID,
            prompt,
          });
          ralphLoopHook.startLoop(input.sessionID, prompt, {
            maxIterations: maxIterMatch
              ? parseInt(maxIterMatch[1], 10)
              : undefined,
            completionPromise: promiseMatch?.[1],
          });
        } else if (isCancelRalphTemplate) {
          log('[ralph-loop] Cancelling loop from chat.message', {
            sessionID: input.sessionID,
          });
          ralphLoopHook.cancelLoop(input.sessionID);
        }
      }
    },
    'tool.execute.before': async (input, output) => {
      await directoryAgentsInjectorHook?.['tool.execute.before']?.(
        input,
        output,
      );
      await directoryReadmeInjectorHook?.['tool.execute.before']?.(
        input,
        output,
      );
      await rulesInjectorHook?.['tool.execute.before']?.(input, output);

      if (input.tool === 'task') {
        const args = output.args as Record<string, unknown>;
        const subagentType = args.subagent_type as string;
        const isExploreOrLibrarian = ['explore', 'librarian'].includes(
          subagentType,
        );

        args.tools = {
          ...(args.tools as Record<string, boolean> | undefined),
          background_task: false,
          ...(isExploreOrLibrarian ? { call_omo_agent: false } : {}),
        };
      }

      if (ralphLoopHook && input.tool === 'slashcommand') {
        const args = output.args as { command?: string } | undefined;
        const command = args?.command?.replace(/^\//, '').toLowerCase();
        const sessionID = input.sessionID || getMainSessionID();

        if (command === 'ralph-loop' && sessionID) {
          const rawArgs =
            args?.command?.replace(/^\/?(ralph-loop)\s*/i, '') || '';
          const taskMatch = rawArgs.match(/^["](.+?)["]/);
          const prompt =
            taskMatch?.[1] ||
            rawArgs.split(/\s+--/)[0]?.trim() ||
            'Complete the task as instructed';

          const maxIterMatch = rawArgs.match(/--max-iterations=(\d+)/i);
          const promiseMatch = rawArgs.match(
            /--completion-promise=["]?([^"'\s]+)["]?/i,
          );

          ralphLoopHook.startLoop(sessionID, prompt, {
            maxIterations: maxIterMatch
              ? parseInt(maxIterMatch[1], 10)
              : undefined,
            completionPromise: promiseMatch?.[1],
          });
        } else if (command === 'cancel-ralph' && sessionID) {
          ralphLoopHook.cancelLoop(sessionID);
        }
      }
    },
    'tool.execute.after': async (input, output) => {
      await toolOutputTruncatorHook?.['tool.execute.after'](input, output);
      await commentCheckerHook?.['tool.execute.after'](input, output);
      await directoryAgentsInjectorHook?.['tool.execute.after'](input, output);
      await directoryReadmeInjectorHook?.['tool.execute.after'](input, output);
      await rulesInjectorHook?.['tool.execute.after'](input, output);
      await emptyTaskResponseDetectorHook?.['tool.execute.after'](
        input,
        output,
      );
      await interactiveBashSessionHook?.['tool.execute.after'](input, output);
      await editErrorRecoveryHook?.['tool.execute.after'](input, output);
    },
  };
};
export default MyOpenCodePlugin;
