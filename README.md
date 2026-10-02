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
  its own `_headers`. There is no build step. Cloudflare serves the folder as it is.
- `page.css` is a copy of the main site's colours, fonts and breakpoints. Nothing is imported across
  sites, so each site can change and deploy on its own.
- The year in the footer of `public/index.html` is typed by hand. Change it every January.

```bash
npm run dev:cabinetos      # serves the page at http://localhost:8788
npm run deploy:cabinetos   # publishes the Worker luminart-cabinetos
```

The hostname `cabinetos.luminart.app` is not attached yet. This is on purpose: the screenshots come
first. Until then the page answers only at `https://luminart-cabinetos.muzexp.workers.dev`, and that
copy tells search engines to stay away.

To go live, add a `routes` line to `sites/cabinetos/wrangler.jsonc`. A route tells Cloudflare which
hostname the Worker answers on. The line is already there, in a comment:

```jsonc
"routes": [{ "pattern": "cabinetos.luminart.app", "custom_domain": true }]
```

After adding the line, run `npm run deploy:cabinetos` and then `npm run verify`. Two warnings:

- Do not run `npm run verify` before go-live. The name does not exist yet. DNS (the system that
  turns a hostname into an address) would remember "no such name" for up to 30 minutes.
- The main page already has a CabinetOS card that links to the new hostname. Deploy the main site
  (`npm run deploy` or `npm run deploy:all`) only after the route is added. Before that, the card
  leads nowhere.

The screenshot arrives later. Put the file in `public/images/`, then replace the striped placeholder
in `public/index.html` with the `<img>` line from the comment above it. The card on the main page
has its own `screenshot` field in `src/products.json` (see "Add a product").

For another product page, copy `sites/cabinetos/` to `sites/<label>/` and change the Worker name and
the hostnames inside the files. Add `dev:<label>` and `deploy:<label>` scripts to `package.json`, and
the page's two checks to `scripts/verify.mjs`. Give the dev script its own port (8788 is CabinetOS;
never use 8080).
