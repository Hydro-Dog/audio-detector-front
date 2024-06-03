import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ErrorResponse } from '@shared/index';
import { fetchCurrentUserInfo, loginUser, registerUser } from './actions';
import { User } from './types';

export type UserState = {
  currentUser: User | null;
  currentUserIsLoading: boolean;
  currentUserError: ErrorResponse | null;
};

const initialState: UserState = {
  currentUser: null,
  currentUserIsLoading: false,
  currentUserError: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUserInfo.pending, (state) => {
        state.currentUserIsLoading = true;
      })
      .addCase(fetchCurrentUserInfo.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
        state.currentUserIsLoading = false;
      })
      .addCase(fetchCurrentUserInfo.rejected, (state, action) => {
        state.currentUserIsLoading = false;
        state.currentUserError = action.payload ?? { message: 'Failed to fetch user information' };
      })
      .addCase(registerUser.pending, (state) => {
        state.currentUserIsLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
        state.currentUserIsLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.currentUserIsLoading = false;
        state.currentUserError = action.payload ?? { message: 'Failed to register user' };
      })
      .addCase(loginUser.pending, (state) => {
        state.currentUserIsLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
        state.currentUserIsLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.currentUserIsLoading = false;
        state.currentUserError = action.payload ?? { message: 'Failed to login user' };
      });
  },
});
