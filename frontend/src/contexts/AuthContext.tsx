import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, User } from '../services/auth.service';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
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
        .then(res => {
          console.log('[AUTH] Profile Restored:', res.data.username, '| Env:', res.data.envScope);
          setUser(res.data);
        })
        .catch(() => logout());
    }
  }, []);

  const handleLoginSuccess = (access_token: string, userData: User) => {
    // 强制清理历史残留，确保新环境 100% 纯净
    localStorage.clear();
    
    localStorage.setItem('token', access_token);
    setToken(access_token);
    setUser(userData);
    
    // 立即更新当前请求实例的 Header
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    console.log('[AUTH] Login Session Established:', userData.envScope);
    navigate('/dashboard');
  };

  const login = async (username: string, password: string) => {
    const response = await authApi.login({ username, password });
    handleLoginSuccess(response.data.access_token, response.data.user);
  };

  const loginDemo = async () => {
    const response = await authApi.loginDemo();
    handleLoginSuccess(response.data.access_token, response.data.user);
  };

  const logout = () => {
    localStorage.clear();
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
