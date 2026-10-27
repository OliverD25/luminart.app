---
version: 0.18.0
date: 2026-10-24
summary: Win+Alt+A opens the Arrange strip with the current virtual desktop first, and a new test command watches taskbar thumbnails.
download: wincraft.exe
highlights:
  - The Arrange strip opens with only the current desktop, with a link to the others
  - The D key shows the other desktops
  - wincraft --probe-thumbnails is a read-only test for taskbar thumbnails
---

## Arrange strip

### This desktop first

Win+Alt+A now opens with only the current virtual desktop. A small link under it, "+ N other desktops", or the **D** key shows the other desktops.

You can still send a window to another desktop. Right-click and choose Move to desktop, press Shift+↑ or Shift+↓, or drag a card onto the link and hold it there for a moment.

## For testing

### Taskbar thumbnail probe

`wincraft --probe-thumbnails` watches the thumbnail popup of the taskbar for 30 seconds and writes a report. It only reads and changes nothing. It is the first step towards dragging thumbnails in the taskbar with WinCraft itself.
