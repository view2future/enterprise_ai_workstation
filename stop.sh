#!/bin/bash

PORT_FE=3000
PORT_BE=3001

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${RED}=== 正在关闭 Enterprise AI Workstation ===${NC}"

# 按照端口杀进程
kill -9 $(lsof -t -i:$PORT_FE) 2>/dev/null
kill -9 $(lsof -t -i:$PORT_BE) 2>/dev/null

# 按照 PID 文件杀进程（双重保险）
if [ -f "./logs/backend.pid" ]; then
    kill -9 $(cat ./logs/backend.pid) 2>/dev/null
    rm ./logs/backend.pid
fi

if [ -f "./logs/frontend.pid" ]; then
    kill -9 $(cat ./logs/frontend.pid) 2>/dev/null
    rm ./logs/frontend.pid
fi

echo -e "${GREEN}所有服务已停止。端口 3000/3001 已释放。${NC}"
