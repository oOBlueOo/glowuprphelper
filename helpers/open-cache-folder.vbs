Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
p = sh.ExpandEnvironmentStrings("%LOCALAPPDATA%\FiveM\FiveM.app\data")
If fso.FolderExists(p) Then
  CreateObject("Shell.Application").Explore p
Else
  MsgBox "FiveM data folder was not found:" & vbCrLf & p, 48, "GlowUpRP Helper"
End If
