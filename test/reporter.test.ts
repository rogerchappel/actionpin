import test from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown, renderRules } from '../src/reporters.js';

test('reporters produce stable readable output', () => {
  const md = renderMarkdown({ ok: true, scannedFiles: ['a.yml'], findings: [], generatedAt: new Date(0).toISOString() });
  assert.match(md, /ActionPin report/);
  assert.match(md, /No findings/);
  assert.match(renderRules(), /actions\.unpinned/);
});
