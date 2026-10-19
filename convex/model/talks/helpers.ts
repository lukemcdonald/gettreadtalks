import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { PaginationOptions } from 'convex/server';

import { getManyVia } from 'convex-helpers/server/relationships';

import { DEFAULT_SEARCH_LIMIT } from '../search/constants';
import { uniqueById } from '../search/utils';
import { searchPublishedSpeakers } from '../speakers/helpers';

function publishedTalksQuery(ctx: QueryCtx) {
  return ctx.db
    .query('talks')
    .withIndex('by_status_and_publishedAt', (q) => q.eq('status', 'published'))
    .order('desc');
}

export async function listPublishedTalks(ctx: QueryCtx) {
  return await publishedTalksQuery(ctx).collect();
}

export async function listPublishedTalksPage(
  ctx: QueryCtx,
  paginationOpts: PaginationOptions
) {
  return await publishedTalksQuery(ctx).paginate(paginationOpts);
}

function publishedTalksForCollectionQuery(
  ctx: QueryCtx,
  collectionId: Id<'collections'>
) {
  return ctx.db
    .query('talks')
    .withIndex('by_collectionId_and_status', (q) =>
      q.eq('collectionId', collectionId).eq('status', 'published')
    );
}

export async function listPublishedTalksForCollection(
  ctx: QueryCtx,
  collectionId: Id<'collections'>,
  limit?: number
) {
  const talks = publishedTalksForCollectionQuery(ctx, collectionId);

  return await (limit ? talks.take(limit) : talks.collect());
}

export async function listPublishedTalksForTopic(
  ctx: QueryCtx,
  topicId: Id<'topics'>
) {
  const talks = await getManyVia(
    ctx.db,
    'talksOnTopics',
    'talkId',
    'by_topicId',
    topicId,
    'topicId'
  );

  return talks.filter(
    (talk): talk is Doc<'talks'> => talk !== null && talk.status === 'published'
  );
}

const TALKS_PER_TOPIC = 24;

/** Published talks that share any of the given topics, excluding listed ids. */
export async function listPublishedTalksForTopics(
  ctx: QueryCtx,
  topicIds: Id<'topics'>[],
  options: {
    excludeTalkIds?: Iterable<string>;
  } = {}
) {
  if (topicIds.length === 0) {
    return [];
  }

  const excludeTalkIds = new Set(options.excludeTalkIds);
  const takePerTopic = TALKS_PER_TOPIC + excludeTalkIds.size;

  const talkPages = await Promise.all(
    topicIds.map(async (topicId) => {
      const joins = await ctx.db
        .query('talksOnTopics')
        .withIndex('by_topicId', (q) => q.eq('topicId', topicId))
        .take(takePerTopic);

      const talks = await Promise.all(
        joins.map((join) => ctx.db.get('talks', join.talkId))
      );

      return talks.filter(
        (talk): talk is Doc<'talks'> =>
          talk !== null &&
          talk.status === 'published' &&
          !excludeTalkIds.has(talk._id)
      );
    })
  );

  return uniqueById(talkPages.flat());
}

export async function searchPublishedTalks(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  return await ctx.db
    .query('talks')
    .withSearchIndex('search_title', (q) =>
      q.search('title', queryText).eq('status', 'published')
    )
    .take(limit);
}

/** Title matches plus published talks by speakers whose names match. */
export async function searchPublishedTalksByTitleOrSpeaker(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  const [titleHits, speakers] = await Promise.all([
    searchPublishedTalks(ctx, queryText, limit),
    searchPublishedSpeakers(ctx, queryText, DEFAULT_SEARCH_LIMIT),
  ]);

  if (speakers.length === 0) {
    return titleHits;
  }

  const speakerTalkPages = await Promise.all(
    speakers.map((speaker) =>
      ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) =>
          q.eq('speakerId', speaker._id).eq('status', 'published')
        )
        .take(limit)
    )
  );

  return uniqueById<Doc<'talks'>>([
    ...titleHits,
    ...speakerTalkPages.flat(),
  ]).slice(0, limit);
}
