import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';

describe('listTopics', () => {
  it('omits topics with no published talks', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const topics = await t.query(api.topics.listTopics, {});
    const slugs = topics.map((topic) => topic.slug);

    expect(slugs).toEqual([visibilitySlugs.publishedTopic]);
    expect(slugs).not.toContain(visibilitySlugs.emptyTopic);
    expect(slugs).not.toContain(visibilitySlugs.unpublishedOnlyTopic);
  });
});
