#!/bin/bash

# --- 配置区 ---
PORT_FE=3000
PORT_BE=3001
LOG_DIR="./logs"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Enterprise AI Workstation V2.0 启动程序 ===${NC}"

# 1. 环境准备
mkdir -p $LOG_DIR

# 2. 状态检查与预清理
echo -e "${YELLOW}[1/3] 正在检查服务活跃度...${NC}"
if lsof -i :$PORT_FE >/dev/null 2>&1 || lsof -i :$PORT_BE >/dev/null 2>&1; then
    echo -e "${RED}检测到服务正在运行，正在执行强制重置...${NC}"
    ./stop.sh
    sleep 2
else
    echo -e "${GREEN}端口处于空闲状态，准备直接启动。${NC}"
fi

# 3. 启动后端
echo -e "${YELLOW}[2/3] 正在启动后端引擎 (3001)...${NC}"
cd backend
npx prisma generate > /dev/null 2>&1
nohup npm run start:dev > ../$LOG_DIR/backend.log 2>&1 &
echo $! > ../$LOG_DIR/backend.pid
cd ..

# 4. 启动前端
echo -e "${YELLOW}[3/3] 正在启动前端指挥大屏 (3000)...${NC}"
cd frontend
nohup npm run dev > ../$LOG_DIR/frontend.log 2>&1 &
echo $! > ../$LOG_DIR/frontend.pid
cd ..

# 5. 完成
sleep 2
echo -e "${GREEN}------------------------------------------------${NC}"
echo -e "${GREEN}系统已上线！${NC}"
echo -e "${BLUE}▶ 前端入口: http://localhost:3000${NC}"
echo -e "${BLUE}▶ 后端接口: http://localhost:3001/api${NC}"
echo -e "${YELLOW}查看实时日志:${NC}"
echo -e "  tail -f $LOG_DIR/backend.log"
echo -e "  tail -f $LOG_DIR/frontend.log"
echo -e "${GREEN}------------------------------------------------${NC}"
