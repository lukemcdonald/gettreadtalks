import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';

describe('listClipSlugs', () => {
  it('omits published clips whose parent talk is unpublished', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const clips = await t.query(api.clips.listClipSlugs, {});
    const slugs = clips.map((clip) => clip.slug).toSorted();

    expect(slugs).toEqual([
      visibilitySlugs.clipOnPublishedTalk,
      visibilitySlugs.standaloneClip,
    ]);
    expect(slugs).not.toContain(visibilitySlugs.clipOnDraftTalk);
  });
});
