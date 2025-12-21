#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

clear
printf "${BLUE}==============================================${NC}\n"
printf "   ${GREEN}ENTERPRISE AI WORKSTATION - 自动化演示系统${NC}\n"
printf "${BLUE}==============================================${NC}\n"
printf "\n"

# 1. 分辨率选择
printf "${BLUE}请选择屏幕分辨率方案:${NC}\n"
printf "1) MacBook Air / Pro (1440x900 Retina) - [默认]\n"
printf "2) 标准高清 (1920x1080)\n"
printf "3) 紧凑型 (1280x800)\n"
printf "选择 (1/2/3): "
read -r res_choice

WIDTH=1440
HEIGHT=900

case $res_choice in
    2) WIDTH=1920; HEIGHT=1080 ;;
    3) WIDTH=1280; HEIGHT=800 ;;
    *) WIDTH=1440; HEIGHT=900 ;;
esac

# 2. 录制选择
printf "是否开启屏幕录制并保存到本地？(y/N): "
read -r record_choice

RECORD_FLAG=""
if [[ "$record_choice" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    RECORD_FLAG="--record"
    mkdir -p demo/recordings
    printf "${RED}注意：录制将在演示结束后保存到 demo/recordings/ 目录。${NC}\n"
fi

printf "${GREEN}正在启动演示环境 ($WIDTH x $HEIGHT)...${NC}\n"
printf "提示：您可以在演示过程中点击右下角按钮随时 ${BLUE}暂停/继续${NC}。\n"
printf "\n"

# 运行驱动程序
python3 demo/runner.py $RECORD_FLAG $WIDTH $HEIGHT

printf "\n"
printf "${GREEN}演示已完成。${NC}\n"
