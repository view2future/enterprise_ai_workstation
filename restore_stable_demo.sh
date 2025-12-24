#!/bin/bash
# 联图/Nexus - 数据库一键恢复脚本 (最终稳定版)

set -e

BACKUP_FILE="backups/nexus_desktop_final_stable.db.bak"
TARGET_FILE="backend/prisma/nexus_desktop.db"

echo "==========================================="
echo "🚀 正在恢复至最终稳定版 Demo 数据库..."
echo "==========================================="

# 1. 检查备份
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ 错误: 找不到备份文件 $BACKUP_FILE"
    exit 1
fi

# 2. 停止后端进程
echo "🛑 正在停止后端服务..."
pkill -f "node dist/main" || echo "未发现运行中的后端进程。"

# 3. 恢复文件
echo "📦 正在还原数据库文件..."
cp "$BACKUP_FILE" "$TARGET_FILE"
chmod 666 "$TARGET_FILE"

# 4. 同步环境
echo "⚙️  正在同步 Prisma 环境..."
cd backend && npx prisma generate && cd ..

echo ""
echo "==========================================="
echo "✅ 恢复完成！数据已回归至稳定状态。"
echo "==========================================="
