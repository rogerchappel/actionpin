import type { ParsedArgs } from './types.js';

const valueOptions = new Set(['config', 'fail-on', 'format', 'ignore-rule', 'out']);
const repeatableOptions = new Set(['ignore-rule']);

export function parseArgs(argv: string[]): ParsedArgs {
  const [command = 'help', ...rest] = argv;
  const paths: string[] = [];
  const flags: Record<string, string | boolean | string[]> = {};

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (!arg) continue;
    if (!arg.startsWith('--')) {
      paths.push(arg);
      continue;
    }
    const [rawName, inline] = arg.slice(2).split('=', 2);
    const name = rawName ?? '';
    if (!valueOptions.has(name)) throw new Error(`Unknown option: --${name}`);
    if (!repeatableOptions.has(name) && flags[name] !== undefined) {
      throw new Error(`Duplicate option: --${name}`);
    }
    const next = rest[i + 1];
    const value = inline ?? (next && !next.startsWith('--') ? String(rest[++i]) : undefined);
    if (!value) throw new Error(`Missing value for --${name}`);
    if (name === 'ignore-rule') {
      const existing = flags[name];
      flags[name] = [...(Array.isArray(existing) ? existing : existing ? [String(existing)] : []), value];
    } else {
      flags[name] = value;
    }
  }

  return { command, paths, flags };
}

export function flagString(flags: ParsedArgs['flags'], name: string): string | undefined {
  const value = flags[name];
  return typeof value === 'string' ? value : undefined;
}

export function flagList(flags: ParsedArgs['flags'], name: string): string[] {
  const value = flags[name];
  if (!value) return [];
  return Array.isArray(value) ? value.flatMap((item) => item.split(',')).filter(Boolean) : String(value).split(',').filter(Boolean);
}
