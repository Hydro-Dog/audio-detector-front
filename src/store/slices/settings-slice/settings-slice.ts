// userAsyncActions.ts
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ErrorResponse } from '@shared/index';
import { fetchSettings, updateSettings } from './actions';
import { Settings } from './types';

interface SettingsState {
  settings: Settings | null;
  settingsIsLoading: boolean;
  settingsError: ErrorResponse | null;
}

const initialState: SettingsState = {
  settings: null,
  settingsIsLoading: false,
  settingsError: null,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.settingsIsLoading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action: PayloadAction<Settings>) => {
        state.settings = action.payload;
        state.settingsIsLoading = false;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.settingsIsLoading = false;
        state.settingsError = action.payload ?? {
          message: 'Failed to fetch settings information',
        };
      })
      .addCase(updateSettings.pending, (state) => {
        state.settingsIsLoading = true;
      })
      .addCase(updateSettings.fulfilled, (state, action: PayloadAction<Settings>) => {
        state.settings = action.payload;
        state.settingsIsLoading = false;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.settingsIsLoading = false;
        state.settingsError = action.payload ?? {
          message: 'Failed to update settings information',
        };
      });
  },
});
