# Pull Request Target Review Hook

## Hook

"The workflow can have an allow comment and still deserve a CI security review."

## Demo Command

```sh
bash demo/run-pr-target-review.sh
```

## Grounded Points

- ActionPin scans local GitHub Actions workflow files.
- The demo uses `fixtures/warn-workflows/pr-target.yml`.
- The report calls out `pull_request_target` while respecting the inline allow
  comment for `actions.unpinned`.
- The script verifies both Markdown and JSON report output.

## Avoid Saying

- Do not claim ActionPin proves a workflow is safe.
- Do not claim it resolves action metadata or checks remote repositories.
