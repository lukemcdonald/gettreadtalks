import assert from 'node:assert/strict';
import { test } from 'node:test';

import { topicTalkCountPhrase } from './topic-talks-description.ts';

test('uses this/talk for one and these N/talks otherwise', () => {
  assert.equal(topicTalkCountPhrase(1), 'this Christ centered talk');
  assert.equal(topicTalkCountPhrase(0), 'these 0 Christ centered talks');
  assert.equal(topicTalkCountPhrase(2), 'these 2 Christ centered talks');
});
