# ActionPin Social Hooks

## Short hooks

- Your GitHub Actions workflow can look boring and still hide a supply-chain review problem. ActionPin turns the obvious risks into a local Markdown report.
- A CI scanner that does not need GitHub API access: point ActionPin at `.github/workflows` and get pinned-action, permission, secret-literal, and shell-fetch findings.
- Demo idea: scan a risky workflow, then scan the pinned fixture. The difference is small enough for a one-minute security review clip.

## Launch note draft

ActionPin is a local-first GitHub Actions workflow checker for common supply-chain review issues: unpinned third-party actions, broad token permissions, privileged PR triggers, secret-looking literals, and shell steps that fetch remote scripts. It reads workflow files from disk, emits Markdown or JSON, and includes file/line evidence so reviewers can use the output in PRs.

Limitations: ActionPin is not a full YAML interpreter, does not verify remote action SHAs, and does not inspect remote repositories. It is meant to catch review-worthy patterns before CI configuration changes merge.
