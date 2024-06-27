import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ErrorResponse } from '@shared/index';
import {
  updateCurrentUser,
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from './actions';
import { User, UserAuthorization } from './types';
import { FETCH_STATUS } from '../../types/fetch-status';

export type UserState = {
  currentUser: User | null;
  currentUserStatus: FETCH_STATUS;
  currentUserError: ErrorResponse | null;
  updateCurrentUserStatus: FETCH_STATUS;
  updateCurrentUserError: ErrorResponse | null;
  registerUserStatus: FETCH_STATUS;
  registerUserError: ErrorResponse | null;
  logoutStatus: FETCH_STATUS;
  logoutError: ErrorResponse | null;
  loginStatus: FETCH_STATUS;
  loginError: ErrorResponse | null;
};

const initialState: UserState = {
  currentUser: null,
  currentUserStatus: FETCH_STATUS.IDLE,
  currentUserError: null,
  updateCurrentUserStatus: FETCH_STATUS.IDLE,
  updateCurrentUserError: null,
  registerUserStatus: FETCH_STATUS.IDLE,
  registerUserError: null,
  logoutStatus: FETCH_STATUS.IDLE,
  logoutError: null,
  loginStatus: FETCH_STATUS.IDLE,
  loginError: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoginStatus: (state, action: PayloadAction<FETCH_STATUS>) => {
      state.loginStatus = action.payload;
    },
    setLogoutStatus: (state, action: PayloadAction<FETCH_STATUS>) => {
      state.logoutStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.currentUserStatus = FETCH_STATUS.LOADING;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUserStatus = FETCH_STATUS.SUCCESS;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.currentUserStatus = FETCH_STATUS.ERROR;
        state.currentUserError = action.payload ?? {
          errorMessage: 'Failed to fetch user information',
        };
      })
      .addCase(updateCurrentUser.pending, (state) => {
        state.updateCurrentUserStatus = FETCH_STATUS.LOADING;
      })
      .addCase(updateCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.updateCurrentUserStatus = FETCH_STATUS.SUCCESS;
        state.currentUser = action.payload;
        state.updateCurrentUserStatus = FETCH_STATUS.IDLE;
      })
      .addCase(updateCurrentUser.rejected, (state, action) => {
        state.updateCurrentUserStatus = FETCH_STATUS.ERROR;
        state.updateCurrentUserError = action.payload ?? {
          errorMessage: 'Failed to fetch user information',
        };
        state.updateCurrentUserStatus = FETCH_STATUS.IDLE;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerUserStatus = FETCH_STATUS.LOADING;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerUserStatus = FETCH_STATUS.SUCCESS;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUserStatus = FETCH_STATUS.ERROR;
        state.registerUserError = action.payload ?? { errorMessage: 'Failed to register user' };
      })
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = FETCH_STATUS.LOADING;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserAuthorization>) => {
        state.loginStatus = FETCH_STATUS.SUCCESS;
        localStorage.setItem('token', action.payload.Authorization);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = FETCH_STATUS.ERROR;
        state.loginError = action.payload ?? { errorMessage: 'Failed to login user' };
      })
      .addCase(logoutUser.pending, (state, action) => {
        state.logoutStatus = FETCH_STATUS.LOADING;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.logoutStatus = FETCH_STATUS.SUCCESS;
        localStorage.removeItem('token');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutStatus = FETCH_STATUS.ERROR;
        state.logoutError = action.payload ?? { errorMessage: 'Failed to logout user' };
      });
  },
});

export const { setLoginStatus, setLogoutStatus } = userSlice.actions;
