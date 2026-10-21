---
version: 0.3.2
date: 2026-09-28
summary: The Currency card shows a one-year graph of the official NBU rate under the 30-day graph.
download: telemetrix-v0.3.2-windows-x86_64.zip
highlights:
  - A 1-year graph of the NBU rate on the Currency card, with its change in green or red
  - A show_year setting turns the year rows off
---

A Linux build (`telemetrix-v0.3.2-linux-x86_64.tar.gz`) is on the [release page](https://github.com/OliverD25/telemetrix/releases/tag/v0.3.2).

## Currency card

### 1-year graphs

A third row under each currency's 30-day graph shows the official NBU rate over the last year, with its change in green or red, lined up with the 7-day and 30-day parts.

The daily NBU request now asks for 366 days instead of 31. It is still one request per currency and day, about 75 KB each. The plugin reads the rates straight from the answer text instead of decoding the JSON, so a year costs little memory. The store keeps only the 366 numbers (about 9 KB for three currencies).

A store from 0.3.1 holds 31 days, so the first update after the upgrade fetches the year at once.

The new `show_year` setting (on by default, also in the `s` box) turns the year rows off. On a card narrower than 37 characters all graph rows go and the rates stay.
