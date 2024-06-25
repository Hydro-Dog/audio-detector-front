import { createSlice } from '@reduxjs/toolkit';
import { ErrorResponse } from '@shared/index';
import { sendAlert } from './actions';
import { FETCH_STATUS } from '../../types/fetch-status';

export type AlertState = {
  sendAlertStatus: FETCH_STATUS;
  sendAlertError: ErrorResponse | null;
};

const initialState: AlertState = {
  sendAlertStatus: FETCH_STATUS.IDLE,
  sendAlertError: null,
};

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendAlert.pending, (state) => {
        state.sendAlertStatus = FETCH_STATUS.LOADING;
      })
      .addCase(sendAlert.fulfilled, (state) => {
        state.sendAlertStatus = FETCH_STATUS.SUCCESS;
      })
      .addCase(sendAlert.rejected, (state, action) => {
        state.sendAlertStatus = FETCH_STATUS.ERROR;
        state.sendAlertError = action.payload ?? {
          errorMessage: 'Failed to fetch user information',
        };
      });
  },
});
