---
version: 0.20.50
date: 2026-10-28
summary: The Win+1 to Win+9 keyboard hook now logs what it does, to help find a Win+digit problem.
download: wincraft.exe
highlights:
  - Diagnostic change only
---

## WindowDeck

### More log lines

The Win+1…9 keyboard hook now logs what it does with each Windows key and each digit pressed with Win. This helps find why a second Win+digit, pressed while WindowDeck is open, goes to Windows instead.
