import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  checkMediaUrl,
  classifyOEmbedStatus,
  getOEmbedRequest,
} from './oembed.ts';

describe('classifyOEmbedStatus', () => {
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

  test('maps other statuses to unknown', () => {
    assert.equal(classifyOEmbedStatus(503), 'unknown');
    assert.equal(classifyOEmbedStatus(), 'unknown');
  });
});

describe('getOEmbedRequest', () => {
  test('skips non-oEmbed URLs', () => {
    assert.equal(getOEmbedRequest('https://cdn.example.com/talk.mp3'), null);
  });

  test('builds YouTube and Vimeo oEmbed URLs', () => {
    const youtube = getOEmbedRequest(
      'https://www.youtube.com/watch?v=LYncFGsKvCQ'
    );
    const vimeo = getOEmbedRequest('https://vimeo.com/123456789');

    assert.equal(
      youtube?.href,
      'https://www.youtube.com/oembed?format=json&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DLYncFGsKvCQ'
    );
    assert.equal(
      vimeo?.href,
      'https://vimeo.com/api/oembed.json?url=https%3A%2F%2Fvimeo.com%2F123456789'
    );
  });
});

describe('checkMediaUrl', () => {
  test('skips audio', async () => {
    const result = await checkMediaUrl(
      'https://cdn.example.com/talk.mp3',
      (() => Promise.reject(new Error('should not fetch'))) as typeof fetch
    );

    assert.deepEqual(result, { skipped: true });
  });

  test('maps response status and fetch failure', async () => {
    const ok = await checkMediaUrl('https://www.youtube.com/watch?v=abc', (() =>
      Promise.resolve(new Response(null, { status: 200 }))) as typeof fetch);
    const privateVideo = await checkMediaUrl(
      'https://www.youtube.com/watch?v=abc',
      (() =>
        Promise.resolve(new Response(null, { status: 403 }))) as typeof fetch
    );
    const failed = await checkMediaUrl(
      'https://www.youtube.com/watch?v=abc',
      (() => Promise.reject(new Error('timeout'))) as typeof fetch
    );

    assert.deepEqual(ok, { skipped: false, status: 'ok' });
    assert.deepEqual(privateVideo, { skipped: false, status: 'private' });
    assert.deepEqual(failed, { skipped: false, status: 'unknown' });
  });
});
