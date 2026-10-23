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

  it('sets thumbnailUrl from the YouTube id', () => {
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
    expect(result.thumbnailUrl).toBe(
      'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg'
    );
  });

  it('uses the site default when there is no published summary', () => {
    const result = buildTalkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      talk: { title: 'The Cross' },
      talkSlug: 'the-cross',
    });

    expect(result.description).toBe(site.description);
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
