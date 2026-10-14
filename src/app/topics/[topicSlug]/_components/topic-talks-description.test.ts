import { describe, expect, test } from 'vitest';

import { topicTalkCountPhrase } from './topic-talks-description';

describe('topicTalkCountPhrase', () => {
  test('uses this/talk for one and these N/talks otherwise', () => {
    expect(topicTalkCountPhrase(1)).toBe('this Christ centered talk');
    expect(topicTalkCountPhrase(2)).toBe('these 2 Christ centered talks');
  });
});
