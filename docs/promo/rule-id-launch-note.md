# Rule ID Launch Note

ActionPin now has a rule-ID oriented promotion pack for explaining why stable
finding names matter in GitHub Actions review.

## What changed

- `docs/promo/rule-id-social-pack.md` adds short hooks, a demo caption, a
  thread outline, and constraints.
- `README.md` links the new promotion pack near the workflow scan demo.

## Suggested post

Workflow review gets easier when findings have names. ActionPin scans local
GitHub Actions YAML and reports stable rule IDs such as `actions.unpinned`,
`permissions.broad`, `events.pull_request_target`, and `shell.curl-bash` with
file and snippet evidence.

Run it:

```sh
bash demo/run-workflow-scan.sh
```

## Do not claim

- proof that a workflow is safe
- remote action metadata resolution
- GitHub API coverage
