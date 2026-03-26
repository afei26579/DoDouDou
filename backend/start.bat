@echo off
echo ========================================
echo 拼豆豆助手 - 后端启动脚本
echo ========================================
echo.

REM 检查虚拟环境
if not exist "venv\Scripts\activate.bat" (
    echo [错误] 虚拟环境不存在，请先运行 setup.bat
    pause
    exit /b 1
)

REM 激活虚拟环境
echo [1/3] 激活虚拟环境...
call venv\Scripts\activate.bat

REM 检查依赖
echo [2/3] 检查依赖...
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo [警告] 依赖未安装，正在安装...
    python -m pip install fastapi uvicorn[standard] sqlalchemy[asyncio] asyncpg alembic redis python-jose[cryptography] passlib[bcrypt] Pillow numpy scikit-learn pydantic pydantic-settings python-dotenv httpx python-multipart
)

REM 启动服务器
echo [3/3] 启动开发服务器...
echo.
echo 访问 http://localhost:8000/docs 查看API文档
echo 按 Ctrl+C 停止服务器
echo.
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
