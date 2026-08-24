import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const projectRoot = new URL('..', import.meta.url);
const temporaryRoot = await mkdtemp(join(tmpdir(), 'actionpin-package-smoke-'));

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed\n${result.stdout}${result.stderr}`);
  }
  return result.stdout;
}

function exportedTargets(value) {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(exportedTargets);
}

try {
  const packOutput = run('npm', ['pack', '--dry-run', '--json'], { cwd: projectRoot });
  const [dryRun] = JSON.parse(packOutput);
  const packedFiles = new Set(dryRun.files.map(({ path }) => path));
  const bins = Object.entries(pkg.bin ?? {});
  const targets = new Set([
    pkg.main,
    pkg.types,
    ...exportedTargets(pkg.exports),
    ...bins.map(([, target]) => target),
  ].filter(Boolean).map((target) => target.replace(/^\.\//, '')));
  const missing = [...targets].filter((target) => !packedFiles.has(target));
  if (missing.length > 0) {
    throw new Error(`declared package target(s) missing from tarball: ${missing.join(', ')}`);
  }

  const packJson = run('npm', ['pack', '--json', '--pack-destination', temporaryRoot], { cwd: projectRoot });
  const [packed] = JSON.parse(packJson);
  const tarball = join(temporaryRoot, packed.filename);
  const consumer = join(temporaryRoot, 'consumer');
  await mkdir(consumer);
  run('npm', ['init', '--yes'], { cwd: consumer });
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', tarball], { cwd: consumer });
  run(process.execPath, ['--input-type=module', '--eval', `await import(${JSON.stringify(pkg.name)})`], { cwd: consumer });
  for (const [name] of bins) {
    run(name, ['--help'], {
      cwd: consumer,
      env: { ...process.env, PATH: `${join(consumer, 'node_modules', '.bin')}${delimiter}${process.env.PATH}` },
    });
  }

  console.log(`Verified ${targets.size} declared target(s), package import, and ${bins.length} bin(s) from ${packed.filename}.`);
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
