# Release Candidate Checklist

Use this checklist before publishing an ActionPin package or tagging a release.

## Verification

- Run `npm run release:check`.
- Confirm `npm run smoke` still flags high-risk workflow fixtures and permits the good workflow fixture.
- Inspect `npm pack --dry-run` output and confirm it includes `dist/src`, `README.md`, `LICENSE`, and `SECURITY.md`.

## Evidence

- Record the workflow fixture names used for smoke testing.
- Include any rule ID, severity, or ignore-rule behavior changes in release notes.
- Note whether JSON and Markdown output changed.

## Support Notes

- Keep workflow fixtures synthetic.
- Do not claim ActionPin proves a workflow is safe; it flags review-worthy patterns.
