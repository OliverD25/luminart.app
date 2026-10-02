---
version: 0.1.1
date: 2026-10-03
summary: The setup file now installs a missing prerequisite itself, and it is the package that winget will carry.
download: CabinetOS-0.1.1-win-x64-setup.exe
highlights:
  - The setup downloads and installs a missing Windows App Runtime, WebView2 Runtime or .NET 10 runtime
  - A silent setup without administrator rights still stops with the winget command for .NET
  - The winget package is the setup file, not the zip
---

## Install

### The setup installs what is missing

Before, a missing prerequisite stopped the setup with the name of the winget command that installs it. Now the setup downloads Microsoft's installer for the Windows App Runtime, the WebView2 Runtime or the .NET 10 runtime, runs it, and checks again. The setup's log names each download with its size and SHA-256.

### Administrator rights for .NET

The .NET runtime installs for the whole PC, so Windows asks for administrator rights for that one installer. A silent setup that has no such rights does not try: it stops and names the winget command, as before.

### winget

The winget package is now this setup file instead of the zip, so `winget install OliverD25.CabinetOS` gives the same install as a download from this page. The package is submitted to Microsoft's community repository and appears there after their review.

## Changed and removed

### Changed

- The setup file installs a missing prerequisite itself; the winget package is the setup file.
