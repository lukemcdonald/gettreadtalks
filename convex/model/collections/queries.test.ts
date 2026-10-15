import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';

describe('listPublishedCollections', () => {
  it('omits empty collections and collections with only unpublished talks', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const collections = await t.query(
      api.collections.listPublishedCollections,
      {}
    );
    const slugs = collections.map((collection) => collection.slug);

    expect(slugs).toEqual([visibilitySlugs.publishedCollection]);
    expect(slugs).not.toContain(visibilitySlugs.emptyCollection);
    expect(slugs).not.toContain(visibilitySlugs.unpublishedOnlyCollection);
  });
});
