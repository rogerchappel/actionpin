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

test('analyzer reports scalar and mapped broad permissions exactly once', async () => {
  const cases = [
    { file: 'fixtures/bad-workflows/supply-chain.yml', line: 3, snippet: 'permissions: write-all' },
    { file: 'fixtures/bad-workflows/mapped-permissions.yml', line: 5, snippet: 'issues: write' }
  ];

  for (const item of cases) {
    const findings = await analyzeFile(path.resolve(item.file));
    const broad = findings.filter((finding) => finding.ruleId === 'permissions.broad');
    assert.equal(broad.length, 1, item.file);
    assert.equal(broad[0]?.line, item.line, item.file);
    assert.equal(broad[0]?.snippet, item.snippet, item.file);
  }
});

test('analyzer leaves least-privilege permission maps clean', async () => {
  const findings = await analyzeFile(path.resolve('fixtures/good-workflows/ci.yml'));
  assert.ok(!findings.some((finding) => finding.ruleId === 'permissions.broad'));
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
