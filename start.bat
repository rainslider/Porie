@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is niet geinstalleerd. Download het gratis van https://nodejs.org en start dit bestand opnieuw.
  pause
  exit /b
)
start "" http://localhost:3000
node server.js
pause
