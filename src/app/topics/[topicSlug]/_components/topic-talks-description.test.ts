import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { topicTalkCountPhrase } from './topic-talks-description.ts';

describe('topicTalkCountPhrase', () => {
  test('uses this/talk for one and these N/talks otherwise', () => {
    assert.equal(topicTalkCountPhrase(1), 'this Christ centered talk');
    assert.equal(topicTalkCountPhrase(2), 'these 2 Christ centered talks');
  });
});
