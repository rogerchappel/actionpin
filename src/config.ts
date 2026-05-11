import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ReportFormat, ScanConfig, Severity } from './types.js';
import { normalizeSeverity } from './severity.js';

interface FileConfig {
  failOn?: Severity;
  ignoreRules?: string[];
  format?: ReportFormat;
}

export async function loadConfig(root = process.cwd(), configPath?: string): Promise<FileConfig> {
  const candidates = configPath ? [path.resolve(root, configPath)] : [path.join(root, 'actionpin.config.json'), path.join(root, '.actionpinrc.json')];
  for (const candidate of candidates) {
    const text = await fs.readFile(candidate, 'utf8').catch(() => undefined);
    if (!text) continue;
    const parsed = JSON.parse(text) as FileConfig;
    return {
      failOn: parsed.failOn ? normalizeSeverity(parsed.failOn) : undefined,
      ignoreRules: Array.isArray(parsed.ignoreRules) ? parsed.ignoreRules : undefined,
      format: parsed.format === 'json' || parsed.format === 'markdown' ? parsed.format : undefined
    };
  }
  return {};
}

export function mergeConfig(fileConfig: FileConfig, cli: Partial<ScanConfig>): ScanConfig {
  const ignoreRules = [...(fileConfig.ignoreRules ?? []), ...(cli.ignoreRules ?? [])];
  return {
    root: cli.root ?? process.cwd(),
    failOn: cli.failOn ?? fileConfig.failOn ?? 'medium',
    ignoreRules,
    format: cli.format ?? fileConfig.format ?? 'markdown',
    ...(cli.out ? { out: cli.out } : {})
  };
}
