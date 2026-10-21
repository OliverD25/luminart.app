---
version: 0.3.0
date: 2026-09-28
summary: Five new themes with their own options, updates straight from GitHub Releases, a Hosts plugin for your own servers, and a lighter GPU card.
download: telemetrix-v0.3.0-windows-x86_64.zip
highlights:
  - Five new themes - nasa, pip-boy, synthwave, kernel-log and ascii-dashboard
  - Options for every theme, changed in the t box with a live preview
  - telemetrix update downloads and installs the latest release, checking its SHA-256
  - A Hosts plugin that shows the health of your own servers
  - A GPU card that reads the same counters as Task Manager
---

A Linux build (`telemetrix-v0.3.0-linux-x86_64.tar.gz`) is on the [release page](https://github.com/OliverD25/telemetrix/releases/tag/v0.3.0).

## Themes

### Five new themes

- `nasa`: a mission control console. Every value is a row with a code, the value, its unit and a NOMINAL, CAUTION or WARNING status, in white and amber on black, under a line with the time since start (MET) and the UTC time (GMT). Static.
- `pip-boy`: a green wrist-computer screen in one hue, with ASCII frames, bracketed tabs and `[▮▮▮▯▯]` gauges. Static.
- `synthwave`: a neon sunset with a striped sun and a wireframe grid floor that moves toward you, and card frames that fade from purple to orange. Animated at `general.fps`, 10 frames per second at most on very large screens.
- `kernel-log`: a scrolling boot log with `[  OK  ]`, `[ WARN ]` and `[FAILED]` records for every change, timestamps like `dmesg`, and a pinned status block with the current values. The log keeps 500 records. Static: it redraws only on new data.
- `ascii-dashboard`: large block-character charts of the CPU and RAM history, and horizontal block bars for disks, GPUs and swap that fill in eighths of a cell. Static.

### Options per theme

Every theme has its own `[theme.<name>]` table: `cpu_view` and `ram_view` (a gauge, the tall history chart of ascii-dashboard, or both), `chart_height`, `hide` and `order` of the cards, and an `accent` colour. You change them in the `t` box (`Right` or `o` opens the options of the highlighted theme, with a live preview and one save for that theme), in the first group of the `s` box, and with `v`, which cycles the CPU view. The defaults keep every theme's look.

## Updates

### Updates from GitHub Releases

`telemetrix update [--check] [--dry-run] [--force]` downloads the program for this platform from the latest release of `OliverD25/telemetrix`, checks its SHA-256 against the release's `SHA256SUMS`, and replaces the installed program. On Windows the old file moves aside to `.old` and is deleted at the next start.

The screensaver watcher checks once a day (`[update] auto`, `check_interval_h`) and installs by itself when no dashboard is open. Otherwise it keeps a checked download ready. An open dashboard shows `update ready · u restart`, and `u` restarts into the new version in the same window.

Releases now carry the bare programs and a `SHA256SUMS` file next to the archives.

## Plugins

### Hosts plugin

The Hosts plugin is off by default. It shows the health result, load, memory, disk, uptime and UPS of your own servers, read by commands you list in the new `[commands]` table of `telemetrix.toml`. Plugins run them with `telemetrix.run(name)` or `telemetrix.run_all(names)`. Only names from your file work, with no extra arguments and no shell, and every command has a time limit and an output cap.

### Search settings for plugins

A `kind = "search"` setting and a `search(query)` function give a plugin a pick-from-a-list row in the `s` box. `plugin check <file> --search <text>` runs it without the dashboard.

## Changed and removed

- **GPU card:** `gpu.source = "auto"` (the default) reads the counters Task Manager uses on Windows (every GPU, about 1.3 MB of memory) and the amdgpu files on Linux. NVIDIA's NVML library is used only with `gpu.source = "nvml"`. It also gives the power in watts and adds about 24 MB. On Windows the card loads `gdi32.dll` at its first reading, so with the card off it costs no memory.
- **Screensaver:** the watcher runs from a copy of the program, so it never blocks `cargo install`. `telemetrix screensaver update` refreshes that copy. `install` and `update` check that the watcher really runs, and the watcher writes a small log that `status` shows. When Windows redirects AppData for the program that runs `install` (a packaged app), the task uses the folder where the copy really is.
- The weather city is picked from a search list in the `s` box, which also finds misspelled, old Russian and Cyrillic names. Places in the `country` setting (default `UA`) come first.
- The Disks and Network cards list drives by letter, as Windows Explorer does. On Linux `/` comes first, then the other mount points in order.
- `u` and `v` are reserved keys now. A plugin cannot use them as its run key.
- The status bar lists `v view` among its hints.

## Fixed

- The status bar no longer cuts its key hints in the middle of a word when the theme name is long. It drops hints from the end, then shows the keys alone.
