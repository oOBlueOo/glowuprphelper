@echo off
set "TARGET=%LOCALAPPDATA%\FiveM\FiveM.app\plugins"
if not exist "%TARGET%\" mkdir "%TARGET%" >nul 2>&1
if not exist "%TARGET%\" (
  echo FiveM plugins folder was not found:
  echo %TARGET%
  pause
  exit /b 1
)
explorer.exe "%TARGET%"
