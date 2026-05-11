import type { Severity } from './types.js';

export const severityOrder: Severity[] = ['info', 'low', 'medium', 'high', 'critical'];

export function normalizeSeverity(value: string | undefined, fallback: Severity = 'medium'): Severity {
  if (!value) return fallback;
  const lower = value.toLowerCase();
  if (severityOrder.includes(lower as Severity)) return lower as Severity;
  throw new Error(`Unknown severity "${value}". Use one of: ${severityOrder.join(', ')}`);
}

export function severityMeets(severity: Severity, threshold: Severity): boolean {
  return severityOrder.indexOf(severity) >= severityOrder.indexOf(threshold);
}
