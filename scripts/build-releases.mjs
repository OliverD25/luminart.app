import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Marked } from 'marked';

const root = join(import.meta.dirname, '..');
const site = join(root, 'sites', 'cabinetos');
const sourceDir = join(site, 'releases');
const publicDir = join(site, 'public');
const outDir = join(publicDir, 'releases');
const origin = 'https://cabinetos.luminart.app';
const repoDownloads = 'https://github.com/OliverD25/cabinetos/releases/download';

// Attributes are always double-quoted, so the apostrophe stays literal (the page title reads What's new).
const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (c) => entities[c]);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const imageTypes = ['.png', '.webp', '.gif', '.jpg'];
const videoTypes = ['.mp4', '.webm'];
const ogImageTypes = ['.png', '.webp', '.jpg'];
const frontKeys = ['version', 'date', 'summary', 'download', 'highlights', 'title'];
const requiredKeys = ['version', 'date', 'summary', 'download', 'highlights'];

class ReleaseError extends Error {
  constructor(file, line, message) {
    super(`${file}${line ? `:${line}` : ''}: ${message}`);
  }
}

const extensionOf = (name) => name.slice(name.lastIndexOf('.')).toLowerCase();
const compareVersions = (a, b) => {
  const left = a.split('.').map(Number);
  const right = b.split('.').map(Number);
  return right[0] - left[0] || right[1] - left[1] || right[2] - left[2];
};

function formatDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}

