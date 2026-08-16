import { promises as fs } from 'node:fs';
import type { Finding } from './types.js';
import { getRule } from './rules.js';
import { findBroadTopLevelPermissions, findUses, hasPullRequestTarget, hasTopLevelPermissions, parseWorkflowText } from './parser.js';
import { previousLineAllows } from './allow.js';

const fullSha = /^[^@\s]+@[0-9a-f]{40}$/i;
const localOrDocker = /^(\.\/|docker:\/\/)/;
const plaintextSecret = /(ghp_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|(?:api[_-]?key|token|secret|password)\s*[:=]\s*['"][^'"${][^'"]{7,}['"])/i;
const curlBash = /\b(curl|wget)\b[^|\n]*\|\s*(sudo\s+)?(bash|sh)\b/i;
const multilineCurlBash = /\b(curl|wget)\b[\s\S]{0,300}?\|\s*(sudo\s+)?(bash|sh)\b/i;
const insecureShell = /\b(set\s+\+e|curl\s+[^\n]*(-k|--insecure)|wget\s+[^\n]*--no-check-certificate)\b/i;

export async function analyzeFile(file: string): Promise<Finding[]> {
  const text = await fs.readFile(file, 'utf8');
  const workflow = parseWorkflowText(text);
  const findings: Finding[] = [];

  for (const ref of findUses(workflow.lines)) {
    if (!localOrDocker.test(ref.value) && !fullSha.test(ref.value)) {
      push(findings, 'actions.unpinned', file, ref.line, ref.snippet);
    }
  }

  if (!hasTopLevelPermissions(workflow.lines)) {
    push(findings, 'permissions.missing', file, 1, firstMeaningfulLine(workflow.lines));
  }

  const broadPermission = findBroadTopLevelPermissions(workflow.lines);
  if (broadPermission) push(findings, 'permissions.broad', file, broadPermission.line, broadPermission.snippet);

  let sawCurlBash = false;
  workflow.lines.forEach((line, index) => {
    if (plaintextSecret.test(line)) push(findings, 'secrets.plaintext', file, index + 1, line.trim());
    if (curlBash.test(line)) {
      sawCurlBash = true;
      push(findings, 'shell.curl-bash', file, index + 1, line.trim());
    }
    if (insecureShell.test(line)) push(findings, 'shell.insecure-flags', file, index + 1, line.trim());
  });

  if (!sawCurlBash) {
    const multiline = findMultilineCurlBash(workflow.lines);
    if (multiline) push(findings, 'shell.curl-bash', file, multiline.line, multiline.snippet);
  }

  const prTargetLine = hasPullRequestTarget(workflow.lines);
  if (prTargetLine) push(findings, 'events.pull_request_target', file, prTargetLine, workflow.lines[prTargetLine - 1]?.trim() ?? 'pull_request_target');

  return findings.filter((finding) => !previousLineAllows(workflow.lines, finding.line - 1, finding.ruleId));
}

function push(findings: Finding[], ruleId: string, file: string, line: number, snippet: string): void {
  const rule = getRule(ruleId);
  if (!rule) throw new Error(`Unknown rule: ${ruleId}`);
  findings.push({ ruleId, severity: rule.severity, title: rule.title, file, line, snippet, remediation: rule.remediation });
}

function firstMeaningfulLine(lines: string[]): string {
  return lines.find((line) => line.trim() && !line.trim().startsWith('#'))?.trim() ?? '(empty workflow)';
}

function findMultilineCurlBash(lines: string[]): { line: number; snippet: string } | undefined {
  for (let index = 0; index < lines.length; index += 1) {
    const window = lines.slice(index, index + 8).join('\n');
    if (multilineCurlBash.test(window)) {
      return { line: index + 1, snippet: lines[index]?.trim() || '(multi-line shell step)' };
    }
  }
  return undefined;
}
