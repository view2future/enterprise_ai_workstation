/**
 * 企业AI工作站 - 主应用
 * 整合所有功能模块
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./api/routes');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 服务静态文件
app.use(express.static(path.join(__dirname, '../../frontend_demo')));

// API路由
app.use('/api', apiRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Enterprise AI Workstation API'
  });
});

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend_demo/index.html'));
});

// 企业管理页面
app.get('/enterprise', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend_demo/index.html'));
});

// 仪表盘页面
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend_demo/ai_ecosystem_dashboard_real_data.html'));
});

// 数据导入导出页面
app.get('/import-export', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend_demo/index.html'));
});

app.listen(PORT, () => {
  console.log(`企业AI工作站服务器运行在端口 ${PORT}`);
  console.log(`仪表盘: http://localhost:${PORT}/dashboard`);
  console.log(`企业管理: http://localhost:${PORT}/enterprise`);
  console.log(`数据导入导出: http://localhost:${PORT}/import-export`);
  console.log(`API文档: http://localhost:${PORT}/api`);
});

module.exports = app;