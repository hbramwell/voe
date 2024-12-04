import { AxiosInstance } from 'axios';
import FormData from 'form-data';
import {
  VoeConfig,
  VoeApiResponse,
  AccountInfo,
  DailyStats,
  UploadServerResponse,
  FileUploadResponse,
  RemoteUploadResponse,
  RemoteUploadStatus,
  FileInfo,
  FolderInfo,
  FileListParams,
  DMCAListParams,
  PremiumKeyGenerationParams,
  PremiumKeyResponse,
} from './types';
import { API_ENDPOINTS } from './constants';
import { createApiClient, withRetry } from './utils/api';
import {
  validate,
  configSchema,
  fileListSchema,
  dmcaListSchema,
  premiumKeySchema,
  fileCodeSchema,
  folderIdSchema,
  remoteUploadSchema,
} from './utils/validation';

/**
 * VOE API client class
 */
export class VoeClient {
  private readonly client: AxiosInstance;

  constructor(config: VoeConfig) {
    const validConfig = validate(configSchema, config);
    this.client = createApiClient(validConfig);
  }

  /**
   * Get account information
   */
  async getAccountInfo(): Promise<AccountInfo> {
    const response = await withRetry(() =>
      this.client.get<VoeApiResponse<AccountInfo>>(API_ENDPOINTS.ACCOUNT_INFO)
    );
    return response.data.result!;
  }

  /**
   * Get account statistics
   */
  async getAccountStats(): Promise<Record<string, DailyStats>> {
    const response = await withRetry(() =>
      this.client.get<VoeApiResponse<Record<string, DailyStats>>>(
        API_ENDPOINTS.ACCOUNT_STATS
      )
    );
    return response.data.result!;
  }

  /**
   * Get upload server URL
   */
  async getUploadServer(): Promise<string> {
    const response = await withRetry(() =>
      this.client.get<VoeApiResponse<string>>(API_ENDPOINTS.UPLOAD_SERVER)
    );
    return response.data.result!;
  }

  /**
   * Upload file to server
   */
  async uploadFile(
    file: Buffer | string,
    filename: string
  ): Promise<FileUploadResponse> {
    const serverUrl = await this.getUploadServer();
    const formData = new FormData();
    formData.append('file', file, filename);

    const response = await withRetry(() =>
      this.client.post<FileUploadResponse>(serverUrl, formData, {
        headers: formData.getHeaders(),
      })
    );
    return response.data;
  }

  /**
   * Add remote upload
   */
  async addRemoteUpload(
    url: string,
    folderId?: number
  ): Promise<RemoteUploadResponse> {
    const params = validate(remoteUploadSchema, { url, folder_id: folderId });
    const response = await withRetry(() =>
      this.client.post<VoeApiResponse<RemoteUploadResponse>>(
        API_ENDPOINTS.UPLOAD_URL,
        null,
        { params }
      )
    );
    return response.data.result!;
  }

  /**
   * Get remote upload list
   */
  async getRemoteUploadList(): Promise<RemoteUploadStatus[]> {
    const response = await withRetry(() =>
      this.client.get<VoeApiResponse<RemoteUploadStatus[]>>(
        API_ENDPOINTS.UPLOAD_URL_LIST
      )
    );
    return response.data.result!;
  }

  /**
   * Clone file
   */
  async cloneFile(fileCode: string, folderId?: number): Promise<FileInfo> {
    const validFileCode = validate(fileCodeSchema, fileCode);
    const validFolderId = folderId
      ? validate(folderIdSchema, folderId)
      : undefined;

    const response = await withRetry(() =>
      this.client.get<VoeApiResponse<FileInfo>>(API_ENDPOINTS.FILE_CLONE, {
        params: {
          file_code: validFileCode,
          fld_id: validFolderId,
        },
      })
    );
    return response.data.result!;
  }

  /**
   * Get file information
   */
  async getFileInfo(fileCodes: string | string[]): Promise<FileInfo[]> {
    const codes = Array.isArray(fileCodes) ? fileCodes : [fileCodes];
    const validCodes = codes.map((code) => validate(fileCodeSchema, code));

    const response = await withRetry(() =>
      this.client.get<VoeApiResponse<FileInfo[]>>(API_ENDPOINTS.FILE_INFO, {
        params: {
          file_code: validCodes.join(','),
        },
      })
    );
    return response.data.result!;
  }

  /**
   * Get file list
   */
  async getFileList(params?: FileListParams): Promise<FileInfo[]> {
    const validParams = params ? validate(fileListSchema, params) : undefined;

    const response = await withRetry(() =>
      this.client.get<VoeApiResponse<FileInfo[]>>(API_ENDPOINTS.FILE_LIST, {
        params: validParams,
      })
    );
    return response.data.result!;
  }

