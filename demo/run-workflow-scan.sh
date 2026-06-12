#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

if node "$repo_root/dist/src/cli.js" scan \
  "$repo_root/fixtures/bad-workflows" \
  --format json \
  --fail-on high \
  --out "$tmp/bad-workflows.json"; then
  echo "bad workflow scan should fail the high-risk gate" >&2
  exit 1
fi

node "$repo_root/dist/src/cli.js" scan \
  "$repo_root/fixtures/good-workflows" \
  --out "$tmp/good-workflows.md" \
  --fail-on high

grep -q '"ruleId": "actions.unpinned"' "$tmp/bad-workflows.json"
grep -q '"ruleId": "permissions.broad"' "$tmp/bad-workflows.json"
grep -q 'ActionPin report' "$tmp/good-workflows.md"

echo "Demo output:"
echo "  $tmp/bad-workflows.json"
echo "  $tmp/good-workflows.md"
