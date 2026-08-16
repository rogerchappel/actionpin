export interface WorkflowText {
  lines: string[];
  text: string;
}

export interface UsesRef {
  value: string;
  line: number;
  snippet: string;
}

export interface PermissionGrant {
  line: number;
  snippet: string;
}

export function parseWorkflowText(text: string): WorkflowText {
  return { text, lines: text.split(/\r?\n/) };
}

export function findUses(lines: string[]): UsesRef[] {
  const refs: UsesRef[] = [];
  lines.forEach((line, index) => {
    const match = /^\s*-?\s*uses:\s*['"]?([^'"\s#]+)['"]?/i.exec(line);
    if (match?.[1]) refs.push({ value: match[1], line: index + 1, snippet: line.trim() });
  });
  return refs;
}

export function hasTopLevelPermissions(lines: string[]): boolean {
  return lines.some((line) => /^permissions\s*:/i.test(line));
}

export function findBroadTopLevelPermissions(lines: string[]): PermissionGrant | undefined {
  const permissionsIndex = lines.findIndex((line) => /^permissions\s*:/i.test(line));
  if (permissionsIndex < 0) return undefined;

  const declaration = lines[permissionsIndex] ?? '';
  const scalar = /^permissions\s*:\s*(write-all|read-all|write)\s*(?:#.*)?$/i.exec(declaration);
  if (scalar) return { line: permissionsIndex + 1, snippet: declaration.trim() };
  if (!/^permissions\s*:\s*(?:#.*)?$/i.test(declaration)) return undefined;

  for (let index = permissionsIndex + 1; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    if (!line.trim() || /^\s*#/.test(line)) continue;
    if (!/^\s/.test(line)) break;
    if (/^\s+[A-Za-z][\w-]*\s*:\s*write\s*(?:#.*)?$/i.test(line)) {
      return { line: index + 1, snippet: line.trim() };
    }
  }

  return undefined;
}

export function hasPullRequestTarget(lines: string[]): number | undefined {
  const idx = lines.findIndex((line) => /^\s*pull_request_target\s*:/i.test(line) || /^on\s*:\s*\[.*pull_request_target.*\]/i.test(line));
  return idx >= 0 ? idx + 1 : undefined;
}
