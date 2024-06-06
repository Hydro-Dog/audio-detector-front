import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ErrorResponse } from '@shared/index';
import { updateCurrentUser, fetchCurrentUser, loginUser, logoutUser, registerUser } from './actions';
import { User, UserAuthorization } from './types';

export type UserState = {
  currentUser: User | null;
  currentUserStatus: 'idle' | 'loading' | 'success' | 'error';
  currentUserError: ErrorResponse | null;
  editCurrentUserStatus: 'idle' | 'loading' | 'success' | 'error';
  registerUserStatus: 'idle' | 'loading' | 'success' | 'error';
  registerUserError: ErrorResponse | null;
  logoutStatus: 'idle' | 'loading' | 'success' | 'error';
  logoutError: ErrorResponse | null;
  loginStatus: 'idle' | 'loading' | 'success' | 'error';
  loginError: ErrorResponse | null;
};

const initialState: UserState = {
  currentUser: null,
  currentUserStatus: 'idle',
  currentUserError: null,
  editCurrentUserStatus: 'idle',
  registerUserStatus: 'idle',
  registerUserError: null,
  logoutStatus: 'idle',
  logoutError: null,
  loginStatus: 'idle',
  loginError: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoginStatus: (state, action: PayloadAction<'idle' | 'loading' | 'success' | 'error'>) => {
      state.loginStatus = action.payload;
    },
    setLogoutStatus: (state, action: PayloadAction<'idle' | 'loading' | 'success' | 'error'>) => {
      state.logoutStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.currentUserStatus = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUserStatus = 'success';
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.currentUserStatus = 'error';
        state.currentUserError = action.payload ?? {
          errorMessage: 'Failed to fetch user information',
        };
      })
      .addCase(updateCurrentUser.pending, (state) => {
        state.editCurrentUserStatus = 'loading';
      })
      .addCase(updateCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.editCurrentUserStatus = 'success';
        state.currentUser = action.payload;
        state.editCurrentUserStatus = 'idle';
      })
      .addCase(updateCurrentUser.rejected, (state, action) => {
        state.editCurrentUserStatus = 'error';
        state.currentUserError = action.payload ?? {
          errorMessage: 'Failed to fetch user information',
        };
        state.editCurrentUserStatus = 'idle';
      })
      .addCase(registerUser.pending, (state) => {
        state.registerUserStatus = 'loading';
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerUserStatus = 'success';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUserStatus = 'error';
        state.registerUserError = action.payload ?? { errorMessage: 'Failed to register user' };
      })
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserAuthorization>) => {
        state.loginStatus = 'success';
        localStorage.setItem('token', action.payload.Authorization);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = 'error';
        state.loginError = action.payload ?? { errorMessage: 'Failed to login user' };
      })
      .addCase(logoutUser.pending, (state, action) => {
        state.logoutStatus = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        console.log('logoutUser++++');
        state.logoutStatus = 'success';
        localStorage.removeItem('token');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutStatus = 'error';
        state.logoutError = action.payload ?? { errorMessage: 'Failed to logout user' };
      });
  },
});

export const { setLoginStatus, setLogoutStatus } = userSlice.actions;
