import assert from 'node:assert/strict';
import { test } from 'node:test';

import { talkListItemsJsonLd } from './utils.ts';

test('uses a talk url when the speaker is present', () => {
  const [item] = talkListItemsJsonLd([
    {
      speaker: { slug: 'lloyd-jones' },
      slug: 'the-cross',
      title: 'The Cross',
    },
  ]);

  assert.equal(item?.position, 1);
  assert.equal(
    item?.url,
    'https://www.gettreadtalks.com/talks/lloyd-jones/the-cross'
  );
});

test('omits the talk url when the speaker is missing', () => {
  const [item] = talkListItemsJsonLd([
    { speaker: null, slug: 'orphan', title: 'Orphan talk' },
  ]);

  assert.equal(item?.position, 1);
  assert.equal(item?.url, undefined);
});
