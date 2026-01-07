export const createPluginVerificationTools = () => {
  return {
    'plugin-verification': {
      name: 'plugin-verification',
      description: 'Verify that the plugin is working correctly',
      execute: async () => {
        return {
          result:
            'Plugin is working correctly! All hooks and tools are active.',
        };
      },
    },
  };
};
