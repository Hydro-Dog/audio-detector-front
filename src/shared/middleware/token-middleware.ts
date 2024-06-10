import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token && config.url !== '/login' && config.url !== '/register') {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      // Редирект на страницу входа при 403 ошибке
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  },
);
