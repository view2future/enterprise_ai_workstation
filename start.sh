#!/bin/bash

# 企业数据管理平台启动脚本

set -e  # 命令失败时退出

echo "==========================================="
echo "企业数据管理平台启动脚本"
echo "==========================================="

# 检查是否已安装必要的工具
echo "检查依赖..."
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "错误: npm 未安装，请先安装 npm"
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "警告: PostgreSQL 未安装或未添加到PATH"
    echo "请确保 PostgreSQL 已安装并正在运行"
fi

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "当前工作目录: $SCRIPT_DIR"

# 检查环境配置
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
    echo "警告: 未找到 $ENV_FILE 文件，正在创建示例配置..."
    cat > "$ENV_FILE" << EOF
# 企业数据管理平台环境配置
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=enterprise_db
DB_USER=wangyu94
DB_PASSWORD=
JWT_SECRET=your_jwt_secret_here_change_this_to_something_secure
EOF
    echo "已创建 $ENV_FILE，请根据您的实际情况修改配置"
else
    echo "已找到环境配置文件: $ENV_FILE"
fi

# 检查后端目录
BACKEND_DIR="backend"
if [ ! -d "$BACKEND_DIR" ]; then
    echo "错误: 后端目录 $BACKEND_DIR 不存在"
    exit 1
fi

# 检查前端目录
FRONTEND_DIR="frontend"
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "错误: 前端目录 $FRONTEND_DIR 不存在"
    exit 1
fi

echo ""
echo "==========================================="
echo "启动开发环境..."
echo "==========================================="

# 运行开发启动脚本
exec ./start_dev.sh