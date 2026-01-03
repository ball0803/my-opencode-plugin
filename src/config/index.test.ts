import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { DEFAULT_CONFIG } from './schema';

// Mock fs before importing ConfigLoader
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  existsSync: jest.fn()
}));

import { ConfigLoader } from './index';

describe('ConfigLoader', () => {
  let configLoader: ConfigLoader;
  let mockFs: any;

  beforeEach(() => {
    mockFs = {
      readFileSync: jest.fn(),
      existsSync: jest.fn()
    };
    // Update the mock implementations
    require('fs').readFileSync = mockFs.readFileSync;
    require('fs').existsSync = mockFs.existsSync;
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
        configLoader = new ConfigLoader();

        // when
        const config = configLoader.loadConfig('test.json');

       // then
       // Note: Schema adds default values like 'disabled: false' to agents
       expect(config.agents.test).toEqual(
         expect.objectContaining({ model: 'test-model', disabled: false })
       );
       expect(config.background?.maxConcurrentTasks).toBe(5);
     });

     it('should use default config when file does not exist', () => {
       // given
       mockFs.existsSync.mockReturnValue(false);
       configLoader = new ConfigLoader();

       // when
       const config = configLoader.loadConfig('nonexistent.json');

      // then
      expect(config).toEqual(DEFAULT_CONFIG);
    });

     it('should handle invalid config gracefully', () => {
       // given
       const invalidConfig = {
         agents: { test: { model: 'test-model', temperature: 5 } } // Invalid: temperature > 2
       };
       mockFs.existsSync.mockReturnValue(true);
       mockFs.readFileSync.mockReturnValue(JSON.stringify(invalidConfig));
       configLoader = new ConfigLoader();

       // when
       const config = configLoader.loadConfig('invalid.json');

       // then
       // Should return default config when validation fails
       expect(config).toEqual(DEFAULT_CONFIG);
     });
  });

   describe('getAgentConfig', () => {
     it('should return agent config', () => {
       // given
       configLoader = new ConfigLoader();
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
       configLoader = new ConfigLoader();
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
        configLoader = new ConfigLoader();
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

  describe('Agent Discovery Methods', () => {
    it('should return available agents', () => {
      // given
      configLoader = new ConfigLoader();
      configLoader.mergeConfig({
        agents: { agent1: { model: 'model1' }, agent2: { model: 'model2' } }
      });

      // when
      const agents = configLoader.getAvailableAgents();

      // then
      expect(agents).toEqual(['agent1', 'agent2']);
    });

    it('should check if agent is available', () => {
      // given
      configLoader = new ConfigLoader();
      configLoader.mergeConfig({
        agents: { available: { model: 'model1' } }
      });

      // when/then
      expect(configLoader.isAgentAvailable('available')).toBe(true);
      expect(configLoader.isAgentAvailable('unavailable')).toBe(false);
    });

    it('should check if agent is disabled', () => {
      // given
      configLoader = new ConfigLoader();
      configLoader.mergeConfig({
        agents: {
          enabled: { model: 'model1', disabled: false },
          disabled: { model: 'model2', disabled: true }
        }
      });

      // when/then
      expect(configLoader.isAgentDisabled('enabled')).toBe(false);
      expect(configLoader.isAgentDisabled('disabled')).toBe(true);
      expect(configLoader.isAgentDisabled('nonexistent')).toBe(false); // Default
    });
  });

    describe('mergeConfig', () => {
      it('should merge new config with existing config', () => {
        // given
        configLoader = new ConfigLoader();

        // when
        configLoader.mergeConfig({
          agents: { agent1: { model: 'model1' } },
          permissions: { test: ['read'] }
        });

        // then
        const config = configLoader.getConfig();
        expect(config.agents?.agent1).toEqual(expect.objectContaining({ model: 'model1' }));
        expect(configLoader.hasPermission('test', 'read')).toBe(true);
      });
    });
});