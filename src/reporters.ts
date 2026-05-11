import type { ScanResult } from './types.js';
import { rules } from './rules.js';

export function renderJson(result: ScanResult): string {
  return `${JSON.stringify(result, null, 2)}\n`;
}

export function renderMarkdown(result: ScanResult): string {
  const lines: string[] = [];
  lines.push('# ActionPin report', '');
  lines.push(`- Result: **${result.ok ? 'pass' : 'fail'}**`);
  lines.push(`- Files scanned: ${result.scannedFiles.length}`);
  lines.push(`- Findings: ${result.findings.length}`, '');
  if (result.scannedFiles.length) {
    lines.push('## Scanned files', '');
    for (const file of result.scannedFiles) lines.push(`- \`${file}\``);
    lines.push('');
  }
  lines.push('## Findings', '');
  if (result.findings.length === 0) {
    lines.push('No findings. Your pins are tidy. 📌', '');
  } else {
    for (const finding of result.findings) {
      lines.push(`### ${finding.severity.toUpperCase()} ${finding.ruleId}`);
      lines.push('', `- ${finding.title}`, `- Location: \`${finding.file}:${finding.line}\``, `- Evidence: \`${escapeBackticks(finding.snippet)}\``, `- Fix: ${finding.remediation}`, '');
    }
  }
  return `${lines.join('\n')}\n`;
}

export function renderRules(): string {
  const lines = ['# ActionPin rules', ''];
  for (const rule of rules) {
    lines.push(`## ${rule.id}`, '', `- Severity: ${rule.severity}`, `- Category: ${rule.category}`, `- ${rule.description}`, `- Fix: ${rule.remediation}`, '');
  }
  return `${lines.join('\n')}\n`;
}

function escapeBackticks(value: string): string {
  return value.replaceAll('`', '\\`');
}
