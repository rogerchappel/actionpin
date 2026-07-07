# Launch Note: ActionPin PR Review Checklist

ActionPin now has a reviewer checklist that turns rule IDs into concrete pull request questions.

## What Is Included

- `docs/tutorials/pr-review-checklist.md` maps each built-in rule to reviewer prompts.
- The checklist points back to `demo/run-workflow-scan.sh` so maintainers can generate fixture-backed JSON and Markdown reports.
- The rollout guidance recommends starting with `--fail-on high` before tightening policy.

## Suggested Post

GitHub Actions security reviews get easier when findings map to specific reviewer questions.

ActionPin now includes a PR review checklist for unpinned actions, broad permissions, `pull_request_target`, curl-to-shell, insecure shell flags, and plaintext secret-looking values.

Try the fixture-backed demo:

```sh
bash demo/run-workflow-scan.sh
```

It stays local: no GitHub API calls, no telemetry, no remote workflow inspection.
