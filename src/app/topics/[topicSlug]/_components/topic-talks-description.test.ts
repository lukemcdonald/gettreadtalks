import { describe, expect, it } from '@/test';

import {
  formatTopicMetaDescription,
  formatTopicPageDescription,
  formatTopicTalkCountPhrase,
} from './topic-talks-description';

describe('formatTopicTalkCountPhrase', () => {
  it('uses this/talk for one and these N/talks otherwise', () => {
    expect(formatTopicTalkCountPhrase(1)).toBe('this Christ centered talk');
    expect(formatTopicTalkCountPhrase(2)).toBe('these 2 Christ centered talks');
  });
});

describe('formatTopicPageDescription', () => {
  it('uses the stored description when set', () => {
    expect(formatTopicPageDescription('Talks on grace.', 4)).toBe(
      'Talks on grace.'
    );
  });

  it('falls back to the talk-count phrase when unset', () => {
    expect(formatTopicPageDescription(undefined, 2)).toBe(
      'Elevate your spiritual heartbeat with these 2 Christ centered talks.'
    );
    expect(formatTopicPageDescription('', 2)).toBe(
      'Elevate your spiritual heartbeat with these 2 Christ centered talks.'
    );
  });
});

describe('formatTopicMetaDescription', () => {
  it('uses the stored description when set', () => {
    expect(formatTopicMetaDescription('Talks on grace.', 'Grace', 4)).toBe(
      'Talks on grace.'
    );
  });

  it('falls back to the talk-count phrase with the title when unset', () => {
    expect(formatTopicMetaDescription(undefined, 'Grace', 1)).toBe(
      'Elevate your spiritual heartbeat with this Christ centered talk on Grace.'
    );
  });
});
