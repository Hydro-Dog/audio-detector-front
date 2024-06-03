import { Navigate } from 'react-router-dom';
import { Route, RouteProps } from 'react-router-dom';

export const GuarderRoute = (props: RouteProps) => {
  const token = localStorage.getItem('token');

  return token ? <>{props.children}</> : <Navigate to="/signin" />;
};
