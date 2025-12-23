#!/bin/bash

# 联图/Nexus - 西南AI产业生态智研决策平台
# 自动化演示启动脚本 (V3.1 路径修复版)

# 确保在项目根目录运行
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "🚀 启动 联图/Nexus 自动化演示系统..."
echo "================================================ட்டான"

# 0. 创建日志目录
mkdir -p logs

# 1. 环境检查
echo "🔍 检查运行环境..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装"
    exit 1
fi

# 检查 playwright
if ! python3 -c "import playwright" &> /dev/null; then
    echo "⚠️  Python playwright 库未安装，尝试安装..."
    pip3 install playwright
    python3 -m playwright install chromium
fi

# 2. 端口清理 (Frontend: 3000, Backend: 3001)
echo "扫 🧹 清理端口占用..."
for port in 3000 3001; do
    pids=$(lsof -ti:$port)
    if [ ! -z "$pids" ]; then
        echo "⚠️  释放端口 $port..."
        kill -9 $pids 2>/dev/null
    fi
done

# 3. 启动后端 (Port 3001)
echo "📡 启动后端 KERNEL (Port 3001)..."
(cd backend && npm run start:dev > ../logs/backend_demo.log 2>&1) &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# 4. 启动前端 (Port 3000)
echo "💻 启动前端 UI (Port 3000)..."
(cd frontend && npm run dev > ../logs/frontend_demo.log 2>&1) &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# 5. 等待系统就绪
echo "⏳ 等待系统服务就绪 (检查健康状态)..."
MAX_RETRIES=60
RETRY_COUNT=0
while ! curl -s http://localhost:3001/api/health > /dev/null; do
    sleep 2
    RETRY_COUNT=$((RETRY_COUNT+1))
    
    # 检查进程是否还在运行
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "\n❌ 后端进程已意外停止，请检查 logs/backend_demo.log"
        exit 1
    fi

    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo -e "\n❌ 后端启动超时，请检查 logs/backend_demo.log"
        kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
        exit 1
    fi
    echo -n "."
done
echo -e "\n✅ 联图/Nexus 系统内核已就绪!"

# 6. 启动演示自动化
echo "🤖 启动演示自动化程序 (Playwright)..."
cd "$SCRIPT_DIR"
python3 demo/runner.py > logs/demo_runner.log 2>&1 &
RUNNER_PID=$!

echo "--------------------------------------------------"
echo "✅ 演示正在进行中!"
echo "🏠 前端 UI: http://localhost:3000"
echo "🏠 着陆页: http://localhost:3000/landing"
echo "📊 后端 API: http://localhost:3001"
echo "🏥 健康检查: http://localhost:3001/api/health"
echo "📝 运行日志: logs/"
echo ""
echo "💡 当前版本 V3.0 亮点:"
echo "   - 实时‘战略指挥官’ AI 评述"
echo "   - 政策模拟沙盒 (Experimental)"
echo "   - 产业链韧性补链分析"
echo "   - 数字化情报档案馆 (L7 级研报)"
echo ""
echo "按 Ctrl+C 停止所有进程并退出演示"
echo "--------------------------------------------------"

# 记录 PID 以便后续手动清理
echo "$BACKEND_PID $FRONTEND_PID $RUNNER_PID" > server_pids.txt

# 捕获退出信号
cleanup() {
    echo -e "\n👋 正在关闭所有演示进程..."
    kill $BACKEND_PID $FRONTEND_PID $RUNNER_PID 2>/dev/null
    rm -f server_pids.txt
    echo "✅ 演示已停止"
    exit 0
}

trap cleanup SIGINT SIGTERM

wait
