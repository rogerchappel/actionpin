# ActionPin Social Hooks

Draft posts grounded in current ActionPin behavior: offline workflow scanning,
stable rule IDs, Markdown/JSON reports, fail-on severity gates, and no GitHub
API requirement.

## Short posts

1. ActionPin checks GitHub Actions workflows for review-worthy supply-chain
   risks: unpinned actions, broad permissions, `pull_request_target`, plaintext
   secret-looking literals, and curl-to-shell patterns.
2. Run ActionPin locally before CI changes ship. It reads workflow files, writes
   Markdown or JSON, and does not call the GitHub API.
3. Use `--fail-on high` for a conservative gate, then attach the Markdown report
   so reviewers can see exact file, line, snippet, and remediation context.

## Demo angle

```sh
npm run build
bash demo/run-workflow-scan.sh
```

The demo scans the included bad and good workflow fixtures, expects the risky
fixture to fail the high-risk gate, and verifies stable rule IDs in the JSON
report.

