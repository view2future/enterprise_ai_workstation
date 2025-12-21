
#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

clear
echo -e "${BLUE}==============================================${NC}"
echo -e "   ${GREEN}ENTERPRISE AI WORKSTATION - 自动化演示系统${NC}"
echo -e "${BLUE}==============================================${NC}"
echo ""

# 检查依赖
if ! command -v python3 &> /dev/null
then
    echo -e "${RED}错误: 未检测到 python3。请先安装。${NC}"
    exit 1
fi

# 询问是否录制
echo -ne "是否开启屏幕录制并保存到本地？(y/${BLUE}N${NC}): "
read -r record_choice

RECORD_FLAG=""
if [[ "$record_choice" =~ ^([yY][eE][sS]|[yY])$ ]]
then
    RECORD_FLAG="--record"
    mkdir -p demo/recordings
    echo -e "${RED}注意：录制将在演示结束后自动保存到 demo/recordings/ 目录。${NC}"
fi

echo -e "${GREEN}正在启动演示环境...${NC}"
echo -e "提示：您可以在演示过程中点击屏幕右下角的按钮随时 ${BLUE}暂停/继续${NC}。"
echo ""

# 启动 Python 脚本
python3 demo/runner.py $RECORD_FLAG

echo ""
echo -e "${GREEN}演示已完成。${NC}"
