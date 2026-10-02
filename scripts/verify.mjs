// Post-deploy checks. With a base URL argument (for example a preview URL), only two checks run
// against that base: the home page and a missing page. The cabinetos site passes the same two
// checks, so `node scripts/verify.mjs <url>` also works for a preview of it. That is why the home
// page may then carry either title.
const base = process.argv[2]?.replace(/\/+$/, '');
const site = base ?? 'https://luminart.app';

const checks = [
  {
    url: `${site}/`,
    status: 200,
    body: base ? ['<title>Luminart</title>', '<title>CabinetOS'] : '<title>Luminart</title>',
    headers: { 'x-content-type-options': 'nosniff' },
  },
  { url: `${site}/this-page-does-not-exist`, status: 404 },
];
if (!base) {
  checks.push(
    { url: 'https://www.luminart.app/a/b?c=1', status: 301, headers: { location: 'https://luminart.app/a/b?c=1' } },
    { url: 'https://telemetrix.luminart.app/', status: 302, headers: { location: 'https://github.com/OliverD25/telemetrix' } },
    { url: 'https://cabinetos.luminart.app/', status: 200, body: '<title>CabinetOS', headers: { 'x-content-type-options': 'nosniff' } },
    { url: 'https://cabinetos.luminart.app/this-page-does-not-exist', status: 404 },
    { url: 'https://cabinetos.luminart.app/releases/', status: 200, body: '<title>Releases' },
    { url: 'https://cabinetos.luminart.app/releases/0.1.0/', status: 200, body: "What's new in 0.1.0" },
    { url: 'https://cabinetos.luminart.app/releases/0.1.1/', status: 200, body: "What's new in 0.1.1" },
  );
}

// A check's body is one string, or a list of which the page must contain at least one.
const accepted = (body) => [body ?? []].flat();

async function problemsOf({ url, status, body, headers = {} }) {
  let response;
  let text;
  try {
    response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15_000) });
    text = await response.text();
  } catch (error) {
    return [`request failed: ${error.cause?.code ?? error.cause?.message ?? error.message}`];
  }
  const problems = [];
  if (response.status !== status) problems.push(`status ${response.status}, expected ${status}`);
  const wanted = accepted(body);
  if (wanted.length > 0 && !wanted.some((part) => text.includes(part))) problems.push(`body does not contain ${wanted.join(' or ')}`);
  for (const [name, expected] of Object.entries(headers)) {
    const actual = response.headers.get(name);
    if (actual !== expected) problems.push(`${name} is ${actual ?? 'missing'}, expected ${expected}`);
  }
  return problems;
}

const describe = ({ status, body, headers = {} }) =>
  [status, accepted(body).join(' or '), ...Object.entries(headers).map(([name, value]) => `${name}: ${value}`)].filter(Boolean).join(', ');

let failed = 0;
for (const check of checks) {
  const problems = await problemsOf(check);
  if (problems.length > 0) failed++;
  console.log(problems.length > 0
    ? `FAIL  ${check.url}  ${problems.join('; ')}`
    : `PASS  ${check.url}  ${describe(check)}`);
}
process.exitCode = failed > 0 ? 1 : 0;
