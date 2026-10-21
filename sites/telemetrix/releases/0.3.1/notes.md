---
version: 0.3.1
date: 2026-09-28
summary: A tidier Currency card, plugin rows that can use several colours, and a way to check for and install updates from the settings box.
download: telemetrix-v0.3.1-windows-x86_64.zip
highlights:
  - A new Currency card layout with the rates next to the currency code and the graphs on the right
  - Plugin rows can use several colours, and can be left out of narrow cards
  - Check for and install updates from the s box
---

A Linux build (`telemetrix-v0.3.1-linux-x86_64.tar.gz`) is on the [release page](https://github.com/OliverD25/telemetrix/releases/tag/v0.3.1).

## Updates

### Updates from the settings box

The `s` box has an `update` group with this program's version, the latest release and when it was checked, and two rows that `Enter` runs in the background.

- `check now` asks GitHub and answers `up to date`, `v0.3.2 available` or `this build is newer`.
- `install now` appears when a newer release is known. It downloads with a percentage, checks the SHA-256 and installs the way `telemetrix update` does (including `screensaver update`). Then the status bar offers `u` to restart.

A failure changes nothing and shows its reason. The `auto` and `check_interval_h` rows are in the same group. The help (`?`) and the README describe it.

## Currency card

### New layout

The buy and sell rates now stand right next to the currency code, in bright text. On the right, a dim column shows the 7-day graph on the currency's line and the 30-day graph on the line under it, so the labels, graphs and changes line up. Each change is green when the rate rose and red when it fell. On a card narrower than 37 characters the 30-day lines go and only the rates stay. Nothing wraps.

## Plugins

### Several colours in one row

A metric's `label` and `value` can be a list of `{ text, style }` spans, and each span has its own style. A new style, `bright`, uses the value colour.

### Narrow cards

A metric can set `min_width`. The row is left out of cards narrower than this many characters.
