@echo off
setlocal EnableExtensions
set "FOUND="

for %%K in (
  "HKLM\SOFTWARE\WOW6432Node\Rockstar Games\Grand Theft Auto V"
  "HKLM\SOFTWARE\Rockstar Games\Grand Theft Auto V"
) do (
  for /f "tokens=2,*" %%A in ('reg query %%K /v InstallFolder 2^>nul ^| find /I "InstallFolder"') do (
    if exist "%%B\GTA5.exe" set "FOUND=%%B"
  )
)

if not defined FOUND (
  for %%K in (
    "HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 271590"
    "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 271590"
  ) do (
    for /f "tokens=2,*" %%A in ('reg query %%K /v InstallLocation 2^>nul ^| find /I "InstallLocation"') do (
      if exist "%%B\GTA5.exe" set "FOUND=%%B"
    )
  )
)

if not defined FOUND (
  for %%P in (
    "%ProgramFiles%\Rockstar Games\Grand Theft Auto V"
    "%ProgramFiles(x86)%\Rockstar Games\Grand Theft Auto V"
    "%ProgramFiles(x86)%\Steam\steamapps\common\Grand Theft Auto V"
    "%ProgramFiles%\Steam\steamapps\common\Grand Theft Auto V"
    "C:\SteamLibrary\steamapps\common\Grand Theft Auto V"
    "D:\SteamLibrary\steamapps\common\Grand Theft Auto V"
    "E:\SteamLibrary\steamapps\common\Grand Theft Auto V"
    "F:\SteamLibrary\steamapps\common\Grand Theft Auto V"
  ) do (
    if exist "%%~P\GTA5.exe" set "FOUND=%%~P"
  )
)

if not defined FOUND (
  echo Could not find GTA5.exe.
  echo Open Steam or Rockstar, right-click GTA V, and choose Browse local files.
  pause
  exit /b 1
)

explorer.exe /select,"%FOUND%\GTA5.exe"
