import type { TalkId } from '@/features/talks/types';

import { describe, expect, it } from '@/test';

import {
  buildTalkEditPath,
  buildTalkListItemsJsonLd,
  buildTalkPath,
  buildTalksPath,
  formatTalkMetaDescription,
  getEditTalkTab,
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

describe('buildTalkEditPath', () => {
  const talkId = 'talks:the-cross' as TalkId;

  it('builds the content and study edit urls', () => {
    expect(buildTalkEditPath(talkId)).toBe('/talks/edit/talks:the-cross');
    expect(buildTalkEditPath(talkId, 'content')).toBe(
      '/talks/edit/talks:the-cross'
    );
    expect(buildTalkEditPath(talkId, 'study')).toBe(
      '/talks/edit/talks:the-cross/study'
    );
  });
});

describe('getEditTalkTab', () => {
  it('reads the study tab from the edit url', () => {
    expect(getEditTalkTab('/talks/edit/talks:the-cross')).toBe('content');
    expect(getEditTalkTab('/talks/edit/talks:the-cross/study')).toBe('study');
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

    expect(item.item).toMatch(/^https:\/\//u);
    expect(item.url).toMatch(/^https:\/\//u);
  });

  it('omits the talk url when the speaker is missing', () => {
    const [item] = buildTalkListItemsJsonLd([
      { slug: 'orphan', speaker: null, title: 'Orphan talk' },
    ]);

    if (!item) {
      throw new Error('expected list item');
    }

    expect(item.url).toBeUndefined();
  });
});

describe('isTranscriptFetchCoolingDown', () => {
  const retryAfter = Date.UTC(2026, 9, 24, 20, 0, 0);
  const now = retryAfter - 1000;

  it('cools down quota and rate-limit failures until retryAfter', () => {
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
  it('returns nothing when there is no published summary or talk', () => {
    expect(formatTalkMetaDescription(null)).toBeUndefined();
    expect(formatTalkMetaDescription('   ')).toBeUndefined();
  });

  it('collapses whitespace and keeps a short summary whole', () => {
    expect(
      formatTalkMetaDescription('Justification is a gift,\n\nnot a wage.')
    ).toBe('Justification is a gift, not a wage.');
  });
});
