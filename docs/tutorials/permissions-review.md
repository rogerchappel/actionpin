# Permissions Review Demo

This demo turns ActionPin's permissions findings into a small reviewer artifact
that can be attached to a pull request or copied into a release audit note.

## Run it

```sh
bash demo/run-permissions-review.sh
```

The script scans `fixtures/bad-workflows`, expects the medium-risk gate to fail,
then writes:

- `bad-workflows.json`, the full ActionPin JSON report.
- `permissions-findings.md`, a focused Markdown summary of `permissions.*`
  findings.

## Review checklist

- Confirm the workflow has explicit top-level `permissions`.
- If broad permissions are present, ask which job needs write access.
- Prefer job-level permissions that grant only the scopes needed by that job.
- Treat the generated Markdown as review evidence, not as an automated approval.

## Why this fixture fails

The bundled bad workflow intentionally includes broad permissions alongside
other risks so the demo can show a realistic review slice without scanning a
private repository or calling the GitHub API.
