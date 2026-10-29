import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  signInAs,
  visibilitySlugs,
} from '../../test.setup';
import { insertTopic } from './test.factory';

describe('listTopicSlugs', () => {
  it('omits topics with no published talks', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const topics = await t.query(api.topics.listTopicSlugs, {});
    const slugs = topics.map((topic) => topic.slug);

    expect(slugs).toEqual([visibilitySlugs.publishedTopic]);
    expect(slugs).not.toContain(visibilitySlugs.emptyTopic);
    expect(slugs).not.toContain(visibilitySlugs.unpublishedOnlyTopic);
  });
});

describe('listAllTopics', () => {
  it('searches topic titles with the search index', async () => {
    const t = createConvexTest();
    const { asUser } = await signInAs(t, {
      email: 'admin@example.test',
      name: 'Admin',
      role: 'admin',
    });

    await t.run(async (ctx) => {
      await insertTopic(ctx, {
        slug: 'zebedee-topic-search',
        title: 'Zebedee Topic Search',
      });
      await insertTopic(ctx, {
        slug: 'other-topic-search',
        title: 'Other Topic',
      });
    });

    const result = await asUser.query(api.topics.listAllTopics, {
      paginationOpts: {
        cursor: null,
        numItems: 20,
      },
      search: 'Zebedee',
    });

    expect(result.page.map((item) => item.topic.slug)).toEqual([
      'zebedee-topic-search',
    ]);
  });
});
