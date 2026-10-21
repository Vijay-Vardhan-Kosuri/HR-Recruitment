@echo off
cd /d "%~dp0"
echo Installing dependencies...
call npm install
echo.
echo Starting HireFlow at http://localhost:5173
call npm run dev
pause
