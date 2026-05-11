import test from 'node:test';
import assert from 'node:assert/strict';
import { severityMeets, normalizeSeverity } from '../src/severity.js';

test('severity thresholds are ordered', () => {
  assert.equal(severityMeets('high', 'medium'), true);
  assert.equal(severityMeets('low', 'medium'), false);
  assert.equal(normalizeSeverity('CRITICAL'), 'critical');
});
