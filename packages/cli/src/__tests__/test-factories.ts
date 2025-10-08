// Test data factories for consistent test data generation

export interface TestInput {
  id: string;
  content: string;
  status: 'processing' | 'processed' | 'failed';
  created_at: string;
  feedback?: TestFeedback[];
}

export interface TestFeedback {
  id: string;
  summary: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  insights?: string[];
}

export interface TestConfig {
  apiKey: string;
  configFile: string;
  configured: boolean;
}

export interface TestTeam {
  id: string;
  name: string;
  website: string;
  updated_at: string;
}

// Input factories
export const createTestInput = (overrides: Partial<TestInput> = {}): TestInput => ({
  id: 'input-' + Math.random().toString(36).substr(2, 9),
  content: 'Test feedback content',
  status: 'processed',
  created_at: new Date().toISOString(),
  ...overrides
});

export const createTestInputs = (count: number, overrides: Partial<TestInput> = {}): TestInput[] => {
  return Array.from({ length: count }, (_, i) => createTestInput({
    id: `input-${i + 1}`,
    content: `Test feedback content ${i + 1}`,
    ...overrides
  }));
};

// Feedback factories
export const createTestFeedback = (overrides: Partial<TestFeedback> = {}): TestFeedback => ({
  id: 'feedback-' + Math.random().toString(36).substr(2, 9),
  summary: 'Test feedback summary',
  priority: 'medium',
  created_at: new Date().toISOString(),
  insights: ['Insight 1', 'Insight 2'],
  ...overrides
});

export const createTestFeedbacks = (count: number, overrides: Partial<TestFeedback> = {}): TestFeedback[] => {
  return Array.from({ length: count }, (_, i) => createTestFeedback({
    id: `feedback-${i + 1}`,
    summary: `Test feedback summary ${i + 1}`,
    ...overrides
  }));
};

// Config factories
export const createTestConfig = (overrides: Partial<TestConfig> = {}): TestConfig => ({
  apiKey: 'test-api-key-' + Math.random().toString(36).substr(2, 9),
  configFile: '/path/to/config.json',
  configured: true,
  ...overrides
});

// Team factories
export const createTestTeam = (overrides: Partial<TestTeam> = {}): TestTeam => ({
  id: 'team-' + Math.random().toString(36).substr(2, 9),
  name: 'Test Team',
  website: 'https://example.com',
  updated_at: new Date().toISOString(),
  ...overrides
});

// API response factories
export const createApiResponse = <T>(data: T, success: boolean = true) => ({
  success,
  data,
  message: success ? 'Success' : 'Error'
});

export const createPaginatedResponse = <T>(
  data: T[], 
  page: number = 1, 
  limit: number = 20, 
  total: number = data.length
) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  }
});

// Error factories
export const createApiError = (status: number, message: string) => ({
  response: {
    status,
    data: { message }
  }
});

export const createNetworkError = (code: string) => ({
  code,
  message: 'Network error'
});

// Mock data sets
export const mockInputs = createTestInputs(5);
export const mockFeedbacks = createTestFeedbacks(3);
export const mockConfig = createTestConfig();
export const mockTeam = createTestTeam();

// Common test scenarios
export const testScenarios = {
  // Success scenarios
  successfulInputSubmission: () => createApiResponse(createTestInput()),
  successfulFeedbackList: () => createPaginatedResponse(mockFeedbacks),
  successfulConfigRetrieval: () => createApiResponse(mockConfig),
  
  // Error scenarios
  apiKeyNotFound: () => createApiError(401, 'Invalid API key'),
  resourceNotFound: () => createApiError(404, 'Resource not found'),
  rateLimited: () => createApiError(429, 'Rate limit exceeded'),
  serverError: () => createApiError(500, 'Internal server error'),
  networkError: () => createNetworkError('ENOTFOUND'),
  timeoutError: () => createNetworkError('ETIMEDOUT'),
  
  // Edge cases
  emptyResponse: () => createApiResponse([]),
  largeDataset: () => createPaginatedResponse(createTestInputs(1000), 1, 100, 1000),
  malformedResponse: () => ({ invalid: 'response' })
};

// Test data generators
export const generateRandomString = (length: number = 10): string => {
  return Math.random().toString(36).substr(2, length);
};

export const generateRandomEmail = (): string => {
  return `test-${generateRandomString(8)}@example.com`;
};

export const generateRandomUrl = (): string => {
  return `https://${generateRandomString(10)}.example.com`;
};

export const generateRandomUuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Performance test data
export const performanceTestData = {
  largeInput: 'a'.repeat(50000),
  manyInputs: createTestInputs(1000),
  manyFeedbacks: createTestFeedbacks(500),
  longUuid: generateRandomUuid() + generateRandomUuid()
};

// Security test data
export const securityTestData = {
  xssPayload: '<script>alert("xss")</script>',
  sqlInjection: "'; DROP TABLE users; --",
  pathTraversal: '../../../etc/passwd',
  commandInjection: '; rm -rf /',
  htmlInjection: '<img src="x" onerror="alert(1)">',
  javascriptUrl: 'javascript:alert("xss")'
};
