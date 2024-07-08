/* eslint-disable @typescript-eslint/no-empty-function */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type WsState = {
  wsConnected: boolean;
  messages: any[];
  error: any;
};

const initialState: WsState = {
  wsConnected: false,
  messages: [],
  error: null,
};

export const wsSlice = createSlice({
  name: 'ws',
  initialState,
  reducers: {
    setWsConnected: (state, action: PayloadAction<boolean>) => {
      state.wsConnected = action.payload;
    },
    pushWsMessage: (state, action: PayloadAction<any>) => {
      state.messages.push(action.payload);
    },
    setWsError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    wsConnect: (state, action: PayloadAction<{ url: string }>) => {},
    wsDisconnect: (state) => {},
    wsSend: (state, action: PayloadAction<any>) => {},
  },
});

export const { setWsConnected, pushWsMessage, setWsError, wsConnect, wsDisconnect, wsSend } =
  wsSlice.actions;
