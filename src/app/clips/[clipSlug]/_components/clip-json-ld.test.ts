import { describe, expect, it } from '@/test';

import { buildClipJsonLd } from './clip-json-ld';

const speaker = {
  firstName: 'Martyn',
  lastName: 'Lloyd-Jones',
  slug: 'lloyd-jones',
};

describe('buildClipJsonLd', () => {
  it('uses the clip page url and speaker as creator', () => {
    const result = buildClipJsonLd({
      clip: { slug: 'the-cross-clip', title: 'The Cross clip' },
      speaker,
      talk: null,
    });

    expect(result.creator).toEqual({
      '@type': 'Person',
      name: 'Martyn Lloyd-Jones',
      url: 'https://www.gettreadtalks.com/speakers/lloyd-jones',
    });
    expect(result.url).toBe(
      'https://www.gettreadtalks.com/clips/the-cross-clip'
    );
  });

  it('adds ISO uploadDate when publishedAt is present', () => {
    const result = buildClipJsonLd({
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

  it('uses AudioObject for audio clips and omits VideoObject otherwise', () => {
    const audio = buildClipJsonLd({
      clip: {
        mediaUrl: 'https://example.com/clip.mp3',
        slug: 'the-cross-clip',
        title: 'The Cross clip',
      },
      speaker,
      talk: null,
    });
    const unknown = buildClipJsonLd({
      clip: {
        mediaUrl: 'https://example.com/notes',
        slug: 'the-cross-clip',
        title: 'The Cross clip',
      },
      speaker,
      talk: null,
    });

    expect(audio['@type']).toBe('AudioObject');
    expect(unknown['@type']).toBe('CreativeWork');
  });

  it('omits creator and uploadDate when those fields are missing', () => {
    const result = buildClipJsonLd({
      clip: { slug: 'the-cross-clip', title: 'The Cross clip' },
      speaker: null,
      talk: null,
    });

    expect('creator' in result).toBe(false);
    expect('uploadDate' in result).toBe(false);
  });

  it('links the parent talk only when both talk and speaker are present', () => {
    const withTalk = buildClipJsonLd({
      clip: { slug: 'the-cross-clip', title: 'The Cross clip' },
      speaker,
      talk: { slug: 'the-cross', title: 'The Cross' },
    });
    const withoutTalk = buildClipJsonLd({
      clip: { slug: 'the-cross-clip', title: 'The Cross clip' },
      speaker,
      talk: null,
    });
    const withoutSpeaker = buildClipJsonLd({
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
