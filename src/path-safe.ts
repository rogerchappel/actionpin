import { promises as fs } from 'node:fs';
import path from 'node:path';

const workflowExt = new Set(['.yml', '.yaml']);

export async function discoverWorkflowFiles(inputs: string[], root = process.cwd()): Promise<string[]> {
  const base = path.resolve(root);
  const realBase = await fs.realpath(base);
  const requested = inputs.length > 0 ? inputs : ['.github/workflows'];
  const files: string[] = [];
  const visitedDirectories = new Set<string>();

  for (const input of requested) {
    const absolute = path.resolve(base, input);
    ensureInside(base, absolute);
    await collect(absolute, files, base, realBase, visitedDirectories);
  }

  return [...new Set(files)].sort((a, b) => a.localeCompare(b));
}

async function collect(
  target: string,
  files: string[],
  base: string,
  realBase: string,
  visitedDirectories: Set<string>,
): Promise<void> {
  ensureInside(base, target);
  const realTarget = await fs.realpath(target).catch(() => undefined);
  if (!realTarget) return;
  ensureRealInside(realBase, realTarget);

  const stat = await fs.stat(realTarget).catch(() => undefined);
  if (!stat) return;
  if (stat.isFile()) {
    if (workflowExt.has(path.extname(target).toLowerCase())) files.push(target);
    return;
  }
  if (!stat.isDirectory()) return;
  if (visitedDirectories.has(realTarget)) return;
  visitedDirectories.add(realTarget);

  const entries = await fs.readdir(realTarget, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const next = path.join(target, entry.name);
    await collect(next, files, base, realBase, visitedDirectories);
  }
}

export function ensureInside(base: string, target: string): void {
  const rel = path.relative(base, target);
  if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    throw new Error('Refusing to read outside the requested root');
  }
}

function ensureRealInside(realBase: string, realTarget: string): void {
  const rel = path.relative(realBase, realTarget);
  if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    throw new Error('Refusing to read a path that resolves outside the requested root');
  }
}

export function toPosixRelative(file: string, root = process.cwd()): string {
  return path.relative(path.resolve(root), file).split(path.sep).join('/');
}
