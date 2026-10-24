import { describe, expect, it } from '@/test';

import {
  buildTalkListItemsJsonLd,
  buildTalkPath,
  buildTalksPath,
  formatTalkMetaDescription,
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

describe('isTranscriptFetchCoolingDown', () => {
  const retryAfter = Date.UTC(2026, 9, 24, 20, 0, 0);
  const now = retryAfter - 1000;

  it('treats legacy and new cooldown codes as the same', () => {
    expect(
      isTranscriptFetchCoolingDown(
        {
          errorCode: 'quota_exhausted',
          retryAfter,
          status: 'failed',
        },
        now
      )
    ).toBe(true);
    expect(
      isTranscriptFetchCoolingDown(
        {
          errorCode: 'QUOTA_EXHAUSTED',
          retryAfter,
          status: 'failed',
        },
        now
      )
    ).toBe(true);
    expect(
      isTranscriptFetchCoolingDown(
        {
          errorCode: 'rate_limited',
          retryAfter,
          status: 'failed',
        },
        now
      )
    ).toBe(true);
    expect(
      isTranscriptFetchCoolingDown(
        {
          errorCode: 'RATE_LIMITED',
          retryAfter,
          status: 'failed',
        },
        now
      )
    ).toBe(true);
  });
});

describe('formatTalkMetaDescription', () => {
  it('returns nothing when there is no published summary', () => {
    expect(formatTalkMetaDescription(null)).toBeUndefined();
    expect(formatTalkMetaDescription('   ')).toBeUndefined();
  });

  it('collapses whitespace and keeps a short summary whole', () => {
    expect(
      formatTalkMetaDescription('Justification is a gift,\n\nnot a wage.')
    ).toBe('Justification is a gift, not a wage.');
  });

  it('trims a long summary to 160 characters at a word boundary', () => {
    const summary =
      'This talk traces Romans 3 at length to show that justification is a gift, not a wage, and that this published summary must stay whole in JSON-LD even when it is longer than a typical meta description.';

    expect(formatTalkMetaDescription(summary)).toBe(
      'This talk traces Romans 3 at length to show that justification is a gift, not a wage, and that this published summary must stay whole in JSON-LD even when it is'
    );
    expect(formatTalkMetaDescription(summary)?.length).toBeLessThanOrEqual(160);
  });
});
