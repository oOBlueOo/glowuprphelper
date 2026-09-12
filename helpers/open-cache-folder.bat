@echo off
set "TARGET=%LOCALAPPDATA%\FiveM\FiveM.app\data"
if not exist "%TARGET%\" (
  echo FiveM data folder was not found:
  echo %TARGET%
  pause
  exit /b 1
)
explorer.exe "%TARGET%"
