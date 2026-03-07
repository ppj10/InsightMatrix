import { configureStore } from '@reduxjs/toolkit'
import metricsReducer from './slices/metricsSlice.ts'
import usersReducer from './slices/usersSlice.ts'
import authReducer from './slices/authSlice.ts'
import chartReducer from './slices/chartSlice.ts'

export const store = configureStore({
  reducer: {
    metrics: metricsReducer,
    users: usersReducer,
    auth: authReducer,
    charts: chartReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
