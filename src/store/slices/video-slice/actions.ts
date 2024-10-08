import { createAsyncThunk } from '@reduxjs/toolkit';
import { ErrorResponse, VideoSettingsType } from '@shared/index';
import { api } from '@store/middleware';
import axios from 'axios';
import { VideoSettingsDTO } from './types';

export const fetchVideoSettings = createAsyncThunk<
  VideoSettingsDTO,
  void,
  { rejectValue: ErrorResponse }
>('/fetchVideoSettings', async (_, thunkAPI) => {
  try {
    const response = await api.get<VideoSettingsDTO>('/videoSettings');
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
  VideoSettingsDTO,
  { rejectValue: ErrorResponse }
>('/updateVideoSettings', async (settings, thunkAPI) => {
  const { range, motionCoefficient } = settings;

  try {
    const response = await api.put<VideoSettingsType>('/videoSettings', {
      range,
      motionCoefficient,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data as ErrorResponse);
    } else {
      return thunkAPI.rejectWithValue({ errorMessage: 'An unknown error occurred' });
    }
  }
});
