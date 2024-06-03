import { MiddlewareAPI, UnknownAction, Dispatch } from 'redux';
import { RootState, loginUser, registerUser } from '@store/index';

// Интерфейсы для действий API
interface ApiAction {
  type: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers: Record<string, string>;
}

export const tokenMiddleware =
  (store: MiddlewareAPI<Dispatch<UnknownAction>, RootState>) =>
  (next: Dispatch<ApiAction>) =>
  (action: ApiAction) => {
    console.log('action: ', action);
    const token = localStorage.getItem('token') || '';
    console.log('token ', token);
    if (
      action.type.includes(registerUser.typePrefix) ||
      action.type.includes(loginUser.typePrefix)
    ) {
      return next(action);
    }
    action.headers = { Authorization: token, ...action.headers };

    return next(action);
  };
