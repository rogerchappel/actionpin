import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, mergeConfig } from '../src/config.js';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

test('config merge prefers explicit CLI settings', () => {
  const config = mergeConfig({ failOn: 'low', ignoreRules: ['a'], format: 'json' }, { root: '/tmp/x', failOn: 'high', ignoreRules: ['b'] });
  assert.equal(config.failOn, 'high');
  assert.deepEqual(config.ignoreRules, ['a', 'b']);
  assert.equal(config.format, 'json');
});

test('optional default config files may be absent', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'actionpin-no-config-'));
  assert.deepEqual(await loadConfig(root), {});
});

test('config fields reject invalid values', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'actionpin-invalid-config-'));
  const cases = [
    [{ format: 'xml' }, 'format'],
    [{ failOn: 42 }, 'failOn'],
    [{ ignoreRules: ['valid', 42] }, 'ignoreRules']
  ] as const;
  for (const [value, field] of cases) {
    const configPath = path.join(root, `${field}.json`);
    await writeFile(configPath, JSON.stringify(value));
    await assert.rejects(loadConfig(root, configPath), new RegExp(`Invalid config value for "${field}"`));
  }
});
