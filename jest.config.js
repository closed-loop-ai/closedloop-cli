module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages/cli/src'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
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
  collectCoverageFrom: [
    'packages/cli/src/**/*.ts',
    '!packages/cli/src/**/*.d.ts',
    '!packages/cli/src/**/__tests__/**',
    '!packages/cli/src/**/index.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/packages/cli/src/__tests__/setup.ts'],
  testTimeout: 10000,
  verbose: true
};
