export type User = {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
};

export type UserRegisterDTO = Omit<User, 'id' | 'token'> & { password: string };
export type UserLoginDTO = { login: string; password: string };

export type UserAuthorization = {
  accessToken: string;
  refreshToken: string;
};

export type SearchRequestParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};

export type CallHistoryParams = SearchRequestParams & {
  userId: string; // Add a userId to the parameters
};

export type CallHistoryRecord = {
  date: string;
  status: string;
  address: string;
  comment: string;
};

export type SearchResponse<T> = {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalRecords: number;
};
