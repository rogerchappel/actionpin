import test from 'node:test';
import assert from 'node:assert/strict';
import { findUses, hasTopLevelPermissions, hasPullRequestTarget } from '../src/parser.js';

test('parser finds uses references and workflow signals', () => {
  const lines = ['on: [push, pull_request_target]', 'permissions:', '  contents: read', 'steps:', '  - uses: actions/checkout@v4'];
  assert.deepEqual(findUses(lines).map((item) => item.value), ['actions/checkout@v4']);
  assert.equal(hasTopLevelPermissions(lines), true);
  assert.equal(hasPullRequestTarget(lines), 1);
});
