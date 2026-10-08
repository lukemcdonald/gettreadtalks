import assert from 'node:assert/strict';
import { test } from 'node:test';

import { uniqueSpeakersFromTalks } from './unique-speakers.ts';

test('skips missing speakers and keeps one entry per id', () => {
  const lloydJones = { _id: 'mlj', slug: 'lloyd-jones' };
  const lloydJonesAgain = { _id: 'mlj', slug: 'mlj-trust' };
  const bunyan = { _id: 'jb', slug: 'bunyan' };

  assert.deepEqual(
    uniqueSpeakersFromTalks([
      { speaker: lloydJones },
      { speaker: null },
      { speaker: bunyan },
      { speaker: lloydJonesAgain },
    ]).map((speaker) => speaker._id),
    ['mlj', 'jb']
  );
});
