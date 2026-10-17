import { describe, expect, it } from '@/test';

import { getUniqueSpeakersFromTalks } from './unique-speakers';

describe('getUniqueSpeakersFromTalks', () => {
  it('skips missing speakers and keeps one entry per id', () => {
    const lloydJones = { _id: 'mlj', slug: 'lloyd-jones' };
    const lloydJonesAgain = { _id: 'mlj', slug: 'mlj-trust' };
    const bunyan = { _id: 'jb', slug: 'bunyan' };

    expect(
      getUniqueSpeakersFromTalks([
        { speaker: lloydJones },
        { speaker: null },
        { speaker: bunyan },
        { speaker: lloydJonesAgain },
      ]).map((speaker) => speaker._id)
    ).toEqual(['mlj', 'jb']);
  });
});
