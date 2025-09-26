import axios from 'axios';
import { CONFIG } from '../config/constants';
import { CliError, handleApiError, ERROR_CODES } from '../utils/errors';

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await axios.get(`${CONFIG.API_BASE_URL}/health`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: CONFIG.TIMEOUT_MS
    });
    
    return response.status === 200;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return false;
    }
    throw handleApiError(error);
  }
}
