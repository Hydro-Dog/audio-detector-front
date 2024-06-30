import { createAsyncThunk } from '@reduxjs/toolkit';
import { ErrorResponse, api } from '@shared/index';
import axios from 'axios';
import { AlertType, } from './types';

export const sendAlert = createAsyncThunk<AlertType, AlertType, { rejectValue: ErrorResponse }>(
  'alarm',
  async (alarmData, thunkAPI) => {
    try {
      const response = await api.post<AlertType>('alarm', alarmData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data as ErrorResponse);
      } else {
        return thunkAPI.rejectWithValue({ errorMessage: 'An unknown error occurred' });
      }
    }
  },
);
