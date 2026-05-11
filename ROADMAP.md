# Roadmap

## V1 MVP

- Offline scan of GitHub Actions workflow files.
- Markdown and JSON reports.
- Configurable fail threshold and ignored rules.
- Fixture-backed tests and CLI smoke checks.

## Nice next steps

- Better YAML structure awareness without sacrificing deterministic behavior.
- SARIF output for GitHub code scanning uploads.
- More shell heuristics for unsafe untrusted input handling.
- Optional `explain <rule>` command with examples.
- Rule docs generated from `src/rules.ts`.

## Explicit non-goals for now

- Network verification of action SHAs.
- Marketplace metadata lookups.
- Auto-fixing workflow files.
- Secret scanning beyond obvious workflow literals.
