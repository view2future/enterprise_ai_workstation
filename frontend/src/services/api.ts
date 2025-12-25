import axios from 'axios';

// 自动检测环境：如果是 Electron 生产环境（file:// 协议），则直接指向后端端口
const isElectronProd = window.location.protocol === 'file:';
const API_URL = isElectronProd ? 'http://localhost:3001/api' : '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 增加超时保护
  proxy: false,   // 强制禁用代理，防止本地请求被转发到外部代理服务器
});

// 请求拦截器
api.interceptors.request.use((config) => {
  // 必须每次从 localStorage 实时读取
  const token = localStorage.getItem('nexus_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 只有在非登录请求且 401 时才处理
    if (error.response?.status === 401 && !error.config.url.includes('/auth/')) {
      console.error('[API] Auth Failure at:', error.config.url);
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
      // 避免无限循环
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
