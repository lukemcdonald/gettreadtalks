import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getClipUrl } from './utils.ts';

test('clip cards link to /clips/{slug}', () => {
  assert.equal(getClipUrl('you-will-suffer'), '/clips/you-will-suffer');
});
