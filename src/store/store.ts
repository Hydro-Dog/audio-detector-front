import { configureStore } from '@reduxjs/toolkit';
import { wsMiddleware } from './middleware/ws-middleware';
import {
  userSlice,
  videoSlice,
  VideoSettingsState,
  UserState,
  alarmSlice,
  AlarmState,
  wsSlice,
} from './slices/';
import { AudioSettingsState, audioSlice } from './slices/audio-slice';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    videoSettings: videoSlice.reducer,
    audioSettings: audioSlice.reducer,
    alarm: alarmSlice.reducer,
    ws: wsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(wsMiddleware),
});

export type RootState = {
  user: UserState;
  videoSettings: VideoSettingsState;
  audioSettings: AudioSettingsState;
  alarmSlice: AlarmState;
};

export type AppDispatch = typeof store.dispatch;
