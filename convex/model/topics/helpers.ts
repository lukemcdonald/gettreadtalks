import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

import { asyncMap } from 'convex-helpers';
import { getManyFrom } from 'convex-helpers/server/relationships';

import { filterTopicsWithPublishedTalks } from '../../lib/filters';

export function toTopicUpdates(fields: {
  description?: string;
  title?: string;
}) {
  const updates = { ...fields };

  if (updates.description === '') {
    updates.description = undefined;
  }

  return updates;
}

const UNFILTERED_SEARCH_MULTIPLIER = 3;

function publishedTopicsQuery(ctx: QueryCtx) {
  return ctx.db.query('topics').withIndex('by_title');
}

export async function listPublishedTopics(ctx: QueryCtx, limit?: number) {
  const topicsQuery = publishedTopicsQuery(ctx);
  const topics =
    limit === undefined
      ? await topicsQuery.collect()
      : await topicsQuery.take(limit);

  return await filterTopicsWithPublishedTalks(ctx, topics);
}

export async function searchTopics(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  return await ctx.db
    .query('topics')
    .withSearchIndex('search_title', (q) => q.search('title', queryText))
    .take(limit);
}

export async function searchPublishedTopics(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  const published = await filterTopicsWithPublishedTalks(
    ctx,
    await searchTopics(ctx, queryText, limit * UNFILTERED_SEARCH_MULTIPLIER)
  );

  return published.slice(0, limit);
}

export async function enrichTopicsForAdmin(
  ctx: QueryCtx,
  topics: Doc<'topics'>[]
) {
  return await asyncMap(topics, async (topic) => {
    const talksOnTopic = await getManyFrom(
      ctx.db,
      'talksOnTopics',
      'by_topicId',
      topic._id
    );

    return {
      talkCount: talksOnTopic.length,
      topic,
    };
  });
}

/** Distinct topics linked to the given talks, sorted by title. */
export async function listPublishedTopicsForTalks(
  ctx: QueryCtx,
  talkIds: Id<'talks'>[]
) {
  if (talkIds.length === 0) {
    return [];
  }

  const joinPages = await Promise.all(
    talkIds.map((talkId) =>
      getManyFrom(ctx.db, 'talksOnTopics', 'by_talkId', talkId)
    )
  );
  const topicIds = [...new Set(joinPages.flat().map((join) => join.topicId))];
  const topics = await Promise.all(
    topicIds.map((topicId) => ctx.db.get('topics', topicId))
  );

  return topics
    .filter((topic): topic is Doc<'topics'> => topic !== null)
    .toSorted((a, b) => a.title.localeCompare(b.title));
}
