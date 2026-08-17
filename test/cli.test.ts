import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

test('CLI emits JSON findings and nonzero exit when threshold is met', () => {
  const result = spawnSync(process.execPath, ['dist/src/cli.js', 'scan', 'fixtures/bad-workflows', '--format', 'json', '--fail-on', 'high'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  const report = JSON.parse(result.stdout) as { findings: Array<{ ruleId: string }> };
  assert.ok(report.findings.some((finding) => finding.ruleId === 'actions.unpinned'));
});

test('CLI reports scalar, block-mapped, and flow-mapped broad permission fixtures', () => {
  for (const file of ['supply-chain.yml', 'mapped-permissions.yml', 'flow-permissions.yml']) {
    const result = spawnSync(process.execPath, ['dist/src/cli.js', 'scan', `fixtures/bad-workflows/${file}`, '--format', 'json', '--fail-on', 'high'], { encoding: 'utf8' });
    assert.equal(result.status, 1, file);
    const report = JSON.parse(result.stdout) as { findings: Array<{ ruleId: string }> };
    assert.equal(report.findings.filter((finding) => finding.ruleId === 'permissions.broad').length, 1, file);
  }
});

test('CLI reports one pull_request_target finding for each valid fixture form', () => {
  const result = spawnSync(process.execPath, ['dist/src/cli.js', 'scan', 'fixtures/event-forms', '--format', 'json', '--fail-on', 'high'], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  const report = JSON.parse(result.stdout) as { findings: Array<{ ruleId: string; file: string; line: number }> };
  const events = report.findings.filter((finding) => finding.ruleId === 'events.pull_request_target');
  assert.equal(events.length, 4);
  assert.deepEqual(events.map((finding) => [path.basename(finding.file), finding.line]), [
    ['block-mapping.yml', 3],
    ['block-sequence.yml', 4],
    ['inline-sequence.yml', 2],
    ['scalar.yml', 2]
  ]);
  assert.ok(!events.some((finding) => finding.file.endsWith('negative.yml')));
});

function runCli(args: string[], cwd = process.cwd()) {
  return spawnSync(process.execPath, [path.resolve('dist/src/cli.js'), ...args], { cwd, encoding: 'utf8' });
}

test('CLI accepts separate and inline option values with repeated ignore rules', () => {
  const result = runCli([
    'scan',
    'fixtures/bad-workflows',
    '--format=json',
    '--fail-on', 'high',
    '--ignore-rule=secrets.plaintext',
    '--ignore-rule', 'events.pull_request_target'
  ]);
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
    const result = runCli(item.args);
    assert.equal(result.status, 2, item.args.join(' '));
    assert.match(result.stderr, new RegExp(item.message), item.args.join(' '));
    assert.equal(result.stdout, '', item.args.join(' '));
  }
});

test('CLI uses config format unless an explicit format overrides it', () => {
  const cwd = mkdtempSync(path.join(tmpdir(), 'actionpin-config-'));
  writeFileSync(path.join(cwd, 'actionpin.config.json'), JSON.stringify({ format: 'json' }));

  const fromConfig = runCli(['scan', '.'], cwd);
  assert.equal(fromConfig.status, 0);
  assert.doesNotThrow(() => JSON.parse(fromConfig.stdout));

  const fromCli = runCli(['scan', '.', '--format', 'markdown'], cwd);
  assert.equal(fromCli.status, 0);
  assert.match(fromCli.stdout, /^# ActionPin report/);
});

test('CLI reports explicit config file errors as misuse', () => {
  const cwd = mkdtempSync(path.join(tmpdir(), 'actionpin-config-errors-'));
  writeFileSync(path.join(cwd, 'malformed.json'), '{');
  writeFileSync(path.join(cwd, 'invalid.json'), JSON.stringify({ format: 'xml' }));

  const cases = [
    { file: 'missing.json', message: 'Unable to read config file' },
    { file: 'malformed.json', message: 'Invalid JSON in config file' },
    { file: 'invalid.json', message: 'Invalid config value for "format"' }
  ];
  for (const item of cases) {
    const result = runCli(['scan', '.', '--config', item.file], cwd);
    assert.equal(result.status, 2, item.file);
    assert.match(result.stderr, new RegExp(item.message), item.file);
    assert.equal(result.stdout, '', item.file);
  }
});
