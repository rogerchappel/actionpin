# Fixture Report Demo

This tutorial creates a local Markdown report from the intentionally risky
workflow fixture in this repository. It is safe to run because ActionPin only
reads local workflow files and writes a report when `--out` is supplied.

## Run the demo

```bash
npm install
npm run build
node dist/src/cli.js scan fixtures/bad-workflows \
  --format markdown \
  --out /tmp/actionpin-fixture-report.md \
  --fail-on critical
test -s /tmp/actionpin-fixture-report.md
```

The command exits non-zero when findings meet or exceed the requested
threshold. That is expected for `fixtures/bad-workflows`; the fixture is meant
to demonstrate the report.

## What to inspect

Open `/tmp/actionpin-fixture-report.md` and look for these rule IDs:

- `actions.unpinned`
- `permissions.broad`
- `events.pull_request_target`
- `shell.curl-bash`
- `shell.insecure-flags`
- `secrets.plaintext`

Each finding includes file and line evidence so reviewers can jump directly to
the workflow statement that needs attention.

## Try a passing fixture

```bash
node dist/src/cli.js scan fixtures/good-workflows \
  --format markdown \
  --out /tmp/actionpin-good-report.md \
  --fail-on high
test -s /tmp/actionpin-good-report.md
```

The passing fixture uses explicit permissions and commit-pinned actions. It is
useful for comparing the report shape when no high-severity workflow issue is
present.
