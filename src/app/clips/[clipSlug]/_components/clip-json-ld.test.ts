import { describe, expect, test } from 'vitest';

import { clipJsonLd } from './clip-json-ld';

const speaker = {
  firstName: 'Martyn',
  lastName: 'Lloyd-Jones',
  slug: 'lloyd-jones',
};

describe('clipJsonLd', () => {
  test('uses the clip page url and speaker as creator', () => {
    const result = clipJsonLd({
      clip: { slug: 'the-cross-clip', title: 'The Cross clip' },
      speaker,
      talk: null,
    });

    expect(result.creator).toEqual({
      '@type': 'Person',
      name: 'Martyn Lloyd-Jones',
    });
    expect(result.url).toBe(
      'https://www.gettreadtalks.com/clips/the-cross-clip'
    );
  });

  test('adds ISO uploadDate when publishedAt is present', () => {
    const result = clipJsonLd({
      clip: {
        publishedAt: Date.UTC(2024, 0, 15),
        slug: 'the-cross-clip',
        title: 'The Cross clip',
      },
      speaker,
      talk: null,
    });

    expect(result.uploadDate).toBe('2024-01-15T00:00:00.000Z');
  });

  test('omits creator and uploadDate when those fields are missing', () => {
    const result = clipJsonLd({
      clip: { slug: 'the-cross-clip', title: 'The Cross clip' },
      speaker: null,
      talk: null,
    });

    expect('creator' in result).toBe(false);
    expect('uploadDate' in result).toBe(false);
  });

  test('links the parent talk only when both talk and speaker are present', () => {
    const withTalk = clipJsonLd({
      clip: { slug: 'the-cross-clip', title: 'The Cross clip' },
      speaker,
      talk: { slug: 'the-cross', title: 'The Cross' },
    });
    const withoutTalk = clipJsonLd({
      clip: { slug: 'the-cross-clip', title: 'The Cross clip' },
      speaker,
      talk: null,
    });
    const withoutSpeaker = clipJsonLd({
      clip: { slug: 'the-cross-clip', title: 'The Cross clip' },
      speaker: null,
      talk: { slug: 'the-cross', title: 'The Cross' },
    });

    expect(withTalk.isPartOf).toEqual({
      '@type': 'CreativeWork',
      name: 'The Cross',
      url: 'https://www.gettreadtalks.com/talks/lloyd-jones/the-cross',
    });
    expect('isPartOf' in withoutTalk).toBe(false);
    expect('isPartOf' in withoutSpeaker).toBe(false);
  });
});
