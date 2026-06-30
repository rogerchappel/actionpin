#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${TMPDIR:-/tmp}/actionpin-permissions-review"
JSON_REPORT="$OUT_DIR/bad-workflows.json"
PERMISSIONS_REPORT="$OUT_DIR/permissions-findings.md"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

cd "$ROOT_DIR"
npm run build >/dev/null

set +e
node dist/src/cli.js scan fixtures/bad-workflows \
  --format json \
  --fail-on medium \
  --out "$JSON_REPORT"
status=$?
set -e

if [ "$status" -ne 1 ]; then
  printf 'expected bad workflow fixture to fail medium gate, got %s\n' "$status" >&2
  exit 1
fi

node --input-type=module - "$JSON_REPORT" "$PERMISSIONS_REPORT" <<'NODE'
import { readFileSync, writeFileSync } from 'node:fs';

const [, , jsonPath, outPath] = process.argv;
const report = JSON.parse(readFileSync(jsonPath, 'utf8'));
const permissionFindings = report.findings.filter((finding) =>
  finding.ruleId.startsWith('permissions.')
);

const lines = [
  '# ActionPin Permissions Review',
  '',
  `Source fixture: ${report.scannedPath}`,
  `Permissions findings: ${permissionFindings.length}`,
  ''
];

for (const finding of permissionFindings) {
  lines.push(`## ${finding.ruleId}`);
  lines.push('');
  lines.push(`- Severity: ${finding.severity}`);
  lines.push(`- File: ${finding.file}:${finding.line}`);
  lines.push(`- Title: ${finding.title}`);
  lines.push('');
}

writeFileSync(outPath, `${lines.join('\n')}\n`);
NODE

grep -q '"ruleId": "permissions.broad"' "$JSON_REPORT"
grep -q "permissions.broad" "$PERMISSIONS_REPORT"
grep -q "Permissions findings:" "$PERMISSIONS_REPORT"

echo "Full JSON report: $JSON_REPORT"
echo "Permissions review: $PERMISSIONS_REPORT"
