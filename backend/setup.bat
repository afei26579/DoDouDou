@echo off
chcp 65001 >nul
echo ========================================
echo Bead Helper - Backend Setup
echo ========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Please install Python 3.11+
    pause
    exit /b 1
)

REM Create virtual environment
if not exist "venv" (
    echo [1/5] Creating virtual environment...
    python -m venv venv
) else (
    echo [1/5] Virtual environment already exists
)

REM Activate virtual environment
echo [2/5] Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo [3/5] Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
echo [4/5] Installing dependencies (this may take a few minutes)...
pip install -r requirements.txt

REM Setup environment file
if not exist ".env" (
    echo [5/5] Creating .env file...
    copy .env.example .env
    echo Please edit .env file to configure database connection
) else (
    echo [5/5] .env file already exists
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file to configure database
echo 2. Run start.bat to start development server
echo.
pause
