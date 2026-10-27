---
version: 0.20.22
date: 2026-10-26
summary: Arrange strip columns now fit in one row first, so the band no longer doubles in height.
download: wincraft.exe
highlights:
  - Each monitor column is as wide as everything it shows
  - A column wraps to a second row only when the columns do not fit
---

## Fixes

### Arrange strip columns fit in one row first

Each monitor column is now as wide as everything it shows, stand-in cards included. When all columns fit side by side, nothing wraps, and the last column takes the spare width. Only when they do not fit does the widest column take the rest. Only then can a column wrap to a second row.

This stops a column with stand-ins from wrapping and doubling the height of the band.
