#!/bin/bash

# --- Nexus Commander V5.0 "Clean" Production Packager ---
# Target: macOS Apple Silicon (arm64)
# ------------------------------------------------------

set -e

echo "=== 🧹 启动 NEXUS V5.0 深度清理与打包程序 ==="

# 1. 深度清理
echo "[1/7] 正在清理旧的构建产物与临时文件..."
rm -rf dist_electron
rm -rf frontend/dist
rm -rf backend/dist
rm -rf logs/*.log
rm -f backend/prisma/nexus_desktop.db
echo "✅ 清理完成。"

# 2. 更新版本号 (以当前日期为前缀)
echo "[2/7] 正在同步版本序列号..."
node scripts/update-version.js

# 3. 重新安装依赖并构建前端 (确保依赖无损)
echo "[3/7] 正在编译前端指挥系统 (Production)..."
cd frontend
# 使用 install 确保依赖一致性
npm install --quiet
npm run build
cd ..

# 4. 构建后端引擎
echo "[4/7] 正在构建后端逻辑内核..."
cd backend
npm install --quiet
npm run build
npx prisma generate
cd ..

# 5. 纯净数据库注入
echo "[5/7] 正在生成全新的生产环境数据库..."
node scripts/switch-db.js sqlite
cd backend
# 从 Schema 重新生成数据库
npx prisma db push --accept-data-loss --force-reset
# 顺序运行生产种子脚本
echo "🌱 注入 Master Seed..."
npx ts-node master_seed.ts
echo "🌱 注入 真实企业画像数据..."
npx ts-node real_data_sync.ts
echo "🌱 执行 V5 活力化更新..."
npx ts-node update_demo_data_v5.ts
cd ..

# 6. 环境校验
echo "[6/7] 正在校验打包资源完整性..."
if [ ! -f "backend/prisma/nexus_desktop.db" ]; then
    echo "❌ 错误: 数据库文件未生成！"
    exit 1
fi

# 7. 执行 Electron 封装
echo "[7/7] 正在封装 DMG 镜像 (Architecture: arm64)..."
npx electron-builder build --mac --arm64

echo ""
echo "=== ✨ 干净的 DMG 打包完成 / CLEAN BUILD SUCCESSFUL ==="
echo "镜像位置: $(pwd)/dist_electron/联图Nexus-$(grep version package.json | awk -F'"' '{print $4}')-arm64.dmg"
echo "系统版本: $(grep version package.json | awk -F'"' '{print $4}')"