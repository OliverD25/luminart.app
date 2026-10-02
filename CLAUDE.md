# luminart.app — company site

Static company site for Luminart, served by Cloudflare Workers in static-assets
mode. The design source is the handoff in `../_io/design_handoff_luminart_home/`
(the `_io` exchange folder is never committed and never referenced from code).
Colors, type, spacing and breakpoints there are final; product data is not.

## Where things are

- `src/products.json` — the product cards. Add a product here; the counter and
  the grid rows follow the array length.
- `src/template.html`, `src/styles.css` — the page. Placeholders `{{count}}`,
  `{{rows}}`, `{{products}}`, `{{year}}` are filled by the build.
- `src/static/` — copied as-is into `dist/`: icons, `404.html`, `robots.txt`,
  `sitemap.xml`, `site.webmanifest`, `_headers` (security headers).
- `scripts/build.mjs` — renders `dist/`. wrangler runs it before every deploy
  and every `wrangler dev`, so `dist/` is never edited by hand.
- `redirects/` — one script and one config with a wrangler environment per
  redirect-only hostname (`www`, `telemetrix`). Each is its own Worker named
  `luminart-<label>`.
- `scripts/verify.mjs` — live checks after a deploy (`npm run verify`).
- `sites/<label>/` — one static product page each (own Worker `luminart-<label>`, no build
  step). `cabinetos` is live. How to add one, and the two-step go-live: README,
  "Product pages". Screenshots are prepared with `scripts/prep-shots.py`.

## Rules

- Publishing follows the global `luminart-publish` skill. It holds the Cloudflare
  account facts, the one-Worker-per-hostname naming, the templates for new
  subdomains and the checks. Deploying changes the public site: do it only when
  the user asked for a publish in this chat.
- `npm run dev` serves the built site at http://localhost:8787/. Use `localhost`,
  never `127.0.0.1`. Port 8080 is taken on this PC.
- The Telemetrix card's terminal render depends on a ten-glyph JetBrains Mono
  subset linked in `src/template.html`, because DM Mono has no box-drawing
  glyphs. A new text render that uses other box characters must add them to
  that link's `text=` list, or Windows draws them at the wrong width.
- Look at a visual change before publishing it (global skill
  `local-site-screenshot`). Screenshots go to `.screenshots/` (gitignored).
- Never commit `dist/`, `node_modules/`, `.screenshots/` or anything from `_io`.
