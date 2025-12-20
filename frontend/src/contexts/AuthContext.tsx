import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, User } from '../services/auth.service';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: { username: string; email: string; password: string }) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // 设置axios默认请求头
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      // 获取用户信息
      const fetchUser = async () => {
        try {
          const response = await authApi.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('获取用户信息失败:', error);
          // Token无效，清除本地存储
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
        }
      };
      
      fetchUser();
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // 登录成功后导航到仪表板
      navigate('/dashboard');
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  };

  const register = async (userData: { username: string; email: string; password: string }) => {
    try {
      const response = await authApi.register(userData);
      // 注册成功后通常需要登录
      await login(userData.email, userData.password);
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    login,
    logout,
    register,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};