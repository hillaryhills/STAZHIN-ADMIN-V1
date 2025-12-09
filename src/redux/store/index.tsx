import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth'
import messageCenterReducer from '../messageCenter'
import userReducer from '../user'
import transactionReducer from '../transaction'
import appReducer from '../app'
import fxEngineReducer from '../fx-engine'
import bankMethodReducer from '../bankMethod'
import vaProviderReducer from '../vaProvider'
import complianceReducer from '../kVBCompliance'

const rootReducer = combineReducers({
  auth: authReducer,
  messageCenter: messageCenterReducer,
  user: userReducer,
  transaction: transactionReducer,
  app: appReducer,
  fxEngine: fxEngineReducer,
  bankMethod: bankMethodReducer,
  vaProvider: vaProviderReducer,
  compliance: complianceReducer
})

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
})

export type RootState = ReturnType<typeof rootReducer>

export type AppDispatch = typeof store.dispatch
