import { describe, expect, it } from 'vitest';

import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';
import { listPublishedTalks, searchPublishedTalks } from './helpers';

describe('listPublishedTalks', () => {
  it('omits unpublished talks', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const talks = await t.query(async (ctx) => await listPublishedTalks(ctx));

    expect(talks.map((talk) => talk.slug)).toEqual([
      visibilitySlugs.publishedTalk,
    ]);
  });
});

describe('searchPublishedTalks', () => {
  it('returns published title matches and omits unpublished ones', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const talks = await t.query(
      async (ctx) => await searchPublishedTalks(ctx, 'Grace', 10)
    );

    expect(talks.map((talk) => talk.slug)).toEqual([
      visibilitySlugs.publishedTalk,
    ]);
  });
});
