# Fixture Comparison Demo

This recipe compares ActionPin's three committed workflow fixture groups in one
run: risky, warning-only, and clean.

## Run it

```sh
bash demo/run-fixture-comparison.sh
```

The script builds ActionPin and writes JSON reports plus a Markdown index under
`${TMPDIR:-/tmp}/actionpin-fixture-comparison`.

## What it verifies

- `fixtures/bad-workflows` fails a high-risk gate and includes
  `actions.unpinned`.
- `fixtures/warn-workflows` fails a medium gate for
  `events.pull_request_target`.
- `fixtures/good-workflows` passes the high-risk gate with no findings.

Use this when a short video needs to show the scanner's contrast between a
review-worthy workflow, a privileged-trigger warning, and an explicit
permissions workflow that passes.
