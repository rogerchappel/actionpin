export interface WorkflowText {
  lines: string[];
  text: string;
}

export interface UsesRef {
  value: string;
  line: number;
  snippet: string;
}

export function parseWorkflowText(text: string): WorkflowText {
  return { text, lines: text.split(/\r?\n/) };
}

export function findUses(lines: string[]): UsesRef[] {
  const refs: UsesRef[] = [];
  lines.forEach((line, index) => {
    const match = /^\s*uses:\s*['"]?([^'"\s#]+)['"]?/i.exec(line);
    if (match?.[1]) refs.push({ value: match[1], line: index + 1, snippet: line.trim() });
  });
  return refs;
}

export function hasTopLevelPermissions(lines: string[]): boolean {
  return lines.some((line) => /^permissions\s*:/i.test(line));
}

export function hasPullRequestTarget(lines: string[]): number | undefined {
  const idx = lines.findIndex((line) => /^\s*pull_request_target\s*:/i.test(line) || /^on\s*:\s*\[.*pull_request_target.*\]/i.test(line));
  return idx >= 0 ? idx + 1 : undefined;
}
