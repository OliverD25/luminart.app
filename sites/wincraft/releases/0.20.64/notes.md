---
version: 0.20.64
date: 2026-10-28
summary: The Detailed log summary script can read the newest log while WinCraft writes it, and Save a report includes that log.
download: wincraft.exe
highlights:
  - The script no longer fails with "being used by another process"
  - Save a report always includes the log that is still being written
---

## Detailed log

### Reading the newest log

The Detailed log summary script (`tools\detailed-log.ps1`) now reads the newest log while WinCraft is still writing it. Before, it failed with "being used by another process".

**Detailed log: Save a report** now always includes the log that is still being written.
