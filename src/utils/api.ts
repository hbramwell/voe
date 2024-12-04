import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { VoeConfig } from '../types';
import { DEFAULT_CONFIG, RATE_LIMIT, ERROR_MESSAGES } from '../constants';
import {
  VoeAuthenticationError,
  VoeNetworkError,
  VoeRateLimitError,
  VoeResponseError,
  VoeServerError,
} from '../errors';

/**
 * Creates an axios instance with the provided configuration
 */
export const createApiClient = (config: VoeConfig): AxiosInstance => {
  const axiosConfig: AxiosRequestConfig = {
    baseURL: config.baseURL || DEFAULT_CONFIG.baseURL,
    timeout: config.timeout || DEFAULT_CONFIG.timeout,
    params: {
      key: config.apiKey,
    },
  };

  const client = axios.create(axiosConfig);

  // Add request interceptor for rate limiting
  client.interceptors.request.use(rateLimitInterceptor);

  // Add response interceptor for error handling
  client.interceptors.response.use((response) => response, handleApiError);

  return client;
};

/**
 * Rate limit queue implementation
 */
const requestQueue: { timestamp: number }[] = [];

/**
 * Rate limit interceptor
 */
const rateLimitInterceptor = async (config: AxiosRequestConfig) => {
  const now = Date.now();
  const timeWindow = RATE_LIMIT.timeWindow;

  // Remove old requests from queue
  while (
    requestQueue.length > 0 &&
    now - requestQueue[0].timestamp > timeWindow
  ) {
    requestQueue.shift();
  }

  // Check if rate limit is exceeded
  if (requestQueue.length >= RATE_LIMIT.maxRequests) {
    throw new VoeRateLimitError(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
  }

  // Add request to queue
  requestQueue.push({ timestamp: now });

  // If queue is full, wait for next time window
  if (requestQueue.length === RATE_LIMIT.maxRequests) {
    const oldestRequest = requestQueue[0].timestamp;
    const waitTime = timeWindow - (now - oldestRequest);
    if (waitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  return config;
};

/**
 * API error handler
 */
const handleApiError = (error: AxiosError) => {
  if (!error.response) {
    throw new VoeNetworkError(ERROR_MESSAGES.NETWORK_ERROR);
  }

  const { status, data } = error.response;

  switch (status) {
    case 401:
      throw new VoeAuthenticationError(ERROR_MESSAGES.UNAUTHORIZED, status);
    case 429:
      throw new VoeRateLimitError(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED, status);
    case 500:
      throw new VoeServerError(ERROR_MESSAGES.SERVER_ERROR, status);
    default:
      throw new VoeResponseError(
        error.message || ERROR_MESSAGES.INVALID_RESPONSE,
        status,
        data
      );
  }
};

/**
 * Retry mechanism for failed requests
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retryAttempts = DEFAULT_CONFIG.retryAttempts,
  retryDelay = DEFAULT_CONFIG.retryDelay
): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on certain errors
      if (
        error instanceof VoeAuthenticationError ||
        error instanceof VoeValidationError
      ) {
        throw error;
      }

      // Last attempt
      if (attempt === retryAttempts) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
    }
  }

  throw lastError;
};
