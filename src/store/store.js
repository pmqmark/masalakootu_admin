import { configureStore } from "@reduxjs/toolkit";
import authenticationSlice from "./slices/authenticationSlice.jsx";
import tokenSlice from "./slices/tokenSlicer.jsx";

export const store = configureStore({
  reducer: {
    authentication: authenticationSlice,
    token: tokenSlice
  }
});
