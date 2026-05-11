export function lineAllowsRule(line: string, ruleId: string): boolean {
  const marker = /actionpin\s+allow(?::|\s+)([^#]+)/i.exec(line);
  if (!marker) return false;
  const value = marker[1] ?? '';
  return value.split(/[\s,]+/).map((part) => part.trim()).filter(Boolean).some((part) => part === ruleId || part === '*');
}

export function previousLineAllows(lines: string[], index: number, ruleId: string): boolean {
  const current = lines[index] ?? '';
  const previous = index > 0 ? lines[index - 1] ?? '' : '';
  return lineAllowsRule(current, ruleId) || lineAllowsRule(previous, ruleId);
}
