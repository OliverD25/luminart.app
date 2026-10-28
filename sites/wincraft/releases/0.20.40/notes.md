---
version: 0.20.40
date: 2026-10-28
summary: WindowDeck switches apps in place and opens much faster.
download: wincraft.exe
highlights:
  - While WindowDeck is open, Win and another number switch it to that app at once
  - Win and the same number pick the next window
  - Opening time falls from 400-550 ms to about 35-110 ms in a test copy
---

## WindowDeck

### Switches apps in place

While WindowDeck is open, Win and another number switch it to that app at once, without closing. Win and the same number pick the next window. Win pressed and released alone closes WindowDeck, and Start opens as usual.

### Opens much faster

This was measured in a test copy. WindowDeck now opens in about 80 to 110 ms when it was opened before. It switches apps in place in 35 to 45 ms. Before, it took 400 to 550 ms.

Four changes make this faster:

- The window thread of WinCraft now wakes at once.
- The WindowDeck window is kept between openings.
- The taskbar buttons are remembered.
- The windows are gathered while you hold Win.

Keeping the window costs no measurable extra memory.
