import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { getClipUrl } from './utils.ts';

describe('getClipUrl', () => {
  test('links to /clips/{slug}', () => {
    assert.equal(getClipUrl('you-will-suffer'), '/clips/you-will-suffer');
  });
});
