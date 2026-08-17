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
  return lines.some((line) => permissionsDeclaration(line) !== undefined);
}

export function findBroadTopLevelPermissions(lines: string[]): PermissionGrant | undefined {
  const permissionsIndex = lines.findIndex((line) => permissionsDeclaration(line) !== undefined);
  if (permissionsIndex < 0) return undefined;

  const declaration = lines[permissionsIndex] ?? '';
  const value = permissionsDeclaration(declaration) ?? '';
  if (/^(?:['"]?(?:write-all|read-all|write)['"]?)$/i.test(value)) {
    return { line: permissionsIndex + 1, snippet: declaration.trim() };
  }
  if (value.startsWith('{') && value.endsWith('}')) {
    const entries = value.slice(1, -1).split(',');
    if (entries.some((entry) => /^(?:[A-Za-z][\w-]*|'[^']+'|"[^"]+")\s*:\s*['"]?write['"]?\s*$/i.test(entry.trim()))) {
      return { line: permissionsIndex + 1, snippet: declaration.trim() };
    }
    return undefined;
  }
  if (value !== '') return undefined;

  for (let index = permissionsIndex + 1; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    if (!line.trim() || /^\s*#/.test(line)) continue;
    if (!/^\s/.test(line)) break;
    if (/^\s+(?:[A-Za-z][\w-]*|'[^']+'|"[^"]+")\s*:\s*['"]?write['"]?\s*(?:#.*)?$/i.test(line)) {
      return { line: index + 1, snippet: line.trim() };
    }
  }

  return undefined;
}

function permissionsDeclaration(line: string): string | undefined {
  const match = /^(?:permissions|'permissions'|"permissions")\s*:\s*(.*?)\s*$/i.exec(withoutComment(line));
  return match?.[1]?.trim();
}

export function hasPullRequestTarget(lines: string[]): number | undefined {
  for (let index = 0; index < lines.length; index += 1) {
    const declaration = /^(?:on|['"]on['"])\s*:\s*(.*?)\s*$/.exec(withoutComment(lines[index] ?? ''));
    if (!declaration) continue;

    const value = declaration[1]?.trim() ?? '';
    if (isEventName(value)) return index + 1;
    if (value.startsWith('[') && value.endsWith(']')) {
      const events = value.slice(1, -1).split(',').map((event) => event.trim());
      if (events.some(isEventName)) return index + 1;
    }
    if (value !== '') continue;

    for (let childIndex = index + 1; childIndex < lines.length; childIndex += 1) {
      const child = withoutComment(lines[childIndex] ?? '');
      if (!child.trim()) continue;
      const indent = child.match(/^\s*/)?.[0].length ?? 0;
      if (indent === 0) break;

      const item = /^\s*-\s*(.*?)\s*$/.exec(child)?.[1];
      if (item !== undefined && isEventName(item)) return childIndex + 1;

      const key = /^\s*([^:]+?)\s*:/.exec(child)?.[1];
      if (key !== undefined && isEventName(key)) return childIndex + 1;
    }
  }
  return undefined;
}

function isEventName(value: string): boolean {
  return /^(?:pull_request_target|['"]pull_request_target['"])$/i.test(value.trim());
}

function withoutComment(line: string): string {
  let quote: "'" | '"' | undefined;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if ((character === "'" || character === '"') && (!quote || quote === character)) {
      quote = quote ? undefined : character;
    } else if (character === '#' && !quote && (index === 0 || /\s/.test(line[index - 1] ?? ''))) {
      return line.slice(0, index).trimEnd();
    }
  }
  return line;
}
