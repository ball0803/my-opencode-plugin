import type { PluginInput } from '@opencode-ai/plugin';

interface KeywordDetectorConfig {
  keywords?: string[];
  action?: (keyword: string, sessionID: string) => Promise<void> | void;
}

export function createKeywordDetectorHook(
  ctx: PluginInput,
  config: KeywordDetectorConfig = {},
) {
  const { keywords = [], action } = config;

  return {
    'tool.execute.after': async (
      input: { tool: string; sessionID: string },
      output: { result: string | undefined },
    ) => {
      if (!output.result || typeof output.result !== 'string') return;

      const result = output.result;
      const foundKeywords = keywords.filter((keyword) =>
        result.toLowerCase().includes(keyword.toLowerCase()),
      );

      if (foundKeywords.length > 0 && action) {
        for (const keyword of foundKeywords) {
          await action(keyword, input.sessionID);
        }
      }
    },
  };
}
