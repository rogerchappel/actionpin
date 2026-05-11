# Contributing

Thanks for helping make CI a little less cursed. 📌

## Local setup

```bash
npm install
npm run build
npm test
```

## Before opening a PR

Run the full local gate:

```bash
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Rule changes

When adding or changing a rule:

1. Add metadata in `src/rules.ts`.
2. Add deterministic analyzer behavior with file/line/snippet evidence.
3. Add good and bad fixtures when practical.
4. Add tests for the rule and reporter output if the shape changes.
5. Update the README rule list.

## Project boundaries

ActionPin should remain offline and local-first. Do not add telemetry, hidden network calls, secret-bearing fixtures, or automatic writes outside explicit `--out` behavior.