function parseFrontMatter(text, file) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  if (lines[0].trim() !== '---') throw new ReleaseError(file, 1, 'the file must start with a --- front matter line');
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (end === -1) throw new ReleaseError(file, 1, 'the front matter has no closing --- line');

  const data = {};
  let list = null;
  for (let i = 1; i < end; i++) {
    const line = lines[i];
    const lineNo = i + 1;
    if (line.trim() === '') continue;
    const item = /^\s+-\s+(.*)$/.exec(line);
    if (item) {
      if (!list) throw new ReleaseError(file, lineNo, 'a list item must follow "highlights:"');
      list.push(item[1].trim().replace(/^(["'])(.*)\1$/, '$2'));
      continue;
    }
    const pair = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!pair) throw new ReleaseError(file, lineNo, `cannot read this front matter line: ${line}`);
    const [, key, value] = pair;
    if (!frontKeys.includes(key)) throw new ReleaseError(file, lineNo, `unknown front matter key "${key}" (allowed: ${frontKeys.join(', ')})`);
    if (Object.hasOwn(data, key)) throw new ReleaseError(file, lineNo, `the key "${key}" appears twice`);
    list = null;
    if (key === 'highlights') {
      if (value !== '') throw new ReleaseError(file, lineNo, '"highlights" is a list: put each line under it as "  - text"');
      list = data.highlights = [];
    } else {
      data[key] = value.trim().replace(/^(["'])(.*)\1$/, '$2');
    }
  }

  for (const key of requiredKeys) {
    const value = data[key];
    if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      throw new ReleaseError(file, 1, `front matter is missing "${key}"`);
    }
  }
  if (!/^\d+\.\d+\.\d+$/.test(data.version)) throw new ReleaseError(file, 1, `version "${data.version}" is not MAJOR.MINOR.PATCH`);
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data.date);
  const parsed = date && new Date(Date.UTC(+date[1], +date[2] - 1, +date[3]));
  if (!parsed || parsed.toISOString().slice(0, 10) !== data.date) throw new ReleaseError(file, 1, `date "${data.date}" is not a real YYYY-MM-DD date`);
  if (/[\\/]/.test(data.download)) throw new ReleaseError(file, 1, `download "${data.download}" must be a file name, not a path`);
  if (data.highlights.length < 3 || data.highlights.length > 6) {
    throw new ReleaseError(file, 1, `"highlights" needs 3 to 6 lines, found ${data.highlights.length}`);
  }
  return { data, bodyStart: end + 1, body: lines.slice(end + 1) };
}

// Checks every image line before marked runs, because marked's tokens carry no line numbers.
function checkMedia(body, bodyStart, releaseDir, file) {
  const media = [];
  let fenced = false;
  body.forEach((line, index) => {
    const lineNo = bodyStart + index + 1;
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    if (fenced || !line.includes('![')) return;
    const whole = /^!\[([^\]]*)\]\((\S+?)(?:\s+"[^"]*")?\)\s*$/.exec(line);
    if (!whole) throw new ReleaseError(file, lineNo, 'a media line must be only ![caption](media/<file>) on its own line');
    const neighbours = [body[index - 1], body[index + 1]];
    if (neighbours.some((other) => other !== undefined && other.trim() !== '')) {
      throw new ReleaseError(file, lineNo, 'a media line needs an empty line before and after it');
    }
    const [, caption, src] = whole;
    if (!/^media\/[^/\\]+$/.test(src) || src.includes('..')) throw new ReleaseError(file, lineNo, `media path "${src}" must be media/<file>`);
    const ext = extensionOf(src);
    if (![...imageTypes, ...videoTypes].includes(ext)) {
      throw new ReleaseError(file, lineNo, `unknown media type "${ext}" (images: ${imageTypes.join(' ')}; videos: ${videoTypes.join(' ')})`);
    }
    if (!existsSync(join(releaseDir, src))) throw new ReleaseError(file, lineNo, `media file "${src}" does not exist`);
    media.push({ src, caption });
  });
  return media;
}

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';

// Reads the pixel size from the file header, so the <img> can reserve its space before it loads.
function imageSize(path) {
  const bytes = readFileSync(path);
  const fail = (why) => { throw new Error(`${path}: cannot read the image size (${why})`); };
  switch (extensionOf(path)) {
    case '.png':
      if (bytes.length < 24 || bytes.toString('latin1', 1, 4) !== 'PNG' || bytes.toString('latin1', 12, 16) !== 'IHDR') fail('no PNG IHDR header');
      return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
    case '.gif':
      if (bytes.length < 10 || !bytes.toString('latin1', 0, 3).startsWith('GIF')) fail('no GIF header');
      return { width: bytes.readUInt16LE(6), height: bytes.readUInt16LE(8) };
    case '.webp': {
      if (bytes.length < 30 || bytes.toString('latin1', 0, 4) !== 'RIFF' || bytes.toString('latin1', 8, 12) !== 'WEBP') fail('no RIFF/WEBP header');
      const kind = bytes.toString('latin1', 12, 16);
      if (kind === 'VP8 ') return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
      if (kind === 'VP8L') {
        const bits = bytes.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
      if (kind === 'VP8X') return { width: bytes.readUIntLE(24, 3) + 1, height: bytes.readUIntLE(27, 3) + 1 };
      return fail(`unknown WebP chunk "${kind}"`);
    }
    case '.jpg': {
      if (bytes[0] !== 0xff || bytes[1] !== 0xd8) fail('no JPEG start marker');
      let at = 2;
      while (at + 9 < bytes.length) {
        if (bytes[at] !== 0xff) fail('broken JPEG marker');
        const marker = bytes[at + 1];
        if (marker === 0xff) { at++; continue; }
        // SOF0 to SOF15 hold the size, except DHT (c4), JPG (c8) and DAC (cc).
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { width: bytes.readUInt16BE(at + 7), height: bytes.readUInt16BE(at + 5) };
        }
        at += 2 + bytes.readUInt16BE(at + 2);
      }
      return fail('no SOF marker');
    }
    default:
      return fail('unsupported type');
  }
}

function renderBody(markdown, releaseDir) {
  const headings = [];
  const used = new Set();
  const uniqueId = (text) => {
    const base = slugify(text);
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    return id;
  };
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth, text }) {
        const inner = this.parser.parseInline(tokens);
        if (depth !== 2 && depth !== 3) return `<h${depth}>${inner}</h${depth}>\n`;
        const id = uniqueId(text);
        if (depth === 2) headings.push({ id, text });
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
      paragraph({ tokens }) {
        const inner = this.parser.parseInline(tokens);
        // A media line is a figure, which may not sit inside a <p>.
        return tokens.length === 1 && tokens[0].type === 'image' ? `${inner}\n` : `<p>${inner}</p>\n`;
      },
      image({ href, text }) {
        const caption = escapeHtml(text);
        const src = escapeHtml(href);
        const element = videoTypes.includes(extensionOf(href))
          ? `<video src="${src}" autoplay loop muted playsinline aria-label="${caption}"></video>`
          : (({ width, height }) => `<img src="${src}" alt="${caption}" width="${width}" height="${height}" loading="lazy">`)(imageSize(join(releaseDir, href)));
        return `<figure class="media"><div class="window">${element}</div><figcaption>${caption}</figcaption></figure>`;
      },
    },
  });
  return { html: marked.parse(markdown), headings };
}

