import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AudioSettingsType, ErrorResponse } from '@shared/index';
import { fetchAudioSettings, updateAudioSettings } from './actions';
import { FETCH_STATUS } from '../../types/fetch-status';

export type AudioSettingsState = {
  audioSettings: AudioSettingsType | null;
  fetchAudioSettingsStatus: FETCH_STATUS;
  fetchAudioSettingsError: ErrorResponse | null;
  updateAudioSettingsStatus: FETCH_STATUS;
  updateAudioSettingsError: ErrorResponse | null;
};

const initialState: AudioSettingsState = {
  audioSettings: null,
  fetchAudioSettingsStatus: FETCH_STATUS.IDLE,
  fetchAudioSettingsError: null,
  updateAudioSettingsStatus: FETCH_STATUS.IDLE,
  updateAudioSettingsError: null,
};

export const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAudioSettings.pending, (state) => {
        state.fetchAudioSettingsStatus = FETCH_STATUS.LOADING;
      })
      .addCase(fetchAudioSettings.fulfilled, (state, action: PayloadAction<AudioSettingsType>) => {
        state.fetchAudioSettingsStatus = FETCH_STATUS.SUCCESS;
        state.audioSettings = action.payload;
        state.fetchAudioSettingsStatus = FETCH_STATUS.IDLE;
      })
      .addCase(fetchAudioSettings.rejected, (state, action) => {
        state.fetchAudioSettingsStatus = FETCH_STATUS.ERROR;
        state.fetchAudioSettingsError = action.payload ?? {
          errorMessage: 'Failed to fetch user information',
        };
        state.fetchAudioSettingsStatus = FETCH_STATUS.IDLE;
      })
      .addCase(updateAudioSettings.pending, (state) => {
        state.updateAudioSettingsStatus = FETCH_STATUS.LOADING;
      })
      .addCase(updateAudioSettings.fulfilled, (state, action: PayloadAction<AudioSettingsType>) => {
        state.updateAudioSettingsStatus = FETCH_STATUS.SUCCESS;
        state.audioSettings = action.payload;
        state.updateAudioSettingsStatus = FETCH_STATUS.IDLE;
      })
      .addCase(updateAudioSettings.rejected, (state, action) => {
        state.updateAudioSettingsStatus = FETCH_STATUS.ERROR;
        state.updateAudioSettingsError = action.payload ?? {
          errorMessage: 'Failed to fetch user information',
        };
        state.updateAudioSettingsStatus = FETCH_STATUS.IDLE;
      });
  },
});
