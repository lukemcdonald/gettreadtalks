import { describe, expect, it } from '@/test';

import { formatTopicTalkCountPhrase } from './topic-talks-description';

describe('formatTopicTalkCountPhrase', () => {
  it('uses this/talk for one and these N/talks otherwise', () => {
    expect(formatTopicTalkCountPhrase(1)).toBe('this Christ centered talk');
    expect(formatTopicTalkCountPhrase(2)).toBe('these 2 Christ centered talks');
  });
});
