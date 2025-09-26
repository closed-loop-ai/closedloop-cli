import { 
  validateUuid, 
  validateInputContent, 
  validateApiKey, 
  validateEmail, 
  validateUrl, 
  validatePagination,
  validateTitle,
  validateCustomerId,
  validateName,
  sanitizeInput,
  validateAndSanitizeInput
} from '../utils/validation';
import { CliError } from '../utils/errors';

describe('Validation Utils', () => {
  describe('validateUuid', () => {
    it('should validate correct UUIDs', () => {
      expect(validateUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(validateUuid('00000000-0000-0000-0000-000000000000')).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(validateUuid('invalid-uuid')).toBe(false);
      expect(validateUuid('123e4567-e89b-12d3-a456')).toBe(false);
      expect(validateUuid('')).toBe(false);
    });
  });

  describe('validateInputContent', () => {
    it('should validate correct content', () => {
      expect(validateInputContent('Valid content')).toBe('Valid content');
      expect(validateInputContent('  Valid content  ')).toBe('Valid content');
    });

    it('should reject empty content', () => {
      expect(() => validateInputContent('')).toThrow(CliError);
      expect(() => validateInputContent('   ')).toThrow(CliError);
    });

    it('should reject content that is too long', () => {
      const longContent = 'a'.repeat(10001);
      expect(() => validateInputContent(longContent)).toThrow(CliError);
    });
  });

  describe('validateApiKey', () => {
    it('should validate correct API keys', () => {
      expect(validateApiKey('valid-api-key-123')).toBe('valid-api-key-123');
      expect(validateApiKey('  valid-api-key-123  ')).toBe('valid-api-key-123');
    });

    it('should reject empty API keys', () => {
      expect(() => validateApiKey('')).toThrow(CliError);
      expect(() => validateApiKey('   ')).toThrow(CliError);
    });

    it('should reject API keys that are too short', () => {
      expect(() => validateApiKey('short')).toThrow(CliError);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe('test@example.com');
      expect(validateEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com');
    });

    it('should reject invalid emails', () => {
      expect(() => validateEmail('invalid-email')).toThrow(CliError);
      expect(() => validateEmail('test@')).toThrow(CliError);
      expect(() => validateEmail('@example.com')).toThrow(CliError);
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe('https://example.com/');
      expect(validateUrl('http://example.com')).toBe('http://example.com/');
    });

    it('should reject invalid URLs', () => {
      expect(() => validateUrl('invalid-url')).toThrow(CliError);
      expect(() => validateUrl('ftp://example.com')).toThrow(CliError);
    });
  });

  describe('validatePagination', () => {
    it('should validate correct pagination', () => {
      expect(validatePagination(1, 20)).toEqual({ page: 1, limit: 20 });
      expect(validatePagination(undefined, undefined)).toEqual({ page: 1, limit: 20 });
    });

    it('should enforce minimum values', () => {
      expect(validatePagination(0, 0)).toEqual({ page: 1, limit: 20 });
      expect(validatePagination(-1, -1)).toEqual({ page: 1, limit: 1 });
    });

    it('should enforce maximum limit', () => {
      const result = validatePagination(1, 1000);
      expect(result.limit).toBeLessThanOrEqual(100);
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize dangerous content', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('javascript:alert("xss")')).toBe('alert("xss")');
      expect(sanitizeInput('onclick="alert(\'xss\')"')).toBe('"alert(\'xss\')"');
    });

    it('should preserve safe content', () => {
      expect(sanitizeInput('Safe content')).toBe('Safe content');
      expect(sanitizeInput('  Safe content  ')).toBe('Safe content');
    });
  });

  describe('validateAndSanitizeInput', () => {
    it('should validate and sanitize complete input data', () => {
      const inputData = {
        content: 'Test content',
        title: 'Test title',
        source_url: 'https://example.com',
        customer_id: 'customer-123',
        reporter_name: 'John Doe',
        reporter_email: 'john@example.com'
      };

      const result = validateAndSanitizeInput(inputData);
      expect(result.content).toBe('Test content');
      expect(result.title).toBe('Test title');
      expect(result.source_url).toBe('https://example.com/');
      expect(result.customer_id).toBe('customer-123');
      expect(result.reporter_name).toBe('John Doe');
      expect(result.reporter_email).toBe('john@example.com');
    });

    it('should handle optional fields', () => {
      const inputData = {
        content: 'Test content'
      };

      const result = validateAndSanitizeInput(inputData);
      expect(result.content).toBe('Test content');
      expect(result.title).toBeUndefined();
    });

    it('should reject invalid content', () => {
      const inputData = {
        content: ''
      };

      expect(() => validateAndSanitizeInput(inputData)).toThrow(CliError);
    });
  });
});
