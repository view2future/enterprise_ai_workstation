import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { NeubrutalCard, NeubrutalButton, NeubrutalInput } from '../../components/ui/neubrutalism/NeubrutalComponents';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('demo@example.com'); // 预填演示邮箱
  const [password, setPassword] = useState('password123'); // 预填演示密码
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // 组件挂载时自动登录
  useEffect(() => {
    const autoLogin = async () => {
      setLoading(true);
      try {
        await login(email, password);
      } catch (err: any) {
        setError(err.response?.data?.message || '自动登录失败，请手动登录');
        setLoading(false);
      }
    };

    // 延迟执行自动登录，给用户一点时间看到页面
    const timer = setTimeout(() => {
      autoLogin();
    }, 1000); // 1秒后自动登录

    return () => clearTimeout(timer);
  }, [login, email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (error) {
      setError('登录失败，请检查邮箱和密码');
      setLoading(false);
    }
  };

  // 如果正在加载，则不显示表单（因为正在进行自动登录）
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center">
          <div className="mx-auto bg-gray-200 border-2 border-gray-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Lock size={32} className="text-gray-800 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">正在自动登录...</h2>
          <p className="text-gray-600 mt-2">使用演示账户登录中</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <NeubrutalCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gray-200 border-2 border-gray-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Lock size={32} className="text-gray-800" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">企业数据管理平台</h1>
          <p className="text-gray-600 mt-2">演示账户已预填，正在自动登录</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <NeubrutalInput
              label="邮箱"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              required
              icon={<Mail size={18} className="text-gray-500" />}
            />
          </div>

          <div className="mb-6">
            <NeubrutalInput
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              icon={<Lock size={18} className="text-gray-500" />}
            />
          </div>

          <NeubrutalButton
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <span className="loading-spinner mr-2">⏳</span>
                登录中...
              </>
            ) : (
              '登录'
            )}
          </NeubrutalButton>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>演示账户: demo@example.com / password123</p>
          <button 
            onClick={() => {
              setEmail('demo@example.com');
              setPassword('password123');
            }}
            className="mt-2 text-blue-600 hover:text-blue-800 underline"
          >
            重置为演示账户
          </button>
        </div>
      </NeubrutalCard>
    </div>
  );
};

export default LoginPage;