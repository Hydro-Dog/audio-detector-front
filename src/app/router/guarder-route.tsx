import { Navigate } from 'react-router-dom';
import { RouteProps } from 'react-router-dom';

export const GuarderRoute = (props: RouteProps) => {
  const token = localStorage.getItem('token');

  return 1 ? <>{props.children}</> : <Navigate to="/signin" />;
};
