@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo Evida starter...
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%start-evida.ps1" %*

if errorlevel 1 (
  echo.
  echo Evida kunne ikke starte. Se feilmeldingen over.
  exit /b %errorlevel%
)

endlocal
