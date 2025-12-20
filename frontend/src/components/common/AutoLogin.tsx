import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AutoLogin: React.FC = () => {
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    const autoLogin = async () => {
      if (!isAuthenticated) {
        try {
          // 使用默认演示凭据自动登录
          await login('demo@example.com', 'password123');
        } catch (error) {
          console.error('自动登录失败:', error);
          // 如果自动登录失败，仍然可以让用户看到登录页面
        }
      }
    };

    // 延迟执行自动登录，避免与初始渲染冲突
    const timer = setTimeout(autoLogin, 500);

    return () => clearTimeout(timer);
  }, [login, isAuthenticated]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg font-medium text-gray-900">正在启动企业数据管理平台...</p>
        <p className="text-gray-500">正在使用演示账户自动登录</p>
      </div>
    </div>
  );
};

export default AutoLogin;