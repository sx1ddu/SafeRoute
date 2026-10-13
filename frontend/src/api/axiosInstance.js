import axios from 'axios';

// ✅ FIXED: Render live link with /api suffix for proper routing
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://school-bus-tracking.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Har request ke header mein automatically token add karega
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Agar token expire ho jaye toh login pe bhej dega
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;