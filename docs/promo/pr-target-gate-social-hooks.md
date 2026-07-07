# PR Target Gate Social Hooks

Grounded hooks for `demo/run-pr-target-gate.sh`.

## Short posts

1. `pull_request_target` is not automatically wrong, but it should always be a
   review moment. ActionPin turns that moment into a report with a stable rule
   ID and file evidence.
2. Inline allow comments are useful only when they stay visible. This demo keeps
   the allowed action out of the findings while still failing on the privileged
   PR trigger.
3. A CI security check can be local and deterministic: scan committed workflow
   fixtures, write JSON plus Markdown, and attach the report to the PR.

## Video beat

- Open `fixtures/warn-workflows/pr-target.yml`.
- Run `bash demo/run-pr-target-gate.sh`.
- Show the JSON rule ID `events.pull_request_target`.
- Show the Markdown report turning the privileged trigger into reviewer-ready
  evidence.
