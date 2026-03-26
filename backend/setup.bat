@echo off
echo ========================================
echo 拼豆豆助手 - 环境设置脚本
echo ========================================
echo.

REM 检查Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到Python，请先安装Python 3.11+
    pause
    exit /b 1
)

REM 创建虚拟环境
if not exist "venv" (
    echo [1/3] 创建虚拟环境...
    python -m venv venv
) else (
    echo [1/3] 虚拟环境已存在
)

REM 激活虚拟环境
echo [2/3] 激活虚拟环境...
call venv\Scripts\activate.bat

REM 升级pip
echo [3/3] 升级pip...
python -m pip install --upgrade pip

REM 安装依赖
echo [4/5] 安装依赖（这可能需要几分钟）...
python -m pip install fastapi==0.110.0 uvicorn[standard]==0.27.0 sqlalchemy[asyncio]==2.0.27 asyncpg==0.29.0 alembic==1.13.1 redis==5.0.1 python-jose[cryptography]==3.3.0 passlib[bcrypt]==1.7.4 Pillow==10.2.0 numpy==1.26.4 scikit-learn==1.4.0 pydantic==2.6.1 pydantic-settings==2.1.0 python-dotenv==1.0.1 httpx==0.27.0 python-multipart==0.0.9

REM 配置环境变量
if not exist ".env" (
    echo [5/5] 创建环境变量文件...
    copy .env.example .env
    echo 请编辑 .env 文件配置数据库连接
) else (
    echo [5/5] 环境变量文件已存在
)

echo.
echo ========================================
echo ✅ 设置完成！
echo ========================================
echo.
echo 下一步：
echo 1. 编辑 .env 文件配置数据库
echo 2. 运行 start.bat 启动开发服务器
echo.
pause
