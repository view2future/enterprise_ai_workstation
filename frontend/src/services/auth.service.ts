import apiClient from './api';

export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  envScope: string; // 新增：环境权限标识
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export const authApi = {
  // 生产环境常规登录
  login: (credentials: LoginCredentials) => {
    return apiClient.post<{ access_token: string; user: User }>('/auth/login', credentials);
  },

  // 演示环境快捷登录 (V2.0)
  loginDemo: () => {
    return apiClient.post<{ access_token: string; user: User }>('/auth/common-sync', {}, {
      timeout: 15000 
    });
  },

  // 获取当前用户信息
  getProfile: () => {
    return apiClient.get<User>('/auth/profile');
  },

  // 获取所有用户 (管理端使用)
  getAllUsers: () => {
    return apiClient.get<User[]>('/users');
  },

  // 删除用户
  deleteUser: (id: number) => {
    return apiClient.delete(`/users/${id}`);
  }
};
