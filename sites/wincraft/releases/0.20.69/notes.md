---
version: 0.20.69
date: 2026-10-29
summary: A small panel shows every update step, and a closing window slides out of WindowDeck with a short animation.
download: wincraft.exe
highlights:
  - The update panel shows each step with a progress bar and says why a step failed
  - When GitHub limits update checks, WinCraft reads the releases page instead
  - At most 6 update checks an hour
  - Closed cards shrink and fade, and the cards after them slide into the gap
---

## Updates

### A panel for every step

A small WinCraft panel shows every update step with a progress bar. The steps are checking, downloading with the percent, checking the download, and restarting. If something fails, it says why, and it says that your version stays.

### Fewer checks to GitHub

- A version that WinCraft already knows about, or downloaded ahead, installs at once without asking GitHub again.
- When GitHub limits update checks, WinCraft reads the newest version from the releases page instead. It says so honestly, instead of saying "offline".
- There are at most 6 update checks an hour.

## WindowDeck

### Closing a window

When you close a window with a middle click or Ctrl+W, its card shrinks and fades. The cards after it slide into the gap. A window that asks "Save changes?" gets its card back with `Waiting for <app>`. There is no motion when Windows animations are off.

## Settings

### Help texts

Help texts in Settings now wrap as one paragraph. The text of "Download updates ahead" had a gap.
