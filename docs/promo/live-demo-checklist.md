# Live Demo Checklist

Use this checklist for a short ActionPin walkthrough based on the checked-in fixtures and demo script.

## Prep

- Run `npm install` and `npm run build`.
- Keep `fixtures/bad-workflows/supply-chain.yml` and `fixtures/good-workflows/ci.yml` open for context.
- Run `bash demo/run-workflow-scan.sh` once before recording to confirm the fixture reports generate locally.

## Demo Flow

1. Show the risky fixture and point out unpinned actions, broad permissions, `pull_request_target`, curl-to-shell, insecure flags, and a secret-looking literal.
2. Run `node dist/src/cli.js scan fixtures/bad-workflows --format markdown --fail-on critical --out /tmp/actionpin-risk.md`.
3. Open `/tmp/actionpin-risk.md` and highlight file/line evidence plus stable rule IDs.
4. Run `node dist/src/cli.js scan fixtures/good-workflows --format markdown --fail-on high --out /tmp/actionpin-good.md`.
5. Show the pass result from the good fixture.

## Sound Bites

- ActionPin is local-first and does not call the GitHub API while scanning.
- Markdown output is useful as a PR review artifact.
- JSON output is useful for bots or release evidence.

## Honest Limits

ActionPin does not verify remote action SHAs, resolve action metadata, or prove a workflow is safe. It flags common review-worthy workflow patterns with deterministic evidence.
