import { describe, expect, it } from '@/test';

import {
  buildSharePropsForClip,
  buildSharePropsForCollection,
  buildSharePropsForSpeaker,
  buildSharePropsForTalk,
  buildSharePropsForTopic,
} from './share-image';

const speaker = {
  firstName: 'Voddie',
  lastName: 'Baucham',
  ministry: 'Founders Ministries',
  role: 'Pastor',
};

describe('buildSharePropsForTalk', () => {
  it('uses the talk title and a speaker byline', () => {
    expect(
      buildSharePropsForTalk({
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
      buildSharePropsForTalk({
        speaker: {
          firstName: 'Eric',
          lastName: 'Alexander',
        },
        title: 'A Talk',
      }).speaker?.imageUrl
    ).toBeUndefined();
  });

  it('uses role when ministry is missing', () => {
    expect(
      buildSharePropsForTalk({
        speaker: { ...speaker, ministry: undefined },
        title: 'A Talk',
      }).speaker?.detail
    ).toBe('Pastor');
  });

  it('omits speaker fields when there is no speaker', () => {
    expect(buildSharePropsForTalk({ title: 'A Talk' })).toEqual({
      speaker: undefined,
      title: 'A Talk',
    });
  });
});

describe('buildSharePropsForClip', () => {
  it('uses the clip title and a speaker byline', () => {
    expect(
      buildSharePropsForClip({
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
        imageUrl: '/images/speakers/tony-payne.jpg',
        name: 'Tony Payne',
      },
      title: 'Two Ways to Live',
    });
  });
});

describe('buildSharePropsForSpeaker', () => {
  it('uses the name as the title', () => {
    expect(
      buildSharePropsForSpeaker({
        firstName: 'Alistair',
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
});

describe('buildSharePropsForTopic', () => {
  it('uses the topic title and pluralized talk count', () => {
    expect(
      buildSharePropsForTopic({
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
      buildSharePropsForTopic({
        talkCount: 1,
        title: 'Grace',
      }).subtitle
    ).toBe('1 talk');
  });
});

describe('buildSharePropsForCollection', () => {
  it('uses the collection title and pluralized talk count', () => {
    expect(
      buildSharePropsForCollection({
        talkCount: 8,
        title: 'The Place and Posture of Christian Woman',
      })
    ).toEqual({
      subtitle: '8 talks',
      title: 'The Place and Posture of Christian Woman',
    });
  });
});
