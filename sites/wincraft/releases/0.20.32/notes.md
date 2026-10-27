---
version: 0.20.32
date: 2026-10-27
summary: One hotkey editor now works everywhere, and the wait for a digit or a chord key is steadier.
download: wincraft.exe
highlights:
  - The same small dialog records a hotkey on every page and in the palette
  - Backspace clears a hotkey, and F13 to F24 can be a hotkey on their own
  - Waits for a digit or a second key run on their own thread, so a digit cannot reach the app in front
---

## Hotkeys

### One hotkey editor everywhere

The same editor is now used in General, on the Hotkeys page, in plugin settings, and with Ctrl+K in the palette. Click the keys, or press Enter on them, to open a small dialog. It records at once.

- Enter saves, and Esc cancels.
- Backspace clears the keys. Backspace again removes the hotkey.
- It warns when another WinCraft command uses the keys. Then you can choose Move here.
- It warns when another app or Windows holds the keys. Then you can only cancel.
- Chords work inside it. A second key within 3 seconds makes "… then S".

**F13 to F24** may now be a hotkey on their own.

## Fixes

### Steadier key waits

The wait for a digit after Win+Alt+A, the wait for the second key of a chord, and the waits of QuickJump now run on their own thread. A busy moment can no longer let a digit slip into the app in front.
