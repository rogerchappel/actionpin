#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${TMPDIR:-/tmp}/actionpin-pr-target-gate"
JSON_REPORT="$OUT_DIR/pr-target.json"
MD_REPORT="$OUT_DIR/pr-target.md"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"
cd "$ROOT_DIR"

npm run build >/dev/null

set +e
node dist/src/cli.js scan fixtures/warn-workflows \
  --format json \
  --fail-on medium \
  --out "$JSON_REPORT"
status=$?
set -e

if [ "$status" -ne 1 ]; then
  printf 'expected pull_request_target fixture scan to exit 1, got %s\n' "$status" >&2
  exit 1
fi

set +e
node dist/src/cli.js scan fixtures/warn-workflows \
  --format markdown \
  --fail-on medium \
  --out "$MD_REPORT"
status=$?
set -e

if [ "$status" -ne 1 ]; then
  printf 'expected pull_request_target Markdown scan to exit 1, got %s\n' "$status" >&2
  exit 1
fi

grep -Fq '"ruleId": "events.pull_request_target"' "$JSON_REPORT"
grep -Fq 'events.pull_request_target' "$MD_REPORT"
grep -Fq 'pull_request_target workflow needs extra scrutiny' "$MD_REPORT"

echo "PR target JSON report: $JSON_REPORT"
echo "PR target Markdown report: $MD_REPORT"
