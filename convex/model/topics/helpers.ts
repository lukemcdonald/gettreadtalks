import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';

import { getManyFrom } from 'convex-helpers/server/relationships';

import { filterTopicsWithPublishedTalks } from '../../lib/filters';

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

/** Distinct topics covered by a speaker's published talks, sorted by title. */
export async function listPublishedTopicsForSpeaker(
  ctx: QueryCtx,
  speakerId: Id<'speakers'>
) {
  const talks = await ctx.db
    .query('talks')
    .withIndex('by_speakerId_and_status', (q) =>
      q.eq('speakerId', speakerId).eq('status', 'published')
    )
    .collect();

  return await listPublishedTopicsForTalks(
    ctx,
    talks.map((talk) => talk._id)
  );
}
