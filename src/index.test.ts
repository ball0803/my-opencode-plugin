import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { MyOpenCodePlugin } from './index';

describe('MyOpenCodePlugin', () => {
  let plugin: MyOpenCodePlugin;
  let mockSession: any;

  beforeEach(() => {
    plugin = new MyOpenCodePlugin();
    mockSession = {
      id: 'test-session',
      getStatus: jest.fn().mockResolvedValue('running'),
      sendMessage: jest.fn().mockResolvedValue(undefined),
    };
  });

  afterEach(async () => {
    await plugin.cleanup();
  }, 5000);

  describe('initialization', () => {
    it('should initialize with default config', () => {
      // when
      const config = plugin.getConfig();

      // then
      expect(config).toBeDefined();
      expect(config.agents).toEqual({});
      expect(config.background).toBeDefined();
    });

    it('should initialize with custom config path', () => {
      // given
      const customPlugin = new MyOpenCodePlugin({ configPath: 'custom.json' });

      // when
      const config = customPlugin.getConfig();

      // then
      expect(config).toBeDefined();
    });
  });

  describe('tools', () => {
    it('should provide background task tools', () => {
      // when
      const tools = plugin.getTools();

      // then
      expect(tools.background_task).toBeDefined();
      expect(tools.background_output).toBeDefined();
      expect(tools.background_cancel).toBeDefined();
    });

    it('should provide call agent tools', () => {
      // when
      const tools = plugin.getTools();

      // then
      expect(tools.call_agent).toBeDefined();
    });
  });

  describe('config handlers', () => {
    it('should provide config handlers', () => {
      // when
      const handlers = plugin.getConfigHandlers();

      // then
      expect(handlers).toBeDefined();
      expect(handlers.length).toBeGreaterThan(0);
    });
  });

  describe('config management', () => {
    it('should update config', () => {
      // given
      const newConfig = { agents: { test: { model: 'test-model' } } };

      // when
      plugin.updateConfig(newConfig);
      const config = plugin.getConfig();

      // then
      expect(config.agents).toEqual(newConfig.agents);
    });
  });
});