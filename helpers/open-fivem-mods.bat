@echo off
set "TARGET=%LOCALAPPDATA%\FiveM\FiveM.app\mods"
if not exist "%TARGET%\" mkdir "%TARGET%" >nul 2>&1
if not exist "%TARGET%\" (
  echo FiveM mods folder was not found:
  echo %TARGET%
  pause
  exit /b 1
)
explorer.exe "%TARGET%"
