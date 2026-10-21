---
version: 0.4.0
date: 2026-09-28
summary: The settings box now has pages, one page for every plugin, and a search that finds any setting.
download: telemetrix-v0.4.0-windows-x86_64.zip
highlights:
  - The settings box has five categories instead of one long list of about 60 rows
  - One page for every plugin, with its own on and off switch and settings
  - Press / in the settings box to search every setting
---

A Linux build (`telemetrix-v0.4.0-linux-x86_64.tar.gz`) is on the [release page](https://github.com/OliverD25/telemetrix/releases/tag/v0.4.0).

## The settings box

### Pages instead of one long list

Press `s` and you no longer get one long list of about 60 rows. Five categories are on the left and the settings of the chosen one on the right.

- **Appearance:** theme, fps, the current theme's options and cards, units, and the keys of one theme.
- **Cards:** thresholds, disks and network drives, GPU, history length.
- **Plugins:** every plugin file, with a switch for all plugins.
- **Updates:** the update settings.
- **System:** screensaver mode, log, plugin folder, memory budgets, plugin limits, metrics intervals.

Nothing is hidden. The technical settings just have their own page. The box always opens at Appearance.

### One page per plugin

The Plugins page lists every plugin file with `on`, `off` or `error`, under the switch for all plugins. `Right` or `Enter` opens a plugin's page with `enabled`, `interval` and its own settings. This includes the weather city search and text inputs, which work as before.

### Keys in the box

- `Up` and `Down` choose.
- `Right` or `Enter` opens a page or a plugin.
- `Esc` or `Backspace` goes back one level. `Esc` on the category list closes the box.
- `Left` still picks the previous value. On a row that has no value to step (a plugin in the list, an action, a text setting, a path) it goes back one level instead.

### Search

`/` in the settings box searches every setting on every page and every plugin's page, by name or file key, in any letter case. The results show where each one is, like `Plugins › weather › city`. `Enter` opens that page with the setting chosen, and `Esc` goes back. While the search line is open every key is typed into it. Only `Ctrl+C` quits.

## Changed and removed

- On a terminal narrower than 60 columns or shorter than 11 rows, the categories become one line of letters (`A C P U S`) above the page. A page longer than the box scrolls.
