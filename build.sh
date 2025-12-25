#!/bin/bash

# 设置错误即停止
set -e

# 颜色定义
GREEN='\033[0-32m'
BLUE='\033[0-34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== 🚀 开始全栈系统构建 / Starting Full System Build ===${NC}"

# 1. 构建前端
echo -e "\n${BLUE}[1/2] 构建前端静态资源 / Building Frontend...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "安装前端依赖..."
    npm install
fi
npm run build
cd ..
echo -e "${GREEN}✔ 前端构建完成 / Frontend Build Complete${NC}"

# 2. 构建后端
echo -e "\n${BLUE}[2/2] 构建后端服务 / Building Backend...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo "安装后端依赖..."
    npm install --legacy-peer-deps
fi
echo "生成 Prisma 客户端..."
npx prisma generate
echo "执行 NestJS 编译..."
npm run build
cd ..
echo -e "${GREEN}✔ 后端构建完成 / Backend Build Complete${NC}"

# 3. 整合准备 (可选，针对本地运行)
echo -e "\n${BLUE}=== 📦 整合资源 / Finalizing ===${NC}"
mkdir -p backend/static
cp -R frontend/dist/* backend/static/
echo -e "${GREEN}✔ 已将前端产物同步至 backend/static${NC}"

echo -e "\n${GREEN}✨ 所有构建任务已成功完成！/ All tasks completed successfully!${NC}"
echo -e "您可以运行 'cd backend && npm run start:prod' 在本地启动生产环境测试。"
