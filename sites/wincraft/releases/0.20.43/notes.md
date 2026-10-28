---
version: 0.20.43
date: 2026-10-28
summary: QuickActions shows live state in the palette, adds seven tools, and asks for Enter twice on risky commands.
download: wincraft.exe
highlights:
  - The inspector shows what a command will do now, for example "Now: Dark · Enter switches to Light"
  - Seven new tools for network, clipboard, audio, system and settings
  - A command that cannot be undone needs Enter twice within 5 seconds
---

## QuickActions

### Live state

Pick a QuickActions command in the palette, and the inspector shows what it will do now. Examples are "Now: Dark · Enter switches to Light", the current size of a window, or how long Keep Awake has been on.

### Seven new tools

- Network: Copy Local IP
- Network: Flush DNS Cache
- Clipboard: Convert to Plain Text
- Clipboard: Copy New UUID
- Audio: Toggle Microphone Mute
- System: Empty Recycle Bin (press Enter twice)
- Settings: Open Environment Variables

### Safer risky commands

A command that cannot be undone, such as emptying the Recycle Bin, needs Enter twice within 5 seconds. A hotkey on such a command opens the palette on it instead of running it.
