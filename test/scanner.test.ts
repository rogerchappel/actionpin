import test from 'node:test';
import assert from 'node:assert/strict';
import { scan } from '../src/scanner.js';

test('scanner passes clean fixtures and fails risky ones', async () => {
  const clean = await scan(['fixtures/good-workflows'], { root: process.cwd(), failOn: 'high', ignoreRules: [], format: 'json' });
  assert.equal(clean.ok, true);
  assert.equal(clean.findings.length, 0);

  const risky = await scan(['fixtures/bad-workflows'], { root: process.cwd(), failOn: 'high', ignoreRules: [], format: 'json' });
  assert.equal(risky.ok, false);
  assert.ok(risky.findings.length >= 5);
});
