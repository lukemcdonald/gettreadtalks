import { describe, expect, it } from '@/test';

import {
  buildTalkListItemsJsonLd,
  buildTalkPath,
  buildTalksPath,
  formatTalkMetaDescription,
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

describe('formatTalkMetaDescription', () => {
  it('includes scripture and topics when they are present', () => {
    expect(
      formatTalkMetaDescription({
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
      formatTalkMetaDescription({
        speakerName: 'Martyn Lloyd-Jones',
      })
    ).toBe('A talk by Martyn Lloyd-Jones.');
  });

  it('omits scripture and topics when they are missing', () => {
    expect(
      formatTalkMetaDescription({
        description: 'A sermon on justification.',
        speakerName: 'Martyn Lloyd-Jones',
      })
    ).toBe('A sermon on justification.');
  });
});
