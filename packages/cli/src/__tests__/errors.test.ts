import { 
  CliError, 
  ERROR_CODES, 
  handleApiError, 
  handleValidationError, 
  handleInputError, 
  handleProcessingError 
} from '../utils/errors';

describe('Error Utils', () => {
  describe('CliError', () => {
    it('should create error with message and code', () => {
      const error = new CliError('Test error', ERROR_CODES.VALIDATION_ERROR);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
      expect(error.exitCode).toBe(1);
    });

    it('should create error with custom exit code', () => {
      const error = new CliError('Test error', ERROR_CODES.VALIDATION_ERROR, 2);
      expect(error.exitCode).toBe(2);
    });
  });

  describe('handleApiError', () => {
    it('should handle 401 errors', () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };
      
      const result = handleApiError(mockError);
      expect(result.message).toContain('Invalid API key');
      expect(result.code).toBe(ERROR_CODES.UNAUTHORIZED);
    });

    it('should handle 404 errors', () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Not found' }
        }
      };
      
      const result = handleApiError(mockError);
      expect(result.message).toContain('Resource not found');
      expect(result.code).toBe(ERROR_CODES.NOT_FOUND);
    });

    it('should handle 429 errors', () => {
      const mockError = {
        response: {
          status: 429,
          data: { message: 'Rate limited' }
        }
      };
      
      const result = handleApiError(mockError);
      expect(result.message).toContain('Rate limit exceeded');
      expect(result.code).toBe(ERROR_CODES.RATE_LIMITED);
    });

    it('should handle 500 errors', () => {
      const mockError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' }
        }
      };
      
      const result = handleApiError(mockError);
      expect(result.message).toContain('Server error');
      expect(result.code).toBe(ERROR_CODES.SERVER_ERROR);
    });

    it('should handle connection errors', () => {
      const mockError = {
        code: 'ENOTFOUND'
      };
      
      const result = handleApiError(mockError);
      expect(result.message).toContain('Cannot connect to ClosedLoop servers');
      expect(result.code).toBe(ERROR_CODES.CONNECTION_ERROR);
    });

    it('should handle timeout errors', () => {
      const mockError = {
        code: 'ETIMEDOUT'
      };
      
      const result = handleApiError(mockError);
      expect(result.message).toContain('Request timed out');
      expect(result.code).toBe(ERROR_CODES.CONNECTION_ERROR);
    });

    it('should handle unknown errors', () => {
      const mockError = {
        message: 'Unknown error'
      };
      
      const result = handleApiError(mockError);
      expect(result.message).toBe('Unknown error');
      expect(result.code).toBe(ERROR_CODES.UNKNOWN_ERROR);
    });
  });

  describe('handleValidationError', () => {
    it('should create validation error', () => {
      const result = handleValidationError('Validation failed');
      expect(result.message).toBe('Validation failed');
      expect(result.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    });
  });

  describe('handleInputError', () => {
    it('should create input error', () => {
      const result = handleInputError('Input invalid');
      expect(result.message).toBe('Input invalid');
      expect(result.code).toBe(ERROR_CODES.INVALID_INPUT);
    });
  });

  describe('handleProcessingError', () => {
    it('should create processing error', () => {
      const result = handleProcessingError('Processing failed');
      expect(result.message).toBe('Processing failed');
      expect(result.code).toBe(ERROR_CODES.PROCESSING_ERROR);
    });
  });
});
