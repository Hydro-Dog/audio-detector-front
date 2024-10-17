import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ErrorResponse } from '@shared/index';
import {
  updateCurrentUser,
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  fetchUsers,
  fetchCallHistory,
  fetchUser,
} from './actions';
import { CallHistoryRecord, SearchResponse, User, UserAuthorization } from './types';
import { FETCH_STATUS } from '../../types/fetch-status';

export type UserState = {
  currentUser: User | null;
  currentUserStatus: FETCH_STATUS;
  currentUserError: ErrorResponse | null;
  user: User | null;
  fetchUserStatus: FETCH_STATUS;
  fetchUserError: ErrorResponse | null;
  updateCurrentUserStatus: FETCH_STATUS;
  updateCurrentUserError: ErrorResponse | null;
  registerUserStatus: FETCH_STATUS;
  registerUserError: ErrorResponse | null;
  logoutStatus: FETCH_STATUS;
  logoutError: ErrorResponse | null;
  loginStatus: FETCH_STATUS;
  loginError: ErrorResponse | null;
  users: SearchResponse<User> | null;
  fetchUsersStatus: FETCH_STATUS;
  fetchUsersError: ErrorResponse | null;
  callHistory: SearchResponse<CallHistoryRecord> | null;
  fetchCallHistoryStatus: FETCH_STATUS;
  fetchCallHistoryError: ErrorResponse | null;
};

const initialState: UserState = {
  currentUser: null,
  currentUserStatus: FETCH_STATUS.IDLE,
  currentUserError: null,
  user: null,
  fetchUserStatus: FETCH_STATUS.IDLE,
  fetchUserError: null,
  updateCurrentUserStatus: FETCH_STATUS.IDLE,
  updateCurrentUserError: null,
  registerUserStatus: FETCH_STATUS.IDLE,
  registerUserError: null,
  logoutStatus: FETCH_STATUS.IDLE,
  logoutError: null,
  loginStatus: FETCH_STATUS.IDLE,
  loginError: null,
  users: { items: [], totalPages: 0, totalRecords: 0, pageNumber: 0 },
  fetchUsersStatus: FETCH_STATUS.IDLE,
  fetchUsersError: null,
  callHistory: { items: [], totalPages: 0, totalRecords: 0, pageNumber: 0 },
  fetchCallHistoryStatus: FETCH_STATUS.IDLE,
  fetchCallHistoryError: null,
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
      .addCase(fetchUser.pending, (state) => {
        state.fetchUserStatus = FETCH_STATUS.LOADING;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.fetchUserStatus = FETCH_STATUS.SUCCESS;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.fetchUserStatus = FETCH_STATUS.ERROR;
        state.fetchUserError = action.payload ?? {
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

        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = FETCH_STATUS.ERROR;
        state.loginError = action.payload ?? { errorMessage: 'Failed to login user' };
      })
      .addCase(logoutUser.pending, (state) => {
        state.logoutStatus = FETCH_STATUS.LOADING;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutStatus = FETCH_STATUS.SUCCESS;
        localStorage.removeItem('token');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutStatus = FETCH_STATUS.ERROR;
        state.logoutError = action.payload ?? { errorMessage: 'Failed to logout user' };
      })
      .addCase(fetchUsers.pending, (state) => {
        state.fetchUsersStatus = FETCH_STATUS.LOADING;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.fetchUsersStatus = FETCH_STATUS.SUCCESS;
        state.users = {
          items: action.payload.items,
          pageNumber: action.payload.pageNumber,
          totalPages: action.payload.totalPages,
          totalRecords: action.payload.totalRecords,
        }; // Предполагаем, что ответ включает массив users
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.fetchUsersStatus = FETCH_STATUS.ERROR;
        state.fetchUsersError = action.payload ?? { errorMessage: 'Failed to fetch users' };
      })
      .addCase(fetchCallHistory.pending, (state) => {
        state.fetchCallHistoryStatus = FETCH_STATUS.LOADING;
      })
      .addCase(fetchCallHistory.fulfilled, (state, action) => {
        state.fetchCallHistoryStatus = FETCH_STATUS.SUCCESS;
        state.callHistory = {
          items: action.payload.items,
          pageNumber: action.payload.pageNumber,
          totalPages: action.payload.totalPages,
          totalRecords: action.payload.totalRecords,
        };
      })
      .addCase(fetchCallHistory.rejected, (state, action) => {
        state.fetchCallHistoryStatus = FETCH_STATUS.ERROR;
        state.fetchCallHistoryError = action.payload ?? { errorMessage: 'Failed to fetch users' };
      });
  },
});

export const { setLoginStatus, setLogoutStatus } = userSlice.actions;
