# Release Checklist

Use this checklist before publishing or announcing ActionPin.

1. Install dependencies with `npm ci`.
2. Run `npm run release:check`.
3. Run `bash scripts/validate.sh`.
4. Confirm `npm run package:smoke` lists the compiled CLI and support docs.
5. Scan the bundled workflow fixtures to confirm high-severity findings still fail as expected.
