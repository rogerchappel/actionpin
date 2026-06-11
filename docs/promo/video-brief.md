# Video Brief: Scan a GitHub Actions Workflow Before Review

## Angle

Show how a local-only workflow scanner turns a risky GitHub Actions file into
reviewable evidence in under a minute.

## Grounded Product Facts

- ActionPin is a local-first GitHub Actions workflow scanner.
- Scans run offline against workflow files or directories.
- Current rules cover unpinned third-party actions, missing or broad permissions, plaintext secret-looking values, `pull_request_target`, curl-to-shell patterns, and insecure shell flags.
- Output formats are Markdown and JSON.
- `--fail-on` controls the severity threshold, and `--ignore-rule` allows narrow rule exceptions.

## 60-Second Flow

1. Show `fixtures/bad-workflows/supply-chain.yml` and point out the intentionally
   risky lines: unpinned `actions/checkout@v4`, `permissions: write-all`,
   `pull_request_target`, curl-to-shell, insecure curl flags, and a
   secret-looking literal.
2. Run:

   ```bash
   npm run build
   node dist/src/cli.js scan fixtures/bad-workflows --out /tmp/actionpin-risk.md --fail-on high --ignore-rule secrets.plaintext
   ```

3. Open `/tmp/actionpin-risk.md` and point to the file/line evidence.
4. Run:

   ```bash
   node dist/src/cli.js scan fixtures/good-workflows --out /tmp/actionpin-good.md --fail-on high
   ```

5. Show that the good fixture passes with explicit permissions and pinned actions.

## Talking Points

- "This is not a hosted scanner; it reads local workflow files and produces deterministic reports."
- "The Markdown report is suitable for human review, while JSON is ready for automation."
- "ActionPin catches review-worthy patterns; it does not prove a workflow is safe."

## Avoid Claiming

- Do not claim full supply-chain protection.
- Do not claim remote SHA verification.
- Do not claim GitHub API integration.
