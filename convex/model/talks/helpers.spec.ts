import { describe, expect, test } from 'vitest';

import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';
import { listPublishedTalks, searchPublishedTalks } from './helpers';

describe('listPublishedTalks', () => {
  test('omits unpublished talks', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const talks = await t.query(async (ctx) => await listPublishedTalks(ctx));

    expect(talks.map((talk) => talk.slug)).toEqual([
      visibilitySlugs.publishedTalk,
    ]);
  });
});

describe('searchPublishedTalks', () => {
  test('returns published title matches and omits unpublished ones', async () => {
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
