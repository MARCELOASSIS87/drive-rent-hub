import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Admin login
  loginAdmin: (email: string, password: string) =>
    api.post('/login', { email, password }),

  // Driver login  
  loginDriver: (email: string, password: string) =>
    api.post('/motoristas/login', { email, password }),

  // Driver register
  registerDriver: (data: FormData) =>
    api.post('/motoristas', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Drivers API
export const driversAPI = {
  // List drivers with optional status filter
  list: (status?: string) =>
    api.get(`/motoristas${status ? `?status=${status}` : ''}`),

  // Update driver status
  updateStatus: (id: number, status: string) =>
    api.put(`/motoristas/${id}/status`, { status }),

  // Block driver
  block: (id: number) =>
    api.put(`/motoristas/${id}/bloquear`),

  // Unblock driver
  unblock: (id: number) =>
    api.put(`/motoristas/${id}/desbloquear`),
};

// Vehicles API
export const vehiclesAPI = {
  // List active vehicles
  list: () =>
    api.get('/veiculos'),

  // Get vehicle details
  getById: (id: number) =>
    api.get(`/veiculos/${id}`),

  // Create vehicle
  create: (data: FormData) =>
    api.post('/veiculos', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Update vehicle
  update: (id: number, data: FormData) =>
    api.put(`/veiculos/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Update vehicle status only
  updateStatus: (id: number, status: string) =>
    api.put(`/veiculos/${id}/status`, { status }),

  // Delete vehicle
  delete: (id: number) =>
    api.delete(`/veiculos/${id}`),
};
// Admin API
export const adminAPI = {
  // List admins
  list: () =>
    api.get('/admin'),

  // Create admin
  create: (data: Record<string, unknown>) =>
    api.post('/admin', data),

  // Update admin
  update: (id: number, data: Record<string, unknown>) =>
    api.put(`/admin/${id}`, data),

  // Delete admin
  delete: (id: number) =>
    api.delete(`/admin/${id}`),
};
// Rental Requests API
export const rentalRequestsAPI = {
  create: (data: { veiculo_id: number; data_inicio: string; data_fim: string }) =>
    api.post('/solicitacoes', data),

  list: () => api.get('/admin/solicitacoes'),

  listMine: () => api.get('/solicitacoes/mine'),

  updateStatus: (id: number, status: string, motivo?: string) =>
    api.put(`/admin/solicitacoes/${id}/status`, { status, motivo }),
};
// Contracts API
export const contractsAPI = {
  // Get contract HTML by id
  getById: async (id: number): Promise<string> => {
    const response = await api.get<{ html?: string } | string>(`/contratos/${id}`);
    const { data } = response;
    if (typeof data === 'string') {
      return data;
    }
    return data.html ?? '';
  },
  // List contracts (admin)
  list: () => api.get('/admin/contratos'),
  // Download contract PDF
  downloadPdf: (id: number) => api.get(`/contratos/${id}/pdf`, { responseType: 'blob' }),
  sign: (id: number) => api.post(`/contratos/${id}/assinar`),

};

