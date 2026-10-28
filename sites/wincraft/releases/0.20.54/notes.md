---
version: 0.20.54
date: 2026-10-28
summary: More diagnostics for the Win+digit problem, and a script that watches the keyboard.
download: wincraft.exe
highlights:
  - The hook logs calls it used to pass silently
  - tools/hook-observer.ps1 is a new script for the repository
---

## WindowDeck

### More diagnostics

The Win+1…9 hook now logs calls that it used to pass silently.

The repository also gains `tools/hook-observer.ps1`. It is a script that watches the keyboard with a hook of its own and writes what it sees. It shows the difference between a key that WinCraft never received and a key that no hook received.
