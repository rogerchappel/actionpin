# ActionPin Rule ID Social Pack

These drafts are grounded in the committed workflow fixtures and demo scripts.
Use them when promoting ActionPin as a local review aid for GitHub Actions.

## Short hooks

1. A workflow scanner is more useful when every finding has a stable rule ID a
   reviewer can discuss.
2. ActionPin turns common GitHub Actions risks into local Markdown or JSON:
   unpinned actions, broad permissions, privileged PR events, and shell
   download patterns.
3. Run one fixture scan and you get rule IDs that can become PR review
   questions instead of vague security advice.
4. `actions.unpinned` and `events.pull_request_target` are easier to review
   when the report points to the file, line, snippet, and remediation.
5. Local-first CI review means no GitHub API call is needed to inspect workflow
   YAML before a PR discussion.

## Demo caption

ActionPin scans committed workflow fixtures and writes reviewable Markdown or
JSON findings with stable rule IDs. The risky fixture intentionally includes
unpinned actions, broad permissions, `pull_request_target`, curl-to-shell, and a
secret-looking literal so the report has concrete evidence to discuss.

Run it:

```sh
bash demo/run-workflow-scan.sh
```

For a focused privileged-PR review:

```sh
bash demo/run-pr-target-review.sh
```

## Thread outline

1. Start with the review problem: workflow YAML can hide supply-chain risk in
   ordinary-looking CI changes.
2. Show `fixtures/bad-workflows/supply-chain.yml` and run
   `demo/run-workflow-scan.sh`.
3. Point at stable rule IDs such as `actions.unpinned`,
   `permissions.broad`, `events.pull_request_target`, and
   `shell.curl-bash`.
4. Close with the local-first constraint: ActionPin reads only local workflow
   files and writes reports when asked.

## Constraints

Do not claim ActionPin proves a workflow is safe. It catches common,
review-worthy patterns and produces deterministic evidence for a human review.
