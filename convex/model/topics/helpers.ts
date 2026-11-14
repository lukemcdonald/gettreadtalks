import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { SearchArgs } from '../search/helpers';

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

export async function listPublishedTopics(
  ctx: QueryCtx,
  args: { limit?: number }
) {
  const topicsQuery = publishedTopicsQuery(ctx);
  const topics =
    args.limit === undefined
      ? await topicsQuery.collect()
      : await topicsQuery.take(args.limit);

  return await filterTopicsWithPublishedTalks(ctx, { topics });
}

export async function searchTopics(ctx: QueryCtx, args: SearchArgs) {
  return await ctx.db
    .query('topics')
    .withSearchIndex('search_title', (q) => q.search('title', args.queryText))
    .take(args.limit);
}

export async function searchPublishedTopics(ctx: QueryCtx, args: SearchArgs) {
  const published = await filterTopicsWithPublishedTalks(ctx, {
    topics: await searchTopics(ctx, {
      limit: args.limit * UNFILTERED_SEARCH_MULTIPLIER,
      queryText: args.queryText,
    }),
  });

  return published.slice(0, args.limit);
}

export async function enrichTopicsForAdmin(
  ctx: QueryCtx,
  args: { topics: Doc<'topics'>[] }
) {
  return await asyncMap(args.topics, async (topic) => {
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
  args: { talkIds: Id<'talks'>[] }
) {
  if (args.talkIds.length === 0) {
    return [];
  }

  const joinPages = await Promise.all(
    args.talkIds.map((talkId) =>
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
