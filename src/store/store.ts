import { configureStore } from '@reduxjs/toolkit';
import { userSlice, videoSlice, VideoSettingsState, UserState } from './slices/';
import { AudioSettingsState, audioSlice } from './slices/audio-slice';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    videoSettings: videoSlice.reducer,
    audioSettings: audioSlice.reducer,
  },
});

export type RootState = {
  user: UserState;
  videoSettings: VideoSettingsState;
  audioSettings: AudioSettingsState;
};
export type AppDispatch = typeof store.dispatch;
