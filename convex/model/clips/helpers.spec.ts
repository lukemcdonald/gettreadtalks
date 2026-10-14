import { describe, expect, test } from 'vitest';

import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';
import { listPublishedClips, searchPublishedClips } from './helpers';

describe('listPublishedClips', () => {
  test('omits published clips whose parent talk is unpublished', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const clips = await t.query(async (ctx) => await listPublishedClips(ctx));

    expect(clips.map((clip) => clip.slug).toSorted()).toEqual([
      visibilitySlugs.clipOnPublishedTalk,
      visibilitySlugs.standaloneClip,
    ]);
  });
});

describe('searchPublishedClips', () => {
  test('returns published clips and omits those whose parent talk is unpublished', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const clips = await t.query(
      async (ctx) => await searchPublishedClips(ctx, 'Grace', 10)
    );

    expect(clips.map((clip) => clip.slug).toSorted()).toEqual([
      visibilitySlugs.clipOnPublishedTalk,
      visibilitySlugs.standaloneClip,
    ]);
  });
});
