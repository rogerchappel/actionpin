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
    let text: string;
    try {
      text = await fs.readFile(candidate, 'utf8');
    } catch (error: unknown) {
      if (!configPath && isMissingFile(error)) continue;
      throw new Error(`Unable to read config file "${candidate}": ${errorMessage(error)}`);
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (error: unknown) {
      throw new Error(`Invalid JSON in config file "${candidate}": ${errorMessage(error)}`);
    }
    if (!isRecord(parsed)) throw invalidValue(candidate, 'config', 'expected a JSON object');
    const config: FileConfig = {};
    if (parsed.failOn !== undefined) {
      if (typeof parsed.failOn !== 'string') throw invalidValue(candidate, 'failOn', 'expected a severity string');
      try {
        config.failOn = normalizeSeverity(parsed.failOn);
      } catch {
        throw invalidValue(candidate, 'failOn', 'use one of: info, low, medium, high, critical');
      }
    }
    if (parsed.ignoreRules !== undefined) {
      if (!Array.isArray(parsed.ignoreRules) || !parsed.ignoreRules.every((rule) => typeof rule === 'string')) {
        throw invalidValue(candidate, 'ignoreRules', 'expected an array of strings');
      }
      config.ignoreRules = parsed.ignoreRules;
    }
    if (parsed.format !== undefined) {
      if (parsed.format !== 'json' && parsed.format !== 'markdown') {
        throw invalidValue(candidate, 'format', 'use one of: markdown, json');
      }
      config.format = parsed.format;
    }
    return config;
  }
  return {};
}

function isMissingFile(error: unknown): boolean {
  return isRecord(error) && error.code === 'ENOENT';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function invalidValue(candidate: string, field: string, guidance: string): Error {
  return new Error(`Invalid config value for "${field}" in "${candidate}": ${guidance}`);
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
