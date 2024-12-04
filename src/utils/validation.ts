import { z } from 'zod';
import { VoeValidationError } from '../errors';
import { ERROR_MESSAGES } from '../constants';

/**
 * Configuration schema
 */
export const configSchema = z.object({
  apiKey: z.string().min(1, ERROR_MESSAGES.MISSING_API_KEY),
  baseURL: z.string().url().optional(),
  timeout: z.number().positive().optional(),
  retryAttempts: z.number().positive().optional(),
  retryDelay: z.number().positive().optional(),
});

/**
 * Pagination parameters schema
 */
export const paginationSchema = z.object({
  page: z.number().positive().optional(),
  per_page: z.number().positive().optional(),
});

/**
 * File list parameters schema
 */
export const fileListSchema = paginationSchema.extend({
  fld_id: z.number().nonnegative().optional(),
  created: z.union([z.string(), z.number()]).optional(),
  name: z.string().optional(),
  preview: z.boolean().optional(),
});

/**
 * DMCA list parameters schema
 */
export const dmcaListSchema = paginationSchema.extend({
  last: z.number().positive().optional(),
  pending: z.boolean().optional(),
});

/**
 * Premium key generation parameters schema
 */
export const premiumKeySchema = z.object({
  days: z.number().positive(),
  amount: z.number().positive(),
});

/**
 * File code schema
 */
export const fileCodeSchema = z.string().min(1);

/**
 * Folder ID schema
 */
export const folderIdSchema = z.number().nonnegative();

/**
 * Remote upload URL schema
 */
export const remoteUploadSchema = z.object({
  url: z.string().url(),
  folder_id: folderIdSchema.optional(),
});

/**
 * Validate data against schema
 */
export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new VoeValidationError('Validation failed', 400, error.errors);
    }
    throw error;
  }
};
