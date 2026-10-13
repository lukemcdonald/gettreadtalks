import type { QueryCtx } from '../../_generated/server';

import { filterTopicsWithPublishedTalks } from '../../lib/filters';

const UNFILTERED_SEARCH_MULTIPLIER = 3;

function publishedTopicsQuery(ctx: QueryCtx) {
  return ctx.db.query('topics').withIndex('by_title');
}

export async function listPublishedTopics(ctx: QueryCtx, limit = 100) {
  const topics = await publishedTopicsQuery(ctx).take(limit);

  return await filterTopicsWithPublishedTalks(ctx, topics);
}

export async function searchPublishedTopics(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  const topics = await ctx.db
    .query('topics')
    .withSearchIndex('search_title', (q) => q.search('title', queryText))
    .take(limit * UNFILTERED_SEARCH_MULTIPLIER);
  const published = await filterTopicsWithPublishedTalks(ctx, topics);

  return published.slice(0, limit);
}
