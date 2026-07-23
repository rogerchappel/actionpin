import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { discoverWorkflowFiles, ensureInside } from '../src/path-safe.js';

test('workflow discovery finds yaml fixtures and blocks outside paths', async () => {
  const files = await discoverWorkflowFiles(['fixtures/good-workflows'], process.cwd());
  assert.ok(files.some((file) => file.endsWith('ci.yml')));
  assert.throws(() => ensureInside(process.cwd(), '/tmp/actionpin-outside.yml'), /outside/);
});

test('workflow discovery rejects a file symlink that escapes the scan root', async () => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'actionpin-path-safe-'));
  const root = path.join(sandbox, 'repo');
  const outside = path.join(sandbox, 'secret-workflow.yml');

  try {
    await fs.mkdir(root);
    await fs.writeFile(outside, 'name: TOP_SECRET_WORKFLOW_CONTENT\n');
    await fs.symlink(outside, path.join(root, 'leak.yml'));

    await assert.rejects(
      discoverWorkflowFiles(['leak.yml'], root),
      (error: unknown) => {
        assert.match(String(error), /resolves outside the requested root/);
        assert.doesNotMatch(String(error), /secret-workflow|TOP_SECRET/);
        return true;
      },
    );
  } finally {
    await fs.rm(sandbox, { recursive: true, force: true });
  }
});

test('workflow discovery rejects a directory symlink that escapes the scan root', async () => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'actionpin-path-safe-'));
  const root = path.join(sandbox, 'repo');
  const workflows = path.join(root, '.github', 'workflows');
  const outside = path.join(sandbox, 'private-workflows');

  try {
    await fs.mkdir(workflows, { recursive: true });
    await fs.mkdir(outside);
    await fs.writeFile(path.join(outside, 'private.yml'), 'name: TOP_SECRET_DIRECTORY_CONTENT\n');
    await fs.symlink(outside, path.join(workflows, 'linked'));

    await assert.rejects(
      discoverWorkflowFiles(['.github/workflows'], root),
      (error: unknown) => {
        assert.match(String(error), /resolves outside the requested root/);
        assert.doesNotMatch(String(error), /private-workflows|TOP_SECRET/);
        return true;
      },
    );
  } finally {
    await fs.rm(sandbox, { recursive: true, force: true });
  }
});

test('workflow discovery follows symlinks that remain inside the scan root', async () => {
  const sandbox = await fs.mkdtemp(path.join(os.tmpdir(), 'actionpin-path-safe-'));
  const root = path.join(sandbox, 'repo');
  const workflows = path.join(root, '.github', 'workflows');

  try {
    await fs.mkdir(workflows, { recursive: true });
    await fs.writeFile(path.join(workflows, 'ci.yml'), 'name: CI\n');
    await fs.symlink('ci.yml', path.join(workflows, 'linked.yml'));

    const files = await discoverWorkflowFiles(['.github/workflows/linked.yml'], root);
    assert.deepEqual(files, [path.join(workflows, 'linked.yml')]);
  } finally {
    await fs.rm(sandbox, { recursive: true, force: true });
  }
});
