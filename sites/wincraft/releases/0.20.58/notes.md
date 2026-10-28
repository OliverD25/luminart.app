---
version: 0.20.58
date: 2026-10-28
summary: A housekeeping release. Nothing you use changes.
download: wincraft.exe
highlights:
  - Old developer probes for the taskbar preview popup were removed
  - More tests were added
---

## Internal

### Housekeeping

Nothing you use changes in this release.

- The old developer probes for the taskbar preview popup were removed. These are `--probe-taskbar-at`, `--probe-thumbnails` and `--test-hide-popup`. The Arrange strip replaced them long ago.
- Tests were added for small core parts that had none.
- The full check now prints a test map report, so the tests stay matched to what WinCraft does.
