---
version: 0.20.17
date: 2026-10-26
summary: A new plugin, QuickJump, pins windows to digits so you can jump back to them from anywhere.
download: wincraft.exe
highlights:
  - Win+Alt+Shift+Q and a digit pins the window in front
  - Win+Alt+Q and a digit jumps to that window, even from another desktop
  - Win+Alt+Q twice opens the pin list
  - ShortcutDetector moved to Win+Alt+S
---

## QuickJump

QuickJump is a new plugin. It pins windows to the digits and lets you jump back to them.

### Pin a window

Press Win+Alt+Shift+Q, then a digit. This pins the window in front to that slot. The digit 0 means slot 10.

### Jump to a window

Press Win+Alt+Q, then a digit. QuickJump jumps to that window from anywhere. It switches the desktop if needed and restores a minimised window. If the window is closed, QuickJump can start the app.

### The pin list

Press Win+Alt+Q twice to open the pin list. It has live pictures and a details panel that shows how each pin finds its window again. You can drag pins to reorder them.

- A slot strip shows while QuickJump waits for the digit.
- Every change can be undone with Ctrl+Z while the notice shows.
- Pins are remembered after a restart.

## Hotkeys

### ShortcutDetector moved to Win+Alt+S

ShortcutDetector moved to Win+Alt+S, so QuickJump can use Win+Alt+Q. If you never changed its key, it moves by itself.

When another WinCraft command already holds a key, the warning now names that command. Before, it said "another app".
