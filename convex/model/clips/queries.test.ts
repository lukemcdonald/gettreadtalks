import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  signInAs,
  visibilitySlugs,
} from '../../test.setup';

describe('listAllClips', () => {
  it('includes the parent talk title for manage lists', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);
    const { asUser } = await signInAs(t, {
      email: 'admin@example.test',
      name: 'Admin',
      role: 'admin',
    });

    const result = await asUser.query(api.clips.listAllClips, {
      paginationOpts: {
        cursor: null,
        numItems: 20,
      },
      status: 'all',
    });
    const clip = result.page.find(
      (item) => item.slug === visibilitySlugs.clipOnPublishedTalk
    );

    expect(clip?.talkTitle).toBe('Grace Abounding');
  });
});

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

describe('getClipBySlug', () => {
  it.fails('returns a published clip on a published talk and hides a clip whose parent talk is unpublished', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const published = await t.query(api.clips.getClipBySlug, {
      slug: visibilitySlugs.clipOnPublishedTalk,
    });
    const unpublishedParent = await t.query(api.clips.getClipBySlug, {
      slug: visibilitySlugs.clipOnDraftTalk,
    });

    expect(published?.clip.slug).toBe(visibilitySlugs.clipOnPublishedTalk);
    expect(unpublishedParent).toBeNull();
  });
});
