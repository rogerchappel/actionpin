import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('CLI emits JSON findings and nonzero exit when threshold is met', () => {
  const result = spawnSync(process.execPath, ['dist/src/cli.js', 'scan', 'fixtures/bad-workflows', '--format', 'json', '--fail-on', 'high'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout) as { findings: Array<{ ruleId: string }> };
  assert.ok(report.findings.some((finding) => finding.ruleId === 'actions.unpinned'));
});

function runCli(...args: string[]) {
  return spawnSync(process.execPath, ['dist/src/cli.js', ...args], { encoding: 'utf8' });
}

test('CLI accepts separate and inline option values with repeated ignore rules', () => {
  const result = runCli(
    'scan',
    'fixtures/bad-workflows',
    '--format=json',
    '--fail-on', 'high',
    '--ignore-rule=secrets.plaintext',
    '--ignore-rule', 'events.pull_request_target'
  );
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout) as { findings: Array<{ ruleId: string }> };
  assert.ok(!report.findings.some((finding) => finding.ruleId === 'secrets.plaintext'));
  assert.ok(!report.findings.some((finding) => finding.ruleId === 'events.pull_request_target'));
});

test('CLI rejects unknown, invalid, missing, and duplicate options as misuse', () => {
  const cases = [
    { args: ['scan', 'fixtures/good-workflows', '--unknown', 'value'], message: 'Unknown option: --unknown' },
    { args: ['scan', 'fixtures/good-workflows', '--format', 'xml'], message: 'Invalid value for --format' },
    { args: ['scan', 'fixtures/good-workflows', '--fail-on=nonsense'], message: 'Unknown severity' },
    { args: ['scan', 'fixtures/good-workflows', '--out'], message: 'Missing value for --out' },
    { args: ['scan', 'fixtures/good-workflows', '--format='], message: 'Missing value for --format' },
    { args: ['scan', 'fixtures/good-workflows', '--config', '--format', 'json'], message: 'Missing value for --config' },
    { args: ['scan', 'fixtures/good-workflows', '--format', 'json', '--format=markdown'], message: 'Duplicate option: --format' }
  ];

  for (const item of cases) {
    const result = runCli(...item.args);
    assert.equal(result.status, 2, item.args.join(' '));
    assert.match(result.stderr, new RegExp(item.message), item.args.join(' '));
    assert.equal(result.stdout, '', item.args.join(' '));
  }
});
