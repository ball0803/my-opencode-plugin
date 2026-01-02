 module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'node',
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
   moduleNameMapper: {
     '^jest-globals$': 'jest-globals'
   }
 };