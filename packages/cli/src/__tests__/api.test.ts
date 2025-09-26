import axios from 'axios';
import { getTeamWebsite, updateTeamWebsite } from '../api/team';
import { CliError, ERROR_CODES } from '../utils/errors';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock config
jest.mock('../config', () => ({
  config: {
    get: jest.fn().mockReturnValue('test-api-key')
  }
}));

// Mock constants
jest.mock('../config/constants', () => ({
  CONFIG: {
    API_BASE_URL: 'https://mcp.closedloop.sh'
  }
}));

describe('API Client Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockedAxios);
  });

  describe('getTeamWebsite', () => {
    it('should make GET request to correct endpoint', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            website: 'https://example.com',
            updated_at: '2024-01-15T10:30:00Z'
          }
        }
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getTeamWebsite();

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://mcp.closedloop.sh',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      expect(mockedAxios.get).toHaveBeenCalledWith('/team/website');
      expect(result).toEqual({
        website: 'https://example.com',
        updated_at: '2024-01-15T10:30:00Z'
      });
    });

    it('should handle API error responses', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Team not found' }
        }
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getTeamWebsite()).rejects.toThrow('Resource not found');
    });

    it('should handle network errors', async () => {
      const mockError = {
        code: 'ENOTFOUND',
        message: 'Network error'
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getTeamWebsite()).rejects.toThrow('Cannot connect to ClosedLoop AI servers');
    });
  });

  describe('updateTeamWebsite', () => {
    it('should make POST request with correct data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            website: 'https://example.com',
            updated_at: '2024-01-15T10:30:00Z'
          }
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await updateTeamWebsite('https://example.com');

      expect(mockedAxios.post).toHaveBeenCalledWith('/team/website', {
        website: 'https://example.com'
      });
      expect(result).toEqual({
        website: 'https://example.com',
        updated_at: '2024-01-15T10:30:00Z'
      });
    });

    it('should validate URL format before making request', async () => {
      await expect(updateTeamWebsite('invalid-url')).rejects.toThrow('Invalid website URL format');
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('should handle API error responses', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' }
        }
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(updateTeamWebsite('https://example.com')).rejects.toThrow('Server error');
    });

    it('should handle unsuccessful API responses', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Update failed'
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      await expect(updateTeamWebsite('https://example.com')).rejects.toThrow('Failed to update team website');
    });
  });

  describe('Error Handling', () => {
    it('should handle 401 unauthorized errors', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getTeamWebsite()).rejects.toThrow('Invalid API key');
    });

    it('should handle 429 rate limit errors', async () => {
      const mockError = {
        response: {
          status: 429,
          data: { message: 'Rate limited' }
        }
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getTeamWebsite()).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle timeout errors', async () => {
      const mockError = {
        code: 'ETIMEDOUT',
        message: 'Request timeout'
      };

      mockedAxios.get.mockRejectedValue(mockError);

      await expect(getTeamWebsite()).rejects.toThrow('Request timed out');
    });
  });
});
