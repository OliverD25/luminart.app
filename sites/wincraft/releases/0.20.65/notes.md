---
version: 0.20.65
date: 2026-10-28
summary: A speed release. WindowDeck reads your windows on its own thread. Nothing you see changes.
download: wincraft.exe
highlights:
  - The main thread of WinCraft stays free, about 1 ms instead of up to 60 ms
  - WindowNamer saves its file in the background
---

## Internal

### Faster under the hood

Nothing you see changes.

- When you press a Windows key, WindowDeck now reads your windows on a thread of its own. The main thread of WinCraft stays free. It needs about 1 ms instead of up to 60 ms.
- WindowNamer matches saved names only when windows really changed, and it saves its file in the background.
