import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ConfigLoader } from './index';
import { DEFAULT_CONFIG } from './schema';

describe('ConfigLoader', () => {
  let configLoader: ConfigLoader;
  let mockFs: any;

  beforeEach(() => {
    configLoader = new ConfigLoader();
    mockFs = {
      readFileSync: jest.fn(),
      existsSync: jest.fn()
    };
    jest.mock('fs', () => mockFs);
  });

  describe('loadConfig', () => {
    it('should load config from file', () => {
      // given
      const mockConfig = {
        agents: { test: { model: 'test-model' } },
        background: { maxConcurrentTasks: 5 }
      };
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));

      // when
      const config = configLoader.loadConfig('test.json');

      // then
      expect(config.agents).toEqual(mockConfig.agents);
      expect(config.background.maxConcurrentTasks).toBe(5);
    });

    it('should use default config when file does not exist', () => {
      // given
      mockFs.existsSync.mockReturnValue(false);

      // when
      const config = configLoader.loadConfig('nonexistent.json');

      // then
      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it('should validate config with Zod schema', () => {
      // given
      const invalidConfig = {
        agents: { test: { model: 'test-model', temperature: 5 } } // Invalid: temperature > 2
      };
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(invalidConfig));

      // when/then
      expect(() => configLoader.loadConfig('invalid.json')).toThrow();
    });
  });

  describe('getAgentConfig', () => {
    it('should return agent config', () => {
      // given
      configLoader.mergeConfig({
        agents: { test: { model: 'test-model', temperature: 0.7 } }
      });

      // when
      const agentConfig = configLoader.getAgentConfig('test');

      // then
      expect(agentConfig).toEqual({ model: 'test-model', temperature: 0.7 });
    });

    it('should return undefined for non-existent agent', () => {
      // given
      configLoader.mergeConfig({ agents: {} });

      // when
      const agentConfig = configLoader.getAgentConfig('nonexistent');

      // then
      expect(agentConfig).toBeUndefined();
    });
  });

  describe('hasPermission', () => {
    it('should check agent permissions', () => {
      // given
      configLoader.mergeConfig({
        permissions: { test: ['read', 'write'] }
      });

      // when/then
      expect(configLoader.hasPermission('test', 'read')).toBe(true);
      expect(configLoader.hasPermission('test', 'write')).toBe(true);
      expect(configLoader.hasPermission('test', 'delete')).toBe(false);
      expect(configLoader.hasPermission('unknown', 'read')).toBe(true); // Default allow
    });
  });
});