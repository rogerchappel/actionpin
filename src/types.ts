export type Severity = 'info' | 'low' | 'medium' | 'high' | 'critical';
export type ReportFormat = 'markdown' | 'json';

export interface RuleMeta {
  id: string;
  title: string;
  severity: Severity;
  category: 'pinning' | 'permissions' | 'secrets' | 'events' | 'shell';
  description: string;
  remediation: string;
}

export interface Finding {
  ruleId: string;
  severity: Severity;
  title: string;
  file: string;
  line: number;
  snippet: string;
  remediation: string;
}

export interface ScanConfig {
  failOn: Severity;
  ignoreRules: string[];
  format: ReportFormat;
  out?: string;
  root: string;
}

export interface ScanResult {
  ok: boolean;
  scannedFiles: string[];
  findings: Finding[];
  generatedAt: string;
}

export interface ParsedArgs {
  command: string;
  paths: string[];
  flags: Record<string, string | boolean | string[]>;
}
