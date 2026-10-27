---
version: 0.18.2
date: 2026-10-25
summary: The hide-popup test now acts on the taskbar hover popup as soon as it appears.
download: wincraft.exe
highlights:
  - The test acts before Windows gives the popup its title
---

## For testing

### Hide-popup test fix

`wincraft --test-hide-popup` now acts on the hover popup of the taskbar the moment it appears. This is before Windows gives the popup its title. Win+number and Alt+Tab are still left alone.
