import assert from 'node:assert/strict';
import { test } from 'node:test';

import { detectMediaType } from '../../../src/components/media-embed/utils.ts';
import {
  checkMediaUrl,
  classifyOEmbedStatus,
  getOEmbedRequest,
} from './oembed.ts';

test('maps 200 to ok', () => {
  assert.equal(classifyOEmbedStatus(200), 'ok');
});

test('maps YouTube 401 and 403 to private', () => {
  assert.equal(classifyOEmbedStatus(401), 'private');
  assert.equal(classifyOEmbedStatus(403), 'private');
});

test('maps 404 to missing', () => {
  assert.equal(classifyOEmbedStatus(404), 'missing');
});

test('maps abort and 503 to unknown', () => {
  assert.equal(classifyOEmbedStatus(503), 'unknown');
  assert.equal(classifyOEmbedStatus(), 'unknown');
});

test('skips mp3 URLs before fetch', () => {
  assert.equal(getOEmbedRequest('https://cdn.example.com/talk.mp3'), null);
});

test('builds YouTube and Vimeo oEmbed URLs', () => {
  const youtube = getOEmbedRequest(
    'https://www.youtube.com/watch?v=LYncFGsKvCQ'
  );
  const vimeo = getOEmbedRequest('https://vimeo.com/123456789');

  assert.ok(youtube?.href.includes('youtube.com/oembed'));
  assert.ok(youtube?.href.includes('LYncFGsKvCQ'));
  assert.ok(vimeo?.href.includes('vimeo.com/api/oembed.json'));
  assert.ok(vimeo?.href.includes('123456789'));
});

test('agrees with detectMediaType on which URLs are checked', () => {
  const urls = [
    'https://www.youtube.com/watch?v=LYncFGsKvCQ',
    'https://vimeo.com/123456789',
    'https://cdn.example.com/talk.mp3',
    'https://cdn.example.com/talk.mp4',
  ];

  for (const url of urls) {
    const mediaType = detectMediaType(url);
    const request = getOEmbedRequest(url);
    const shouldCheck =
      mediaType.type === 'vimeo' || mediaType.type === 'youtube';

    assert.equal(request !== null, shouldCheck, url);
  }
});

test('checkMediaUrl skips audio before fetch', async () => {
  let called = 0;
  const fetchImpl = (() => {
    called += 1;

    return Promise.resolve(new Response(null, { status: 200 }));
  }) as typeof fetch;

  const result = await checkMediaUrl(
    'https://cdn.example.com/talk.mp3',
    fetchImpl
  );

  assert.deepEqual(result, { skipped: true });
  assert.equal(called, 0);
});

test('checkMediaUrl maps response status and fetch failure', async () => {
  const ok = await checkMediaUrl('https://www.youtube.com/watch?v=abc', (() =>
    Promise.resolve(new Response(null, { status: 200 }))) as typeof fetch);
  const privateVideo = await checkMediaUrl(
    'https://www.youtube.com/watch?v=abc',
    (() => Promise.resolve(new Response(null, { status: 403 }))) as typeof fetch
  );
  const failed = await checkMediaUrl(
    'https://www.youtube.com/watch?v=abc',
    (() => Promise.reject(new Error('timeout'))) as typeof fetch
  );

  assert.deepEqual(ok, { skipped: false, status: 'ok' });
  assert.deepEqual(privateVideo, { skipped: false, status: 'private' });
  assert.deepEqual(failed, { skipped: false, status: 'unknown' });
});
