import apiClient from './api';

export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  lastLogin?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  // 用户登录
  login: (credentials: LoginCredentials) => {
    return apiClient.post<{ access_token: string; user: User }>('/auth/login', credentials);
  },

  // 用户注册
  register: (userData: RegisterData) => {
    return apiClient.post<User>('/auth/register', userData);
  },

  // 获取当前用户信息
  getProfile: () => {
    return apiClient.get<User>('/auth/profile');
  },

  // 更新用户信息
  updateProfile: (userData: UpdateUserData) => {
    return apiClient.put<User>('/users/profile/me', userData);
  },

  // 修改密码
  changePassword: (passwordData: ChangePasswordData) => {
    return apiClient.put('/auth/change-password', passwordData);
  },

  // 获取所有用户（需要管理员权限）
  getAllUsers: () => {
    return apiClient.get<User[]>('/users');
  },

  // 获取特定用户
  getUser: (id: number) => {
    return apiClient.get<User>(`/users/${id}`);
  },

  // 更新用户
  updateUser: (id: number, userData: UpdateUserData) => {
    return apiClient.put<User>(`/users/${id}`, userData);
  },

  // 删除用户
  deleteUser: (id: number) => {
    return apiClient.delete(`/users/${id}`);
  }
};