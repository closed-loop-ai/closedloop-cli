import { CliError, handleValidationError, handleInputError, ERROR_CODES } from './errors';
import { CONFIG } from '../config/constants';

// UUID validation
export function validateUuid(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Content validation
export function validateInputContent(content: string): string {
  if (!content || content.trim().length === 0) {
    throw handleInputError('Content cannot be empty');
  }
  
  if (content.length > CONFIG.MAX_CONTENT_LENGTH) {
    throw handleInputError(`Content too long (max ${CONFIG.MAX_CONTENT_LENGTH} characters)`);
  }
  
  return content.trim();
}

// API key validation
export function validateApiKey(apiKey: string): string {
  if (!apiKey || apiKey.trim().length === 0 || apiKey.length < CONFIG.MIN_API_KEY_LENGTH) {
    throw handleValidationError('Invalid API key. Get your free API key at https://closedloop.sh');
  }
  
  return apiKey.trim();
}

// Email validation
export function validateEmail(email: string): string {
  if (!email || email.trim().length === 0) {
    throw handleValidationError('Email cannot be empty');
  }
  
  const trimmedEmail = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    throw handleValidationError('Invalid email format');
  }
  
  return trimmedEmail.toLowerCase();
}

// URL validation
export function validateUrl(url: string): string {
  if (!url || url.trim().length === 0) {
    throw handleValidationError('URL cannot be empty');
  }
  
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw handleValidationError('URL must use HTTP or HTTPS protocol');
    }
    return urlObj.toString();
  } catch (error) {
    throw handleValidationError('Invalid URL format');
  }
}

// Pagination validation
export function validatePagination(page?: number, limit?: number): { page: number; limit: number } {
  const validatedPage = Math.max(1, page || 1);
  const validatedLimit = Math.min(
    Math.max(1, limit || CONFIG.DEFAULT_PAGE_SIZE),
    CONFIG.MAX_PAGE_SIZE
  );
  
  return { page: validatedPage, limit: validatedLimit };
}

// Title validation
export function validateTitle(title: string): string {
  if (!title || title.trim().length === 0) {
    throw handleValidationError('Title cannot be empty');
  }
  
  if (title.length > 200) {
    throw handleValidationError('Title too long (max 200 characters)');
  }
  
  return title.trim();
}

// Customer ID validation
export function validateCustomerId(customerId: string): string {
  if (!customerId || customerId.trim().length === 0) {
    throw handleValidationError('Customer ID cannot be empty');
  }
  
  if (customerId.length > 100) {
    throw handleValidationError('Customer ID too long (max 100 characters)');
  }
  
  return customerId.trim();
}

// Name validation
export function validateName(name: string): string {
  if (!name || name.trim().length === 0) {
    throw handleValidationError('Name cannot be empty');
  }
  
  if (name.length > 100) {
    throw handleValidationError('Name too long (max 100 characters)');
  }
  
  return name.trim();
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Validate and sanitize all input data
export function validateAndSanitizeInput(data: {
  content: string;
  title?: string;
  source_url?: string;
  customer_id?: string;
  reporter_name?: string;
  reporter_email?: string;
}): {
  content: string;
  title?: string;
  source_url?: string;
  customer_id?: string;
  reporter_name?: string;
  reporter_email?: string;
} {
  const validated: any = {};
  
  // Required fields
  validated.content = sanitizeInput(validateInputContent(data.content));
  
  // Optional fields
  if (data.title) {
    validated.title = sanitizeInput(validateTitle(data.title));
  }
  
  if (data.source_url) {
    validated.source_url = validateUrl(data.source_url);
  }
  
  if (data.customer_id) {
    validated.customer_id = sanitizeInput(validateCustomerId(data.customer_id));
  }
  
  if (data.reporter_name) {
    validated.reporter_name = sanitizeInput(validateName(data.reporter_name));
  }
  
  if (data.reporter_email) {
    validated.reporter_email = validateEmail(data.reporter_email);
  }
  
  return validated;
}
