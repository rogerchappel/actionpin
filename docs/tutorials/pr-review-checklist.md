# Pull Request Review Checklist

Use this checklist when ActionPin finds workflow risks in a pull request. It maps the built-in rule IDs to reviewer questions and keeps the review focused on evidence from the report.

## Run the Fixture Demo

```sh
npm install
bash demo/run-workflow-scan.sh
```

The script writes JSON and Markdown reports under `${TMPDIR:-/tmp}/actionpin-demo` and verifies stable rule IDs against the bundled fixtures.

## Checklist

| Rule | Reviewer question | Useful evidence |
|------|-------------------|-----------------|
| `actions.unpinned` | Is the third-party action pinned to a full commit SHA? | `uses:` line and remediation text |
| `permissions.missing` | Should top-level workflow permissions be explicit? | workflow header and suggested least-privilege scope |
| `permissions.broad` | Can broad read/write permissions be narrowed? | `permissions:` block |
| `events.pull_request_target` | Does this privileged PR workflow handle untrusted input? | trigger block and checkout pattern |
| `shell.curl-bash` | Can remote shell execution be replaced with a pinned action or checked-in script? | shell snippet |
| `shell.insecure-flags` | Why is certificate validation or failure handling weakened? | shell snippet |
| `secrets.plaintext` | Is the literal a placeholder, or should it move to secrets? | exact line evidence |

## PR Comment Shape

```md
ActionPin found workflow risks in `.github/workflows/ci.yml`.

- Highest severity: high
- Report: actionpin-report.md
- Review focus: pinned actions, explicit permissions, and shell download steps
```

## Rollout Advice

Start with `--fail-on high` so the check blocks the riskiest findings first. Keep lower-severity findings visible in Markdown until the repository has a clear allow-comment policy.
