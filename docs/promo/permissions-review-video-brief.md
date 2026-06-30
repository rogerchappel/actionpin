# Video Brief: Permissions Review With ActionPin

## Hook

Broad GitHub Actions permissions are easy to miss in a noisy workflow diff.
ActionPin can turn that specific risk into a small Markdown review artifact.

## Demo beats

1. Run `bash demo/run-permissions-review.sh`.
2. Show that the fixture scan exits through the expected medium-risk gate.
3. Open the generated `permissions-findings.md` artifact.
4. Point from each finding to the source file and line evidence.

## Claims to keep grounded

- ActionPin scans local workflow files and does not call the GitHub API.
- The permissions review artifact is generated from the checked-in
  `fixtures/bad-workflows` fixture.
- The tool highlights review-worthy patterns; it does not prove a workflow is
  safe.

## CTA

Try the fixture-backed permissions review before wiring ActionPin into CI:

```sh
bash demo/run-permissions-review.sh
```
