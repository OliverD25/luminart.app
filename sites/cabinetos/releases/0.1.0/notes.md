---
version: 0.1.0
date: 2026-09-30
summary: The first release: two panes, copy queues per disk, search, a command palette, a terminal, themes and sandboxed plugins.
download: CabinetOS-0.1.0-win-x64-setup.exe
highlights:
  - Two file panes with tabs, breadcrumbs and pinned folders
  - One copy queue per disk, with pause, resume and cancel
  - A command palette with chord keys
  - An integrated terminal with PowerShell, Command Prompt and WSL
  - Plugins that run in a sandbox, installed from a marketplace
---

## Panes and navigation

### Two panes, or one

Two file panes side by side, or one at a keystroke. Each pane has back, forward and up, pinned folders, and the drives with their free space.

![Two panes side by side, the sidebar with pinned folders and drives](media/hero.webp)

### Tabs and breadcrumbs

Each pane has its own tab strip and breadcrumb row. The tab strip shows from the first tab, with a "+" button, and a middle click closes any tab. Long paths collapse to `Drive › … › parent › current`, and Ctrl+L types a path. Ctrl+1 to Ctrl+9 bring a pane's tabs to the front.

### Fast listings

Folder listings are read with the NT API and handed to the window through shared memory: 100,000 entries in about 50 ms. Open folders refresh when their contents change on disk, and drives appear and disappear as they are plugged in. Type names and icons are the ones Windows Explorer shows.

### One top row

One top row is also the window's drag area. It holds a menu of common commands, the workspace pill with the git branch of the active folder, a command center, and the view and Settings buttons. Ctrl+K Ctrl+W opens the workspace pill's dropdown.

## File operations

### Copy, move, rename and delete

Copy (F5), move (F6), new folder (F7) and rename (F2). Delete goes to the Recycle Bin. Delete for good (Shift+Delete) asks for a confirmation first.

### One copy queue per disk

There is one copy queue per physical disk: one job at a time on a hard disk, several on an SSD. A job can be paused, resumed or cancelled, and a live speed graph shows how fast it goes.

### Conflicts stop only one file

A file conflict pauses only that file. You can skip it, replace it, or copy it under a new name, once or for every conflict of its kind.

### Open and Properties

Open a file with its default program, or a folder in the other pane. Properties works for any row.

## Search

### Search as you type

Search as you type in the current folder, or across a whole volume. Find in Pane (Ctrl+F) filters the active pane's list by name as you type, and Esc shows every row again. The search through subfolders is the Search view (Ctrl+Shift+F), which the classic and right layouts show in the sidebar's place.

### Quick Open

Quick Open (Ctrl+P) lists the files and folders of the workspace on the command palette's surface, and `>` switches to the commands. Enter opens a row in the active pane, and Ctrl+Enter opens it in the other one.

### An optional indexer

An optional indexer service reads the NTFS master file table and change journal, for instant search of whole volumes. Install it with `install.ps1 -AllUsers -Indexer`.

## Commands and keys

### The command palette

The command palette (Ctrl+Shift+P) finds every command by name, shows its keys, and changes them in place.

![The command palette filtered to the copy commands, each with its shortcut](media/command-palette.webp)

### Chord keys

Chord keys such as Ctrl+K then Ctrl+T are supported. A protected set of system keys cannot be rebound away.

## Terminal

### An integrated terminal

The terminal (`` Ctrl+` ``) has PowerShell, Command Prompt and WSL profiles, and it follows the active pane's folder. A fourth profile, `claude`, runs Claude Code on your own login. It is not a shell, so `followsPane: false` keeps the folder sync from typing into it.

![The terminal dock below the file panes, running git log](media/terminal.webp)

### cabinetos-cli

`cabinetos-cli` reaches the core's functions from a terminal. In a release it is also called `cab`. Both are on the `PATH` of every terminal.

## Themes and the settings file

### Colour themes

Colour themes are JSON files with an accent, a Mica tint, a palette and terminal colours. They apply live, and the theme picker (Ctrl+K Ctrl+T) switches between them. Default, Nord, Catppuccin Mocha and Rose Pine Moon are built in. Default follows Windows' light or dark mode.

![The Commander Compact theme with the function-key bar](media/commander-compact.webp)

### One settings file

Every setting lives in `cabinetos.json`. A saved change applies while CabinetOS runs, and Ctrl+, opens the file for editing.

## Plugins, tools and the marketplace

### Core Plugins

Core Plugins are WebAssembly components that run in a sandbox. They get only the capabilities you grant in a review dialog. A plugin that crashes is stopped while CabinetOS keeps running.

### Tool Extensions

Tool Extensions are web pages in WebView2. Each one runs in a browser process of its own and has no network access. Markdown Preview is the first. It is opt-in, in the release's `extras` folder.

### The marketplace

A marketplace view installs plugins, themes and tools from a static index, and checks each download's SHA-256. No public index exists yet.

![The marketplace view listing colour themes](media/marketplace.webp)

## Install, updates and diagnostics

### Install

The release is a zip with an install script. It installs per user without administrator rights, or for all users. The Start Menu entry, the `PATH` entry and the indexer service are added only when you ask. An uninstall script is included, with the license text of every third-party component. CabinetOS also appears in Settings > Apps, with its version and size, and uninstalls from there.

### Updates from inside the app

For the per-user install, CabinetOS checks for an update once a day (`update.check`, and `update.channel` for the stable or the preview channel). The download runs in the background with a pill in the status bar. The release notes open in a dialog with Restart now and Later, and there is a rollback to the version before. A download whose SHA-256 does not match is deleted, and a swap that fails half way puts the old version back. `cabinetos-cli update` does the same from a terminal.

### Logs and crash traces

There is one JSON Lines log per program and day. A request ID follows each action from the window through the core. A crash writes a trace that names where it happened: the window, the core or a plugin.

## Changed and removed

**Changed**

- Total Commander's "path to the command line" (Insert Folder Path) moves from Ctrl+P to Ctrl+Alt+P, because Ctrl+P is Quick Open.
- Ctrl+F and Alt+F7 open the pane's find widget. The search through subfolders is the Search view (Ctrl+Shift+F), which the classic and right layouts show in the sidebar's place.
- A pane's tab strip shows from the first tab, with a "+" button. A middle click closes any tab.
- Ctrl+K Ctrl+W opens the workspace pill's dropdown.

**Removed**

- The title bar with its workspace tab, the command bar, the global address bar and the global search field, and the pane's header. The top row and each pane's tab strip and breadcrumb row replace them. No setting of `cabinetos.json` served only these parts. The theme metrics that sized them are still accepted and size nothing.