  /**
   * Rename file
   */
  async renameFile(fileCode: string, title: string): Promise<void> {
    const validFileCode = validate(fileCodeSchema, fileCode);

    await withRetry(() =>
      this.client.get<VoeApiResponse<void>>(API_ENDPOINTS.FILE_RENAME, {
        params: {
          file_code: validFileCode,
          title,
        },
      })
    );
  }

  /**
   * Move file to folder
   */
  async moveFileToFolder(fileCode: string, folderId: number): Promise<void> {
    const validFileCode = validate(fileCodeSchema, fileCode);
    const validFolderId = validate(folderIdSchema, folderId);

    await withRetry(() =>
      this.client.get<VoeApiResponse<void>>(API_ENDPOINTS.FILE_SET_FOLDER, {
        params: {
          file_code: validFileCode,
          fld_id: validFolderId,
        },
      })
    );
  }

  /**
   * Delete file
   */
  async deleteFile(fileCode: string | string[]): Promise<void> {
    const codes = Array.isArray(fileCode) ? fileCode : [fileCode];
    const validCodes = codes.map((code) => validate(fileCodeSchema, code));

    await withRetry(() =>
      this.client.get<VoeApiResponse<void>>(API_ENDPOINTS.FILE_DELETE, {
        params: {
          del_code: validCodes.join(','),
        },
      })
    );
  }

  /**
   * Get folder list
   */
  async getFolderList(folderId?: number): Promise<{
    folders: FolderInfo[];
    files: FileInfo[];
  }> {
    const validFolderId = folderId
      ? validate(folderIdSchema, folderId)
      : undefined;

    const response = await withRetry(() =>
      this.client.get<
        VoeApiResponse<{
          folders: FolderInfo[];
          files: FileInfo[];
        }>
      >(API_ENDPOINTS.FOLDER_LIST, {
        params: {
          fld_id: validFolderId,
        },
      })
    );
    return response.data.result!;
  }

  /**
   * Create folder
   */
  async createFolder(name: string, parentId?: number): Promise<number> {
    const validParentId = parentId
      ? validate(folderIdSchema, parentId)
      : undefined;

    const response = await withRetry(() =>
      this.client.get<VoeApiResponse<{ fld_id: number }>>(
        API_ENDPOINTS.FOLDER_CREATE,
        {
          params: {
            name,
            parent_id: validParentId,
          },
        }
      )
    );
    return response.data.result!.fld_id;
  }

  /**
   * Rename folder
   */
  async renameFolder(folderId: number, name: string): Promise<void> {
    const validFolderId = validate(folderIdSchema, folderId);

    await withRetry(() =>
      this.client.get<VoeApiResponse<void>>(API_ENDPOINTS.FOLDER_RENAME, {
        params: {
          fld_id: validFolderId,
          name,
        },
      })
    );
  }

  /**
   * Get deleted files
   */
  async getDeletedFiles(params?: DMCAListParams): Promise<FileInfo[]> {
    const validParams = params ? validate(dmcaListSchema, params) : undefined;

    const response = await withRetry(() =>
      this.client.get<VoeApiResponse<FileInfo[]>>(API_ENDPOINTS.FILES_DELETED, {
        params: validParams,
      })
    );
    return response.data.result!;
  }

  /**
   * Get DMCA list
   */
  async getDMCAList(params?: DMCAListParams): Promise<FileInfo[]> {
    const validParams = params ? validate(dmcaListSchema, params) : undefined;

    const response = await withRetry(() =>
      this.client.get<VoeApiResponse<FileInfo[]>>(API_ENDPOINTS.DMCA_LIST, {
        params: validParams,
      })
    );
    return response.data.result!;
  }

  /**
   * Get current adblock domain
   */
  async getCurrentDomain(): Promise<string> {
    const response = await withRetry(() =>
      this.client.get<VoeApiResponse<string>>(API_ENDPOINTS.SETTINGS_DOMAIN)
    );
    return response.data.result!;
  }

  /**
   * Generate premium keys
   */
  async generatePremiumKeys(
    params: PremiumKeyGenerationParams
  ): Promise<PremiumKeyResponse[]> {
    const validParams = validate(premiumKeySchema, params);

    const response = await withRetry(() =>
      this.client.get<VoeApiResponse<PremiumKeyResponse[]>>(
        API_ENDPOINTS.PREMIUM_GENERATE,
        {
          params: validParams,
        }
      )
    );
    return response.data.result!;
  }
}
