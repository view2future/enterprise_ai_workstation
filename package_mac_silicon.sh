#!/bin/bash

# =================================================================
# 联图/Nexus - macOS Apple Silicon 自动打包脚本
# 功能：自动生成带日期前缀的版本号，构建生产环境并打包 DMG
# =================================================================

set -e

# 1. 获取当前日期作为版本前缀
DATE_PREFIX=$(date +%Y%m%d)
echo "📅 打包日期前缀: $DATE_PREFIX"

# 2. 读取原始版本号 (从 package.json)
ORIGINAL_VERSION=$(node -p "require('./package.json').version")
NEW_VERSION="${DATE_PREFIX}.${ORIGINAL_VERSION}"
echo "🏷️  新版本号: $NEW_VERSION (原版本: $ORIGINAL_VERSION)"

# 3. 临时更新 package.json 中的版本号
# 使用 node 脚本安全更新，避免 sed 在不同平台下的差异
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.version = '$NEW_VERSION';
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

echo "🚀 开始构建生产环境..."

# 4. 构建前端
echo "📦 构建前端资源..."
npm run build:frontend

# 5. 构建后端
echo "📦 构建后端资源..."
npm run build:backend

# 6. 准备 SQLite 生产数据库
echo "🗄️  准备生产环境 SQLite 数据库..."
npm run prep:sqlite

# 7. 执行 Electron 打包 (针对 Apple Silicon)
echo "🏗️  正在生成 macOS (arm64) DMG 安装包..."
npx electron-builder build --mac --arm64

# 8. 恢复原始版本号
echo "♻️  恢复 package.json 原始版本号..."
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.version = '$ORIGINAL_VERSION';
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

echo "✅ 打包完成！DMG 文件已存放在 dist_electron 目录中。"
echo "📂 输出路径: $(pwd)/dist_electron/联图Nexus-${NEW_VERSION}-arm64.dmg"
