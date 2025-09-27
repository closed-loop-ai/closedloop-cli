import axios from 'axios';
import { config } from '../config';
import { InputData, ListResponse, CommandOptions } from '../types';
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

export async function listIngests(page: number = 1, limit: number = 20): Promise<ListResponse<InputData>> {
  try {
    const client = getClient();
    const response = await client.get('/inputs', { 
      params: { page, limit } 
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getIngestDetail(id: string): Promise<InputData> {
  try {
    const client = getClient();
    const response = await client.get(`/inputs/${id}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getIngestStatus(id: string): Promise<InputData> {
  try {
    const client = getClient();
    const response = await client.get(`/inputs/${id}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
