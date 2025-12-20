#!/bin/bash

# 企业数据管理平台停止脚本

echo "==========================================="
echo "企业数据管理平台停止脚本"
echo "==========================================="

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 读取PID并终止进程
stop_service() {
    local service_name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        PID=$(cat "$pid_file")
        if kill -0 "$PID" 2>/dev/null; then
            echo "正在停止 $service_name (PID: $PID)..."
            kill "$PID"
            # 等待进程结束
            for i in {1..10}; do
                if ! kill -0 "$PID" 2>/dev/null; then
                    echo "$service_name 已停止"
                    break
                fi
                sleep 1
            done
            # 如果进程仍未停止，强制终止
            if kill -0 "$PID" 2>/dev/null; then
                echo "强制停止 $service_name (PID: $PID)..."
                kill -9 "$PID"
                echo "$service_name 已强制停止"
            fi
        else
            echo "$service_name (PID: $PID) 未运行"
        fi
        rm -f "$pid_file"
    else
        echo "$service_name 进程ID文件不存在"
    fi
}

# 停止前端服务
stop_service "前端服务" "frontend_pid.txt"

# 停止后端服务
stop_service "后端服务" "backend_pid.txt"

echo ""
echo "==========================================="
echo "所有服务已停止"
echo "==========================================="