import { describe, expect, it } from '@/test';

import { talkListItemsJsonLd } from './utils';

describe('talkListItemsJsonLd', () => {
  it('uses a talk url when the speaker is present', () => {
    const [item] = talkListItemsJsonLd([
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
    const [item] = talkListItemsJsonLd([
      { slug: 'orphan', speaker: null, title: 'Orphan talk' },
    ]);

    if (!item) {
      throw new Error('expected list item');
    }

    expect(item.position).toBe(1);
    expect(item.url).toBeUndefined();
  });
});
