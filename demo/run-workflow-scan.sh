#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

npm run build >/dev/null

out_dir="${TMPDIR:-/tmp}/actionpin-demo"
mkdir -p "$out_dir"

set +e
node dist/src/cli.js scan fixtures/bad-workflows \
  --format markdown \
  --fail-on high \
  --out "$out_dir/bad-workflows.md"
status=$?
set -e

if [ "$status" -ne 1 ]; then
  printf 'expected risky fixture scan to exit 1, got %s\n' "$status" >&2
  exit 1
fi

grep -Fq 'actions.unpinned' "$out_dir/bad-workflows.md"
grep -Fq 'shell.curl-bash' "$out_dir/bad-workflows.md"

node dist/src/cli.js scan fixtures/good-workflows \
  --format markdown \
  --fail-on high \
  --out "$out_dir/good-workflows.md"

grep -Fq 'Result: **pass**' "$out_dir/good-workflows.md"

printf 'wrote %s/bad-workflows.md and %s/good-workflows.md\n' "$out_dir" "$out_dir"
