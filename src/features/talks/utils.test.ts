import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { talkListItemsJsonLd } from './utils.ts';

describe('talkListItemsJsonLd', () => {
  test('uses a talk url when the speaker is present', () => {
    const [item] = talkListItemsJsonLd([
      {
        slug: 'the-cross',
        speaker: { slug: 'lloyd-jones' },
        title: 'The Cross',
      },
    ]);

    assert.ok(item);
    assert.equal(item.position, 1);
    assert.equal(
      item.url,
      'https://www.gettreadtalks.com/talks/lloyd-jones/the-cross'
    );
  });

  test('omits the talk url when the speaker is missing', () => {
    const [item] = talkListItemsJsonLd([
      { slug: 'orphan', speaker: null, title: 'Orphan talk' },
    ]);

    assert.ok(item);
    assert.equal(item.position, 1);
    assert.equal(item.url, undefined);
  });
});
