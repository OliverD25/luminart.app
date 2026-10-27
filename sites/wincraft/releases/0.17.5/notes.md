---
version: 0.17.5
date: 2026-10-23
summary: LayoutKeeper puts your windows back more reliably after a reboot, because it keeps the layout from the last moment before shutdown.
download: wincraft.exe
highlights:
  - A separate snapshot is saved at shutdown and used at the next sign-in
  - Windows are checked and moved to the right virtual desktop after a restore
  - Apps shown on all desktops are no longer treated as being on a removed desktop
  - The previous log is kept as wincraft.prev.log
---

## LayoutKeeper

LayoutKeeper puts your windows back more reliably after a reboot.

### The last layout before shutdown is kept

When Windows shuts down or restarts, LayoutKeeper writes a separate snapshot. The next sign-in restores from it. Later saves can no longer replace the layout you had.

### Windows land on their virtual desktops

A few seconds after a restore, LayoutKeeper checks the desktop and monitor of every window. It moves a window once more if it is in the wrong place. It writes any window that is still wrong to the log.

### Smaller fixes

- Apps that are shown on all desktops (such as Claude, Telegram and Obsidian) are no longer treated as being on a removed desktop.
- Windows with the same title now get their taskbar place and their desktop from the same saved entry.

## Log

### The previous log is kept

At each start, WinCraft keeps the previous log as `wincraft.prev.log`. You can use it to look into problems after a reboot.
