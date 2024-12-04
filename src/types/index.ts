/**
 * Base response interface for all VOE API responses
 */
export interface VoeApiResponse<T = unknown> {
  server_time: string;
  msg: string;
  message: string;
  status: number;
  success: boolean;
  result?: T;
}

/**
 * Account information response
 */
export interface AccountInfo {
  email: string;
  balance: string;
  storage_used: number;
  storage_left: number;
  premium_until: string;
  partner_until: string;
}

/**
 * Statistics data for a specific date
 */
export interface DailyStats {
  date: string;
  views: number;
  views_adb: number;
  views_vpn_proxy: number;
  views_paid: number;
  views_tor: number;
  uploads: number;
  downloads: number;
  profit_total: number;
  views_total: number;
}

/**
 * Upload server response
 */
export interface UploadServerResponse {
  server_url: string;
}

/**
 * File upload response
 */
export interface FileUploadResponse {
  success: boolean;
  message: string;
  file: {
    id: number;
    file_code: string;
    file_title: string;
    encoding_necessary: boolean;
  };
}

/**
 * Remote upload response
 */
export interface RemoteUploadResponse {
  file_code: string;
  queueID: number;
}

/**
 * Remote upload status
 */
export interface RemoteUploadStatus {
  id: number;
  folder_id: number;
  file_code: string;
  url: string;
  status: number;
  status_note: string;
  created_at: string;
  started_at: string | null;
  updated_at: string;
  total_size: number;
  loaded_size: number;
  speed: number;
  estimated_duration: number;
  percent: number;
  additional_headers: string | null;
}

/**
 * File information
 */
export interface FileInfo {
  status: number;
  fileCode: string;
  name: string;
  title: string;
  length: number;
  file_size: number;
}

/**
 * Folder information
 */
export interface FolderInfo {
  fld_id: number;
  name: string;
}

/**
 * Configuration options for the VOE client
 */
export interface VoeConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

/**
 * File list parameters
 */
export interface FileListParams extends PaginationParams {
  fld_id?: number;
  created?: string | number;
  name?: string;
  preview?: boolean;
}

/**
 * DMCA list parameters
 */
export interface DMCAListParams extends PaginationParams {
  last?: number;
  pending?: boolean;
}

/**
 * Premium key generation parameters
 */
export interface PremiumKeyGenerationParams {
  days: number;
  amount: number;
}

/**
 * Premium key generation response
 */
export interface PremiumKeyResponse {
  key: string;
  days: number;
}
