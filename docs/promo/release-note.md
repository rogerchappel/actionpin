# ActionPin Release Note Draft

ActionPin is a local-first GitHub Actions workflow checker for common CI
supply-chain review risks. It scans workflow files from disk and reports
review-ready evidence for unpinned third-party actions, broad permissions,
privileged PR triggers, secret-looking literals, curl-to-shell patterns, and
insecure shell flags.

## Demo

```bash
npm run build
bash demo/run-workflow-scan.sh
```

The demo scans the bundled risky and safe workflow fixtures. The risky fixture
is expected to fail the high-risk gate, while the safe fixture writes a passing
Markdown report. The script also checks stable rule IDs in the JSON output.

## Reviewer value

- Markdown output gives humans file, line, snippet, severity, and remediation
  context.
- JSON output is suitable for bots, release evidence, or agent handoffs.
- `--fail-on` lets teams choose the severity threshold for CI gates.
- Scanning is offline and does not require the GitHub API.

## Limits

ActionPin is not a full YAML interpreter, does not verify remote action SHAs,
and does not inspect remote repositories. It catches common review-worthy
patterns before workflow changes merge.
