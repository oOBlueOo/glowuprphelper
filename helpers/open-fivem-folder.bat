@echo off
set "TARGET=%LOCALAPPDATA%\FiveM\FiveM.app"
if not exist "%TARGET%\" (
  echo FiveM folder was not found:
  echo %TARGET%
  pause
  exit /b 1
)
explorer.exe "%TARGET%"
