import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth'

const rootReducer = combineReducers({
  auth: authReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware: any) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
})
