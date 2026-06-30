# Fixture Comparison Hooks

Use these drafts with `bash demo/run-fixture-comparison.sh`.

## Short Posts

1. A useful workflow scanner demo should show contrast: risky workflows fail a
   high gate, privileged trigger usage fails a medium gate, and explicit safe
   fixtures pass.

2. `ActionPin` comparison clip: scan `bad-workflows`, `warn-workflows`, and
   `good-workflows`, then open the generated index to show rule IDs beside the
   expected pass/fail result.

3. The scanner is local-only and deterministic. The fixture comparison is
   designed for reviewers who need evidence, not a black-box security score.

## Clip CTA

```sh
bash demo/run-fixture-comparison.sh
```

Show `bad-workflows.json`, `warn-workflows.json`, `good-workflows.json`, then
the generated `index.md`.
