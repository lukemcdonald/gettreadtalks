import { describe, expect, it } from '@/test';

import {
  buildTalkListItemsJsonLd,
  buildTalkPath,
  buildTalksPath,
  formatTalkMetaDescription,
  formatTranscriptFetchFailure,
  isTranscriptFetchCoolingDown,
} from './utils';

describe('buildTalkPath', () => {
  it('nests the talk under the speaker slug', () => {
    expect(
      buildTalkPath({
        speaker: { slug: 'lloyd-jones' },
        slug: 'the-cross',
      })
    ).toBe('/talks/lloyd-jones/the-cross');
  });

  it('falls back to the talk slug when speaker is missing', () => {
    expect(buildTalkPath({ slug: 'orphan' })).toBe('/talks/orphan');
  });
});

describe('buildTalksPath', () => {
  it('appends a featured query when requested', () => {
    expect(buildTalksPath({ query: { featured: true } })).toBe(
      '/talks?featured=true'
    );
  });
});

describe('buildTalkListItemsJsonLd', () => {
  it('uses a talk url when the speaker is present', () => {
    const [item] = buildTalkListItemsJsonLd([
      {
        slug: 'the-cross',
        speaker: { slug: 'lloyd-jones' },
        title: 'The Cross',
      },
    ]);

    if (!item) {
      throw new Error('expected list item');
    }

    expect(item.position).toBe(1);
    expect(item.url).toBe(
      'https://www.gettreadtalks.com/talks/lloyd-jones/the-cross'
    );
  });

  it('omits the talk url when the speaker is missing', () => {
    const [item] = buildTalkListItemsJsonLd([
      { slug: 'orphan', speaker: null, title: 'Orphan talk' },
    ]);

    if (!item) {
      throw new Error('expected list item');
    }

    expect(item.position).toBe(1);
    expect(item.url).toBeUndefined();
  });
});

describe('formatTalkMetaDescription', () => {
  it('includes scripture and topics when they are present', () => {
    expect(
      formatTalkMetaDescription({
        description: 'A sermon on justification.',
        scripture: 'Romans 3:21-26',
        speakerName: 'Martyn Lloyd-Jones',
        topicTitles: ['Justification', 'The Gospel'],
      })
    ).toBe(
      'A sermon on justification. Romans 3:21-26 Topics: Justification, The Gospel.'
    );
  });

  it('falls back to the speaker when the talk has no description', () => {
    expect(
      formatTalkMetaDescription({
        speakerName: 'Martyn Lloyd-Jones',
      })
    ).toBe('A talk by Martyn Lloyd-Jones.');
  });

  it('omits scripture and topics when they are missing', () => {
    expect(
      formatTalkMetaDescription({
        description: 'A sermon on justification.',
        speakerName: 'Martyn Lloyd-Jones',
      })
    ).toBe('A sermon on justification.');
  });
});

describe('formatTranscriptFetchFailure', () => {
  it('includes a local retry time with a time zone label', () => {
    const retryAfter = Date.UTC(2026, 10, 21);
    const timeZoneName = new Intl.DateTimeFormat(undefined, {
      timeZoneName: 'short',
    })
      .formatToParts(new Date(retryAfter))
      .find((part) => part.type === 'timeZoneName')?.value;

    expect(timeZoneName).toBeTruthy();
    expect(
      formatTranscriptFetchFailure({
        message: 'The monthly transcript quota has been used up.',
        retryAfter,
      })
    ).toBe(
      `The monthly transcript quota has been used up. Try again after Nov 21, 2026, 12:00 AM ${timeZoneName}.`
    );
  });
});

describe('isTranscriptFetchCoolingDown', () => {
  const now = Date.UTC(2026, 9, 21, 12);

  it('is true while a quota or rate-limit retryAfter is still in the future', () => {
    expect(
      isTranscriptFetchCoolingDown(
        {
          errorCode: 'quota_exhausted',
          retryAfter: now + 1,
          status: 'failed',
        },
        now
      )
    ).toBe(true);
    expect(
      isTranscriptFetchCoolingDown(
        {
          errorCode: 'rate_limited',
          retryAfter: now + 1,
          status: 'failed',
        },
        now
      )
    ).toBe(true);
  });

  it('is false after retryAfter or for other failures', () => {
    expect(
      isTranscriptFetchCoolingDown(
        {
          errorCode: 'rate_limited',
          retryAfter: now,
          status: 'failed',
        },
        now
      )
    ).toBe(false);
    expect(
      isTranscriptFetchCoolingDown(
        {
          errorCode: 'no_captions',
          retryAfter: now + 1,
          status: 'failed',
        },
        now
      )
    ).toBe(false);
  });
});
