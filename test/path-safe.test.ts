import test from 'node:test';
import assert from 'node:assert/strict';
import { discoverWorkflowFiles, ensureInside } from '../src/path-safe.js';

test('workflow discovery finds yaml fixtures and blocks outside paths', async () => {
  const files = await discoverWorkflowFiles(['fixtures/good-workflows'], process.cwd());
  assert.ok(files.some((file) => file.endsWith('ci.yml')));
  assert.throws(() => ensureInside(process.cwd(), '/tmp/actionpin-outside.yml'), /outside/);
});
