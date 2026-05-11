import { promises as fs } from 'node:fs';
import path from 'node:path';

const workflowExt = new Set(['.yml', '.yaml']);

export async function discoverWorkflowFiles(inputs: string[], root = process.cwd()): Promise<string[]> {
  const base = path.resolve(root);
  const requested = inputs.length > 0 ? inputs : ['.github/workflows'];
  const files: string[] = [];

  for (const input of requested) {
    const absolute = path.resolve(base, input);
    ensureInside(base, absolute);
    await collect(absolute, files, base);
  }

  return [...new Set(files)].sort((a, b) => a.localeCompare(b));
}

async function collect(target: string, files: string[], base: string): Promise<void> {
  const stat = await fs.stat(target).catch(() => undefined);
  if (!stat) return;
  if (stat.isFile()) {
    if (workflowExt.has(path.extname(target).toLowerCase())) files.push(target);
    return;
  }
  if (!stat.isDirectory()) return;
  const entries = await fs.readdir(target, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const next = path.join(target, entry.name);
    ensureInside(base, next);
    if (entry.isDirectory()) await collect(next, files, base);
    else if (entry.isFile() && workflowExt.has(path.extname(entry.name).toLowerCase())) files.push(next);
  }
}

export function ensureInside(base: string, target: string): void {
  const rel = path.relative(base, target);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Refusing to read outside the requested root: ${target}`);
  }
}

export function toPosixRelative(file: string, root = process.cwd()): string {
  return path.relative(path.resolve(root), file).split(path.sep).join('/');
}
