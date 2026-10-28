import { site } from '@/configs/site';
import { describe, expect, it } from '@/test';

import { buildTalkJsonLd } from './talk-json-ld';

const speaker = { firstName: 'Martyn', lastName: 'Lloyd-Jones' };

describe('buildTalkJsonLd', () => {
  it('uses the talk page url and speaker as creator', () => {
    const result = buildTalkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      talk: { title: 'The Cross' },
      talkSlug: 'the-cross',
    });

    expect(result.creator).toEqual({
      '@type': 'Person',
      name: 'Martyn Lloyd-Jones',
      url: 'https://www.gettreadtalks.com/speakers/lloyd-jones',
    });
    expect(result.url).toBe(
      'https://www.gettreadtalks.com/talks/lloyd-jones/the-cross'
    );
  });

  it('uses _creationTime for uploadDate when publishedAt is missing', () => {
    const result = buildTalkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      talk: { _creationTime: Date.UTC(2019, 5, 1), title: 'The Cross' },
      talkSlug: 'the-cross',
    });

    expect(result.uploadDate).toBe('2019-06-01T00:00:00.000Z');
  });

  it('prefers publishedAt over _creationTime for uploadDate', () => {
    const result = buildTalkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      talk: {
        _creationTime: Date.UTC(2019, 5, 1),
        publishedAt: Date.UTC(2020, 0, 15),
        title: 'The Cross',
      },
      talkSlug: 'the-cross',
    });

    expect(result.uploadDate).toBe('2020-01-15T00:00:00.000Z');
  });

  it('omits creator and uploadDate when those fields are missing', () => {
    const result = buildTalkJsonLd({
      speaker: null,
      speakerSlug: 'lloyd-jones',
      talk: { title: 'The Cross' },
      talkSlug: 'the-cross',
    });

    expect('creator' in result).toBe(false);
    expect('uploadDate' in result).toBe(false);
  });

  it('includes Google VideoObject required fields for a YouTube talk', () => {
    const summary =
      'This talk traces Romans 3 at length to show that justification is a gift.';
    const result = buildTalkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      summary,
      talk: {
        mediaUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        publishedAt: Date.UTC(2020, 0, 15),
        title: 'The Cross',
      },
      talkSlug: 'the-cross',
    });

    expect(result).toEqual(
      expect.objectContaining({
        '@type': 'VideoObject',
        description: summary,
        embedUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
        name: 'The Cross',
        thumbnailUrl: [
          'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg',
          'https://www.gettreadtalks.com/talks/lloyd-jones/the-cross/opengraph-image',
        ],
        uploadDate: '2020-01-15T00:00:00.000Z',
      })
    );
    expect(result).not.toHaveProperty('contentUrl');
  });

  it('uses AudioObject for audio talks and omits VideoObject otherwise', () => {
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

    expect(audio).toEqual(
      expect.objectContaining({
        '@type': 'AudioObject',
        contentUrl: 'https://example.com/talk.mp3',
      })
    );
    expect(unknown['@type']).toBe('CreativeWork');
    expect(missing['@type']).toBe('CreativeWork');
  });

  it('uses a unique fallback when there is no published summary', () => {
    const result = buildTalkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      talk: { title: 'The Cross' },
      talkSlug: 'the-cross',
    });

    expect(result.description).toBe(
      `The Cross by Martyn Lloyd-Jones. ${site.description}`
    );
  });

  it('uses the full published summary when it is present', () => {
    const summary =
      'This talk traces Romans 3 at length to show that justification is a gift, not a wage, and that this published summary must stay whole in JSON-LD even when it is longer than a typical meta description.';

    const result = buildTalkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      summary,
      talk: { title: 'The Cross' },
      talkSlug: 'the-cross',
    });

    expect(result.description).toBe(summary);
  });
});
