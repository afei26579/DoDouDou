@echo off
echo ========================================
echo 拼豆豆助手 - 前端启动脚本
echo ========================================
echo.

REM 检查node_modules
if not exist "node_modules" (
    echo [错误] 依赖未安装，请先运行 npm install
    pause
    exit /b 1
)

REM 启动开发服务器
echo 启动开发服务器...
echo.
echo 访问 http://localhost:5173
echo 按 Ctrl+C 停止服务器
echo.
npm run dev
