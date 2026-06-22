/**
 * Simulates a Render Docker deploy locally before you push.
 *
 * Prerequisites: Docker Desktop running + .env.local with NEXT_PUBLIC_* vars.
 */
import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const image = 'cybereats-web-smoke';
const container = 'cybereats-web-smoke';
const port = 3099;
const homeUrl = `http://127.0.0.1:${port}/`;
const maxWaitMs = 120_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadPublicEnv(envPath) {
  const vars = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key.startsWith('NEXT_PUBLIC_')) vars[key] = value;
  }
  return vars;
}

function dockerBuild(publicEnv) {
  const args = ['build', '-t', image];
  for (const [key, value] of Object.entries(publicEnv)) {
    args.push('--build-arg', `${key}=${value}`);
  }
  args.push('.');

  const result = spawnSync('docker', args, { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function waitForHome() {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const res = await fetch(homeUrl);
      if (res.ok) {
        const html = await res.text();
        if (html.includes('CyberEats') || html.includes('__next')) {
          console.log('\n[ok] Frontend responded:', res.status, homeUrl);
          return;
        }
      }
    } catch {
      // container still booting
    }
    await sleep(2000);
  }
  throw new Error(`Frontend smoke timed out after ${maxWaitMs / 1000}s (${homeUrl})`);
}

async function main() {
  const envFile = path.join(root, '.env.local');
  if (!existsSync(envFile)) {
    console.error('[fail] .env.local not found — copy .env.example to .env.local first');
    process.exit(1);
  }

  const publicEnv = loadPublicEnv(envFile);
  if (!publicEnv.NEXT_PUBLIC_API_URL) {
    console.error('[fail] NEXT_PUBLIC_API_URL missing in .env.local');
    process.exit(1);
  }

  console.log('==> Building Docker image (same as Render)...');
  dockerBuild(publicEnv);

  try {
    execSync(`docker rm -f ${container}`, { stdio: 'ignore' });
  } catch {
    // not running
  }

  console.log('==> Starting container (non-root user, like Render)...');
  const run = spawnSync(
    'docker',
    ['run', '-d', '--name', container, '-p', `${port}:3000`, image],
    { cwd: root, stdio: 'inherit' },
  );
  if (run.status !== 0) process.exit(run.status ?? 1);

  try {
    console.log(`==> Waiting for ${homeUrl} ...`);
    await waitForHome();
    console.log('\n[ok] Docker smoke test passed — safe to push to Render.');
  } catch (err) {
    console.error('\n[fail] Smoke test failed. Container logs:\n');
    execSync(`docker logs ${container}`, { cwd: root, stdio: 'inherit' });
    process.exit(1);
  } finally {
    execSync(`docker rm -f ${container}`, { stdio: 'ignore' });
  }
}

main().catch((err) => {
  console.error('[fail]', err.message);
  process.exit(1);
});
