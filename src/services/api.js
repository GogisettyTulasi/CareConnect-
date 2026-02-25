import axios from 'axios';

// Base URL - switch to your Spring Boot backend when ready
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 - clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('careconnect_token');
      localStorage.removeItem('careconnect_user');
      window.dispatchEvent(new Event('storage'));
    }
    return Promise.reject(error);
  }
);

export default api;
export { BASE_URL };
