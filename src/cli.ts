#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import { parseArgs, flagList, flagString } from './args.js';
import { loadConfig, mergeConfig } from './config.js';
import { renderJson, renderMarkdown, renderRules } from './reporters.js';
import { scan } from './scanner.js';
import { normalizeSeverity } from './severity.js';
import type { ReportFormat } from './types.js';

async function main(argv: string[]): Promise<number> {
  const parsed = parseArgs(argv);
  if (parsed.command === 'help' || parsed.command === '--help' || parsed.command === '-h') {
    process.stdout.write(help());
    return 0;
  }
  if (parsed.command === 'rules') {
    process.stdout.write(renderRules());
    return 0;
  }
  if (parsed.command !== 'scan') {
    process.stderr.write(`Unknown command: ${parsed.command}\n\n${help()}`);
    return 2;
  }

  const formatFlag = flagString(parsed.flags, 'format');
  if (formatFlag && formatFlag !== 'markdown' && formatFlag !== 'json') {
    throw new Error(`Invalid value for --format: "${formatFlag}". Use one of: markdown, json`);
  }
  const fileConfig = await loadConfig(process.cwd(), flagString(parsed.flags, 'config'));
  const out = flagString(parsed.flags, 'out');
  const cliConfig = {
    root: process.cwd(),
    ...(formatFlag ? { format: formatFlag as ReportFormat } : {}),
    failOn: normalizeSeverity(flagString(parsed.flags, 'fail-on'), fileConfig.failOn ?? 'medium'),
    ignoreRules: flagList(parsed.flags, 'ignore-rule'),
    ...(out ? { out } : {})
  };
  const config = mergeConfig(fileConfig, cliConfig);
  const result = await scan(parsed.paths, config);
  const output = config.format === 'json' ? renderJson(result) : renderMarkdown(result);
  if (config.out) await fs.writeFile(config.out, output, 'utf8');
  else process.stdout.write(output);
  return result.ok ? 0 : 1;
}

function help(): string {
  return `ActionPin — local GitHub Actions safety scanner\n\nUsage:\n  actionpin scan [paths...] [--format markdown|json] [--out file] [--fail-on severity]\n  actionpin scan fixtures/bad-workflows --format json --fail-on high\n  actionpin rules\n\nOptions:\n  --format <format>   markdown or json (default: markdown)\n  --out <file>        Write the report to a file instead of stdout\n  --ignore-rule <id>  Ignore a rule id; repeat or comma-separate\n  --config <file>     Load JSON config; CLI options override config values\n  --fail-on <level>   info, low, medium, high, critical (default: medium)\n\nInvalid options or values exit with status 2 and an explanation on stderr.\n`;
}

main(process.argv.slice(2)).then((code) => {
  process.exitCode = code;
}).catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 2;
});
