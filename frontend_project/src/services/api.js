import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  checkAuth: async () => {
    const response = await api.get('/auth/check');
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Cars API
export const carsAPI = {
  getAll: async () => {
    const response = await api.get('/cars');
    return response.data;
  },
  
  getById: async (plateNumber) => {
    const response = await api.get(`/cars/${plateNumber}`);
    return response.data;
  },
  
  create: async (carData) => {
    const response = await api.post('/cars', carData);
    return response.data;
  },
  
  update: async (plateNumber, carData) => {
    const response = await api.put(`/cars/${plateNumber}`, carData);
    return response.data;
  },
  
  delete: async (plateNumber) => {
    const response = await api.delete(`/cars/${plateNumber}`);
    return response.data;
  },
};

// Packages API
export const packagesAPI = {
  getAll: async () => {
    const response = await api.get('/packages');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },
  
  create: async (packageData) => {
    const response = await api.post('/packages', packageData);
    return response.data;
  },
  
  update: async (id, packageData) => {
    const response = await api.put(`/packages/${id}`, packageData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
  },
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    const response = await api.get('/services');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },
  
  create: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },
  
  update: async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  getAll: async () => {
    const response = await api.get('/payments');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
  
  getByServiceId: async (serviceId) => {
    const response = await api.get(`/payments/service/${serviceId}`);
    return response.data;
  },
  
  create: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },
  
  update: async (id, paymentData) => {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  getDailyReport: async (date) => {
    const response = await api.get(`/reports/daily/${date}`);
    return response.data;
  },
  
  getMonthlyReport: async (year, month) => {
    const response = await api.get(`/reports/monthly/${year}/${month}`);
    return response.data;
  },
  
  getSummary: async () => {
    const response = await api.get('/reports/summary');
    return response.data;
  },
  
  getTrends: async () => {
    const response = await api.get('/reports/trends');
    return response.data;
  },
};

// Bills API
export const billsAPI = {
  getByPaymentId: async (paymentId) => {
    const response = await api.get(`/bills/${paymentId}`);
    return response.data;
  },
  
  getByServiceId: async (serviceId) => {
    const response = await api.get(`/bills/service/${serviceId}`);
    return response.data;
  },
};

export default api;
