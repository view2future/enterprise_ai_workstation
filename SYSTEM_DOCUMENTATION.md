# 企业数据管理平台 - 系统说明

## 系统架构

本系统采用前后端分离架构：

- **前端**: React 18 + TypeScript + Vite (运行在端口 3000)
- **后端**: NestJS + PostgreSQL (运行在端口 3001)
- **代理**: Vite 开发服务器自动将 `/api/*` 请求代理到后端

## 启动脚本说明

### 1. start.sh
主启动脚本，用于启动完整的开发环境。

### 2. start_dev.sh
开发环境启动脚本，分别启动前端和后端服务。

### 3. stop.sh
停止所有运行的服务。

### 4. status.sh
检查服务运行状态。

## 启动步骤

1. 确保已安装 Node.js 18+ 和 PostgreSQL
2. 运行 `./start.sh` 启动系统
3. 系统将在浏览器中自动打开 `http://localhost:3000`
4. 使用以下账户登录：
   - 邮箱: `demo@example.com`
   - 密码: `password123`

## 系统功能

- 企业数据管理 (CRUD)
- 仪表板数据可视化
- 数据导入导出 (Excel/CSV)
- 高级搜索和筛选
- 报告生成
- 用户权限管理
- Neubrutalism UI风格
- 自动登录功能 (启动时自动使用演示账户登录)

## 开发说明

- 前端代码位于 `frontend/` 目录
- 后端代码位于 `backend/` 目录
- API 请求通过 Vite 代理转发到后端
- 数据库存储在 PostgreSQL 中

## 环境配置

系统使用 `.env` 文件进行环境配置，主要参数包括：
- `PORT`: 后端服务端口 (默认 3001)
- `DB_HOST`: 数据库主机 (默认 localhost)
- `DB_NAME`: 数据库名称 (默认 enterprise_db)
- `DB_USER`: 数据库用户 (默认 wangyu94)
- `DB_PASSWORD`: 数据库密码

## 故障排除

如果遇到端口被占用的问题，请检查是否有其他进程在使用端口 3000 或 3001。

如果依赖安装失败，请清理 npm 缓存：
```bash
npm cache clean --force
```

如果数据库连接失败，请确保 PostgreSQL 服务正在运行，并检查数据库配置。