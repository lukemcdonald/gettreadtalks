import { describe, expect, it } from 'vitest';

import { uniqueSpeakersFromTalks } from './unique-speakers';

describe('uniqueSpeakersFromTalks', () => {
  it('skips missing speakers and keeps one entry per id', () => {
    const lloydJones = { _id: 'mlj', slug: 'lloyd-jones' };
    const lloydJonesAgain = { _id: 'mlj', slug: 'mlj-trust' };
    const bunyan = { _id: 'jb', slug: 'bunyan' };

    expect(
      uniqueSpeakersFromTalks([
        { speaker: lloydJones },
        { speaker: null },
        { speaker: bunyan },
        { speaker: lloydJonesAgain },
      ]).map((speaker) => speaker._id)
    ).toEqual(['mlj', 'jb']);
  });
});
