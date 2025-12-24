#!/bin/bash

# 企业数据管理平台 - 数据库一键恢复脚本 (V5 Demo版)

set -e

BACKUP_FILE="backups/nexus_desktop_v5_demo.db.bak"
TARGET_FILE="backend/prisma/nexus_desktop.db"

echo "==========================================="
echo "正在恢复数据库到 V5 Demo 稳定版本..."
echo "==========================================="

# 1. 检查备份文件是否存在
if [ ! -f "$BACKUP_FILE" ]; then
    echo "错误: 找不到备份文件 $BACKUP_FILE"
    exit 1
fi

# 2. 停止可能正在运行的后端服务
echo "停止后端服务以释放数据库文件锁..."
pkill -f "node dist/main" || echo "没有正在运行的后端进程。"

# 3. 执行恢复
echo "正在覆盖数据库文件..."
cp "$BACKUP_FILE" "$TARGET_FILE"
chmod 666 "$TARGET_FILE"

# 4. 重新生成 Prisma Client (确保类型匹配)
echo "重新生成 Prisma Client..."
cd backend
npx prisma generate
cd ..

echo ""
echo "==========================================="
echo "✅ 数据库恢复成功！"
echo "您可以运行 ./start_dev.sh 或手动启动后端服务。"
echo "==========================================="
