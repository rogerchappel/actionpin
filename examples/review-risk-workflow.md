# Review Risk Workflow Demo

This demo scans the bundled risky workflow fixture and writes both bot-friendly JSON and reviewer-friendly Markdown.

## Run

From the repository root:

```bash
npm install
npm run build
node dist/src/cli.js scan fixtures/bad-workflows --format json --fail-on high --ignore-rule secrets.plaintext > /tmp/actionpin-risk.json
node dist/src/cli.js scan fixtures/bad-workflows --out /tmp/actionpin-risk.md --fail-on high --ignore-rule secrets.plaintext
node dist/src/cli.js scan fixtures/good-workflows --out /tmp/actionpin-good.md --fail-on high
```

The risky fixture is expected to exit non-zero because it includes `pull_request_target`, broad permissions, unpinned actions, and shell fetch patterns. The good fixture should pass at the same threshold.

## Inspect

```bash
cat /tmp/actionpin-risk.md
cat /tmp/actionpin-good.md
```

Use JSON when another tool needs stable fields such as `ruleId`, `severity`, `file`, and `line`. Use Markdown when the report is meant for a PR comment or handoff.

