#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${TMPDIR:-/tmp}/actionpin-pr-target-demo"

cd "$ROOT_DIR"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

npm run build >/dev/null

set +e
node dist/src/cli.js scan fixtures/warn-workflows \
  --format markdown \
  --fail-on medium \
  --out "$OUT_DIR/pr-target-review.md"
status=$?
set -e

if [ "$status" -ne 1 ]; then
  printf 'expected pull_request_target fixture to fail the medium gate, got %s\n' "$status" >&2
  exit 1
fi

set +e
node dist/src/cli.js scan fixtures/warn-workflows \
  --format json \
  --out "$OUT_DIR/pr-target-review.json"
status=$?
set -e

if [ "$status" -ne 1 ]; then
  printf 'expected JSON pull_request_target fixture scan to exit 1, got %s\n' "$status" >&2
  exit 1
fi

grep -Fq "events.pull_request_target" "$OUT_DIR/pr-target-review.md"
grep -Fq '"ruleId": "events.pull_request_target"' "$OUT_DIR/pr-target-review.json"

echo "PR target review reports:"
echo "  $OUT_DIR/pr-target-review.md"
echo "  $OUT_DIR/pr-target-review.json"
