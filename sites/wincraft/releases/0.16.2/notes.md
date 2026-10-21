---
version: 0.16.2
date: 2026-10-17
summary: LayoutKeeper names apps as the Start menu does, a notice confirms an update and opens What's new in About, and a restart no longer restores your windows.
download: wincraft.exe
highlights:
  - Apps are named as the Start menu names them in LayoutKeeper's panel, strip and Layout page
  - After an update, a short notice says it worked, and About shows what is new
  - WinCraft restores your windows only for a start soon after you sign in
---

## LayoutKeeper

### Real app names

An app that gives its windows no name of its own used to be labelled from its program file, such as "Windows Terminal Host" or "Com.Codewulf.WulfScreen". LayoutKeeper now looks the app up in the list the palette keeps (the Start menu, the app list and installed programs) and uses that name. If there is no match, the label stays as it was. Browser labels and names an app gave itself are not changed.

### No restore after a restart

After an update, WinCraft restarted and put "Putting your windows back" on screen, although nothing had been closed. Now LayoutKeeper restores at start only when WinCraft starts within 15 minutes of your sign-in. A manual restart, an update or an installer restart never restores. Restore now and Win+Alt+L still work at any time.

## Updates

### A notice after an update

After an update, a notice shows once at the bottom right: "WinCraft - Updated to 0.16.2" and "See what's new in Settings, About". It stays six seconds and fades, and a click on it opens About. The tray balloon that used to say this half a minute later is gone. A failed update still says so.

### What's new in About

The About page now has "What's new in <version>" with the release notes of the version you have installed.
