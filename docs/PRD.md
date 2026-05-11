# ActionPin PRD

Status: in-progress

## Summary

A local GitHub Actions workflow checker that finds unpinned actions, broad token permissions, plaintext secret hazards, and risky shell patterns before they become supply-chain confetti. 📌

## Source attribution

Created during the twice-daily OSS factory run on 2026-05-11. Web search for current developer-tool signals was attempted but rate-limited. Follow-up web fetch reviewed GitHub’s public secure-use reference for Actions, including least-privilege token guidance, masking sensitive data, and avoiding plaintext secrets in workflows. This tool reframes those practices into a deterministic offline repo check.

## Target users

- OSS maintainers with GitHub Actions workflows.
- Agents generating or editing CI files.
- Security-conscious developers who want local review before pushing workflow changes.

## Problem

CI workflows are easy to copy-paste and hard to audit. Unpinned third-party actions, broad `permissions`, secret echoing, and dangerous shell flags often slip into repos because there is no tiny local checker in the normal agent loop.

## Goals

- Scan `.github/workflows/*.yml` offline.
- Detect common risky patterns with precise file/line evidence.
- Provide actionable fixes without requiring GitHub API access.
- Emit Markdown and JSON reports for local checks, PR comments, or release evidence.
- Include fixtures for good/bad workflows and tests another developer can run immediately.

## Non-goals

- Full static analysis of arbitrary shell scripts.
- Replacing GitHub’s security products.
- Auto-editing workflow files in V1.
- Network resolution of action SHAs or marketplace metadata.

## V1 CLI

```bash
actionpin scan .github/workflows --out actionpin-report.md
actionpin scan fixtures/bad-workflows --format json --fail-on medium
actionpin rules
```

## Functional requirements

1. Parse GitHub Actions YAML workflow files from requested paths.
2. Flag unpinned `uses:` references, mutable refs, missing/top-level broad permissions, secret-looking literals, and risky `pull_request_target` patterns.
3. Emit stable Markdown and JSON with severity, rule id, file, line, snippet, and remediation.
4. Support `--fail-on`, `--ignore-rule`, inline allow comments, and config file.
5. Include fixtures and tests for safe, warning, and failing workflows.
6. Avoid telemetry, external network calls, hidden writes, or reading outside requested paths.

## Acceptance criteria

- `npm test`, `npm run check`, `npm run build`, and `npm run smoke` pass.
- `bash scripts/validate.sh` passes when present.
- Real CLI smoke scans checked-in workflow fixtures and produces expected reports.
- README covers quick start, rules, examples, safety model, limitations, and CI usage.
- Public GitHub repo `rogerchappel/actionpin` has useful description and topics.

## Suggested implementation waves

1. Scaffold TypeScript CLI with StackForge and planning docs.
2. Implement YAML workflow parser and line mapping.
3. Implement rules, reporters, config, and CLI flags.
4. Add fixtures, tests, smoke scripts, validation.
5. Polish README, package metadata, GitHub metadata, and branch protection.
