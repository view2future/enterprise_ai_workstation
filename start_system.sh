#!/bin/bash

# 企业数据管理平台启动脚本

set -e  # 遌输命令失败时退出

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

# 安装后端依赖
echo ""
echo "正在安装后端依赖..."
cd "$BACKEND_DIR"
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules)" ]; then
    npm install
    echo "后端依赖安装完成"
else
    echo "后端依赖已存在，跳过安装"
fi

# 同步数据库结构
echo "正在同步数据库结构..."
npx prisma db push || echo "数据库同步可能需要手动处理"

cd ..

# 安装前端依赖
echo ""
echo "正在安装前端依赖..."
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules)" ]; then
    npm install
    echo "前端依赖安装完成"
else
    echo "前端依赖已存在，跳过安装"
fi

cd ..

echo ""
echo "==========================================="
echo "启动服务..."
echo "==========================================="

# 检查端口是否被占用
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "端口 $port 已被占用"
        return 1
    fi
    return 0
}

# 检查端口
if ! check_port 3000; then
    echo "警告: 端口 3000 已被占用"
fi

if ! check_port 3001; then
    echo "警告: 端口 3001 已被占用"
fi

# 启动后端服务
echo "启动后端服务 (端口 3001)..."
cd "$BACKEND_DIR"
npm run start:dev > backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo "后端服务 PID: $BACKEND_PID"

# 等待后端服务启动
echo "等待后端服务启动..."
sleep 5

# 启动前端服务
echo "启动前端服务 (端口 3000)..."
cd "$FRONTEND_DIR"
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "前端服务 PID: $FRONTEND_PID"

# 等待前端服务启动
echo "等待前端服务启动..."
sleep 5

# 保存进程ID到文件，方便停止服务
echo "$BACKEND_PID" > backend_pid.txt
echo "$FRONTEND_PID" > frontend_pid.txt

echo ""
echo "==========================================="
echo "服务启动完成!"
echo "==========================================="
echo "前端地址: http://localhost:3000"
echo "后端地址: http://localhost:3001"
echo "健康检查: http://localhost:3001/health"
echo ""
echo "演示账户:"
echo "  邮箱: demo@example.com"
echo "  密码: password123"
echo ""
echo "要停止服务，请运行: ./stop.sh"
echo "==========================================="

# 打开浏览器（如果在桌面环境中）
if command -v open &> /dev/null; then
    echo "正在打开浏览器..."
    sleep 2
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    echo "正在打开浏览器..."
    sleep 2
    xdg-open http://localhost:3000
fi

# 显示日志（可选）
echo ""
echo "要查看日志，可以运行以下命令:"
echo "  后端日志: tail -f backend/backend.log"
echo "  前端日志: tail -f frontend/frontend.log"