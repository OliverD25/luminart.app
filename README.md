# luminart.app

The company website of Luminart, served at <https://luminart.app>.

It is a static site: plain HTML, one CSS file and a few lines of JavaScript. There is no framework.
A small Node script builds the page into `dist/`. Cloudflare Workers serves `dist/` as static
assets, so no Worker code runs for the main site.

Where things are:

- [src/template.html](src/template.html): the page. The build fills its `{{...}}` placeholders.
- [src/styles.css](src/styles.css): all CSS.
- [src/products.json](src/products.json): the product list.
- [src/static/](src/static/): files copied into `dist/` unchanged (icons, 404 page, `_headers`,
  `robots.txt`, `sitemap.xml`, `site.webmanifest`).
- [scripts/build.mjs](scripts/build.mjs): empties `dist/` and builds it again.
- [scripts/verify.mjs](scripts/verify.mjs): checks the live sites and the redirects after a deploy.
- [wrangler.jsonc](wrangler.jsonc): Cloudflare settings for the main site (Worker `luminart-site`).
- [redirects/](redirects/): one small redirect Worker, deployed once per subdomain.
- [sites/](sites/): one folder per product page, each a static site with its own Worker
  (see "Product pages").

## Build and preview

Run the commands in the repository folder. You need Node 24.

```bash
npm install     # once: installs wrangler, the Cloudflare command-line tool
npm run build   # builds the site into dist/
npm run dev     # builds, then serves the site at http://localhost:8787
```

`npm run dev` builds again when a file in `src/` changes.

## Deploy

Log in to Cloudflare once with `npx wrangler login`. Then:

```bash
npm run deploy             # main site: luminart.app
npm run deploy:www         # www.luminart.app sends visitors to luminart.app (301)
npm run deploy:telemetrix  # telemetrix.luminart.app sends visitors to the GitHub repo (302)
npm run deploy:cabinetos   # the CabinetOS page (see "Product pages")
npm run deploy:all         # all four, one after another
npm run verify             # checks the live domains and prints PASS or FAIL per check
```

Every deploy connects its domain as a Cloudflare custom domain. This means Cloudflare itself
creates the DNS record and the HTTPS certificate for the Worker. The `luminart.app` domain must
be in the same Cloudflare account. The one exception today is `deploy:cabinetos`: it does not
connect a domain yet (see "Product pages").

`301` is a permanent redirect: browsers and search engines remember it. `302` is a temporary
redirect: nothing remembers it, so it is safe to change later.

## Preview a change before publishing

```bash
npx wrangler versions upload
```

This builds and uploads the site as a new version that is **not** live, and prints a
`Version Preview URL` like `https://02977f20-luminart-site.muzexp.workers.dev`. Open it, share it,
or check it with the command below. When it looks right, run `npm run deploy` to publish.

To check a preview URL instead of the live domains, give it as the first argument. Then only two
checks run: the home page and a page that does not exist. They also fit the CabinetOS page, so the
same command checks a preview of it:

```bash
npm run verify -- https://<preview-url>
```

## Add a product

Add an object to [src/products.json](src/products.json):

```json
{
  "name": "Prism",
  "subdomain": "prism.luminart.app",
  "href": "https://prism.luminart.app",
  "description": "One or two sentences about the product.",
  "cta": "Open Prism →",
  "screenshot": { "type": "image", "src": "/images/prism.png", "alt": "Prism palette view" }
}
```

`screenshot` has three forms:

- `{ "type": "image", "src": "/...", "alt": "..." }`: an image. Put the file in `src/static/`,
  for example `src/static/images/prism.png`.
- `{ "type": "text", "lines": ["...", "..."] }`: text shown in a terminal-style box.
- no `screenshot`, or `null`: the striped placeholder.

The product counter and the grid rows follow the number of products. Run `npm run build` to see
the result, or `npm run deploy` to publish it.

## Add a subdomain redirect

Every product subdomain is its own Worker, named `luminart-<label>`. While a product has no site
of its own, that Worker is the generic redirect in [redirects/worker.js](redirects/worker.js).
Its settings are variables in [redirects/wrangler.jsonc](redirects/wrangler.jsonc):

- `TARGET`: where to send visitors.
- `STATUS`: `301` or `302`.
- `KEEP_PATH`: `"true"` adds the path and query of the request to `TARGET`.

To add `prism.luminart.app`:

1. In `redirects/wrangler.jsonc`, copy the `telemetrix` block to a new `prism` block. Set the name
   to `luminart-prism`, the route pattern to `prism.luminart.app`, and the variables.
2. In `package.json`, add `"deploy:prism": "wrangler deploy -c redirects/wrangler.jsonc -e prism"`
   and add it to `deploy:all`.
3. Add a check for the new subdomain to `scripts/verify.mjs`.
4. Run `npm run deploy:prism`, then `npm run verify`.

