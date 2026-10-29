import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  signInAs,
  visibilitySlugs,
} from '../../test.setup';
import { insertSpeaker } from '../speakers/test.factory';
import { insertTalk } from '../talks/test.factory';
import { insertCollection } from './test.factory';

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

describe('listAllCollections', () => {
  it('searches collection titles and counts talks of every status', async () => {
    const t = createConvexTest();
    const { asUser } = await signInAs(t, {
      email: 'admin@example.test',
      name: 'Admin',
      role: 'admin',
    });

    await t.run(async (ctx) => {
      const speakerId = await insertSpeaker(ctx, {
        slug: 'zebedee-collection-speaker',
      });
      const collectionId = await insertCollection(ctx, {
        slug: 'zebedee-collection-search',
        title: 'Zebedee Collection Search',
      });
      await insertCollection(ctx, {
        slug: 'other-collection-search',
        title: 'Other Collection',
      });
      await insertTalk(ctx, {
        collectionId,
        slug: 'zebedee-published-talk',
        speakerId,
        title: 'Published in Zebedee',
      });
      await insertTalk(ctx, {
        collectionId,
        slug: 'zebedee-backlog-talk',
        speakerId,
        status: 'backlog',
        title: 'Backlog in Zebedee',
      });
    });

    const result = await asUser.query(api.collections.listAllCollections, {
      paginationOpts: {
        cursor: null,
        numItems: 20,
      },
      search: 'Zebedee',
    });

    expect(result.page).toEqual([
      expect.objectContaining({
        collection: expect.objectContaining({
          slug: 'zebedee-collection-search',
        }),
        status: 'published',
        talkCount: 2,
      }),
    ]);
  });
});
