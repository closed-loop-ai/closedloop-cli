import axios from 'axios';
import { config } from '../config';
import { FeedbackData, ListResponse, CommandOptions, InputData } from '../types';
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

export async function submitFeedback(data: Partial<InputData>): Promise<{ id: string }> {
  try {
    const client = getClient();
    const response = await client.post('/feedbacks', data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function listFeedbacks(params: CommandOptions, isNew = false): Promise<ListResponse<FeedbackData>> {
  try {
    const client = getClient();
    const endpoint = isNew ? '/feedbacks/new' : '/feedbacks';
    const response = await client.get(endpoint, { params });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getFeedbackStatus(id: string): Promise<FeedbackData> {
  try {
    const client = getClient();
    const response = await client.get(`/feedbacks/new/${id}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getFeedbackDetail(id: string): Promise<FeedbackData> {
  try {
    const client = getClient();
    const response = await client.get(`/feedbacks/${id}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
