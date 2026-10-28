---
version: 0.20.53
date: 2026-10-28
summary: More diagnostics for the Win+digit problem, in the log.
download: wincraft.exe
highlights:
  - Diagnostic change only
---

## WindowDeck

### More diagnostics

These changes help find the Win+digit problem.

- Each keyboard-hook thread now warns in the log when it could not run for 150 ms or more.
- The hook logs its mask key and any slow callback.
- WindowDeck logs how it took the keyboard and how long that took.
