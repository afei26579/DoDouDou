@echo off
chcp 65001 >/dev/null
echo ========================================
echo Bead Helper - Frontend Server
echo ========================================
echo.

REM Check Node.js
node --version >/dev/null 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

REM Check node_modules
if not exist "node_modules" (
    echo [1/2] Installing dependencies...
    npm install
) else (
    echo [1/2] Dependencies already installed
)

REM Start dev server
echo [2/2] Starting development server...
echo.
echo Visit http://localhost:5173
echo Press Ctrl+C to stop the server
echo.
npm run dev
