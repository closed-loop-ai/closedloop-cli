import axios from 'axios';
import { config } from '../config';
import { ApiResponse } from '../types';
import { CONFIG } from '../config/constants';
import { CliError, handleApiError, ERROR_CODES } from '../utils/errors';

export interface TeamWebsiteData {
  website: string;
  updated_at: string;
}

const getClient = () => {
  const apiKey = config.get('apiKey');

  if (!apiKey) {
    throw new CliError('API key not configured. Run: cl config set --api-key <key>', ERROR_CODES.NO_API_KEY);
  }

  return axios.create({
    baseURL: CONFIG.API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });
};

export async function getTeamWebsite(): Promise<TeamWebsiteData> {
  try {
    const client = getClient();
    const response = await client.get<ApiResponse<TeamWebsiteData>>('/team/website');

    if (!response.data.success) {
      throw new Error('Failed to fetch team website');
    }

    return response.data.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
}

export async function updateTeamWebsite(website: string): Promise<TeamWebsiteData> {
  // Validate website URL format
  const websiteRegex = /^https?:\/\/.+\..+/;
  if (!websiteRegex.test(website)) {
    throw new Error('Invalid website URL format. Must include protocol (http:// or https://) and domain');
  }

  try {
    const client = getClient();
    const response = await client.post<ApiResponse<TeamWebsiteData>>('/team/website', {
      website
    });

    if (!response.data.success) {
      throw new Error('Failed to update team website');
    }

    return response.data.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
}
