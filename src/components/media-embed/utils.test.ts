import assert from 'node:assert/strict';
import { test } from 'node:test';

import { mediaJsonLd, preferItemsWithVideoThumbnails } from './utils.ts';

test('maps watch pages to player embedUrl and files to contentUrl', () => {
  assert.deepEqual(mediaJsonLd('https://www.youtube.com/watch?v=jNQXAC9IVRw'), {
    '@type': 'VideoObject',
    embedUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
  });
  assert.deepEqual(mediaJsonLd('https://vimeo.com/123456789'), {
    '@type': 'VideoObject',
    embedUrl: 'https://player.vimeo.com/video/123456789',
  });
  assert.deepEqual(mediaJsonLd('https://example.com/talk.mp4'), {
    '@type': 'VideoObject',
    contentUrl: 'https://example.com/talk.mp4',
  });
  assert.deepEqual(mediaJsonLd('https://example.com/talk.mp3'), {
    '@type': 'AudioObject',
    contentUrl: 'https://example.com/talk.mp3',
  });
});

test('uses MediaObject when the URL is missing or not playable media', () => {
  assert.deepEqual(mediaJsonLd(), { '@type': 'MediaObject' });
  assert.deepEqual(mediaJsonLd('https://example.com/notes'), {
    '@type': 'MediaObject',
  });
});

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