function readRelease(version) {
  const dir = join(sourceDir, version);
  const file = `sites/cabinetos/releases/${version}/notes.md`;
  const notesPath = join(dir, 'notes.md');
  if (!existsSync(notesPath)) throw new ReleaseError(file, 0, 'notes.md does not exist');
  const { data, bodyStart, body } = parseFrontMatter(readFileSync(notesPath, 'utf8'), file);
  if (data.version !== version) throw new ReleaseError(file, 1, `front matter version "${data.version}" differs from the folder name "${version}"`);
  const mediaDir = join(dir, 'media');
  const media = checkMedia(body, bodyStart, dir, file);
  const { html, headings } = renderBody(body.join('\n'), dir);
  const firstImage = media.find((item) => ogImageTypes.includes(extensionOf(item.src)));
  return {
    ...data,
    title: data.title || `What's new in ${version}`,
    mediaDir: existsSync(mediaDir) ? mediaDir : null,
    html,
    headings,
    ogImage: firstImage ? `${origin}/releases/${version}/${firstImage.src}` : null,
  };
}

const themeScript = `<script>
  {
    let saved = null;
    try { saved = localStorage.getItem('luminart-theme'); } catch {}
    if (saved === 'light' || (!saved && matchMedia('(prefers-color-scheme: light)').matches)) {
      document.documentElement.dataset.theme = 'light';
      document.querySelector('meta[name="theme-color"]').content = '#f6f5f8';
    }
  }
</script>`;

const toggleScript = `<script>
  {
    const root = document.documentElement;
    const toggle = document.querySelector('.theme-toggle');
    const showLabel = () => {
      toggle.textContent = root.dataset.theme === 'light' ? 'Light' : 'Dark';
    };
    toggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      if (next === 'light') root.dataset.theme = 'light';
      else delete root.dataset.theme;
      document.querySelector('meta[name="theme-color"]').content = next === 'light' ? '#f6f5f8' : '#0c0b10';
      try { localStorage.setItem('luminart-theme', next); } catch {}
      showLabel();
    });
    showLabel();
  }
</script>`;

const logo = '<svg width="22" height="22" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#0c0b10"/><rect x="20" y="16" width="8" height="32" rx="2" fill="#e6e4ec"/><rect x="20" y="40" width="26" height="8" rx="2" fill="#e6e4ec"/><circle cx="43" cy="21" r="5" fill="#c9a6ff"/></svg>';

