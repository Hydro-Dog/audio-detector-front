import { createAsyncThunk } from '@reduxjs/toolkit';
import { AudioSettingsType, ErrorResponse } from '@shared/index';
import axios from 'axios';
import { AudioSettingsDTO } from './types';
import { api } from '@store/middleware';

export const fetchAudioSettings = createAsyncThunk<
  AudioSettingsType,
  void,
  { rejectValue: ErrorResponse }
>('/fetchVideoSettings', async (_, thunkAPI) => {
  try {
    const response = await api.get<AudioSettingsType>('/audioSettings');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data as ErrorResponse);
    } else {
      return thunkAPI.rejectWithValue({ errorMessage: 'An unknown error occurred' });
    }
  }
});

export const updateAudioSettings = createAsyncThunk<
  AudioSettingsType,
  AudioSettingsDTO,
  { rejectValue: ErrorResponse }
>('/updateVideoSettings', async (settings, thunkAPI) => {
  const { thresholdVolumeLevelNormalized, sensitivityCoefficient } = settings;
  try {
    const response = await api.put<AudioSettingsType>('/audioSettings', {
      thresholdVolumeLevelNormalized,
      sensitivityCoefficient,
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
