import * as fs from 'fs';
import * as path from 'path';
import {
  MyOpenCodePluginConfig,
  MyOpenCodePluginConfigSchema,
  DEFAULT_CONFIG,
} from './config/index.ts';
import {
  log,
  getUserConfigDir,
  addConfigLoadError,
  parseJsonc,
  detectConfigFile,
  migrateConfigFile,
} from './shared/index.ts';

export function loadConfigFromPath(
  configPath: string,
  ctx: unknown,
): MyOpenCodePluginConfig | null {
  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      const rawConfig = parseJsonc<Record<string, unknown>>(content);

      migrateConfigFile(configPath, rawConfig);

      const result = MyOpenCodePluginConfigSchema.safeParse(rawConfig);

      if (!result.success) {
        const errorMsg = result.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join(', ');
        log(`Config validation error in ${configPath}:`, result.error.issues);
        addConfigLoadError({
          path: configPath,
          error: `Validation error: ${errorMsg}`,
        });
        return null;
      }

      log(`Config loaded from ${configPath}`, { agents: result.data.agents });
      return result.data;
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    log(`Error loading config from ${configPath}:`, err);
    addConfigLoadError({ path: configPath, error: errorMsg });
  }
  return null;
}

export function mergeConfigs(
  baseConfig: MyOpenCodePluginConfig,
  overrideConfig: Partial<MyOpenCodePluginConfig>,
): MyOpenCodePluginConfig {
  return {
    ...baseConfig,
    ...overrideConfig,
    sisyphus_agent: {
      ...baseConfig.sisyphus_agent,
      ...overrideConfig.sisyphus_agent,
    },
    agents: {
      ...baseConfig.agents,
      ...overrideConfig.agents,
    },
  };
}

export function loadPluginConfig(
  directory: string,
  ctx: unknown,
): MyOpenCodePluginConfig {
  // User-level config path (OS-specific) - prefer .jsonc over .json
  const userBasePath = path.join(
    getUserConfigDir(),
    'opencode',
    'oh-my-opencode',
  );
  const userDetected = detectConfigFile(userBasePath);
  const userConfigPath =
    userDetected.format !== 'none' ? userDetected.path : userBasePath + '.json';

  // Project-level config path - prefer .jsonc over .json
  const projectBasePath = path.join(
    directory,
    '.opencode',
    'my-opencode-plugin',
  );
  const projectDetected = detectConfigFile(projectBasePath);
  const projectConfigPath =
    projectDetected.format !== 'none'
      ? projectDetected.path
      : projectBasePath + '.json';

  // Load user config first (base)
  let config: MyOpenCodePluginConfig =
    loadConfigFromPath(userConfigPath, ctx) ?? DEFAULT_CONFIG;

  // Override with project config
  const projectConfig = loadConfigFromPath(projectConfigPath, ctx);
  if (projectConfig) {
    config = mergeConfigs(config, projectConfig);
  }

  log('Final merged config', {
    agents: config.agents,
    disabled_agents: config.disabled_agents,
    disabled_mcps: config.disabled_mcps,
    disabled_hooks: config.disabled_hooks,
  });
  return config;
}
