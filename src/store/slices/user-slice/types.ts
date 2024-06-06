export type User = {
  id: number;
  firstName: string;
  lastName: string;
  telegramUsername: string;
  token: string;
  phoneNumber: string;
  email: string;
};

export type UserRegisterDTO = Omit<User, 'id' | 'token'> & { password: string };
export type UserLoginDTO = { login: string; password: string };

export type UserAuthorization = {
  Authorization: string;
};
