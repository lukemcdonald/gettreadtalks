import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';

describe('searchSite', () => {
  it('returns published title matches and omits unpublished ones', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const result = await t.query(api.search.searchSite, {
      query: 'Grace',
    });

    expect(result.talks.map((talk) => talk.slug)).toEqual([
      visibilitySlugs.publishedTalk,
    ]);
    expect(result.talks[0]?.scripture).toBe('Romans 5:1-2');
  });

  it('returns published clips and omits those whose parent talk is unpublished', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const result = await t.query(api.search.searchSite, {
      query: 'Grace',
    });

    expect(result.clips.map((clip) => clip.slug).toSorted()).toEqual([
      visibilitySlugs.clipOnPublishedTalk,
      visibilitySlugs.standaloneClip,
    ]);
    expect(
      result.clips.find(
        (clip) => clip.slug === visibilitySlugs.clipOnPublishedTalk
      )?.scripture
    ).toBe('Romans 5:1-2');
    expect(
      result.clips.find((clip) => clip.slug === visibilitySlugs.standaloneClip)
        ?.scripture
    ).toBeUndefined();
  });
});
