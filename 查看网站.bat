@echo off
title 订货商城 - 本地预览
cd /d "C:\Users\Qiuxiaomin\Desktop\订货移动商城"
echo 正在启动本地服务器...
start http://localhost:4173
npx vite preview --port 4173 --host
pause
