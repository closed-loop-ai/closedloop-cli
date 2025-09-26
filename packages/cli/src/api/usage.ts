import axios from 'axios';
import { config } from '../config';
import { UsageData, ListResponse } from '../types';
import { CONFIG, MESSAGES } from '../config/constants';
import { CliError, handleApiError, ERROR_CODES } from '../utils/errors';

const getClient = () => {
  const apiKey = config.get('apiKey');

  if (!apiKey) {
    throw new CliError(MESSAGES.NO_API_KEY, ERROR_CODES.NO_API_KEY);
  }

  return axios.create({
    baseURL: CONFIG.API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': CONFIG.USER_AGENT
    },
    timeout: CONFIG.TIMEOUT_MS
  });
};

export async function listUsage(page: number = 1, limit: number = 20): Promise<ListResponse<UsageData>> {
  try {
    const client = getClient();
    const response = await client.get('/usage', { 
      params: { page, limit } 
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getUsageDetail(id: string): Promise<UsageData> {
  try {
    const client = getClient();
    const response = await client.get(`/usage/${id}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
