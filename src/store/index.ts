import { configureStore, isRejectedWithValue, type Middleware } from '@reduxjs/toolkit'
import { normalizeApiError } from '../lib/api-error'
import { toastError } from '../lib/toast'
import { financialAssistanceApi } from './api/financialAssistanceApi'
import formSlice from './slices/formSlice'

const recentRejectedRequests = new Map<string, number>()
const REQUEST_TTL_MS = 10_000

const globalErrorMiddleware: Middleware = () => next => action => {
  if (isRejectedWithValue(action)) {
    const requestId = (action.meta && (action.meta as { requestId?: string }).requestId) || undefined
    if (requestId) {
      const seenAt = recentRejectedRequests.get(requestId)
      const nowTs = Date.now()
      if (seenAt && nowTs - seenAt < REQUEST_TTL_MS) {
        return next(action)
      }
      // record this requestId
      recentRejectedRequests.set(requestId, nowTs)
      // opportunistic cleanup
      for (const [id, ts] of Array.from(recentRejectedRequests.entries())) {
        if (nowTs - ts > REQUEST_TTL_MS) recentRejectedRequests.delete(id)
      }
    }
    const normalized = normalizeApiError(action.payload)
    toastError(normalized.message)
  }
  return next(action)
}

export const store = configureStore({
  reducer: {
    form: formSlice,
    [financialAssistanceApi.reducerPath]: financialAssistanceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // No ignored paths needed - all data is now serializable
      },
    }).concat(financialAssistanceApi.middleware, globalErrorMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// (moved above store creation)
