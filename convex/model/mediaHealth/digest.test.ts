import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildMediaHealthDigest, getMediaAdminPath } from './digest.ts';

test('two transitions produce one digest that includes both titles', () => {
  const digest = buildMediaHealthDigest([
    {
      adminPath: '/talks/edit/talk1',
      entityTable: 'talks',
      mediaUrl: 'https://www.youtube.com/watch?v=abc',
      newStatus: 'private',
      previousStatus: 'ok',
      title: 'First Talk',
    },
    {
      adminPath: '/clips/edit/clip1',
      entityTable: 'clips',
      mediaUrl: 'https://vimeo.com/1',
      newStatus: 'missing',
      previousStatus: 'ok',
      title: 'Second Clip',
    },
  ]);

  assert.ok(digest);
  assert.equal(digest.length, 2);
  assert.ok(digest.some((item) => item.title === 'First Talk'));
  assert.ok(digest.some((item) => item.title === 'Second Clip'));
});

test('an empty transition list does not produce a digest', () => {
  assert.equal(buildMediaHealthDigest([]), null);
});

test('admin paths point at existing edit routes', () => {
  assert.equal(getMediaAdminPath('talks', 'talk123'), '/talks/edit/talk123');
  assert.equal(getMediaAdminPath('clips', 'clip123'), '/clips/edit/clip123');
});
