import { configureStore } from '@reduxjs/toolkit';
import { userSlice, settingsSlice, SettingsState, UserState } from './slices/';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    settings: settingsSlice.reducer,
  },
});

export type RootState = {
  user: UserState;
  settings: SettingsState;
};
export type AppDispatch = typeof store.dispatch;
