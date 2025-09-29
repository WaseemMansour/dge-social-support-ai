import { retry, type RetryOptions } from '@reduxjs/toolkit/query'
import { fetchBaseQuery, type BaseQueryApi, type FetchArgs, type FetchBaseQueryError, type FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react'

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
    extraOptions?: RetryOptions
  ) => {
    const result = await baseQuery(args, api, extraOptions || {})

    if ('error' in result && result.error) {
      // Do not toast here; let the global middleware handle notifications to avoid duplicates
      // Error is normalized by the global middleware
      // Return RTKQ error untouched so components select error as usual
      return result as { error: FetchBaseQueryError; meta?: FetchBaseQueryMeta }
    }

    return result
  }
}


