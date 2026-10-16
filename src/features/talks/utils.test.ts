import { describe, expect, it } from '@/test';

import {
  buildTalksPath,
  talkListItemsJsonLd,
  talkMetaDescription,
} from './utils';

describe('buildTalksPath', () => {
  it('links to /talks', () => {
    expect(buildTalksPath()).toBe('/talks');
  });
});

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

describe('talkMetaDescription', () => {
  it('includes scripture and topics when they are present', () => {
    expect(
      talkMetaDescription({
        description: 'A sermon on justification.',
        scripture: 'Romans 3:21-26',
        speakerName: 'Martyn Lloyd-Jones',
        topicTitles: ['Justification', 'The Gospel'],
      })
    ).toBe(
      'A sermon on justification. Romans 3:21-26 Topics: Justification, The Gospel.'
    );
  });

  it('falls back to the speaker when the talk has no description', () => {
    expect(
      talkMetaDescription({
        speakerName: 'Martyn Lloyd-Jones',
      })
    ).toBe('A talk by Martyn Lloyd-Jones.');
  });

  it('omits scripture and topics when they are missing', () => {
    expect(
      talkMetaDescription({
        description: 'A sermon on justification.',
        speakerName: 'Martyn Lloyd-Jones',
      })
    ).toBe('A sermon on justification.');
  });
});
