# Pull Request Target Review Demo

This recipe demonstrates a workflow that is not obviously malicious but still
deserves review: it uses `pull_request_target` and contains a narrow allow
comment for an unpinned action.

## Run It

```sh
bash demo/run-pr-target-review.sh
```

The script writes both report formats under:

```text
/tmp/actionpin-pr-target-demo
```

The Markdown command intentionally uses `--fail-on medium`, so it exits with a
failure status after writing the report. The script checks for that status and
continues only when the risk gate behaves as expected.

## What to Inspect

Look for the `events.pull_request_target` rule ID.

The fixture also shows an inline allow comment:

```yaml
# actionpin allow: actions.unpinned
```

That keeps the demo focused on the privileged PR workflow review instead of an
unpinned action finding.
