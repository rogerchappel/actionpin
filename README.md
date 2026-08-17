# ActionPin 📌

ActionPin is a tiny local-first GitHub Actions workflow checker. It looks for the stuff that quietly turns CI into supply-chain confetti: unpinned actions, broad token permissions, secret-looking literals, risky `pull_request_target`, and shell steps that fetch the internet straight into `bash`.

It is boring on purpose: deterministic, offline, no telemetry, no GitHub API required.

## Install

```bash
npm install
npm run build
node dist/src/cli.js rules
```

When published, the CLI is exposed as `actionpin`.

## Quickstart

```bash
actionpin scan .github/workflows --out actionpin-report.md
actionpin scan fixtures/bad-workflows --format json --fail-on medium
actionpin rules
```

For local development in this repo:

```bash
npm run build
node dist/src/cli.js scan fixtures/bad-workflows --format json --fail-on high
```

## Demo recipe

Run the included fixture scan to see the Markdown evidence format without
touching your own workflows:

```bash
npm install
npm run build
node dist/src/cli.js scan fixtures/bad-workflows --format markdown --fail-on critical > /tmp/actionpin-demo.md
sed -n '1,80p' /tmp/actionpin-demo.md
```

The demo fixture includes intentionally risky examples: unpinned third-party
actions, broad workflow permissions, a `pull_request_target` trigger, curl-to-
shell, insecure curl flags, and a secret-looking literal. Use the generated
Markdown report as a PR comment draft or release evidence artifact.

For a fixture-backed script that produces both JSON and Markdown reports, run:

```bash
npm run build
bash demo/run-workflow-scan.sh
```

The script scans the included bad and good workflow fixtures, checks that the
bad fixture fails the high-risk gate, and verifies stable rule IDs in the JSON
report.

Promotion drafts for this workflow live in
[docs/promo/social-hooks.md](docs/promo/social-hooks.md) and
[docs/promo/release-note.md](docs/promo/release-note.md).
For short rule-ID oriented launch drafts, see
[docs/promo/rule-id-social-pack.md](docs/promo/rule-id-social-pack.md).

See [the workflow risk tutorial](docs/tutorials/review-workflow-risk.md) for a
review-ready walkthrough.
Use [the PR review checklist](docs/tutorials/pr-review-checklist.md) when you
want to turn ActionPin rule IDs into reviewer questions.

For a focused `pull_request_target` gate with JSON and Markdown artifacts:

```bash
bash demo/run-pr-target-gate.sh
```

See [docs/tutorials/pr-target-gate.md](docs/tutorials/pr-target-gate.md) and
[docs/promo/pr-target-gate-social-hooks.md](docs/promo/pr-target-gate-social-hooks.md).

For a side-by-side fixture comparison across risky, warning-only, and passing
workflow examples:

```bash
bash demo/run-fixture-comparison.sh
```

See [docs/tutorials/fixture-comparison.md](docs/tutorials/fixture-comparison.md).

For a focused permissions review artifact generated from the bad workflow
fixture:

```bash
bash demo/run-permissions-review.sh
```

See [docs/tutorials/permissions-review.md](docs/tutorials/permissions-review.md)
and [docs/promo/permissions-review-video-brief.md](docs/promo/permissions-review-video-brief.md).

## Rules

- `actions.unpinned` — third-party `uses:` references must be pinned to a full 40-character commit SHA.
- `permissions.missing` — top-level `permissions:` should be explicit.
- `permissions.broad` — scalar `write-all`, `read-all`, or `write`, and any
  `scope: write` entry in a top-level block permission map, are risky. A mapped
  declaration produces one finding at its first write scope; read-only maps
  such as `contents: read` remain clean.
- `secrets.plaintext` — secret-looking literal values should not live in workflow YAML.
- `events.pull_request_target` — privileged PR workflows need careful review. Recognizes top-level scalar, inline sequence, block sequence, and mapping trigger declarations, including quoted event names.
- `shell.curl-bash` — piping remote content into `bash`/`sh` is flagged.
- `shell.insecure-flags` — patterns like `set +e`, `curl -k`, and `wget --no-check-certificate` are flagged.

## Configuration

