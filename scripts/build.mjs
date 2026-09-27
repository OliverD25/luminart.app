import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const src = join(root, 'src');
const dist = join(root, 'dist');

const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => entities[c]);

function renderShot(shot) {
  if (!shot) return '<div class="shot shot-placeholder">product screenshot</div>';
  switch (shot.type) {
    case 'text':
      return `<pre class="shot shot-text" aria-hidden="true">${escapeHtml(shot.lines.join('\n'))}</pre>`;
    case 'image':
      return `<img class="shot" src="${escapeHtml(shot.src)}" alt="${escapeHtml(shot.alt ?? '')}">`;
    default:
      throw new Error(`Unknown screenshot type "${shot.type}" in src/products.json`);
  }
}

const renderCard = (product) => `      <a class="card" href="${escapeHtml(product.href)}">
        <div class="card-text">
          <span class="card-sub">${escapeHtml(product.subdomain)}</span>
          <h2>${escapeHtml(product.name)}</h2>
          <p class="card-desc">${escapeHtml(product.description)}</p>
          <span class="card-cta">${escapeHtml(product.cta)}</span>
        </div>
        ${renderShot(product.screenshot)}
      </a>`;

const products = JSON.parse(readFileSync(join(src, 'products.json'), 'utf8'));
const required = ['name', 'subdomain', 'href', 'description', 'cta'];
for (const product of products) {
  const missing = required.filter((key) => typeof product[key] !== 'string' || product[key] === '');
  if (missing.length > 0) {
    throw new Error(`Product "${product.name ?? '?'}" in src/products.json is missing: ${missing.join(', ')}`);
  }
}
const values = {
  year: String(new Date().getFullYear()),
  count: String(products.length).padStart(2, '0'),
  rows: `repeat(${products.length}, minmax(0, 1fr))`,
  products: products.map(renderCard).join('\n'),
};

const page = readFileSync(join(src, 'template.html'), 'utf8').replace(/\{\{(\w+)\}\}/g, (_, key) => {
  if (!Object.hasOwn(values, key)) throw new Error(`Unknown placeholder {{${key}}} in src/template.html`);
  return values[key];
});

// Empty dist/ rather than delete it: on Windows, `wrangler dev` holds the watched folder open,
// so removing the folder itself fails with EPERM on every rebuild.
mkdirSync(dist, { recursive: true });
for (const entry of readdirSync(dist)) rmSync(join(dist, entry), { recursive: true, force: true });
writeFileSync(join(dist, 'index.html'), page);
cpSync(join(src, 'styles.css'), join(dist, 'styles.css'));
cpSync(join(src, 'static'), dist, { recursive: true });

console.log(`Built dist/ with ${products.length} product(s).`);
