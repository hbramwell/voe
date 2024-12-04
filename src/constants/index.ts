/**
 * VOE API base URL
 */
export const VOE_API_BASE_URL = 'https://voe.sx/api';

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Account endpoints
  ACCOUNT_INFO: '/account/info',
  ACCOUNT_STATS: '/account/stats',

  // Upload endpoints
  UPLOAD_SERVER: '/upload/server',
  UPLOAD_URL: '/upload/url',
  UPLOAD_URL_LIST: '/upload/url/list',

  // File endpoints
  FILE_CLONE: '/file/clone',
  FILE_INFO: '/file/info',
  FILE_LIST: '/file/list',
  FILE_RENAME: '/file/rename',
  FILE_SET_FOLDER: '/file/set_folder',
  FILE_DELETE: '/file/delete',

  // Folder endpoints
  FOLDER_LIST: '/folder/list',
  FOLDER_CREATE: '/folder/create',
  FOLDER_RENAME: '/folder/rename',

  // History endpoints
  FILES_DELETED: '/files/deleted',
  DMCA_LIST: '/dmca/list',

  // Settings endpoints
  SETTINGS_DOMAIN: '/settings/domain',

  // Premium reseller endpoints
  PREMIUM_GENERATE: '/reseller/premium/generate',
} as const;

/**
 * Default configuration
 */
export const DEFAULT_CONFIG = {
  baseURL: VOE_API_BASE_URL,
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

/**
 * Rate limit configuration
 */
export const RATE_LIMIT = {
  requestsPerSecond: 3,
  maxRequests: 4,
  timeWindow: 1000, // 1 second
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  MISSING_API_KEY: 'API key is required',
  INVALID_API_KEY: 'Invalid API key provided',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  NETWORK_ERROR: 'Network error occurred',
  INVALID_RESPONSE: 'Invalid response from server',
  FILE_NOT_FOUND: 'File not found',
  FOLDER_NOT_FOUND: 'Folder not found',
  UNAUTHORIZED: 'Unauthorized request',
  SERVER_ERROR: 'Server error occurred',
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;
