import { createAsyncThunk } from '@reduxjs/toolkit';
import { ErrorResponse, VideoSettingsType, api } from '@shared/index';
import axios from 'axios';

export const fetchVideoSettings = createAsyncThunk<
  VideoSettingsType,
  void,
  { rejectValue: ErrorResponse }
>('/fetchVideoSettings', async (_, thunkAPI) => {
  try {
    const response = await api.post<VideoSettingsType>('/videoSettings');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data as ErrorResponse);
    } else {
      return thunkAPI.rejectWithValue({ errorMessage: 'An unknown error occurred' });
    }
  }
});

export const updateVideoSettings = createAsyncThunk<
  VideoSettingsType,
  VideoSettingsType,
  { rejectValue: ErrorResponse }
>('/updateVideoSettings', async (settings, thunkAPI) => {
  try {
    const response = await api.put<VideoSettingsType>('/videoSettings', settings);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data as ErrorResponse);
    } else {
      return thunkAPI.rejectWithValue({ errorMessage: 'An unknown error occurred' });
    }
  }
});
