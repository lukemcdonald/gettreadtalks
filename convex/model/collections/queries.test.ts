import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';

describe('listCollectionSlugs', () => {
  it('omits empty collections and collections with only unpublished talks', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const collections = await t.query(api.collections.listCollectionSlugs, {});
    const slugs = collections.map((collection) => collection.slug);

    expect(slugs).toEqual([visibilitySlugs.publishedCollection]);
    expect(slugs).not.toContain(visibilitySlugs.emptyCollection);
    expect(slugs).not.toContain(visibilitySlugs.unpublishedOnlyCollection);
  });
});

describe('getCollectionBySlug', () => {
  it('returns a collection with published talks and hides a collection whose talks are all unpublished', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const published = await t.query(api.collections.getCollectionBySlug, {
      slug: visibilitySlugs.publishedCollection,
    });
    const unpublishedOnly = await t.query(api.collections.getCollectionBySlug, {
      slug: visibilitySlugs.unpublishedOnlyCollection,
    });

    expect(published?.collection.slug).toBe(
      visibilitySlugs.publishedCollection
    );
    expect(unpublishedOnly).toBeNull();
  });
});
