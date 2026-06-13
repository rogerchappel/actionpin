# Review GitHub Actions Risk Locally

This recipe shows how to turn ActionPin's fixtures into a repeatable workflow review demo. It stays offline and uses only repository files.

## Run the risky fixture

```sh
npm install
npm run build
node dist/src/cli.js scan fixtures/bad-workflows --format markdown --fail-on high --out /tmp/actionpin-bad.md
```

The command exits `1` because the fixture intentionally includes high-risk workflow patterns. The Markdown report points to file and line evidence for unpinned actions, broad permissions, secret-looking literals, and shell download patterns.

## Compare a passing workflow

```sh
node dist/src/cli.js scan fixtures/good-workflows --format markdown --fail-on high --out /tmp/actionpin-good.md
```

The passing fixture uses explicit read permissions and pins third-party actions to full commit SHAs.

## Demo shortcut

```sh
bash demo/run-workflow-scan.sh
```

The script builds the CLI, writes both reports under `/tmp/actionpin-demo`, and checks for key report text so the demo fails if the output shape changes.

## Review talking points

- ActionPin is local-first and does not call the GitHub API while scanning.
- `--fail-on high` is useful when teams want warnings in reports but hard failures only for the riskiest findings.
- Inline allow comments exist for narrow exceptions, but they should sit near a human-readable explanation.
