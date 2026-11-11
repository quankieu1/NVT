@echo off
chcp 65001 >nul
set "PORTABLE_NODE=C:\Users\admin\.gemini\antigravity\brain\6ea55005-e15e-43ad-a43b-d529515fcf82\scratch\node-v22.14.0-win-x64"
if exist "%PORTABLE_NODE%\node.exe" (
  set "PATH=%PORTABLE_NODE%;%PATH%"
)
echo =========================================================
echo   Khoi dong Website Thiep Cuoi Online tai http://localhost:3000
echo   Cong cu tao link khach moi: http://localhost:3000/tao-link
echo =========================================================
npm.cmd run dev
pause

