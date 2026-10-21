---
version: 0.17.1
date: 2026-10-21
summary: File search works without Everything, the palette teaches bookmarks with small tips, and resetting a plugin now really resets it.
download: wincraft.exe
highlights:
  - File search falls back to the Windows Search index when Everything is not running
  - Small in-app tips teach the Ctrl+B bookmark key, with a switch to turn them off
  - Resetting a running plugin now gives its real defaults, and a plugin you switched off stays off
  - A copy of WinCraft that is not the installed one no longer takes over or removes your logon task
---

## Command palette

### File search without Everything

Before, file search needed Everything, and without it the palette showed no files. Now, when Everything is not running, the palette asks the Windows Search index instead, so `.` and the blended list still find files and folders. It is slower than Everything, and the palette waits up to 0.8 seconds for it. It finds only what Windows Search has indexed, which by default is your user folders and not whole disks. Rows from the index start their second line with "Windows index".

### The search switches

Settings, General has **File search: Everything, then Windows index**, which switches all file search off. **Use the Windows index when Everything is not running** switches off only the fallback, which is `search.file_search_fallback` in `config.json`. If the Windows Search service is off, `.` says "File search needs Everything or Windows Search".

### Tips that teach bookmarks

Many people never saw that Ctrl+B saves a folder as a bookmark. Until you have a bookmark, a small tip over the palette's footer says "Ctrl + B saves this folder as a bookmark" when a folder or file row is selected. It retires after three openings, when you click its cross, or when you save your first bookmark.

After you save a bookmark, the palette stays open for four seconds and says what to type to open it. The Bookmarks page now explains the three steps while it is empty. The **Show tips** switch on the General page turns every tip off, and **Show all tips again** brings them back.

## Plugins

### Reset gives the real defaults

Resetting a running plugin used to keep its old values and hotkeys, because the plugin saved its old settings over the reset. Now the plugin stops first, then reloads from the cleared file and starts again with its defaults.

### A plugin you switched off stays off

A reset writes the plugin's default settings, and those say "enabled", so a plugin you had turned off came back on at the next start. A reset now keeps the on or off state the plugin had.

## Start with Windows

### Only the installed copy owns the logon task

Before, a copy of WinCraft that was not the installed one could repoint your start-with-Windows task at itself, for example a development build started while the installed copy was closed. Or it could remove the task when you turned the switch off. Now, when an installed copy exists, any other copy leaves the task alone. The Settings switch explains why in its help text. With no installed copy, every copy still manages the task, `wincraft.exe --install` still repoints it, and `--uninstall` still removes it from any copy.
