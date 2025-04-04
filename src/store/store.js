import authenticationSlice from "./slices/authenticationSlice.jsx";
import tokenSlice from "./slices/tokenSlicer.jsx";
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from "redux-persist"

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ["authentication", "token"],
}

const rootReducer = combineReducers({
  authentication: authenticationSlice,
    token: tokenSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store)