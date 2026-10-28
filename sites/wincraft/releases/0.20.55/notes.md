---
version: 0.20.55
date: 2026-10-28
summary: Win+1, let go, Win+2 now moves the open WindowDeck to app 2, and the cause is found and removed.
download: wincraft.exe
highlights:
  - Win+same digit picks the next card while WindowDeck has the keyboard
  - The raw keyboard input that made Windows skip the hook is removed
---

## WindowDeck

### Win+1, let go, Win+2 works

Win+1, let go, then Win+2 now moves the open WindowDeck to app 2. Win and the same digit pick the next card. This works while WindowDeck has the keyboard.

The cause was the window library. It registered WinCraft for raw keyboard input. While a WinCraft window was in front, Windows then skipped the keyboard hook of WinCraft for key presses. WinCraft never used that raw input. It is now removed at start and kept removed.
