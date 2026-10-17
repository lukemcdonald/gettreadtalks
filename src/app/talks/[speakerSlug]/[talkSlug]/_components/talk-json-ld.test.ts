import { buildTalkUrl, buildTalksPath } from '@/features/talks/utils';
import { buildBreadcrumbJsonLd } from '@/lib/json-ld';
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

  it('adds ISO uploadDate when publishedAt is present', () => {
    const result = buildTalkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      talk: { publishedAt: Date.UTC(2020, 0, 15), title: 'The Cross' },
      talkSlug: 'the-cross',
    });

    expect(result.uploadDate).toBe('2020-01-15T00:00:00.000Z');
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

  it('falls back to title, speaker, and scripture when description is missing', () => {
    const result = buildTalkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      talk: { scripture: 'Romans 3:21-26', title: 'The Cross' },
      talkSlug: 'the-cross',
    });

    expect(result.description).toBe(
      'The Cross by Martyn Lloyd-Jones on Romans 3:21-26'
    );
  });

  it('uses the talk description when it is present', () => {
    const result = buildTalkJsonLd({
      speaker,
      speakerSlug: 'lloyd-jones',
      talk: {
        description: 'A sermon on justification.',
        scripture: 'Romans 3:21-26',
        title: 'The Cross',
      },
      talkSlug: 'the-cross',
    });

    expect(result.description).toBe('A sermon on justification.');
  });
});

describe('talk page BreadcrumbList', () => {
  it('matches the visible Talks / title trail with absolute urls', () => {
    expect(
      buildBreadcrumbJsonLd([
        { href: buildTalksPath(), label: 'Talks' },
        {
          href: buildTalkUrl('lloyd-jones', 'the-cross'),
          label: 'The Cross',
        },
      ])
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          item: 'https://www.gettreadtalks.com/talks',
          name: 'Talks',
          position: 1,
        },
        {
          '@type': 'ListItem',
          item: 'https://www.gettreadtalks.com/talks/lloyd-jones/the-cross',
          name: 'The Cross',
          position: 2,
        },
      ],
    });
  });
});
