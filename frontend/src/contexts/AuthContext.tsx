import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, User } from '../services/auth.service';

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
  const [token, setToken] = useState<string | null>(localStorage.getItem('nexus_token'));
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('nexus_token');
    if (storedToken) {
      authApi.getProfile()
        .then(res => {
          console.log('[AUTH] Session Verified:', res.data.username);
          setUser(res.data);
        })
        .catch((err) => {
          console.warn('[AUTH] Session Invalid:', err.message);
          logout();
        });
    }
  }, []);

  const handleLoginSuccess = (access_token: string, userData: User) => {
    // 写入统一的键名
    localStorage.setItem('nexus_token', access_token);
    localStorage.setItem('nexus_user', JSON.stringify(userData));
    
    setToken(access_token);
    setUser(userData);
    
    console.log('[AUTH] Login Success, Navigating to Dashboard...');
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
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
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
