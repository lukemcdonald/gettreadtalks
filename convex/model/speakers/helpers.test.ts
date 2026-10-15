import { describe, expect, it } from 'vitest';

import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';
import { listPublishedSpeakers } from './helpers';

describe('listPublishedSpeakers', () => {
  it('omits speakers who have no published talks or clips', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const speakers = await t.query(
      async (ctx) => await listPublishedSpeakers(ctx)
    );

    expect(speakers.map((speaker) => speaker.slug)).toEqual([
      visibilitySlugs.publishedSpeaker,
    ]);
  });
});
