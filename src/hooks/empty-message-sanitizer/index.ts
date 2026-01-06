import type { MessagesTransformHook } from "@opencode-ai/plugin"

export function createEmptyMessageSanitizerHook(): MessagesTransformHook {
  return {
    transform: (messages) => {
      return messages.filter((message) => {
        if (message.role === "user" && message.parts) {
          const hasContent = message.parts.some((part) => {
            if (part.type === "text" && typeof part.text === "string") {
              return part.text.trim().length > 0
            }
            return true
          })
          return hasContent
        }
        return true
      })
    },
  }
}
