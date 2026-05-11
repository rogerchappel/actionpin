import type { Finding, ScanConfig, ScanResult } from './types.js';
import { discoverWorkflowFiles, toPosixRelative } from './path-safe.js';
import { analyzeFile } from './analyzer.js';
import { severityMeets } from './severity.js';

export async function scan(paths: string[], config: ScanConfig): Promise<ScanResult> {
  const files = await discoverWorkflowFiles(paths, config.root);
  const ignored = new Set(config.ignoreRules);
  const findings: Finding[] = [];

  for (const file of files) {
    const fileFindings = await analyzeFile(file);
    for (const finding of fileFindings) {
      if (ignored.has(finding.ruleId)) continue;
      findings.push({ ...finding, file: toPosixRelative(finding.file, config.root) });
    }
  }

  findings.sort(compareFindings);
  const ok = !findings.some((finding) => severityMeets(finding.severity, config.failOn));
  return { ok, scannedFiles: files.map((file) => toPosixRelative(file, config.root)), findings, generatedAt: new Date(0).toISOString() };
}

function compareFindings(a: Finding, b: Finding): number {
  return a.file.localeCompare(b.file) || a.line - b.line || a.ruleId.localeCompare(b.ruleId);
}
