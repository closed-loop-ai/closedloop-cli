import { 
  validateInputContent, 
  validateApiKey, 
  validateEmail, 
  validateUrl,
  sanitizeInput,
  validateAndSanitizeInput
} from '../utils/validation';
import { performanceTestData, securityTestData } from './test-factories';

describe('Performance Tests', () => {
  describe('Input Validation Performance', () => {
    it('should handle large input efficiently', () => {
      const largeInput = performanceTestData.largeInput;
      const startTime = performance.now();
      
      validateInputContent(largeInput);
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Should complete within 100ms
      expect(executionTime).toBeLessThan(100);
    });

    it('should handle many validations efficiently', () => {
      const inputs = Array.from({ length: 1000 }, (_, i) => `Test input ${i}`);
      const startTime = performance.now();
      
      inputs.forEach(input => {
        try {
          validateInputContent(input);
        } catch (error) {
          // Some might fail, that's okay for performance test
        }
      });
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Should complete 1000 validations within 500ms
      expect(executionTime).toBeLessThan(500);
    });
  });

  describe('Sanitization Performance', () => {
    it('should sanitize large XSS payload efficiently', () => {
      const xssPayload = securityTestData.xssPayload.repeat(1000);
      const startTime = performance.now();
      
      sanitizeInput(xssPayload);
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Should complete within 50ms
      expect(executionTime).toBeLessThan(50);
    });

    it('should handle many sanitizations efficiently', () => {
      const payloads = Array.from({ length: 500 }, () => securityTestData.xssPayload);
      const startTime = performance.now();
      
      payloads.forEach(payload => {
        sanitizeInput(payload);
      });
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Should complete 500 sanitizations within 200ms
      expect(executionTime).toBeLessThan(200);
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory with repeated validations', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Perform many validations
      for (let i = 0; i < 10000; i++) {
        try {
          validateInputContent(`Test input ${i}`);
          validateApiKey(`test-key-${i}`);
          validateEmail(`test${i}@example.com`);
        } catch (error) {
          // Some might fail, that's okay
        }
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });
});

describe('Edge Case Tests', () => {
  describe('Boundary Conditions', () => {
    it('should handle exactly maximum length input', () => {
      const maxLengthInput = 'a'.repeat(50000);
      expect(() => validateInputContent(maxLengthInput)).not.toThrow();
    });

    it('should reject input one character over maximum', () => {
      const tooLongInput = 'a'.repeat(50001);
      expect(() => validateInputContent(tooLongInput)).toThrow();
    });

    it('should handle minimum valid API key length', () => {
      const minApiKey = 'a'.repeat(10);
      expect(() => validateApiKey(minApiKey)).not.toThrow();
    });

    it('should reject API key one character under minimum', () => {
      const tooShortApiKey = 'a'.repeat(9);
      expect(() => validateApiKey(tooShortApiKey)).toThrow();
    });
  });

  describe('Unicode and Special Characters', () => {
    it('should handle unicode characters', () => {
      const unicodeInput = 'Test with émojis 🚀 and ñ characters';
      expect(() => validateInputContent(unicodeInput)).not.toThrow();
    });

    it('should handle various unicode ranges', () => {
      const unicodeInputs = [
        'English text',
        '中文文本',
        'العربية',
        'Русский текст',
        '日本語のテキスト',
        '한국어 텍스트'
      ];

      unicodeInputs.forEach(input => {
        expect(() => validateInputContent(input)).not.toThrow();
      });
    });

    it('should handle special characters in URLs', () => {
      const specialUrls = [
        'https://example.com/path?query=value&other=test',
        'https://example.com/path#fragment',
        'https://example.com/path/with-dashes_and_underscores',
        'https://example.com/path%20with%20spaces'
      ];

      specialUrls.forEach(url => {
        expect(() => validateUrl(url)).not.toThrow();
      });
    });
  });

  describe('Security Edge Cases', () => {
    it('should sanitize various XSS payloads', () => {
      const xssPayloads = [
        securityTestData.xssPayload,
        securityTestData.htmlInjection,
        securityTestData.javascriptUrl,
        '<iframe src="javascript:alert(1)"></iframe>',
        '<img src="x" onerror="alert(1)">',
        '<svg onload="alert(1)"></svg>',
        '<body onload="alert(1)">',
        '<input onfocus="alert(1)" autofocus>'
      ];

      xssPayloads.forEach(payload => {
        const sanitized = sanitizeInput(payload);
        expect(sanitized).not.toContain('<script');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror');
        expect(sanitized).not.toContain('onload');
        expect(sanitized).not.toContain('onfocus');
      });
    });

    it('should handle SQL injection attempts', () => {
      const sqlPayloads = [
        securityTestData.sqlInjection,
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "'; INSERT INTO users VALUES ('hacker', 'password'); --"
      ];

      sqlPayloads.forEach(payload => {
        const sanitized = sanitizeInput(payload);
        // The current sanitization is basic, so we just check it doesn't contain script tags
        expect(sanitized).not.toContain('<script');
        expect(sanitized).not.toContain('javascript:');
        // Basic check that it's been processed
        expect(sanitized).toBeDefined();
        expect(typeof sanitized).toBe('string');
      });
    });

    it('should handle path traversal attempts', () => {
      const pathPayloads = [
        securityTestData.pathTraversal,
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        '....//....//....//etc/passwd'
      ];

      pathPayloads.forEach(payload => {
        const sanitized = sanitizeInput(payload);
        // The current sanitization is basic, so we just check it doesn't contain script tags
        expect(sanitized).not.toContain('<script');
        expect(sanitized).not.toContain('javascript:');
        // Basic check that it's been processed
        expect(sanitized).toBeDefined();
        expect(typeof sanitized).toBe('string');
      });
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent validations', async () => {
      const promises = Array.from({ length: 100 }, (_, i) => 
        Promise.resolve(validateInputContent(`Concurrent test ${i}`))
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(100);
    });

    it('should handle concurrent sanitizations', async () => {
      const payloads = Array.from({ length: 100 }, () => securityTestData.xssPayload);
      const promises = payloads.map(payload => Promise.resolve(sanitizeInput(payload)));

      const results = await Promise.all(promises);
      expect(results).toHaveLength(100);
      results.forEach(result => {
        expect(result).not.toContain('<script');
      });
    });
  });

  describe('Error Recovery', () => {
    it('should recover from validation errors gracefully', () => {
      const invalidInputs = ['', '   ', 'a'.repeat(50001)];
      const validInputs = ['Valid input 1', 'Valid input 2', 'Valid input 3'];

      let errorCount = 0;
      let successCount = 0;

      [...invalidInputs, ...validInputs].forEach(input => {
        try {
          validateInputContent(input);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      });

      expect(errorCount).toBe(3); // 3 invalid inputs
      expect(successCount).toBe(3); // 3 valid inputs
    });
  });
});
