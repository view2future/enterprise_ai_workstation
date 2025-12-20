require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./src/api/routes');
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

// 服务静态文件
app.use(express.static(path.join(__dirname, 'frontend_demo')));

// API路由（需要认证的路由）
app.use('/api', authenticateToken, apiRoutes);

// 用于公共访问的API路由（如登录、注册等）
const publicRoutes = express.Router();
const AuthController = require('./src/controllers/authController');

publicRoutes.post('/auth/login', AuthController.login);
publicRoutes.post('/auth/register', AuthController.register);

// 只立的公共API路由，不需要认证
app.use('/api', publicRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Enterprise AI Workstation API'
  });
});

// 主页路由 - 仪表盘
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend_demo', 'ai_ecosystem_dashboard_real_data.html'));
});

// 仪表盘页面
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend_demo', 'ai_ecosystem_dashboard_real_data.html'));
});

// 企业管理页面
app.get('/enterprise', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend_demo', 'index.html'));
});

// 数据导入导出页面
app.get('/import', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend_demo', 'index.html'));
});

// 通用路由 - 返回主页面，让前端路由处理
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend_demo', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`企业AI工作站服务器运行在端口 ${PORT}`);
  console.log(`仪表盘: http://localhost:${PORT}/dashboard`);
  console.log(`企业管理: http://localhost:${PORT}/enterprise`);
  console.log(`数据导入: http://localhost:${PORT}/import`);
  console.log(`API文档: http://localhost:${PORT}/api`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
});

module.exports = app;