import { describe, expect, it } from 'vitest';

import { checkMediaUrl, getOEmbedRequest } from './oembed';

describe('getOEmbedRequest', () => {
  it('skips non-oEmbed URLs', () => {
    expect(getOEmbedRequest('https://cdn.example.com/talk.mp3')).toBe(null);
  });

  it('builds YouTube and Vimeo oEmbed URLs', () => {
    const youtube = getOEmbedRequest(
      'https://www.youtube.com/watch?v=LYncFGsKvCQ'
    );
    const vimeo = getOEmbedRequest('https://vimeo.com/123456789');

    if (!youtube || !vimeo) {
      throw new Error('expected oEmbed requests');
    }

    expect(youtube.href).toBe(
      'https://www.youtube.com/oembed?format=json&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DLYncFGsKvCQ'
    );
    expect(vimeo.href).toBe(
      'https://vimeo.com/api/oembed.json?url=https%3A%2F%2Fvimeo.com%2F123456789'
    );
  });
});

describe('checkMediaUrl', () => {
  it('skips audio', async () => {
    const result = await checkMediaUrl(
      'https://cdn.example.com/talk.mp3',
      (() => Promise.reject(new Error('should not fetch'))) as typeof fetch
    );

    expect(result).toEqual({ skipped: true });
  });

  it('maps response status and fetch failure', async () => {
    const cases = [
      { expected: 'ok', status: 200 },
      { expected: 'private', status: 401 },
      { expected: 'private', status: 403 },
      { expected: 'missing', status: 404 },
      { expected: 'unknown', status: 503 },
    ] as const;

    const results = await Promise.all(
      cases.map(({ status }) =>
        checkMediaUrl('https://www.youtube.com/watch?v=abc', (() =>
          Promise.resolve(new Response(null, { status }))) as typeof fetch)
      )
    );

    expect(results).toEqual(
      cases.map(({ expected }) => ({ skipped: false, status: expected }))
    );

    const failed = await checkMediaUrl(
      'https://www.youtube.com/watch?v=abc',
      (() => Promise.reject(new Error('timeout'))) as typeof fetch
    );

    expect(failed).toEqual({ skipped: false, status: 'unknown' });
  });
});
