@echo off
for %%P in (
  "%ProgramFiles%\Rockstar Games\Launcher\Launcher.exe"
  "%ProgramFiles(x86)%\Rockstar Games\Launcher\Launcher.exe"
) do (
  if exist "%%~P" (
    start "" "%%~P"
    exit /b 0
  )
)
echo Rockstar Games Launcher was not found.
echo Download it from https://www.rockstargames.com/downloads
pause
