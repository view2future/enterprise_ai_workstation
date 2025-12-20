#!/bin/bash

# 企业数据管理平台启动脚本

set -e  # 命令失败时退出

echo "==========================================="
echo "企业数据管理平台启动脚本"
echo "==========================================="

# 检查是否已安装必要的工具
echo "检查依赖..."
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "错误: npm 未安装，请先安装 npm"
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "警告: PostgreSQL 未安装或未添加到PATH"
    echo "请确保 PostgreSQL 已安装并正在运行"
fi

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "当前工作目录: $SCRIPT_DIR"

# 检查环境配置
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
    echo "警告: 未找到 $ENV_FILE 文件，正在创建示例配置..."
    cat > "$ENV_FILE" << EOF
# 企业数据管理平台环境配置
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=enterprise_db
DB_USER=wangyu94
DB_PASSWORD=
JWT_SECRET=your_jwt_secret_here_change_this_to_something_secure
EOF
    echo "已创建 $ENV_FILE，请根据您的实际情况修改配置"
else
    echo "已找到环境配置文件: $ENV_FILE"
fi

# 检查后端目录
BACKEND_DIR="backend"
if [ ! -d "$BACKEND_DIR" ]; then
    echo "错误: 后端目录 $BACKEND_DIR 不存在"
    exit 1
fi

# 检查前端目录
FRONTEND_DIR="frontend"
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "错误: 前端目录 $FRONTEND_DIR 不存在"
    exit 1
fi

echo ""
echo "==========================================="
echo "启动开发环境..."
echo "==========================================="

# 启动后端服务
echo "启动后端服务 (NestJS on port 3001)..."
cd "$BACKEND_DIR"

# 安装后端依赖（如果需要）
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules)" ]; then
    echo "正在安装后端依赖..."
    npm install
    echo "后端依赖安装完成"
else
    echo "后端依赖已存在，跳过安装"
fi

# 同步数据库结构
echo "正在同步数据库结构..."
npx prisma db push || echo "数据库同步可能需要手动处理"

# 在后台启动后端服务
npm run start:dev > backend_dev.log 2>&1 &
BACKEND_PID=$!
cd ..

echo "后端服务已启动 (PID: $BACKEND_PID)"

# 等待后端服务启动
echo "等待后端服务启动..."
sleep 8

# 启动前端服务
echo ""
echo "启动前端服务 (React + Vite on port 3000)..."
cd "$FRONTEND_DIR"

# 安装前端依赖（如果需要）
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules)" ]; then
    echo "正在安装前端依赖..."
    npm install
    echo "前端依赖安装完成"
else
    echo "前端依赖已存在，跳过安装"
fi

# 在后台启动前端服务
npm run dev > frontend_dev.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "前端服务已启动 (PID: $FRONTEND_PID)"

# 等待前端服务启动
echo "等待前端服务启动..."
sleep 5

# 保存进程ID到文件，方便停止服务
echo "$BACKEND_PID" > backend_pid.txt
echo "$FRONTEND_PID" > frontend_pid.txt

echo ""
echo "==========================================="
echo "开发环境启动完成!"
echo "==========================================="
echo "前端地址: http://localhost:3000"
echo "后端地址: http://localhost:3001"
echo "API代理: 前端请求 /api/* 将自动转发到后端"
echo ""
echo "系统架构:"
echo "- 前端: React 18 + TypeScript + Vite (端口 3000)"
echo "- 后端: NestJS + PostgreSQL (端口 3001)"
echo "- 代理: 前端开发服务器自动代理 /api 请求到后端"
echo ""
echo "自动登录功能:"
echo "- 系统将自动使用演示账户 (demo@example.com / password123) 登录"
echo "- 您将直接进入仪表板，无需手动输入登录信息"
echo ""
echo "要停止服务，请运行: ./stop.sh"
echo "==========================================="

# 打开浏览器（如果在桌面环境中）
if command -v open &> /dev/null; then
    echo "正在打开浏览器到前端应用..."
    sleep 3
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    echo "正在打开浏览器到前端应用..."
    sleep 3
    xdg-open http://localhost:3000
fi

echo ""
echo "日志文件:"
echo "- 后端日志: backend/backend_dev.log"
echo "- 前端日志: frontend/frontend_dev.log"
echo ""
echo "开发提示:"
echo "- 前端代码修改将自动热重载"
echo "- 后端代码修改将自动重启"
echo "- API请求可通过 /api/* 访问"