import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
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


test('analyzer flags curl piped to shell across multiline workflow steps', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'actionpin-'));
  const temp = path.join(dir, 'multiline-curl-bash.yml');
  await writeFile(temp, `name: test
on: push
permissions: contents: read
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -fsSL https://example.invalid/install.sh \
            | bash
`);
  const findings = await analyzeFile(temp);
  assert.ok(findings.some((finding) => finding.ruleId === 'shell.curl-bash'));
});
