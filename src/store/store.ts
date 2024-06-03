import { configureStore } from '@reduxjs/toolkit';
import { userSlice, settingsSlice, SettingsState, UserState } from './slices/';
import { tokenMiddleware } from './middleware';

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tokenMiddleware),
  reducer: {
    user: userSlice.reducer,
    settings: settingsSlice.reducer,
  },
});

// export type RootState = ReturnType<typeof store.getState>;
export type RootState = {
  user: UserState;
  settings: SettingsState;
};
export type AppDispatch = typeof store.dispatch;
