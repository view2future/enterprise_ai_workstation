#!/bin/bash

# 企业数据管理平台状态检查脚本

echo "==========================================="
echo "企业数据管理平台服务状态"
echo "==========================================="

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 检查进程状态
check_process() {
    local service_name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        PID=$(cat "$pid_file")
        if kill -0 "$PID" 2>/dev/null; then
            echo "$service_name: 运行中 (PID: $PID)"
            return 0
        else
            echo "$service_name: 已停止 (PID: $PID, 但进程不存在)"
            return 1
        fi
    else
        echo "$service_name: 未启动 (PID文件不存在)"
        return 2
    fi
}

# 检查前端服务
check_process "前端服务" "frontend_pid.txt"

# 检查后端服务
check_process "后端服务" "backend_pid.txt"

# 检查端口监听情况
echo ""
echo "端口监听状态:"
if command -v lsof &> /dev/null; then
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "端口 3000: 正在监听 (前端服务)"
    else
        echo "端口 3000: 未监听"
    fi
    
    if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "端口 3001: 正在监听 (后端服务)"
    else
        echo "端口 3001: 未监听"
    fi
else
    echo "无法检查端口状态 (lsof 未安装)"
fi

echo ""
echo "==========================================="