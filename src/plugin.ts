import type { Plugin } from "@opencode-ai/plugin"
import { BackgroundManager } from './background-agent/manager.ts'
import { createBackgroundTaskTools } from './tools/background-task/index.ts'
import { createCallAgentTools } from './tools/call-agent/index.ts'
import { createSubagentTools } from './tools/subagent/index.ts'
import { createAgentDiscoveryTools } from './tools/agent-discovery/index.ts'
import { createAstGrepTools } from './tools/ast-grep/index.ts'
import { ConfigLoader } from './config/index.ts'
import { createConfigHandler } from './plugin-handlers/config-handler.ts'
import {
  createDirectoryAgentsInjectorHook,
  createDirectoryReadmeInjectorHook,
  createEmptyTaskResponseDetectorHook,
  createEditErrorRecoveryHook,
  createCommentCheckerHooks,
  createRalphLoopHook,
  createToolOutputTruncatorHook,
  createSessionNotificationHook,
  createBackgroundNotificationHook,
  createAutoSlashCommandHook,
  createEmptyMessageSanitizerHook,
  createKeywordDetectorHook,
  createThinkingModeHook,
  createRulesInjectorHook,
  createInteractiveBashSessionHook,
} from './hooks/index.ts'

const MyOpenCodePlugin: Plugin = async (ctx) => {
  const configLoader = new ConfigLoader()
  const config = configLoader.loadConfig()
  
  const backgroundManager = new BackgroundManager({
    taskTTL: config.background?.taskTTL,
    pollInterval: config.background?.pollInterval,
  })
  
  // Initialize hooks
  const directoryAgentsInjector = createDirectoryAgentsInjectorHook(ctx)
  const directoryReadmeInjector = createDirectoryReadmeInjectorHook(ctx)
  const emptyTaskResponseDetector = createEmptyTaskResponseDetectorHook(ctx)
  const editErrorRecovery = createEditErrorRecoveryHook(ctx)
  const commentChecker = createCommentCheckerHooks()
  const ralphLoop = createRalphLoopHook(ctx)
  const toolOutputTruncator = createToolOutputTruncatorHook(ctx)
  const sessionNotification = createSessionNotificationHook(ctx)
  const backgroundNotification = createBackgroundNotificationHook(backgroundManager)
  const autoSlashCommand = createAutoSlashCommandHook(ctx)
  const emptyMessageSanitizer = createEmptyMessageSanitizerHook()
  const keywordDetector = createKeywordDetectorHook(ctx)
  const thinkingMode = createThinkingModeHook(ctx)
  const rulesInjector = createRulesInjectorHook(ctx)
  const interactiveBashSession = createInteractiveBashSessionHook(ctx)
  
  const configHandler = createConfigHandler(configLoader)
  
  return {
    tool: {
      ...createBackgroundTaskTools(backgroundManager),
      ...createCallAgentTools(backgroundManager),
      ...createSubagentTools(backgroundManager),
      ...createAgentDiscoveryTools(backgroundManager),
      ...createAstGrepTools(),
    },
    
    config: configHandler.handleConfig,
    
    event: async (input) => {
      await directoryAgentsInjector.event?.(input)
      await directoryReadmeInjector.event?.(input)
      await ralphLoop.event?.(input)
      await sessionNotification.event?.(input)
      await backgroundNotification.event?.(input)
    },
    
    "tool.execute.before": async (input, output) => {
      await directoryAgentsInjector["tool.execute.before"]?.(input, output)
      await directoryReadmeInjector["tool.execute.before"]?.(input, output)
      await commentChecker["tool.execute.before"]?.(input, output)
      await autoSlashCommand["tool.execute.before"]?.(input, output)
      await thinkingMode["tool.execute.before"]?.(input, output)
      await rulesInjector["tool.execute.before"]?.(input, output)
      await interactiveBashSession["tool.execute.before"]?.(input, output)
    },
    
    "tool.execute.after": async (input, output) => {
      await emptyTaskResponseDetector["tool.execute.after"]?.(input, output)
      await editErrorRecovery["tool.execute.after"]?.(input, output)
      await directoryAgentsInjector["tool.execute.after"]?.(input, output)
      await directoryReadmeInjector["tool.execute.after"]?.(input, output)
      await commentChecker["tool.execute.after"]?.(input, output)
      await ralphLoop["tool.execute.after"]?.(input, output)
      await toolOutputTruncator["tool.execute.after"]?.(input, output)
      await keywordDetector["tool.execute.after"]?.(input, output)
    },
  }
}

export default MyOpenCodePlugin
