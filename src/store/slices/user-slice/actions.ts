import { createAsyncThunk } from '@reduxjs/toolkit';
import { ErrorResponse } from '@shared/index';
import axios from 'axios';
import { User, UserLoginDTO, UserRegisterDTO } from './types';

export const fetchCurrentUserInfo = createAsyncThunk<User, void, { rejectValue: ErrorResponse }>(
  '/fetchCurrentUserInfo',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<User>('/api/user');
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

export const registerUser = createAsyncThunk<User, UserRegisterDTO, { rejectValue: ErrorResponse }>(
  '/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post<User>('/api/register', userData);
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

export const loginUser = createAsyncThunk<User, UserLoginDTO, { rejectValue: ErrorResponse }>(
  '/loginUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post<User>('/api/login', userData);
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
