import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVERURI || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Medicines API
export const medicinesAPI = {
  getAll: () => api.get('/medicines'),
  getById: (id: string) => api.get(`/medicines/${id}`),
  create: (data) => api.post('/medicines', data),
  update: (id: string, data) => api.put(`/medicines/${id}`, data),
  delete: (id: string) => api.delete(`/medicines/${id}`),
};

// Sales API
export const salesAPI = {
  getAll: () => api.get('/sales'),
  getById: (id: string) => api.get(`/sales/${id}`),
  create: (data) => api.post('/sales', data),
  getDaily: () => api.get('/sales/daily'),
  getMonthly: () => api.get('/sales/monthly'),
};

// Suppliers API
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  getById: (id: string) => api.get(`/suppliers/${id}`),
  create: (data) => api.post('/suppliers', data),
  update: (id: string, data) => api.put(`/suppliers/${id}`, data),
  delete: (id: string) => api.delete(`/suppliers/${id}`),
};

// Reports API
export const reportsAPI = {
  getSalesReport: (startDate: string, endDate: string) =>
    api.get('/reports/sales', { params: { startDate, endDate } }),
  getLowStockReport: () => api.get('/reports/low-stock'),
  getExpiredReport: () => api.get('/reports/expired'),
};

// Users API (Admin only)
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id: string, data) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export default api;
