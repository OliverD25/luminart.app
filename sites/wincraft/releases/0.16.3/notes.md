---
version: 0.16.3
date: 2026-10-18
summary: Notices from plugins are no longer lost when WinCraft is busy at that moment.
download: wincraft.exe
highlights:
  - Plugin notices, tooltips and prompts are delivered even when they arrive while WinCraft is busy
---

## Fixes

### Notices that were dropped

When WinCraft was busy at the moment a plugin sent a notice, a tooltip, a prompt or an Arrange strip request, the request was dropped and never shown. WinCraft now tries again after a moment. The tray icon and the palette hotkey are delivered again in the same way.
