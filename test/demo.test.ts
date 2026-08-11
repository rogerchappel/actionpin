import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

test('PR target review demo runs outside the repository', () => {
  const externalCwd = mkdtempSync(path.join(tmpdir(), 'actionpin-external-cwd-'));
  const outputRoot = mkdtempSync(path.join(tmpdir(), 'actionpin-demo-output-'));
  const script = path.resolve('demo/run-pr-target-review.sh');

  const result = spawnSync('bash', [script], {
    cwd: externalCwd,
    encoding: 'utf8',
    env: { ...process.env, TMPDIR: outputRoot }
  });

  assert.equal(result.status, 0, result.stderr);

  const reportDir = path.join(outputRoot, 'actionpin-pr-target-demo');
  const markdown = readFileSync(path.join(reportDir, 'pr-target-review.md'), 'utf8');
  const json = JSON.parse(readFileSync(path.join(reportDir, 'pr-target-review.json'), 'utf8')) as {
    findings: Array<{ ruleId: string }>;
  };

  assert.match(markdown, /events\.pull_request_target/);
  assert.ok(json.findings.some((finding) => finding.ruleId === 'events.pull_request_target'));
});
