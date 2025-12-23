#!/bin/bash

PORT_FE=3000
PORT_BE=3001

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "=== 系统运行状态 ==="

# 检查后端
if lsof -i :$PORT_BE > /dev/null; then
    echo -e "后端引擎 (3001): ${GREEN}RUNNING${NC}"
else
    echo -e "后端引擎 (3001): ${RED}STOPPED${NC}"
fi

# 检查前端
if lsof -i :$PORT_FE > /dev/null; then
    echo -e "前端大屏 (3000): ${GREEN}RUNNING${NC}"
else
    echo -e "前端大屏 (3000): ${RED}STOPPED${NC}"
fi
