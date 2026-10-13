import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { PaginationOptions } from 'convex/server';

import { asyncMap } from 'convex-helpers';
import { getManyVia } from 'convex-helpers/server/relationships';

import { DEFAULT_SEARCH_LIMIT } from '../search/constants';
import { uniqueById } from '../search/utils';
import { searchPublishedSpeakers } from '../speakers/queries';

function speakerNameMatches(
  searchLower: string,
  speaker: Doc<'speakers'> | null
): boolean {
  if (!speaker) {
    return false;
  }

  return `${speaker.firstName ?? ''} ${speaker.lastName ?? ''}`
    .toLowerCase()
    .includes(searchLower);
}

function talkTitleMatches(searchLower: string, title: string): boolean {
  return title.toLowerCase().includes(searchLower);
}

/**
 * Title-match first, then load unique speakers only for remaining talks.
 */
// fallow-ignore-next-line complexity
export async function filterTalksByTitleOrSpeaker(
  ctx: QueryCtx,
  search: string,
  talks: Doc<'talks'>[]
): Promise<Doc<'talks'>[]> {
  const searchLower = search.toLowerCase();
  const remaining: Doc<'talks'>[] = [];
  const titleHitIds = new Set<Id<'talks'>>();

  for (const talk of talks) {
    if (talkTitleMatches(searchLower, talk.title)) {
      titleHitIds.add(talk._id);
    } else {
      remaining.push(talk);
    }
  }

  const speakerIds = [...new Set(remaining.map((talk) => talk.speakerId))];
  const speakers = await Promise.all(
    speakerIds.map((speakerId) => ctx.db.get('speakers', speakerId))
  );
  const matchingSpeakerIds = new Set(
    speakerIds.filter((speakerId, index) =>
      speakerNameMatches(searchLower, speakers[index] ?? null)
    )
  );
  const matchingIds = new Set(titleHitIds);

  for (const talk of remaining) {
    if (matchingSpeakerIds.has(talk.speakerId)) {
      matchingIds.add(talk._id);
    }
  }

  return talks.filter((talk) => matchingIds.has(talk._id));
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

export async function listPublishedTalksForCollection(
  ctx: QueryCtx,
  collectionId: Id<'collections'>,
  limit?: number
) {
  const talksQuery = ctx.db
    .query('talks')
    .withIndex('by_collectionId_and_status', (q) =>
      q.eq('collectionId', collectionId).eq('status', 'published')
    );

  return await (limit ? talksQuery.take(limit) : talksQuery.collect());
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
