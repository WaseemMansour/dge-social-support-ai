export interface AppError {
  status: number | 'FETCH_ERROR' | 'PARSING_ERROR' | 'TIMEOUT_ERROR' | 'UNKNOWN_ERROR'
  code?: string
  message: string
  fieldErrors?: Record<string, string[]>
  raw?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function normalizeApiError(error: unknown): AppError {
  if (!error) {
    return {
      status: 'UNKNOWN_ERROR',
      message: 'Unknown error occurred',
      raw: error,
    }
  }

  // RTK Query fetchBaseQuery error shape
  if (isRecord(error) && 'status' in error) {
    const status = (error as { status: unknown }).status
    // HTTP error with data
    if (typeof status === 'number') {
      const data = (error as { data?: unknown }).data
      const dataRecord = isRecord(data) ? data : undefined
      const message = typeof dataRecord?.message === 'string'
        ? dataRecord.message
        : mapStatusToDefaultMessage(status)
      const fieldErrors = (isRecord(dataRecord?.errors) ? dataRecord?.errors as Record<string, string[]> : undefined)
      return {
        status,
        message,
        fieldErrors,
        raw: error,
      }
    }
    // Non-HTTP statuses like FETCH_ERROR/PARSING_ERROR
    if (
      status === 'FETCH_ERROR' ||
      status === 'PARSING_ERROR' ||
      status === 'TIMEOUT_ERROR'
    ) {
      const errMessage = (error as { error?: unknown }).error
      return {
        status,
        message: typeof errMessage === 'string' ? errMessage : mapStatusToDefaultMessage(status),
        raw: error,
      }
    }
  }

  // SerializedError or plain Error
  if (isRecord(error) && typeof (error as { message?: unknown }).message === 'string') {
    return {
      status: 'UNKNOWN_ERROR',
      message: String((error as { message: unknown }).message),
      raw: error,
    }
  }

  return {
    status: 'UNKNOWN_ERROR',
    message: 'Unknown error occurred',
    raw: error,
  }
}

export function mapStatusToDefaultMessage(status: number | 'FETCH_ERROR' | 'PARSING_ERROR' | 'TIMEOUT_ERROR' | 'UNKNOWN_ERROR'): string {
  if (typeof status === 'number') {
    if (status === 400) return 'Invalid request'
    if (status === 401) return 'You are not authorized. Please sign in.'
    if (status === 403) return 'You do not have permission to perform this action.'
    if (status === 404) return 'Requested resource was not found.'
    if (status === 409) return 'Request could not be completed due to a conflict.'
    if (status === 422) return 'Validation failed.'
    if (status === 429) return 'Too many requests. Please try again later.'
    if (status >= 500) return 'A server error occurred. Please try again.'
    return 'Request failed'
  }

  if (status === 'FETCH_ERROR') return 'Network error. Check your connection and try again.'
  if (status === 'PARSING_ERROR') return 'Received an unexpected response from the server.'
  if (status === 'TIMEOUT_ERROR') return 'The request timed out. Please try again.'
  return 'An unexpected error occurred.'
}

export function getUserMessage(appError: AppError, translate?: (key: string) => string): string {
  if (!translate) return appError.message
  // Simple mapping to i18n keys keeping defaults as fallback
  if (typeof appError.status === 'number') {
    if (appError.status === 401) return translate('errors.unauthorized') || appError.message
    if (appError.status === 403) return translate('errors.forbidden') || appError.message
    if (appError.status === 404) return translate('errors.notFound') || appError.message
    if (appError.status === 429) return translate('errors.rateLimited') || appError.message
    if (appError.status >= 500) return translate('errors.server') || appError.message
    if (appError.status === 400 || appError.status === 422) return translate('errors.validation') || appError.message
    return translate('errors.requestFailed') || appError.message
  }
  if (appError.status === 'FETCH_ERROR') return translate('errors.network') || appError.message
  if (appError.status === 'PARSING_ERROR') return translate('errors.unexpectedResponse') || appError.message
  if (appError.status === 'TIMEOUT_ERROR') return translate('errors.timeout') || appError.message
  return translate('errors.unknown') || appError.message
}

export function handleApiError(error: unknown, translate?: (key: string) => string): AppError {
  const normalized = normalizeApiError(error)
  return {
    ...normalized,
    message: getUserMessage(normalized, translate),
  }
}


