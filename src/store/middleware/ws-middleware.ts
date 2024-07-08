import { Middleware } from '@reduxjs/toolkit';
import {
  pushWsMessage,
  setWsConnected,
  setWsError,
  wsConnect,
  wsDisconnect,
  wsSend,
} from '@store/index';

type WsAction = {
  type: string;
  payload?: any;
};

export const wsMiddleware: Middleware = (store) => {
  let socket: WebSocket | null = null;

  return (next) => (action: WsAction) => {
    switch (action.type) {
      case wsConnect.toString():
        if (socket !== null) {
          socket.close();
        }

        socket = new WebSocket(action.payload.url);

        socket.onopen = () => {
          store.dispatch(setWsConnected(true));
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          store.dispatch(pushWsMessage(data));
        };

        socket.onclose = () => {
          store.dispatch(setWsConnected(false));
        };

        socket.onclose = (error) => {
          store.dispatch(setWsError(error));
        };

        break;

      case wsDisconnect.toString():
        if (socket !== null) {
          socket.close();
          socket = null;
        }

        break;

      case wsSend.toString():
        if (socket !== null) {
          socket.send(JSON.stringify(action.payload));
        }

        break;

      default:
        break;
    }

    return next(action);
  };
};
