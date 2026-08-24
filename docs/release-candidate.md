# Release Candidate Checklist

Use this checklist before publishing an ActionPin package or tagging a release.

## Verification

- Run `npm run release:check`.
- Confirm `npm run smoke` still flags high-risk workflow fixtures and permits the good workflow fixture.
- From a clean checkout after `npm ci`, run `npm pack --dry-run --json`. The
  `prepack` lifecycle builds the package, and the JSON file list must include
  `dist/src/index.js`, `dist/src/index.d.ts`, and `dist/src/cli.js` alongside
  `README.md`, `LICENSE`, and `SECURITY.md`.

## Evidence

- Record the workflow fixture names used for smoke testing.
- Include any rule ID, severity, or ignore-rule behavior changes in release notes.
- Note whether JSON and Markdown output changed.

## Support Notes

- Keep workflow fixtures synthetic.
- Do not claim ActionPin proves a workflow is safe; it flags review-worthy patterns.
