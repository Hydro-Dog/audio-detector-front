type Args = Record<string, any> & {
  type: string;
  code: string;
  message?: string;
  payload?: Record<string, any>;
};

export const createWsMessage = ({ type, code, message, payload }: Args) => ({
  type,
  code,
  message,
  timeStamp: new Date().valueOf(),
  payload,
});
