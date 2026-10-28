---
version: 0.20.52
date: 2026-10-28
summary: The Win+1 to Win+9 keyboard hook does nothing slow in its callback, so Windows does not skip it.
download: wincraft.exe
highlights:
  - The mask key and the log line are handled on a side thread
  - The hook log shows how long each key waited
---

## WindowDeck

### A faster keyboard hook

The Win+1…9 keyboard hook now does nothing slow inside its callback. The mask key and the log line are handled on a side thread. Windows skips a hook that answers late. That can send a Win+digit to Windows instead of WinCraft.

The hook log now also shows how long each key waited and how long the callback took.
