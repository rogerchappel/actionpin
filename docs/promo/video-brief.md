# Short Video Brief: ActionPin Fixture Scan

## Angle

Show how a local-only workflow scanner turns a risky GitHub Actions file into
reviewable evidence in under a minute.

## Demo beats

1. Open `fixtures/bad-workflows/supply-chain.yml` and point out the intentionally
   risky lines: unpinned `actions/checkout@v4`, `permissions: write-all`,
   `pull_request_target`, curl-to-shell, insecure curl flags, and a
   secret-looking literal.
2. Run:

   ```bash
   npm run build
   node dist/src/cli.js scan fixtures/bad-workflows --format markdown --out /tmp/actionpin-demo.md --fail-on critical
   ```

3. Show `/tmp/actionpin-demo.md` with rule IDs and file/line evidence.
4. Run the same command against `fixtures/good-workflows` to show the cleaner
   baseline.

## Claims to keep factual

- ActionPin scans local workflow files.
- It does not call the GitHub API while scanning.
- It reports common review-worthy workflow risks with stable evidence.

## Limitations to mention

ActionPin does not verify remote action SHAs, resolve action metadata, or prove
that a workflow is safe. It is a deterministic review aid for common patterns.
