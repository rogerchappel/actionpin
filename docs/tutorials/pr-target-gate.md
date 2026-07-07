# Pull Request Target Gate

This recipe turns the committed `fixtures/warn-workflows/pr-target.yml` workflow
into review evidence for privileged `pull_request_target` usage.

## Run it

```sh
bash demo/run-pr-target-gate.sh
```

The script builds ActionPin, scans `fixtures/warn-workflows`, and writes:

- `${TMPDIR:-/tmp}/actionpin-pr-target-gate/pr-target.json`
- `${TMPDIR:-/tmp}/actionpin-pr-target-gate/pr-target.md`

The scan is expected to exit non-zero at `--fail-on medium` because the fixture
uses `pull_request_target`. The wrapper verifies that the JSON and Markdown
reports both contain the `events.pull_request_target` rule ID.

## Review angle

Use the Markdown report as a PR comment draft when a workflow needs a privileged
trigger. The fixture includes a narrow inline allow comment for the unpinned
labeler action, so the focused report leaves the allowed action quiet while
still making the privileged event a reviewer question.
