import type { Speaker } from '@/features/speakers/types';

import { describe, expect, it } from '@/test';

import { groupSpeakersByLastName } from './utils';

describe('groupSpeakersByLastName', () => {
  it('groups speakers by last-name letter', () => {
    const speakers = [
      { lastName: 'Adams' },
      { lastName: 'White' },
    ] as Speaker[];
    const groups = groupSpeakersByLastName(speakers);

    expect(groups.map((group) => group.letter)).toEqual(['A', 'W']);
    expect(groups.map((group) => group.items)).toEqual([
      [{ lastName: 'Adams' }],
      [{ lastName: 'White' }],
    ]);
  });
});
