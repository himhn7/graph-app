@echo off
setlocal

set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm is not available in PATH.
  echo Install Node.js and reopen your terminal.
  exit /b 1
)

if not exist "backend\package.json" (
  echo [ERROR] backend\package.json not found.
  exit /b 1
)

if not exist "frontend\package.json" (
  echo [ERROR] frontend\package.json not found.
  exit /b 1
)

echo Starting backend and frontend in separate terminals...
start "Graph App Backend" cmd /k "cd /d ""%ROOT_DIR%backend"" && npm run dev"
start "Graph App Frontend" cmd /k "cd /d ""%ROOT_DIR%frontend"" && npm run dev"

echo.
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:5173
echo.
echo Close each terminal window to stop its server.

endlocal