Create `actionpin.config.json` or pass `--config`:

```json
{
  "failOn": "medium",
  "format": "markdown",
  "ignoreRules": ["events.pull_request_target"]
}
```

ActionPin also checks `.actionpinrc.json` when `actionpin.config.json` is not
present. Explicit CLI options override config-file values; for example,
`--format markdown` overrides `"format": "json"`. Missing optional default
config files are ignored, but a file named with `--config` must be readable and
valid JSON. Unreadable, missing, malformed, or invalid explicit config files
produce an explanation on stderr and exit with status 2.

Inline allow comments are supported for narrow exceptions:

```yaml
# actionpin allow: actions.unpinned
- uses: actions/labeler@v5
```

Use them sparingly and leave a human-readable comment nearby.

## Safety model

ActionPin only reads workflow paths you ask it to scan, refuses paths outside the repo root, and checks resolved filesystem paths before following symlinks. Symlinks that stay within the repo root are scanned; file or directory symlinks that escape it are rejected without reading the external content. ActionPin writes only when `--out` is provided and never performs network calls while scanning. Reports include stable file/line/snippet evidence and remediation text.

## CI usage

```yaml
- run: npm ci
- run: npm run build
- run: node dist/src/cli.js scan .github/workflows --fail-on high
```

Use Markdown output for PR artifacts and JSON output for bots or release evidence.

See the [CLI reference](docs/CLI.md) for path discovery, every option,
configuration precedence, and the `0`/`1`/`2` exit-status contract.

The `--format` option accepts `markdown` or `json`, and `--fail-on` accepts
`info`, `low`, `medium`, `high`, or `critical`. Options that take values support
both `--option value` and `--option=value`. Repeat `--ignore-rule` to ignore
multiple rule IDs (comma-separated IDs also work); other options may be supplied
only once. Unknown options, missing values, duplicate non-repeatable options,
and unsupported values are command misuse: ActionPin explains the problem on
stderr and exits with status 2.

## Demo Recipes

- [Review Risk Workflow Demo](examples/review-risk-workflow.md) scans the bundled risky and safe workflow fixtures and writes both Markdown and JSON reports.
- [Pull request target fixture review](examples/pr-target-review.md) focuses on the privileged `pull_request_target` fixture and the matching demo script.
- [Workflow risk tutorial](docs/tutorials/review-workflow-risk.md) turns the fixture scan into a review-ready walkthrough.
- [PR review checklist](docs/tutorials/pr-review-checklist.md) maps rule IDs to focused review questions.
- [Pull request target review](docs/tutorials/pr-target-review.md) focuses on a privileged PR workflow with a narrow allow comment.
- [Video brief](docs/promo/video-brief.md) outlines a short grounded walkthrough for promotion or screencast prep.
- [Live demo checklist](docs/promo/live-demo-checklist.md) gives a concise recording flow based on the bundled fixtures.


## Verification

Run the local quality gates before opening a pull request:

```sh
npm run lint
npm test
npm run smoke
```

`npm run lint` is an alias for the repository static check so contributors can use the common npm workflow without guessing the project-specific command.

## Limitations

ActionPin is not a full YAML interpreter or shell static analyzer. It intentionally catches common, review-worthy patterns without trying to prove a workflow is safe. It does not resolve action metadata, verify SHAs, or inspect remote repositories.

## Development

```bash
npm test
npm run check
npm run build
npm run smoke
npm run package:smoke
npm run release:check
bash scripts/validate.sh
```

## Package contents

The npm package allowlist includes the compiled runtime plus the public support
documents needed for release review: `README.md`, `LICENSE`, `SECURITY.md`,
`CHANGELOG.md`, `CONTRIBUTING.md`, and `CODE_OF_CONDUCT.md`.

Run `npm run package:smoke` before publishing to confirm the tarball still
contains the expected files.

See `docs/PRD.md` and `docs/TASKS.md` for the MVP contract.
## Release readiness

Before opening a release PR, run the package checks that exercise the build, tests, smoke path, and pack manifest:

```sh
npm run check
npm test
npm run smoke
npm run package:smoke
npm run release:check
```

The package metadata points at the public GitHub repository so npm and generated provenance link back to the source.
