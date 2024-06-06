import { createAsyncThunk } from '@reduxjs/toolkit';
import { ErrorResponse, api } from '@shared/index';
import axios from 'axios';
import { User, UserAuthorization, UserLoginDTO, UserRegisterDTO } from './types';

export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: ErrorResponse }>(
  '/fetchCurrentUser',
  async (_, thunkAPI) => {
    console.log('fetchCurrentUser');
    try {
      const response = await api.get<User>('/user');
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

export const updateCurrentUser = createAsyncThunk<User, User, { rejectValue: ErrorResponse }>(
  '/updateCurrentUser',
  async (userData, thunkAPI) => {
    console.log('fetchCurrentUser');
    try {
      const response = await api.put<User>('/user', userData);
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

export const registerUser = createAsyncThunk<User, UserRegisterDTO, { rejectValue: ErrorResponse }>(
  '/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post<User>(`/register`, userData);
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

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVc2VyIGRldGFpbHMiLCJpZCI6IjZkOWVkMDE1LWVkY2QtNDE3OS1iNTQ1LTAxZjg1NmNkOGNkMyIsImlhdCI6MTcxNzYxMDA1MywiaXNzIjoiZGlzcGF0Y2hlciJ9.YCpBezyh5nGBGfAmDRqLHHLjFKauqjrNFHBhk9Haic4

export const loginUser = createAsyncThunk<
  UserAuthorization,
  UserLoginDTO,
  { rejectValue: ErrorResponse }
>('/loginUser', async (userData, thunkAPI) => {
  try {
    const response = await api.post<UserAuthorization>(`/login`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data as ErrorResponse);
    } else {
      return thunkAPI.rejectWithValue({ errorMessage: 'An unknown error occurred' });
    }
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: ErrorResponse }>(
  '/logoutUser',
  async (_, thunkAPI) => {
    try {
      const response = await api.get<void>(`/logout`);
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
