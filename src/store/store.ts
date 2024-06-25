import { configureStore } from '@reduxjs/toolkit';
import {
  userSlice,
  videoSlice,
  VideoSettingsState,
  UserState,
  alertSlice,
  AlertState,
} from './slices/';
import { AudioSettingsState, audioSlice } from './slices/audio-slice';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    videoSettings: videoSlice.reducer,
    audioSettings: audioSlice.reducer,
    alert: alertSlice.reducer,
  },
});

export type RootState = {
  user: UserState;
  videoSettings: VideoSettingsState;
  audioSettings: AudioSettingsState;
  alertSlice: AlertState;
};
export type AppDispatch = typeof store.dispatch;
