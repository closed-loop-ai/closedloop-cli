export const CONFIG = {
  API_BASE_URL: process.env.CLOSEDLOOP_API_URL || 'https://mcp.closedloop.sh',
  USER_AGENT: 'closedloop-cli/0.2.0',
  MAX_RETRY_ATTEMPTS: 100,
  POLL_INTERVAL_MS: 3000,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_API_KEY_LENGTH: 10,
  MAX_CONTENT_LENGTH: 10000,
  TIMEOUT_MS: 30000
} as const;

export const MESSAGES = {
  NO_API_KEY: `🔑 No API key configured!

To get started:
1. Go to https://closedloop.sh
2. Sign up for a free account
3. Generate your API key
4. Run: cl config --set-api-key <your-key>

Get your free API key at: https://closedloop.sh`,
  
  INVALID_API_KEY: '❌ Invalid API key. Get your free API key at https://closedloop.sh',
  CONNECTION_ERROR: '❌ Connection Error: Cannot connect to ClosedLoop servers',
  CHECK_INTERNET: 'Check your internet connection and try again',
  GET_HELP: 'Get help: cl --help',
  PROCESSING_ERROR: '❌ Processing Error: Unable to process feedback',
  VALIDATION_ERROR: '❌ Validation Error:',
  UNKNOWN_ERROR: 'Unknown error occurred'
} as const;

export const URLS = {
  CLOSEDLOOP_HOME: 'https://closedloop.sh',
  GET_API_KEY: 'https://closedloop.sh'
} as const;
