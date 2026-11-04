import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { ContentSortOption } from '../../lib/sort';
import type { StatusFilterType } from '../../lib/types';
import type { PaginationOptions, PaginationResult } from 'convex/server';

import { asyncMap } from 'convex-helpers';
import { getManyVia } from 'convex-helpers/server/relationships';

import { getTalkIdsByTopicSlugs } from '../../lib/filters';
import { getContentComparator } from '../../lib/sort';
import { enrichWithSpeaker, paginateUntilFull } from '../../lib/utils';
import {
  DEFAULT_SEARCH_LIMIT,
  searchTitleQuery,
  uniqueById,
} from '../search/helpers';
import {
  searchPublishedSpeakers,
  searchSpeakers,
  speakerIdsForSlugs,
} from '../speakers/helpers';

function publishedTalksQuery(ctx: QueryCtx) {
  return ctx.db
    .query('talks')
    .withIndex('by_status_and_publishedAt', (q) => q.eq('status', 'published'))
    .order('desc');
}

export function talksByStatusQuery(ctx: QueryCtx, status: StatusFilterType) {
  if (status === 'all') {
    return ctx.db.query('talks').order('desc');
  }

  return ctx.db
    .query('talks')
    .withIndex('by_status_and_publishedAt', (q) => q.eq('status', status))
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

export async function listTalksForCollection(
  ctx: QueryCtx,
  collectionId: Id<'collections'>
) {
  return await ctx.db
    .query('talks')
    .withIndex('by_collectionId_and_status', (q) =>
      q.eq('collectionId', collectionId)
    )
    .collect();
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
        .order('desc')
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

export async function searchTalks(
  ctx: QueryCtx,
  queryText: string,
  limit: number,
  status?: StatusFilterType
) {
  return await ctx.db
    .query('talks')
    .withSearchIndex('search_title', searchTitleQuery(queryText, status))
    .take(limit);
}

function filterTalkSearchHits(
  talks: Doc<'talks'>[],
  options: {
    featured?: boolean;
    speakerIds: Set<Id<'speakers'>> | null;
    topicTalkIds: Set<Id<'talks'>> | null | undefined;
  }
) {
  const { featured, speakerIds, topicTalkIds } = options;

  if (speakerIds?.size === 0 || topicTalkIds === null) {
    return [];
  }

  return talks.filter((talk) => {
    if (speakerIds && !speakerIds.has(talk.speakerId)) {
      return false;
    }

    if (topicTalkIds && !topicTalkIds.has(talk._id)) {
      return false;
    }

    if (featured && !talk.featured) {
      return false;
    }

    return true;
  });
}

export async function paginatePublishedTalkSearch(
  ctx: QueryCtx,
  options: {
    featured?: boolean;
    paginationOpts: PaginationOptions;
    queryText: string;
    sort: ContentSortOption;
    speakerIds: Set<Id<'speakers'>> | null;
    topicTalkIds: Set<Id<'talks'>> | null | undefined;
  }
): Promise<PaginationResult<Doc<'talks'>>> {
  const {
    featured,
    paginationOpts,
    queryText,
    sort,
    speakerIds,
    topicTalkIds,
  } = options;
  const result = await paginateUntilFull(
    (opts) =>
      ctx.db
        .query('talks')
        .withSearchIndex(
          'search_title',
          searchTitleQuery(queryText, 'published')
        )
        .paginate(opts),
    (found) =>
      filterTalkSearchHits(found, { featured, speakerIds, topicTalkIds }),
    paginationOpts
  );

  if (sort !== 'recent') {
    result.page.sort(getContentComparator(sort));
  }

  return result;
}

export async function loadPublishedTalkSearchPage(
  ctx: QueryCtx,
  options: {
    featured?: boolean;
    paginationOpts: PaginationOptions;
    queryText: string;
    sort: ContentSortOption;
    speakerSlugs?: string[];
    topicSlugs?: string[];
  }
) {
  const {
    featured,
    paginationOpts,
    queryText,
    sort,
    speakerSlugs,
    topicSlugs,
  } = options;
  const speakerIds = speakerSlugs?.length
    ? await speakerIdsForSlugs(ctx, speakerSlugs)
    : null;
  const topicTalkIds = topicSlugs?.length
    ? await getTalkIdsByTopicSlugs(ctx, topicSlugs)
    : undefined;
  const result = await paginatePublishedTalkSearch(ctx, {
    featured,
    paginationOpts,
    queryText,
    sort,
    speakerIds,
    topicTalkIds,
  });
  const talksWithSpeakers = await enrichWithSpeaker(ctx, result.page);

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    page: await enrichWithTopics(ctx, talksWithSpeakers),
  };
}

export async function searchPublishedTalks(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  return await searchTalks(ctx, queryText, limit, 'published');
}

/** Title matches plus talks by speakers whose names match. */
export async function searchTalksByTitleOrSpeaker(
  ctx: QueryCtx,
  queryText: string,
  limit: number,
  status?: StatusFilterType
) {
  const searchSpeakersByName =
    status === 'published' ? searchPublishedSpeakers : searchSpeakers;
  const [titleHits, speakers] = await Promise.all([
    searchTalks(ctx, queryText, limit, status),
    searchSpeakersByName(ctx, queryText, DEFAULT_SEARCH_LIMIT),
  ]);

  if (speakers.length === 0) {
    return titleHits;
  }

  const speakerTalkPages = await Promise.all(
    speakers.map((speaker) =>
      ctx.db
        .query('talks')
        .withIndex('by_speakerId_and_status', (q) => {
          const bySpeaker = q.eq('speakerId', speaker._id);

          return status && status !== 'all'
            ? bySpeaker.eq('status', status)
            : bySpeaker;
        })
        .take(limit)
    )
  );

  return uniqueById<Doc<'talks'>>([
    ...titleHits,
    ...speakerTalkPages.flat(),
  ]).slice(0, limit);
}

export async function searchPublishedTalksByTitleOrSpeaker(
  ctx: QueryCtx,
  queryText: string,
  limit: number
) {
  return await searchTalksByTitleOrSpeaker(ctx, queryText, limit, 'published');
}

/**
 * Enrich talks with topic slugs for client-side filtering.
 * Composable: works with raw talks or already-enriched talks.
 */
export async function enrichWithTopics<T extends { _id: Id<'talks'> }>(
  ctx: QueryCtx,
  talks: T[]
): Promise<(T & { topicSlugs: string[] })[]> {
  return await asyncMap(talks, async (talk: T) => {
    const talksOnTopics = await ctx.db
      .query('talksOnTopics')
      .withIndex('by_talkId', (q) => q.eq('talkId', talk._id))
      .collect();

    const topics = await Promise.all(
      talksOnTopics.map((tot) => ctx.db.get('topics', tot.topicId))
    );

    const topicSlugs = topics
      .filter((topic): topic is Doc<'topics'> => topic !== null)
      .map((topic) => topic.slug);

    return { ...talk, topicSlugs };
  });
}

function collectionTitleForTalk(
  collectionId: Id<'collections'> | undefined,
  titlesByCollectionId: Map<Id<'collections'>, string>
) {
  if (!collectionId) {
    return null;
  }

  return titlesByCollectionId.get(collectionId) ?? null;
}

async function featuredClipTitleForTalk(ctx: QueryCtx, talkId: Id<'talks'>) {
  const clip = await ctx.db
    .query('clips')
    .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
    .first();

  return clip?.title ?? null;
}

async function loadCollectionTitles(
  ctx: QueryCtx,
  talks: { collectionId?: Id<'collections'> }[]
) {
  const collectionIds = [
    ...new Set(
      talks.flatMap((talk) => (talk.collectionId ? [talk.collectionId] : []))
    ),
  ];
  const collections = await Promise.all(
    collectionIds.map((collectionId) => ctx.db.get('collections', collectionId))
  );

  return new Map(
    collections.flatMap((collection) =>
      collection ? [[collection._id, collection.title] as const] : []
    )
  );
}

export async function enrichTalksForAdmin(
  ctx: QueryCtx,
  talks: Doc<'talks'>[]
) {
  const talksWithTopics = await enrichWithTopics(
    ctx,
    await enrichWithSpeaker(ctx, talks)
  );
  const titlesByCollectionId = await loadCollectionTitles(ctx, talksWithTopics);

  return await asyncMap(talksWithTopics, async (talk) => ({
    ...talk,
    collectionTitle: collectionTitleForTalk(
      talk.collectionId,
      titlesByCollectionId
    ),
    featuredClipTitle: await featuredClipTitleForTalk(ctx, talk._id),
  }));
}
