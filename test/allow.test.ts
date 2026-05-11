import test from 'node:test';
import assert from 'node:assert/strict';
import { lineAllowsRule, previousLineAllows } from '../src/allow.js';

test('inline allow comments can target one rule or all rules', () => {
  assert.equal(lineAllowsRule('# actionpin allow: actions.unpinned', 'actions.unpinned'), true);
  assert.equal(lineAllowsRule('# actionpin allow: *', 'shell.curl-bash'), true);
  assert.equal(previousLineAllows(['# actionpin allow: x.y', 'uses: owner/action@v1'], 1, 'x.y'), true);
});
