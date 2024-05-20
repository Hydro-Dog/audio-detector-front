import { configureStore } from '@reduxjs/toolkit';
import { userSlice, settingsSlice } from './slices/';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    settings: settingsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
