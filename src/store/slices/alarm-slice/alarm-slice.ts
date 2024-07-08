import { createSlice } from '@reduxjs/toolkit';
import { ErrorResponse } from '@shared/index';
import { sendAlarm } from './actions';
import { FETCH_STATUS } from '../../types/fetch-status';

export type AlarmState = {
  sendAlarmStatus: FETCH_STATUS;
  sendAlarmError: ErrorResponse | null;
};

const initialState: AlarmState = {
  sendAlarmStatus: FETCH_STATUS.IDLE,
  sendAlarmError: null,
};

export const alarmSlice = createSlice({
  name: 'alarm',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendAlarm.pending, (state) => {
        state.sendAlarmStatus = FETCH_STATUS.LOADING;
      })
      .addCase(sendAlarm.fulfilled, (state) => {
        state.sendAlarmStatus = FETCH_STATUS.SUCCESS;
      })
      .addCase(sendAlarm.rejected, (state, action) => {
        state.sendAlarmStatus = FETCH_STATUS.ERROR;
        state.sendAlarmError = action.payload ?? {
          errorMessage: 'Failed to fetch user information',
        };
      });
  },
});
