@echo off
title Glow - Clear FiveM cache
echo Closing FiveM if it is running...
taskkill /F /IM FiveM.exe >nul 2>&1
taskkill /F /IM FiveM_GTAProcess.exe >nul 2>&1
taskkill /F /IM FiveM_ChromeBrowser.exe >nul 2>&1
taskkill /F /IM FiveM_DumpServer.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo Deleting cache, server-cache, and server-cache-priv only...
rd /s /q "%LOCALAPPDATA%\FiveM\FiveM.app\data\cache" 2>nul
rd /s /q "%LOCALAPPDATA%\FiveM\FiveM.app\data\server-cache" 2>nul
rd /s /q "%LOCALAPPDATA%\FiveM\FiveM.app\data\server-cache-priv" 2>nul
echo Done. game-storage was left alone.
echo You can start FiveM again. The first join will be slower.
pause
