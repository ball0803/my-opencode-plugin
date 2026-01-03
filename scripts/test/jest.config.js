 module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'node',
  testTimeout: 10000,
   testMatch: ['**/*.test.ts'],
   moduleFileExtensions: ['ts', 'js', 'json', 'node'],
   clearMocks: true,
   collectCoverage: true,
   coverageDirectory: 'coverage',
   coverageReporters: ['text', 'lcov', 'html'],
   coverageThreshold: {
     global: {
       branches: 80,
       functions: 80,
       lines: 80,
       statements: 80
     }
   },
   roots: ['<rootDir>'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      isolatedModules: true
    }
  },
 };
