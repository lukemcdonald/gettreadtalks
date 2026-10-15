import { describe, expect, it } from '@/test';

import {
  checkMediaUrl,
  classifyOEmbedStatus,
  getOEmbedRequest,
} from './oembed';

describe('classifyOEmbedStatus', () => {
  it('maps 200 to ok', () => {
    expect(classifyOEmbedStatus(200)).toBe('ok');
  });

  it('maps YouTube 401 and 403 to private', () => {
    expect(classifyOEmbedStatus(401)).toBe('private');
    expect(classifyOEmbedStatus(403)).toBe('private');
  });

  it('maps 404 to missing', () => {
    expect(classifyOEmbedStatus(404)).toBe('missing');
  });

  it('maps other statuses to unknown', () => {
    expect(classifyOEmbedStatus(503)).toBe('unknown');
    expect(classifyOEmbedStatus()).toBe('unknown');
  });
});

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

    expect(ok).toEqual({ skipped: false, status: 'ok' });
    expect(privateVideo).toEqual({ skipped: false, status: 'private' });
    expect(failed).toEqual({ skipped: false, status: 'unknown' });
  });
});
