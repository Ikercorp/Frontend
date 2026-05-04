import axios from 'axios';

const configuredApiBase = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || 'http://localhost:8000';
const normalizedApiBase = configuredApiBase.replace(/\/$/, '');
const apiBaseUrl = normalizedApiBase.endsWith('/api') ? normalizedApiBase : `${normalizedApiBase}/api`;

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Podríamos redirigir a login aquí si quisiéramos forzar
    }
    return Promise.reject(error);
  }
);
