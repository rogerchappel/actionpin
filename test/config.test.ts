import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeConfig } from '../src/config.js';

test('config merge prefers explicit CLI settings', () => {
  const config = mergeConfig({ failOn: 'low', ignoreRules: ['a'], format: 'json' }, { root: '/tmp/x', failOn: 'high', ignoreRules: ['b'] });
  assert.equal(config.failOn, 'high');
  assert.deepEqual(config.ignoreRules, ['a', 'b']);
  assert.equal(config.format, 'json');
});
