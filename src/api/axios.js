import axios from 'axios';

const configuredApiBase = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || 'http://localhost:8000';
const normalizedApiBase = configuredApiBase.replace(/\/$/, '');
const apiBaseUrl = normalizedApiBase.endsWith('/api') ? normalizedApiBase : `${normalizedApiBase}/api`;
const storageUrlPattern = /^https?:\/\/[^/]+\/storage\//i;

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
  (response) => {
    response.data = normalizeStorageUrls(response.data);
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Podríamos redirigir a login aquí si quisiéramos forzar
    }
    return Promise.reject(error);
  }
);

function normalizeStorageUrls(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeStorageUrls);
  }

  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      value[key] = normalizeStorageUrls(value[key]);
    }
    return value;
  }

  if (typeof value !== 'string') {
    return value;
  }

  if (storageUrlPattern.test(value)) {
    return value.replace(storageUrlPattern, '/storage/');
  }

  if (value.startsWith('/storage/') && window.location.protocol === 'http:' && window.location.hostname === 'localhost') {
    const backendOrigin = apiBaseUrl.replace(/\/api$/, '');
    return `${backendOrigin}${value}`;
  }

  return value;
}
