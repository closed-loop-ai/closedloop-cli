export class CliError extends Error {
  constructor(
    message: string,
    public code: string,
    public exitCode: number = 1
  ) {
    super(message);
    this.name = 'CliError';
  }
}

export const ERROR_CODES = {
  NO_API_KEY: 'NO_API_KEY',
  INVALID_API_KEY: 'INVALID_API_KEY',
  INVALID_INPUT: 'INVALID_INPUT',
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  PROCESSING_ERROR: 'PROCESSING_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

export function handleApiError(error: any): CliError {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 401:
        return new CliError(
          'Invalid API key. Please check your configuration.',
          ERROR_CODES.UNAUTHORIZED,
          1
        );
      case 404:
        return new CliError(
          'Resource not found. Please check the ID and try again.',
          ERROR_CODES.NOT_FOUND,
          1
        );
      case 429:
        return new CliError(
          'Rate limit exceeded. Please wait a moment and try again.',
          ERROR_CODES.RATE_LIMITED,
          1
        );
      case 500:
      case 502:
      case 503:
      case 504:
        return new CliError(
          'Server error. Please try again later.',
          ERROR_CODES.SERVER_ERROR,
          1
        );
      default:
        return new CliError(
          data?.message || `API error (${status})`,
          ERROR_CODES.API_ERROR,
          1
        );
    }
  } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return new CliError(
      'Cannot connect to ClosedLoop servers. Please check your internet connection.',
      ERROR_CODES.CONNECTION_ERROR,
      1
    );
  } else if (error.code === 'ETIMEDOUT') {
    return new CliError(
      'Request timed out. Please try again.',
      ERROR_CODES.CONNECTION_ERROR,
      1
    );
  } else {
    return new CliError(
      error.message || 'An unknown error occurred',
      ERROR_CODES.UNKNOWN_ERROR,
      1
    );
  }
}

export function handleValidationError(message: string): CliError {
  return new CliError(message, ERROR_CODES.VALIDATION_ERROR, 1);
}

export function handleInputError(message: string): CliError {
  return new CliError(message, ERROR_CODES.INVALID_INPUT, 1);
}

export function handleProcessingError(message: string): CliError {
  return new CliError(message, ERROR_CODES.PROCESSING_ERROR, 1);
}
