---
version: 0.17.8
date: 2026-10-24
summary: The taskbar order after sign-in is now set reliably, and Settings switches no longer slide when the window opens.
download: wincraft.exe
highlights:
  - LayoutKeeper waits until new windows answer, then sets the taskbar order again 8 seconds later
  - The log names the window when Windows refuses to move a taskbar button
  - Settings switches slide only when you click them
---

## LayoutKeeper

### Taskbar order after sign-in

LayoutKeeper now waits until the new windows of an app answer before it sets their taskbar order. After a sign-in, it sets the order once more 8 seconds later. Before, the buttons of windows that had just opened could keep the place the app gave them.

If Windows refuses to move a taskbar button, the log now says which window it was.

## Settings

### No slide when the window opens

Switches in Settings no longer slide when the window opens. They slide only when you click them.
