# Security Policy

ActionPin is a local workflow checker. It should never collect telemetry, call remote services during scans, or read outside paths explicitly requested by the user.

## Reporting a vulnerability

Please open a private GitHub security advisory if available, or contact the maintainer with:

- affected version or commit
- reproduction steps
- expected vs actual behavior
- whether the issue can cause hidden network access, unexpected file reads/writes, or incorrect security results

## Supported versions

This repository is pre-1.0. Security fixes target `main` first.

## Design expectations

- No secrets in fixtures, tests, docs, or telemetry.
- No automatic workflow rewrites in V1.
- Deterministic output suitable for CI evidence.
- Prefer false positives with clear remediation over silent misses for high-risk patterns.
