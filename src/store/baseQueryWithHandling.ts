import { retry } from '@reduxjs/toolkit/query'
import { fetchBaseQuery, type BaseQueryApi, type FetchArgs, type FetchBaseQueryError, type FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react'
import { normalizeApiError } from '../lib/api-error'

export function createBaseQueryWithHandling(baseUrl: string) {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    }
  })

  const baseQuery = retry(rawBaseQuery, { maxRetries: 0 })

  return async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions?: unknown
  ) => {
    const result = await baseQuery(args, api, extraOptions)

    if ('error' in result && result.error) {
      const _normalized = normalizeApiError(result.error as unknown)
      // Do not toast here; let the global middleware handle notifications to avoid duplicates
      // Return RTKQ error untouched so components select error as usual
      return result as { error: FetchBaseQueryError; meta?: FetchBaseQueryMeta }
    }

    return result
  }
}


