import { describe, expect, it } from '@/test';

import { buildTalkJsonLd } from './talk-json-ld';

const speaker = { firstName: 'Martyn', lastName: 'Lloyd-Jones' };

describe('buildTalkJsonLd', () => {
  it('gives VideoObject a thumbnail, a playback url, and an absolute page url', () => {
    const result = buildTalkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      talk: {
        mediaUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        title: 'The Cross',
      },
      talkSlug: 'the-cross',
    });

    expect(result['@type']).toBe('VideoObject');
    expect('thumbnailUrl' in result).toBe(true);
    expect('embedUrl' in result || 'contentUrl' in result).toBe(true);
    expect(result.url).toMatch(/^https:\/\//u);
  });

  it('uses AudioObject for audio and CreativeWork when media is missing or unknown', () => {
    const audio = buildTalkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      talk: {
        mediaUrl: 'https://example.com/talk.mp3',
        title: 'The Cross',
      },
      talkSlug: 'the-cross',
    });
    const unknown = buildTalkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      talk: {
        mediaUrl: 'https://example.com/notes',
        title: 'The Cross',
      },
      talkSlug: 'the-cross',
    });
    const missing = buildTalkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      talk: { title: 'The Cross' },
      talkSlug: 'the-cross',
    });

    expect(audio['@type']).toBe('AudioObject');
    expect(unknown['@type']).toBe('CreativeWork');
    expect(missing['@type']).toBe('CreativeWork');
  });
});
