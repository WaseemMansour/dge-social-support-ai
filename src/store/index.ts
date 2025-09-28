import { configureStore } from '@reduxjs/toolkit'
import { financialAssistanceApi } from './api/financialAssistanceApi'
import formSlice from './slices/formSlice'

export const store = configureStore({
  reducer: {
    form: formSlice,
    [financialAssistanceApi.reducerPath]: financialAssistanceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(financialAssistanceApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
