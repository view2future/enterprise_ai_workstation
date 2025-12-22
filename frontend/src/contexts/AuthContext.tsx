import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, User } from '../services/auth.service';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => void;
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      authApi.getProfile()
        .then(res => setUser(res.data))
        .catch(() => logout());
    }
  }, []);

  const handleLoginSuccess = (access_token: string, userData: User) => {
    if (!access_token || !userData) {
      throw new Error('鉴权令牌或用户信息缺失');
    }
    localStorage.setItem('token', access_token);
    setToken(access_token);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    navigate('/dashboard');
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login({ username, password });
      handleLoginSuccess(response.data.access_token, response.data.user);
    } catch (err) {
      console.error('PROD_LOGIN_FAULT:', err);
      throw err;
    }
  };

  const loginDemo = async () => {
    try {
      const response = await authApi.loginDemo();
      handleLoginSuccess(response.data.access_token, response.data.user);
    } catch (err) {
      console.error('DEMO_LOGIN_FAULT:', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginDemo, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
