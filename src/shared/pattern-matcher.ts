// Local type definitions since claude-code-hooks module is not available
type ClaudeHooksConfig = Record<string, any>;

type HookMatcher = {
  matcher: string;
  [key: string]: any;
};

export function matchesToolMatcher(toolName: string, matcher: string): boolean {
  if (!matcher) {
    return true
  }
  const patterns = matcher.split("|").map((p) => p.trim())
  return patterns.some((p) => {
    if (p.includes("*")) {
      const regex = new RegExp(`^${p.replace(/\*/g, ".*")}$`, "i")
      return regex.test(toolName)
    }
    return p.toLowerCase() === toolName.toLowerCase()
  })
}

export function findMatchingHooks(
  config: ClaudeHooksConfig,
  eventName: keyof ClaudeHooksConfig,
  toolName?: string
): HookMatcher[] {
  const hookMatchers = config[eventName]
  if (!hookMatchers) return []

  return hookMatchers.filter((hookMatcher: HookMatcher) => {
    if (!toolName) return true
    return matchesToolMatcher(toolName, hookMatcher.matcher)
  })
}
