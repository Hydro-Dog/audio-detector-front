import { configureStore } from '@reduxjs/toolkit';
import { userSlice, videoSlice, VideoSettingsState, UserState } from './slices/';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    videoSettings: videoSlice.reducer,
  },
});

export type RootState = {
  user: UserState;
  videoSettings: VideoSettingsState;
};
export type AppDispatch = typeof store.dispatch;
