Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
paths = Array( _
  sh.ExpandEnvironmentStrings("%ProgramFiles%\Rockstar Games\Launcher\Launcher.exe"), _
  sh.ExpandEnvironmentStrings("%ProgramFiles(x86)%\Rockstar Games\Launcher\Launcher.exe") _
)
For i = 0 To UBound(paths)
  If fso.FileExists(paths(i)) Then
    sh.Run """" & paths(i) & """", 1, False
    WScript.Quit
  End If
Next
MsgBox "Rockstar Games Launcher was not found.", 48, "GlowUpRP Helper"
