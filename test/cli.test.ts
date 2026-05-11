import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('CLI emits JSON findings and nonzero exit when threshold is met', () => {
  const result = spawnSync(process.execPath, ['dist/src/cli.js', 'scan', 'fixtures/bad-workflows', '--format', 'json', '--fail-on', 'high'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout) as { findings: Array<{ ruleId: string }> };
  assert.ok(report.findings.some((finding) => finding.ruleId === 'actions.unpinned'));
});
