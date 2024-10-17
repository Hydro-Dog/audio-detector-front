import { createAsyncThunk } from '@reduxjs/toolkit';
import { ErrorResponse } from '@shared/index';
import { api } from '@store/middleware';
import axios from 'axios';
import {
  CallHistoryParams,
  CallHistoryRecord,
  SearchRequestParams,
  SearchResponse,
  User,
  UserAuthorization,
  UserLoginDTO,
  UserRegisterDTO,
} from './types';

export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: ErrorResponse }>(
  '/fetchCurrentUser',
  async (_, thunkAPI) => {
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

export const fetchUser = createAsyncThunk<User, string, { rejectValue: ErrorResponse }>(
  'user/fetchUser',
  async (userId, thunkAPI) => {
    try {
      const response = await api.get<User>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Return the error message as part of the rejection
        return thunkAPI.rejectWithValue(error.response.data as ErrorResponse);
      } else {
        // Handle unexpected errors
        return thunkAPI.rejectWithValue({ errorMessage: 'An unknown error occurred' });
      }
    }
  },
);

export const updateCurrentUser = createAsyncThunk<User, User, { rejectValue: ErrorResponse }>(
  '/updateCurrentUser',
  async (userData, thunkAPI) => {
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
    const response = await api.post<UserAuthorization>(`/auth/login`, userData);
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

export const fetchUsers = createAsyncThunk<
  SearchResponse<User>, // Тип возвращаемого значения
  SearchRequestParams, // Тип аргумента
  { rejectValue: ErrorResponse } // Тип возвращаемого ошибки
>('user/fetchUsers', async (params, thunkAPI) => {
  try {
    const queryString = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 10),
      search: params.search || '',
      sort: params.sort || '',
      order: params.order || 'asc',
    }).toString();

    const response = await api.get<SearchResponse<User>>(`/users?${queryString}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data as ErrorResponse);
    } else {
      return thunkAPI.rejectWithValue({ errorMessage: 'An unknown error occurred' });
    }
  }
});

export const fetchCallHistory = createAsyncThunk<
  SearchResponse<CallHistoryRecord>,
  CallHistoryParams,
  { rejectValue: ErrorResponse }
>('callHistory/fetchCallHistory', async (params, thunkAPI) => {
  try {
    const queryString = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 10),
      search: params.search || '',
      sort: params.sort || '',
      order: params.order || 'asc',
    }).toString();

    const response = await api.get<SearchResponse<CallHistoryRecord>>(
      `/users/${params.userId}/callHistory?${queryString}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Assuming your ErrorResponse is structured this way
      return thunkAPI.rejectWithValue(error.response.data as ErrorResponse);
    } else {
      return thunkAPI.rejectWithValue({ errorMessage: 'An unknown error occurred' });
    }
  }
});
