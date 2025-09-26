// Test setup file
import { jest } from '@jest/globals';

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock process.exit to prevent tests from actually exiting
const originalExit = process.exit;
beforeAll(() => {
  process.exit = jest.fn() as any;
});

afterAll(() => {
  process.exit = originalExit;
});

// Mock process.stdin for interactive tests
Object.defineProperty(process, 'stdin', {
  value: {
    isTTY: false,
    setRawMode: jest.fn(),
    resume: jest.fn(),
    pause: jest.fn(),
  },
  writable: true,
});

// Mock process.stdout for output tests
Object.defineProperty(process, 'stdout', {
  value: {
    write: jest.fn(),
    end: jest.fn(),
  },
  writable: true,
});

// Mock process.stderr for error output tests
Object.defineProperty(process, 'stderr', {
  value: {
    write: jest.fn(),
    end: jest.fn(),
  },
  writable: true,
});

// Global test timeout
jest.setTimeout(10000);