When the product gets a real site, deploy that site as a Worker with the same name
(`luminart-prism`) and the same custom domain. It replaces the redirect.

## Product pages

A product can have a page of its own. It is a separate static site in `sites/<label>/`, with its own
Worker named `luminart-<label>`. `sites/cabinetos/` is the first one.

- `public/` holds plain files: HTML, `page.css`, icons, `404.html`, `robots.txt`, `sitemap.xml` and
  its own `_headers`. Cloudflare serves the folder as it is. The only generated part is
  `public/releases/` (see "Release notes").
- `page.css` is a copy of the main site's colours, fonts and breakpoints. Nothing is imported across
  sites, so each site can change and deploy on its own.
- The year in the footer of `public/index.html` is typed by hand. Change it every January.

```bash
npm run dev:cabinetos      # serves the page at http://localhost:8788
npm run deploy:cabinetos   # publishes the Worker luminart-cabinetos
```

Going live happens in two steps, so a page can be checked before it has a public name:

1. Deploy with no `routes` line in `sites/<label>/wrangler.jsonc`. The page then answers only at
   `https://luminart-<label>.muzexp.workers.dev`, and that copy tells search engines to stay away.
   Do not run `npm run verify` yet, and do not deploy the main site while its new card links to the
   hostname: the name does not exist, and DNS (the system that turns a hostname into an address)
   would remember "no such name" for up to 30 minutes.
2. When the page is approved, add the route, which tells Cloudflare which hostname the Worker
   answers on: `"routes": [{ "pattern": "<label>.luminart.app", "custom_domain": true }]`.
   Then `npm run deploy:<label>`, then `npm run deploy` for the main site, then `npm run verify`.

Screenshots come from a clean machine (window only, dark theme, about 1920x1020, no personal
folder or drive names) and stay in `../_io/<label>-screenshots/`, outside the repo. Then:

```bash
python scripts/prep-shots.py cabinetos ../_io/cabinetos-screenshots 01-dual-pane.png
```

writes the web copies into `public/images/` (the hero 1600 wide, the others 1200, named after the
source files without their number prefix), `og.jpg` for link previews, and the 560x350 card image
into `src/static/images/`. It needs Pillow (`python -m pip install pillow`). The `<img>` lines in
`public/index.html` and the card's `screenshot` field in `src/products.json` point at those files.

For another product page, copy `sites/cabinetos/` to `sites/<label>/` and change the Worker name and
the hostnames inside the files. Add `dev:<label>` and `deploy:<label>` scripts to `package.json`, and
the page's two checks to `scripts/verify.mjs`. Give the dev script its own port (8788 is CabinetOS;
never use 8080).

### Release notes

The CabinetOS site has a "What's new in <version>" page for every release, in the style of VS Code's
release notes. Each release is written as files in `sites/cabinetos/releases/<version>/`:

- `notes.md`: front matter, then the notes in markdown.
- `media/`: the images and short videos that `notes.md` shows.

Front matter (between two `---` lines). The build stops with the file name and line on a missing key:

```
---
version: 0.1.0
date: 2026-09-30
summary: One sentence for the list and the link preview.
download: CabinetOS-0.1.0-win-x64-setup.exe
highlights:
  - Three to six short lines
  - that open the page
  - in a Highlights card
---
```

- `version` is `MAJOR.MINOR.PATCH` and must match the folder name. `date` is `YYYY-MM-DD`.
- `download` is the file name of the release asset. The page links to
  `https://github.com/OliverD25/cabinetos/releases/download/v<version>/<download>`.
- `title` is optional. The default is `What's new in <version>`.

The body uses `##` for sections, `###` for features, and normal markdown: paragraphs, bullet lists,
bold, inline code and links. Every `##` and `###` gets an id, and the `##` headings fill the
"On this page" list.

A media line is `![caption](media/<file>)` alone on a line, with an empty line before and after.
The file must exist in `media/`. A `.mp4` or `.webm` file becomes a looping, muted `<video>`. A
`.png`, `.webp`, `.gif` or `.jpg` file becomes an `<img loading="lazy">`. Both become a
`<figure class="media">` with the caption, framed like the screenshots on the product page. Any other
type is an error. The first `.png`, `.webp` or `.jpg` of the notes is also the link preview image
of the page.

```bash
npm run build:releases     # writes public/releases/ and rewrites public/sitemap.xml
npm run dev:cabinetos      # builds the releases, then serves http://localhost:8788
npm run deploy:cabinetos   # builds the releases, then publishes
```

`scripts/build-releases.mjs` uses the `marked` package and Node's own modules. It lists the releases
newest first (compared as numbers, so 0.10.0 is newer than 0.9.0). It empties and fills only
`public/releases/`, which is generated and ignored by git: never edit it by hand. It also rewrites
`public/sitemap.xml` with the product page, `/releases/` and every release page.

