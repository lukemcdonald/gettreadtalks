import { describe, expect, it } from '@/test';

import { buildClipJsonLd } from './clip-json-ld';

const speaker = {
  firstName: 'Martyn',
  lastName: 'Lloyd-Jones',
  slug: 'lloyd-jones',
};

describe('buildClipJsonLd', () => {
  it('uses AudioObject for audio, CreativeWork otherwise, and an absolute page url', () => {
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
    const missing = buildClipJsonLd({
      clip: { slug: 'the-cross-clip', title: 'The Cross clip' },
      speaker,
      talk: null,
    });

    expect(audio['@type']).toBe('AudioObject');
    expect(unknown['@type']).toBe('CreativeWork');
    expect(missing['@type']).toBe('CreativeWork');
    expect(missing.url).toMatch(/^https:\/\//u);
  });
});
