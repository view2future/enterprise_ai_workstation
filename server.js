require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const { authenticateToken } = require('./src/utils/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// PostgreSQL连接池
const pool = new Pool({
  user: process.env.DB_USER || 'wangyu94',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'enterprise_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000, // 30秒空闲超时
  connectionTimeoutMillis: 2000, // 2秒连接超时,
});

// 数据库连接测试
pool.on('connect', () => {
  console.log('已连接到PostgreSQL数据库');
});

pool.on('error', (err) => {
  console.error('PostgreSQL连接错误:', err);
});

// 服务静态文件 - 在开发模式下代理到前端开发服务器
if (process.env.NODE_ENV === 'development') {
  // 在开发模式下，我们依赖前端的Vite服务器来提供文件
  // 这里只提供API服务
  console.log('开发模式：API服务运行中');
} else {
  // 在生产模式下，提供构建后的前端文件
  app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
  console.log('生产模式：提供前端静态文件');
}

// API路由（需要认证的路由）
app.use('/api', authenticateToken, (req, res, next) => {
  console.log(`${req.method} ${req.url} - API请求`);
  next();
});

// 用于公共访问的API路由（如登录、注册等）
const publicRoutes = express.Router();

// 临时模拟认证路由，直到实现完整的认证模块
publicRoutes.post('/auth/login', (req, res) => {
  // 简单的模拟登录
  const { email, password } = req.body;
  if (email && password) {
    // 在实际实现中，这里会有真正的身份验证
    const mockUser = {
      id: 1,
      email: email,
      username: email.split('@')[0],
      role: 'admin'
    };
    
    // 返回模拟的JWT令牌（实际实现中需要真实的JWT）
    res.json({
      access_token: 'mock-jwt-token-for-development',
      user: mockUser
    });
  } else {
    res.status(400).json({ message: '邮箱和密码是必需的' });
  }
});

publicRoutes.post('/auth/register', (req, res) => {
  res.status(501).json({ message: '注册功能尚未实现' });
});

// 独立的公共API路由，不需要认证
app.use('/api', publicRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Enterprise AI Management System API',
    version: '1.0.0'
  });
});

// 在生产环境中提供前端页面
if (process.env.NODE_ENV === 'production') {
  // 所有非API路由都返回index.html，让前端路由处理
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  });
} else {
  // 在开发模式下，API端点
  app.get('/api/demo/enterprises', (req, res) => {
    // 返回模拟的企业数据用于前端开发
    res.json({
      items: [],
      total: 0,
      page: 0,
      limit: 50,
      totalPages: 0
    });
  });
  
  app.get('/api/demo/dashboard/stats', (req, res) => {
    // 返回模拟的仪表板统计数据
    res.json({
      totalEnterprises: 0,
      p0Enterprises: 0,
      feijiangEnterprises: 0,
      wenxinEnterprises: 0,
      newEnterprisesLast30Days: 0,
      priorityStats: [],
      feijiangWenxinStats: [],
      regionStats: [],
      partnerLevelStats: [],
      overallGrowthRate: '0%'
    });
  });
}

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`企业数据管理平台API服务器运行在端口 ${PORT}`);
  console.log(`API文档: http://localhost:${PORT}/api`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('开发模式：仅提供API服务，前端请访问 http://localhost:3000');
  } else {
    console.log(`生产模式：提供前端和API服务`);
  }
});

module.exports = app;