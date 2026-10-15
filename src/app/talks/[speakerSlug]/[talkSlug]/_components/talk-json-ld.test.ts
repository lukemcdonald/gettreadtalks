import { describe, expect, it } from '@/test';

import { talkJsonLd } from './talk-json-ld';

const speaker = { firstName: 'Martyn', lastName: 'Lloyd-Jones' };

describe('talkJsonLd', () => {
  it('uses the talk page url and speaker as creator', () => {
    const result = talkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      talk: { title: 'The Cross' },
      talkSlug: 'the-cross',
    });

    expect(result.creator).toEqual({
      '@type': 'Person',
      name: 'Martyn Lloyd-Jones',
    });
    expect(result.url).toBe(
      'https://www.gettreadtalks.com/talks/lloyd-jones/the-cross'
    );
  });

  it('adds ISO uploadDate when publishedAt is present', () => {
    const result = talkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      talk: { publishedAt: Date.UTC(2020, 0, 15), title: 'The Cross' },
      talkSlug: 'the-cross',
    });

    expect(result.uploadDate).toBe('2020-01-15T00:00:00.000Z');
  });

  it('omits creator and uploadDate when those fields are missing', () => {
    const result = talkJsonLd({
      speaker: null,
      speakerSlug: 'lloyd-jones',
      talk: { title: 'The Cross' },
      talkSlug: 'the-cross',
    });

    expect('creator' in result).toBe(false);
    expect('uploadDate' in result).toBe(false);
  });
});
