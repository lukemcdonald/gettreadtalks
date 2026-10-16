import { describe, expect, it } from '@/test';

import {
  sharePropsForClip,
  sharePropsForCollection,
  sharePropsForSpeaker,
  sharePropsForTalk,
  sharePropsForTopic,
} from './share-image';

const speaker = {
  firstName: 'Voddie',
  imageUrl: '/images/speakers/voddie-baucham.jpg',
  lastName: 'Baucham',
  ministry: 'Founders Ministries',
  role: 'Pastor',
};

describe('sharePropsForTalk', () => {
  it('uses the talk title and a speaker byline', () => {
    expect(
      sharePropsForTalk({
        speaker,
        title: 'Does the Bible Permit A Woman to Preach?',
      })
    ).toEqual({
      speaker: {
        detail: 'Founders Ministries',
        imageUrl: '/images/speakers/voddie-baucham.jpg',
        name: 'Voddie Baucham',
      },
      title: 'Does the Bible Permit A Woman to Preach?',
    });
  });

  it('omits the avatar when the speaker has no photo', () => {
    expect(
      sharePropsForTalk({
        speaker: { ...speaker, imageUrl: undefined },
        title: 'A Talk',
      }).speaker?.imageUrl
    ).toBeUndefined();
  });

  it('uses role when ministry is missing', () => {
    expect(
      sharePropsForTalk({
        speaker: { ...speaker, ministry: undefined },
        title: 'A Talk',
      }).speaker?.detail
    ).toBe('Pastor');
  });

  it('omits speaker fields when there is no speaker', () => {
    expect(sharePropsForTalk({ title: 'A Talk' })).toEqual({
      speaker: undefined,
      title: 'A Talk',
    });
  });
});

describe('sharePropsForClip', () => {
  it('uses the clip title and a speaker byline', () => {
    expect(
      sharePropsForClip({
        speaker: {
          firstName: 'Tony',
          lastName: 'Payne',
          ministry: 'Matthias Media',
        },
        title: 'Two Ways to Live',
      })
    ).toEqual({
      speaker: {
        detail: 'Matthias Media',
        imageUrl: undefined,
        name: 'Tony Payne',
      },
      title: 'Two Ways to Live',
    });
  });
});

describe('sharePropsForSpeaker', () => {
  it('uses the name as the title', () => {
    expect(
      sharePropsForSpeaker({
        firstName: 'Alistair',
        imageUrl: '/images/speakers/alistair-begg.jpg',
        lastName: 'Begg',
        ministry: 'Truth For Life',
        role: 'Pastor',
      })
    ).toEqual({
      speaker: {
        detail: 'Truth For Life',
        imageUrl: '/images/speakers/alistair-begg.jpg',
        name: 'Alistair Begg',
      },
      speakerPlacement: 'title',
      title: 'Alistair Begg',
    });
  });

  it('omits the avatar when the speaker has no photo', () => {
    expect(
      sharePropsForSpeaker({
        firstName: 'Alistair',
        lastName: 'Begg',
        ministry: 'Truth For Life',
      }).speaker?.imageUrl
    ).toBeUndefined();
  });

  it('uses role when ministry is missing', () => {
    expect(
      sharePropsForSpeaker({
        firstName: 'Alistair',
        lastName: 'Begg',
        role: 'Pastor',
      }).speaker?.detail
    ).toBe('Pastor');
  });
});

describe('sharePropsForTopic', () => {
  it('uses the topic title and pluralized talk count', () => {
    expect(
      sharePropsForTopic({
        talkCount: 6,
        title: 'Anxiety',
      })
    ).toEqual({
      subtitle: '6 talks',
      title: 'Anxiety',
    });
  });

  it('uses the singular form for one talk', () => {
    expect(
      sharePropsForTopic({
        talkCount: 1,
        title: 'Grace',
      }).subtitle
    ).toBe('1 talk');
  });
});

describe('sharePropsForCollection', () => {
  it('uses the collection title and pluralized talk count', () => {
    expect(
      sharePropsForCollection({
        talkCount: 8,
        title: 'The Place and Posture of Christian Woman',
      })
    ).toEqual({
      subtitle: '8 talks',
      title: 'The Place and Posture of Christian Woman',
    });
  });
});
