@echo off
title 订货商城 - 本地预览
cd /d "C:\Users\Qiuxiaomin\Desktop\订货移动商城"
echo 正在启动开发服务器（热更新模式）...
start http://localhost:3000
npx vite --port 3000 --host
pause
