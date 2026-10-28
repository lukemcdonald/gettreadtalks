import type { TalkId } from '@/features/talks/types';

import { describe, expect, it } from '@/test';

import {
  buildTalkEditPath,
  buildTalkListItemsJsonLd,
  buildTalkPath,
  buildTalksPath,
  formatTalkMetaDescription,
  formatTalkMetaTitle,
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

    expect(item.item).toBe(
      'https://www.gettreadtalks.com/talks/lloyd-jones/the-cross'
    );
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

describe('formatTalkMetaTitle', () => {
  it('includes the speaker when the combined title stays within 60 characters', () => {
    expect(formatTalkMetaTitle('The Cross', 'Martyn Lloyd-Jones')).toBe(
      'The Cross | Martyn Lloyd-Jones'
    );
  });

  it('drops the speaker when adding them would exceed the title limit', () => {
    expect(
      formatTalkMetaTitle('Confronting the Woke Church', 'Martyn Lloyd-Jones')
    ).toBe('Confronting the Woke Church');
  });
});

describe('formatTalkMetaDescription', () => {
  it('returns nothing when there is no published summary or talk', () => {
    expect(formatTalkMetaDescription(null)).toBeUndefined();
    expect(formatTalkMetaDescription('   ')).toBeUndefined();
  });

  it('falls back to a unique description when the summary is missing', () => {
    expect(
      formatTalkMetaDescription(null, {
        speakerName: 'Martyn Lloyd-Jones',
        title: 'The Cross',
      })
    ).toBe(
      'The Cross is a Christ centered talk by Martyn Lloyd-Jones. Christ centered sermons to elevate your spiritual heartbeat.'
    );
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
