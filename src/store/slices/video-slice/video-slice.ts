import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ErrorResponse, VideoSettingsType } from '@shared/index';
import { fetchVideoSettings, updateVideoSettings } from './actions';
import { FETCH_STATUS } from '../../types/fetch-status';

export type VideoSettingsState = {
  videoSettings: VideoSettingsType | null;
  fetchVideoSettingsStatus: FETCH_STATUS;
  fetchVideoSettingsError: ErrorResponse | null;
  updateVideoSettingsStatus: FETCH_STATUS;
  updateVideoSettingsError: ErrorResponse | null;
};

const initialState: VideoSettingsState = {
  videoSettings: null,
  fetchVideoSettingsStatus: FETCH_STATUS.IDLE,
  fetchVideoSettingsError: null,
  updateVideoSettingsStatus: FETCH_STATUS.IDLE,
  updateVideoSettingsError: null,
};

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoSettings.pending, (state) => {
        state.fetchVideoSettingsStatus = FETCH_STATUS.LOADING;
      })
      .addCase(fetchVideoSettings.fulfilled, (state, action: PayloadAction<VideoSettingsType>) => {
        state.fetchVideoSettingsStatus = FETCH_STATUS.SUCCESS;
        state.videoSettings = action.payload;
        state.fetchVideoSettingsStatus = FETCH_STATUS.IDLE;
      })
      .addCase(fetchVideoSettings.rejected, (state, action) => {
        state.fetchVideoSettingsStatus = FETCH_STATUS.ERROR;
        state.fetchVideoSettingsError = action.payload ?? {
          errorMessage: 'Failed to fetch user information',
        };
        state.fetchVideoSettingsStatus = FETCH_STATUS.IDLE;
      })
      .addCase(updateVideoSettings.pending, (state) => {
        state.updateVideoSettingsStatus = FETCH_STATUS.LOADING;
      })
      .addCase(updateVideoSettings.fulfilled, (state, action: PayloadAction<VideoSettingsType>) => {
        state.updateVideoSettingsStatus = FETCH_STATUS.SUCCESS;
        state.videoSettings = action.payload;
        state.updateVideoSettingsStatus = FETCH_STATUS.IDLE;
      })
      .addCase(updateVideoSettings.rejected, (state, action) => {
        state.updateVideoSettingsStatus = FETCH_STATUS.ERROR;
        state.updateVideoSettingsError = action.payload ?? {
          errorMessage: 'Failed to fetch user information',
        };
        state.updateVideoSettingsStatus = FETCH_STATUS.IDLE;
      });
  },
});
