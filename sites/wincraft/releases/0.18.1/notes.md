---
version: 0.18.1
date: 2026-10-25
summary: A new test command checks whether WinCraft can hide the taskbar hover popup the moment it opens.
download: wincraft.exe
highlights:
  - wincraft --test-hide-popup measures how long the popup is visible first
  - Win+number and Alt+Tab are always left alone
---

## For testing

### Hide-popup test

`wincraft --test-hide-popup` checks whether WinCraft can hide the hover thumbnail popup of the taskbar the moment the mouse opens it. It also measures how long the popup was visible first.

- Win+number and Alt+Tab are always left alone.
- The last 10 seconds only watch. They show that the popup works normally again.
- Add `--dry-run` to hide nothing.

This is a step towards opening the WinCraft Arrange strip instead of the hover preview of Windows.
