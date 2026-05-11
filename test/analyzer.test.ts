import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { analyzeFile } from '../src/analyzer.js';

test('analyzer flags bad workflow patterns', async () => {
  const findings = await analyzeFile(path.resolve('fixtures/bad-workflows/supply-chain.yml'));
  const ids = findings.map((finding) => finding.ruleId);
  assert.ok(ids.includes('actions.unpinned'));
  assert.ok(ids.includes('permissions.broad'));
  assert.ok(ids.includes('secrets.plaintext'));
  assert.ok(ids.includes('shell.curl-bash'));
  assert.ok(ids.includes('shell.insecure-flags'));
  assert.ok(ids.includes('events.pull_request_target'));
});
