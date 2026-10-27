---
version: 0.17.6
date: 2026-10-24
summary: Windows are placed as soon as they open after sign-in, the please-wait panel can no longer get stuck, and arrow keys work in Settings.
download: wincraft.exe
highlights:
  - Each window moves to its saved desktop and monitor as soon as its app opens it
  - Apps that start hidden in the tray no longer keep the please-wait panel open
  - The panel shows only once per restore
  - Up and down arrows move between the pages of the Settings side menu
---

## LayoutKeeper

### Windows are placed the moment they open

After sign-in, LayoutKeeper now moves each window to its saved desktop and monitor as soon as its app opens it. Before, it waited for all windows of the app. The taskbar order follows when all windows of the app are in, or after 3 quiet seconds.

### The please-wait panel never gets stuck

Apps that start hidden in the tray (such as Surfshark or ShareX) no longer hold the panel open.

- Each line shows for at most 20 seconds after the last new window of its app.
- The whole panel closes at most 60 seconds after the last window was placed.
- The panel shows only once per restore. It does not come back when you open an app later.

## Settings

### Arrow keys

The ↑ and ↓ keys now move between the pages of the side menu.
