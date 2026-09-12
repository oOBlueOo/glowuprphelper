Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
p = FindGta()
If p = "" Then
  MsgBox "Could not find GTA5.exe. Open Steam or Rockstar, right-click GTA V, and choose Browse local files.", 48, "GlowUpRP Helper"
Else
  sh.Run "explorer.exe /select,""" & p & "\GTA5.exe""", 1, False
End If

Function FindGta()
  Dim sh, fso, keys, paths, i, p
  Set sh = CreateObject("WScript.Shell")
  Set fso = CreateObject("Scripting.FileSystemObject")
  keys = Array( _
    "HKLM\SOFTWARE\WOW6432Node\Rockstar Games\Grand Theft Auto V\InstallFolder", _
    "HKLM\SOFTWARE\Rockstar Games\Grand Theft Auto V\InstallFolder", _
    "HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 271590\InstallLocation", _
    "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 271590\InstallLocation" _
  )
  For i = 0 To UBound(keys)
    On Error Resume Next
    p = sh.RegRead(keys(i))
    On Error GoTo 0
    If VarType(p) = 8 Then
      p = Trim(p)
      If Right(p, 1) = "\" Then p = Left(p, Len(p) - 1)
      If fso.FileExists(p & "\GTA5.exe") Then
        FindGta = p
        Exit Function
      End If
    End If
    p = ""
  Next
  paths = Array( _
    sh.ExpandEnvironmentStrings("%ProgramFiles%\Rockstar Games\Grand Theft Auto V"), _
    sh.ExpandEnvironmentStrings("%ProgramFiles(x86)%\Rockstar Games\Grand Theft Auto V"), _
    sh.ExpandEnvironmentStrings("%ProgramFiles(x86)%\Steam\steamapps\common\Grand Theft Auto V"), _
    "C:\SteamLibrary\steamapps\common\Grand Theft Auto V", _
    "D:\SteamLibrary\steamapps\common\Grand Theft Auto V", _
    "E:\SteamLibrary\steamapps\common\Grand Theft Auto V", _
    "F:\SteamLibrary\steamapps\common\Grand Theft Auto V" _
  )
  For i = 0 To UBound(paths)
    If fso.FileExists(paths(i) & "\GTA5.exe") Then
      FindGta = paths(i)
      Exit Function
    End If
  Next
  FindGta = ""
End Function
