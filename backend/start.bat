@echo off
chcp 65001 >nul
echo ========================================
echo Bead Helper - Backend Server
echo ========================================
echo.

REM Check virtual environment
if not exist "venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment not found. Please run setup.bat first
    pause
    exit /b 1
)

REM Activate virtual environment
echo [1/3] Activating virtual environment...
call venv\Scripts\activate.bat

REM Check dependencies
echo [2/3] Checking dependencies...
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo [WARNING] Dependencies not installed. Installing...
    pip install -r requirements.txt
)

REM Start server
echo [3/3] Starting development server...
echo.
echo Visit http://localhost:8000/docs for API documentation
echo Press Ctrl+C to stop the server
echo.
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
