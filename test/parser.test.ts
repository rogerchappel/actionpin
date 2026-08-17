import test from 'node:test';
import assert from 'node:assert/strict';
import { findUses, hasTopLevelPermissions, hasPullRequestTarget } from '../src/parser.js';

test('parser finds uses references and workflow signals', () => {
  const lines = ['on: [push, pull_request_target]', 'permissions:', '  contents: read', 'steps:', '  - uses: actions/checkout@v4'];
  assert.deepEqual(findUses(lines).map((item) => item.value), ['actions/checkout@v4']);
  assert.equal(hasTopLevelPermissions(lines), true);
  assert.equal(hasPullRequestTarget(lines), 1);
});

test('parser locates pull_request_target in every supported top-level event form', () => {
  const cases = [
    { lines: ['on: pull_request_target'], line: 1 },
    { lines: ['"on": "pull_request_target"'], line: 1 },
    { lines: ["on: [push, 'pull_request_target']"], line: 1 },
    { lines: ['on:', '  - push', '  - "pull_request_target"'], line: 3 },
    { lines: ["'on':", "  'pull_request_target':", '    types: [opened]'], line: 2 }
  ];

  for (const item of cases) assert.equal(hasPullRequestTarget(item.lines), item.line, item.lines.join(' / '));
});

test('parser ignores comments, similarly named events, and unrelated keys and values', () => {
  const cases = [
    ['# on: pull_request_target', 'on: push'],
    ['on: pull_request_target_review'],
    ['on: [push, pull_request_target_review]'],
    ['on:', '  - pull_request', 'jobs:', '  pull_request_target:', '    runs-on: ubuntu-latest'],
    ['on: push', 'jobs:', '  test:', '    name: pull_request_target', '    steps:', '      - run: echo pull_request_target'],
    ['name: "on: pull_request_target"', 'on: push']
  ];

  for (const lines of cases) assert.equal(hasPullRequestTarget(lines), undefined, lines.join(' / '));
});
