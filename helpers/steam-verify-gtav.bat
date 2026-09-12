@echo off
start "" "%ProgramFiles(x86)%\Steam\steam.exe" steam://validate/271590
if errorlevel 1 start "" steam://validate/271590
