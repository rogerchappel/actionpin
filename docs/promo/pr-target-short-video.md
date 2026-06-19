# Short Video Brief: Review `pull_request_target` in 45 Seconds

## Hook

"This workflow looks harmless because it only labels pull requests, but the
trigger is privileged. Here is the evidence I want in the review."

## Demo Path

1. Open `fixtures/warn-workflows/pr-target.yml`.
2. Point out `pull_request_target`, `pull-requests: write`, and the allow
   comment beside `actions/labeler@v5`.
3. Run `bash demo/run-pr-target-review.sh`.
4. Open the generated Markdown report from
   `${TMPDIR:-/tmp}/actionpin-pr-target-demo/pr-target-review.md`.
5. Show the stable rule ID `events.pull_request_target`.

## Spoken Points

- ActionPin runs locally and reads only the workflow paths passed to `scan`.
- Allow comments can narrow one finding without hiding the privileged trigger.
- The report is useful as PR evidence because it includes the rule ID, severity,
  file location, and remediation text.

## Boundaries

- Do not claim the fixture is a real vulnerability.
- Do not claim ActionPin proves the workflow is safe.
- Keep the ending practical: use the report to make privileged CI changes easier
  to review.
