export interface CommandOptions {
  page?: number;
  limit?: number;
  json?: boolean;
  wait?: boolean;
  interactive?: boolean;
  // Config options
  setApiKey?: string;
  setTeam?: string;
  apiKey?: string;
  team?: string;
  // Input options
  title?: string;
  url?: string;
  customer?: string;
  name?: string;
  email?: string;
  // Feedback options
  status?: string;
  search?: string;
  new?: boolean;
  watch?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface InputData {
  id: string;
  title?: string;
  content: string;
  source_url?: string;
  source_id?: string;
  source_timestamp?: string;
  customer_id?: string;
  reporter_name?: string;
  reporter_email?: string;
  language?: string;
  metadata?: any;
  tags?: string[];
  status: string;
  created_at: string;
  updated_at: string;
  claimed_at?: string;
  retry_count?: number;
  error_message?: string;
  feedback_count: number;
  credits_consumed: number;
}

export interface FeedbackData {
  id: string;
  title?: string;
  clarity?: string;
  deal_blocker: boolean;
  pain_point?: string;
  workaround?: string;
  competitor_gap?: string;
  willingness_to_pay?: string;
  use_case?: string;
  feature_area?: string;
  source_url?: string;
  timestamp: string;
  input_id?: string;
  severity?: string;
  status?: string;
  source?: string;
  // For backward compatibility
  signal_title?: string;
  created_at?: string;
  updated_at?: string;
  feedbackCount?: number;
  creditsConsumed?: number;
}

export interface UsageData {
  id: string;
  input_id: string;
  title?: string;
  credits_consumed: number;
  feedback_count: number;
  created_at: string;
  updated_at: string;
}

export interface ConfigData {
  apiKey?: string;
  baseUrl?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ListResponse<T> {
  data: T[];
  pagination: PaginationData;
  // For backward compatibility
  inputs?: T[];
  feedbacks?: T[];
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
}