function renderHead({ title, description, path, type, ogImage }) {
  const image = ogImage ?? `${origin}/images/og.jpg`;
  const size = ogImage ? '' : '\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${origin}${path}">
<meta name="theme-color" content="#0c0b10">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${origin}${path}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Luminart">
<meta property="og:image" content="${escapeHtml(image)}">${size}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/icons/cabinetos.svg" type="image/svg+xml">
<link rel="icon" href="/icons/cabinetos-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/icons/cabinetos-256.png">
${themeScript}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=DM+Mono:wght@400&display=swap">
<link rel="stylesheet" href="/page.css">
</head>`;
}

const renderBar = (current) => `  <header class="bar">
    <div class="bar-start">
      <a class="logo" href="https://luminart.app/">${logo}Luminart</a>
      <nav class="crumbs" aria-label="Breadcrumb">Luminart / <a href="/">CabinetOS</a> / <a href="/releases/"${current ? ' aria-current="page"' : ''}>Releases</a></nav>
    </div>
    <button class="theme-toggle" type="button" aria-label="Toggle color theme">Dark</button>
  </header>`;

const renderFooter = () => `  <footer>
    <span class="copyright">© ${new Date().getFullYear()} Luminart</span>
    <div class="links">
      <a href="https://luminart.app/">luminart.app</a>
      <a href="https://github.com/OliverD25" target="_blank" rel="noopener">GitHub</a>
    </div>
  </footer>`;

function renderReleasePage(release) {
  const path = `/releases/${release.version}/`;
  const downloadUrl = `${repoDownloads}/v${release.version}/${release.download}`;
  const toc = release.headings.length === 0 ? '' : `
        <nav class="toc" aria-label="On this page">
          <h2 class="label">On this page</h2>
          <ol>
${release.headings.map((h) => `            <li><a href="#${h.id}">${escapeHtml(h.text)}</a></li>`).join('\n')}
          </ol>
        </nav>`;
  return `${renderHead({ title: `${release.title} · CabinetOS`, description: release.summary, path, type: 'article', ogImage: release.ogImage })}
<body>
<div class="page">
${renderBar(false)}
  <main class="release">
    <header class="release-head">
      <p class="kicker">Release notes · ${formatDate(release.date)}</p>
      <h1>${escapeHtml(release.title)}</h1>
      <p class="release-summary">${escapeHtml(release.summary)}</p>
      <div class="actions">
        <a class="btn btn-primary" href="${escapeHtml(downloadUrl)}">Download ${escapeHtml(release.version)}</a>
        <a class="btn" href="/releases/">All releases</a>
      </div>
    </header>
    <section class="card highlights">
      <h2 class="label">Highlights</h2>
      <ul>
${release.highlights.map((item) => `        <li>${escapeHtml(item)}</li>`).join('\n')}
      </ul>
    </section>
    <div class="release-layout${toc ? '' : ' no-toc'}">${toc}
      <article class="release-body">
${release.html}      </article>
    </div>
  </main>
${renderFooter()}
</div>
${toggleScript}
</body>
</html>
`;
}

function renderIndexPage(releases) {
  return `${renderHead({ title: 'Releases · CabinetOS', description: 'Release notes for every version of CabinetOS, newest first.', path: '/releases/', type: 'website', ogImage: null })}
<body>
<div class="page">
${renderBar(true)}
  <main class="release">
    <header class="release-head">
      <p class="kicker">CabinetOS</p>
      <h1>Releases</h1>
      <p class="release-summary">What each version adds, newest first.</p>
    </header>
    <ul class="release-list">
${releases.map((release) => `      <li>
        <a class="card release-card" href="/releases/${release.version}/">
          <span class="release-card-meta"><span class="release-card-version">${escapeHtml(release.version)}</span> · ${formatDate(release.date)}</span>
          <span class="release-card-summary">${escapeHtml(release.summary)}</span>
          <span class="release-card-more">Read the notes →</span>
        </a>
      </li>`).join('\n')}
    </ul>
  </main>
${renderFooter()}
</div>
${toggleScript}
</body>
</html>
`;
}

const renderSitemap = (releases) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['/', '/releases/', ...releases.map((release) => `/releases/${release.version}/`)]
  .map((path) => `  <url>\n    <loc>${origin}${path}</loc>\n  </url>`)
  .join('\n')}
</urlset>
`;

const versions = readdirSync(sourceDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(sourceDir, entry.name, 'notes.md')))
  .map((entry) => entry.name);
for (const version of versions) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`sites/cabinetos/releases/${version}: the folder name must be MAJOR.MINOR.PATCH`);
}
if (versions.length === 0) throw new Error('sites/cabinetos/releases/: no release folder with a notes.md was found');
versions.sort(compareVersions);

// Read and check everything first, so a mistake in one notes.md leaves the old output untouched.
const releases = versions.map(readRelease);

// Empty releases/ rather than delete it: on Windows, `wrangler dev` holds watched folders open,
// so removing the folder itself fails with EPERM.
mkdirSync(outDir, { recursive: true });
for (const entry of readdirSync(outDir)) rmSync(join(outDir, entry), { recursive: true, force: true });

for (const release of releases) {
  const releaseOut = join(outDir, release.version);
  mkdirSync(releaseOut, { recursive: true });
  writeFileSync(join(releaseOut, 'index.html'), renderReleasePage(release));
  if (release.mediaDir && statSync(release.mediaDir).isDirectory()) cpSync(release.mediaDir, join(releaseOut, 'media'), { recursive: true });
}
writeFileSync(join(outDir, 'index.html'), renderIndexPage(releases));
writeFileSync(join(publicDir, 'sitemap.xml'), renderSitemap(releases));

console.log(`Built ${releases.length} release page(s): ${versions.join(', ')}.`);
