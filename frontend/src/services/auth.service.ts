import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  envScope: string;
  status: string;
  createdAt: string;
  created_at: string;
  firstName?: string;
  lastName?: string;
}

export const authApi = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  loginDemo: () => api.post('/auth/common-sync', { demo: true }),
  getProfile: () => api.get('/auth/profile'),
  refresh: () => api.post('/auth/refresh'),
  getAllUsers: () => api.get('/users'),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
};

export const login = authApi.login;
export const loginDemo = authApi.loginDemo;
export const refresh = authApi.refresh;
