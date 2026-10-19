import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';

describe('searchSite', () => {
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
  });
});
