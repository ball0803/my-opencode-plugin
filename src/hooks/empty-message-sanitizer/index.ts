import type { MessagesTransformHook } from '../../types.ts';
import type { Message, Part } from '@opencode-ai/sdk';

type MessageWithParts = {
  info: Message;
  parts: Part[];
};

type TransformOutput = {
  messages: MessageWithParts[];
};

export function createEmptyMessageSanitizerHook(): MessagesTransformHook {
  return {
    'experimental.chat.messages.transform': async (input: Record<string, never>, output: TransformOutput) => {
      output.messages = output.messages.filter((message) => {
        if (message.info.role === 'user' && message.parts) {
          const hasContent = message.parts.some((part) => {
            if (part.type === 'text' && typeof part.text === 'string') {
              return part.text.trim().length > 0;
            }
            return true;
          });
          return hasContent;
        }
        return true;
      });
    },
  };
}
