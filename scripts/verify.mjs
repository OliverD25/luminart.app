// Post-deploy checks. With a base URL argument (for example a preview URL), only the two
// main-site checks run against that base.
const base = process.argv[2]?.replace(/\/+$/, '');
const site = base ?? 'https://luminart.app';

const checks = [
  { url: `${site}/`, status: 200, body: '<title>Luminart</title>', headers: { 'x-content-type-options': 'nosniff' } },
  { url: `${site}/this-page-does-not-exist`, status: 404 },
];
if (!base) {
  checks.push(
    { url: 'https://www.luminart.app/a/b?c=1', status: 301, headers: { location: 'https://luminart.app/a/b?c=1' } },
    { url: 'https://telemetrix.luminart.app/', status: 302, headers: { location: 'https://github.com/OliverD25/telemetrix' } },
  );
}

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
  if (body && !text.includes(body)) problems.push(`body does not contain ${body}`);
  for (const [name, expected] of Object.entries(headers)) {
    const actual = response.headers.get(name);
    if (actual !== expected) problems.push(`${name} is ${actual ?? 'missing'}, expected ${expected}`);
  }
  return problems;
}

const describe = ({ status, body, headers = {} }) =>
  [status, body, ...Object.entries(headers).map(([name, value]) => `${name}: ${value}`)].filter(Boolean).join(', ');

let failed = 0;
for (const check of checks) {
  const problems = await problemsOf(check);
  if (problems.length > 0) failed++;
  console.log(problems.length > 0
    ? `FAIL  ${check.url}  ${problems.join('; ')}`
    : `PASS  ${check.url}  ${describe(check)}`);
}
process.exitCode = failed > 0 ? 1 : 0;
