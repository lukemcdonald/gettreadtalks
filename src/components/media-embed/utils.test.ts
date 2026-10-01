import assert from 'node:assert/strict';
import { test } from 'node:test';

import { preferItemsWithVideoThumbnails } from './utils.ts';

test('prefers items that have a video thumbnail', () => {
  const items = [
    { mediaUrl: 'https://example.com/talk.mp3', title: 'audio' },
    {
      mediaUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      title: 'video',
    },
  ];

  assert.deepEqual(preferItemsWithVideoThumbnails(items), [items[1]]);
});

test('falls back to the full list when nothing has a thumbnail', () => {
  const items = [
    { mediaUrl: 'https://example.com/talk.mp3', title: 'audio-a' },
    { mediaUrl: 'https://example.com/talk-2.mp3', title: 'audio-b' },
  ];

  assert.deepEqual(preferItemsWithVideoThumbnails(items), items);
});

test('returns empty input unchanged', () => {
  assert.deepEqual(preferItemsWithVideoThumbnails([]), []);
});
