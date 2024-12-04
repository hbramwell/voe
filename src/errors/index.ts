/**
 * Base error class for VOE API errors
 */
export class VoeError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when API key is missing or invalid
 */
export class VoeAuthenticationError extends VoeError {
  constructor(message: string, status?: number) {
    super(message, 'AUTHENTICATION_ERROR', status);
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class VoeRateLimitError extends VoeError {
  constructor(message: string, status?: number) {
    super(message, 'RATE_LIMIT_ERROR', status);
  }
}

/**
 * Error thrown when network request fails
 */
export class VoeNetworkError extends VoeError {
  constructor(message: string, status?: number) {
    super(message, 'NETWORK_ERROR', status);
  }
}

/**
 * Error thrown when API response is invalid
 */
export class VoeResponseError extends VoeError {
  constructor(message: string, status?: number, data?: unknown) {
    super(message, 'RESPONSE_ERROR', status, data);
  }
}

/**
 * Error thrown when resource is not found
 */
export class VoeNotFoundError extends VoeError {
  constructor(message: string, status?: number) {
    super(message, 'NOT_FOUND_ERROR', status);
  }
}

/**
 * Error thrown when validation fails
 */
export class VoeValidationError extends VoeError {
  constructor(message: string, status?: number, data?: unknown) {
    super(message, 'VALIDATION_ERROR', status, data);
  }
}

/**
 * Error thrown when server returns an error
 */
export class VoeServerError extends VoeError {
  constructor(message: string, status?: number) {
    super(message, 'SERVER_ERROR', status);
  }
}
