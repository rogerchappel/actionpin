# ActionPin Social Hooks

Draft posts grounded in current ActionPin behavior: offline workflow scanning,
stable rule IDs, Markdown/JSON reports, fail-on severity gates, and no GitHub
API requirement.

## Short posts

1. Your GitHub Actions workflow can look boring and still hide a supply-chain
   review problem. ActionPin turns the obvious risks into a local Markdown
   report.
2. Run ActionPin locally before CI changes ship. It reads workflow files, writes
   Markdown or JSON, and does not call the GitHub API.
3. Use `--fail-on high` for a conservative gate, then attach the Markdown report
   so reviewers can see exact file, line, snippet, and remediation context.
4. Demo idea: scan a risky workflow, then scan the pinned fixture. The
   difference is small enough for a one-minute security review clip.
5. New review aid: `docs/tutorials/pr-review-checklist.md` maps rule IDs to
   concrete reviewer questions for workflow pull requests.

## Launch note draft

ActionPin is a local-first GitHub Actions workflow checker for common
supply-chain review issues: unpinned third-party actions, broad token
permissions, privileged PR triggers, secret-looking literals, and shell steps
that fetch remote scripts. It reads workflow files from disk, emits Markdown or
JSON, and includes file/line evidence so reviewers can use the output in PRs.

Limitations: ActionPin is not a full YAML interpreter, does not verify remote
action SHAs, and does not inspect remote repositories. It is meant to catch
review-worthy patterns before CI configuration changes merge.

## Demo angle

```sh
npm run build
bash demo/run-workflow-scan.sh
```

The demo scans the included bad and good workflow fixtures, expects the risky
fixture to fail the high-risk gate, and verifies stable rule IDs in the JSON
report.

## Fixture comparison angle

```sh
bash demo/run-fixture-comparison.sh
```

Use this when the story is contrast: bad workflows fail a high gate,
`pull_request_target` fails a medium gate, and the good fixture passes. See
[fixture comparison hooks](fixture-comparison-hooks.md).
