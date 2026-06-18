# Pull Request Target Review Fixture

This example uses `fixtures/warn-workflows/pr-target.yml` to show a narrow
review flow for privileged pull request automation. The fixture is intentionally
small: it uses `pull_request_target`, grants `pull-requests: write`, and leaves
an allow comment beside `actions/labeler@v5`.

Run the demo script:

```bash
npm run build
bash demo/run-pr-target-review.sh
```

The script writes Markdown and JSON reports under
`${TMPDIR:-/tmp}/actionpin-pr-target-demo` and verifies that
`events.pull_request_target` appears in both formats.

Use the Markdown report as a reviewer handoff when a workflow:

- runs on `pull_request_target`;
- needs write access to pull requests;
- has a deliberately allowed unpinned action;
- should still keep a visible record of the privileged trigger.

The fixture is not a claim that the workflow is exploitable. It is a compact
example of the review evidence ActionPin can produce before a maintainer
approves a privileged workflow change.
