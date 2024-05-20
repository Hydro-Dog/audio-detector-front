import { createAsyncThunk } from '@reduxjs/toolkit';
import { ErrorResponse } from '@shared/index';
import axios from 'axios';
import { Settings, SettingsDTO } from './types';

export const fetchSettings = createAsyncThunk<Settings, void, { rejectValue: ErrorResponse }>(
  '/fetchSettings',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Settings>('/api/settings');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data as ErrorResponse);
      } else {
        return thunkAPI.rejectWithValue({ message: 'An unknown error occurred' });
      }
    }
  },
);

export const updateSettings = createAsyncThunk<
  Settings,
  SettingsDTO,
  { rejectValue: ErrorResponse }
>('/updateSettings', async (settings, thunkAPI) => {
  try {
    const response = await axios.put<Settings>('/api/settings', settings);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data as ErrorResponse);
    } else {
      return thunkAPI.rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
});
