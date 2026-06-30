#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${TMPDIR:-/tmp}/actionpin-fixture-comparison"
BAD_REPORT="$OUT_DIR/bad-workflows.json"
WARN_REPORT="$OUT_DIR/warn-workflows.json"
GOOD_REPORT="$OUT_DIR/good-workflows.json"
INDEX="$OUT_DIR/index.md"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

cd "$ROOT_DIR"
npm run build >/dev/null

set +e
node dist/src/cli.js scan fixtures/bad-workflows --format json --fail-on high --out "$BAD_REPORT"
bad_status=$?
node dist/src/cli.js scan fixtures/warn-workflows --format json --fail-on medium --out "$WARN_REPORT"
warn_status=$?
node dist/src/cli.js scan fixtures/good-workflows --format json --fail-on high --out "$GOOD_REPORT"
good_status=$?
set -e

if [ "$bad_status" -ne 1 ]; then
  printf 'expected bad workflow fixture to fail high-risk gate, got %s\n' "$bad_status" >&2
  exit 1
fi

if [ "$warn_status" -ne 1 ]; then
  printf 'expected warning workflow fixture to fail medium gate, got %s\n' "$warn_status" >&2
  exit 1
fi

if [ "$good_status" -ne 0 ]; then
  printf 'expected good workflow fixture to pass high-risk gate, got %s\n' "$good_status" >&2
  exit 1
fi

node --input-type=module - "$BAD_REPORT" "$WARN_REPORT" "$GOOD_REPORT" "$INDEX" <<'NODE'
import { readFileSync, writeFileSync } from 'node:fs';

const [, , badPath, warnPath, goodPath, indexPath] = process.argv;
const reports = [
  ['bad-workflows', badPath],
  ['warn-workflows', warnPath],
  ['good-workflows', goodPath]
].map(([label, path]) => [label, JSON.parse(readFileSync(path, 'utf8'))]);

const lines = ['# ActionPin Fixture Comparison', ''];
for (const [label, report] of reports) {
  lines.push(`## ${label}`);
  lines.push('');
  lines.push(`- OK: ${report.ok}`);
  lines.push(`- Findings: ${report.findings.length}`);
  for (const finding of report.findings) {
    lines.push(`- ${finding.ruleId} (${finding.severity}): ${finding.title}`);
  }
  lines.push('');
}

writeFileSync(indexPath, `${lines.join('\n')}\n`);
NODE

grep -Fq '"ruleId": "actions.unpinned"' "$BAD_REPORT"
grep -Fq '"ruleId": "events.pull_request_target"' "$WARN_REPORT"
grep -Fq '"ok": true' "$GOOD_REPORT"
grep -Fq "good-workflows" "$INDEX"

echo "Bad fixture report: $BAD_REPORT"
echo "Warning fixture report: $WARN_REPORT"
echo "Good fixture report: $GOOD_REPORT"
echo "Comparison index: $INDEX"
