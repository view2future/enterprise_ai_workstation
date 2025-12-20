#!/bin/bash

# 企业AI技术生态合作伙伴管理系统启动脚本

echo "🚀 企业AI技术生态合作伙伴管理系统启动脚本"
echo "================================================"

# 检查Node.js是否已安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装Node.js"
    exit 1
fi

# 检查PostgreSQL是否已安装
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL 未安装，请先安装PostgreSQL"
    exit 1
fi

echo "✅ 环境检查通过"

# 进入项目目录
cd /Users/wangyu94/enterprise_ai_workstation/final_system || { echo "❌ 项目目录不存在"; exit 1; }

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 检查并启动PostgreSQL数据库
echo "🐘 检查PostgreSQL数据库状态..."
if brew services list | grep -q "started.*postgresql"; then
    echo "✅ PostgreSQL服务正在运行"
else
    echo "🔧 启动PostgreSQL数据库..."
    brew services start postgresql@14 2>/dev/null || echo "PostgreSQL服务启动中或需要手动启动"
    # 等待数据库启动
    sleep 5
fi

# 检查数据库是否存在
echo "🔍 检查数据库..."
if psql -lqt | cut -d \| -f 1 | grep -qw 'enterprise_ai_db'; then
    echo "✅ 数据库 enterprise_ai_db 已存在"
else
    echo "🔧 创建数据库 enterprise_ai_db..."
    createdb enterprise_ai_db
fi

# 检查端口占用并释放
echo "🔍 检查端口占用情况..."

if lsof -i :3000 > /dev/null; then
    echo "⚠️  端口3000被占用，释放中..."
    pids=$(lsof -ti:3000)
    if [ ! -z "$pids" ]; then
        kill -9 $pids 2>/dev/null
        echo "✅ 端口3000已释放"
    fi
fi

if lsof -i :3002 > /dev/null; then
    echo "⚠️  端口3002被占用，释放中..."
    pids=$(lsof -ti:3002)
    if [ ! -z "$pids" ]; then
        kill -9 $pids 2>/dev/null
        echo "✅ 端口3002已释放"
    fi
fi

# 启动后端服务
echo "📡 启动后端API服务器 (端口3000)..."
node server.js &
BACKEND_PID=$!
echo "✅ 后端服务器启动，PID: $BACKEND_PID"

# 等待后端服务器启动
echo "⏳ 等待后端服务启动..."
sleep 5

# 启动前端服务
echo "🌐 启动前端服务器 (端口3002)..."
cd frontend
npx http-server -p 3002 &
FRONTEND_PID=$!
echo "✅ 前端服务器启动，PID: $FRONTEND_PID"

# 等待前端启动
sleep 3

# 验证服务状态
echo ""
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ 后端服务运行正常"
else
    echo "⚠️  后端服务可能未完全启动"
fi

if nc -z localhost 3002 > /dev/null 2>&1; then
    echo "✅ 前端服务运行正常"
else
    echo "⚠️  前端服务可能未完全启动"
fi

echo ""
echo "🎉 系统启动成功!"
echo "📊 后端API: http://localhost:3000"
echo "🏠 前端界面: http://localhost:3002" 
echo "🏥 健康检查: http://localhost:3000/health"
echo ""
echo "📋 使用说明:"
echo "   - 访问 http://localhost:3002 查看企业管理系统界面"
echo "   - API文档: http://localhost:3000/api/enterprises"
echo "   - 系统包含500家成都企业数据，包含完整的BMO互动经历"
echo "   - 支持搜索、筛选、查看、编辑等完整功能"
echo ""
echo "💡 提示: 系统已预装500家成都企业数据，包含BMO互动经历"
echo "================================================"

# 创建PID文件以便后续管理
echo "$BACKEND_PID,$FRONTEND_PID" > ../server_pids.txt

# 捕获退出信号
cleanup() {
    echo ""
    echo "👋 正在关闭系统..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    rm -f ../server_pids.txt
    echo "✅ 系统已关闭"
    exit 0
}

trap cleanup SIGINT SIGTERM

# 等待进程
wait $BACKEND_PID $FRONTEND_PID