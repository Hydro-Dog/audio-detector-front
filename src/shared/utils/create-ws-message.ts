type Args = Record<string, any> & {
  type: string;
  code: string;
  message?: string;
  data?: Record<string, any>;
};

export const createWsMessage = ({ type, code, message, ...rest }: Args) => ({
  type,
  code,
  message,
  date: new Date().valueOf(),
  ...rest,
});
